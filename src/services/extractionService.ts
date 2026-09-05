import { LabResult, Medication, Condition, MedicalReport, RangeStatus, ReferenceRange } from '../types/clinical';

export interface ExtractionResult {
  report: MedicalReport;
  extractedLabs: LabResult[];
  extractedMedications: Medication[];
  extractedConditions: Condition[];
  processingLog: Array<{ stage: string; timestamp: string; details: string; status: 'complete' | 'in_progress' | 'warning' }>;
}

/**
 * Parses numeric reference range expressions like "70 - 99", "< 150", "> 50", "0.50-1.10"
 */
export function parseReferenceRange(rangeStr: string): ReferenceRange | null {
  if (!rangeStr || rangeStr.toLowerCase().includes('not provided') || rangeStr.toLowerCase().includes('no range') || rangeStr.trim() === '') {
    return null;
  }

  const cleaned = rangeStr.trim();

  // Pattern: "< 150" or "<= 100"
  const lessThanMatch = cleaned.match(/^<\s*=?\s*([0-9.]+)/);
  if (lessThanMatch) {
    return {
      max: parseFloat(lessThanMatch[1]),
      text: cleaned,
    };
  }

  // Pattern: "> 50" or ">= 60"
  const greaterThanMatch = cleaned.match(/^>\s*=?\s*([0-9.]+)/);
  if (greaterThanMatch) {
    return {
      min: parseFloat(greaterThanMatch[1]),
      text: cleaned,
    };
  }

  // Pattern: "70 - 99" or "70-99" or "0.50 - 1.10"
  const rangeMatch = cleaned.match(/([0-9.]+)\s*[-–—to]+\s*([0-9.]+)/i);
  if (rangeMatch) {
    return {
      min: parseFloat(rangeMatch[1]),
      max: parseFloat(rangeMatch[2]),
      text: cleaned,
    };
  }

  return { text: cleaned };
}

/**
 * Determines laboratory result status strictly relative to the source-provided reference range.
 * Never infers status if reference range is missing.
 */
export function evaluateRangeStatus(value: number | string, range: ReferenceRange | null): RangeStatus {
  if (!range || (range.min === undefined && range.max === undefined)) {
    return 'range_unavailable';
  }

  const numericVal = typeof value === 'number' ? value : parseFloat(String(value).replace(/[^0-9.]/g, ''));
  if (isNaN(numericVal)) {
    return 'range_unavailable';
  }

  if (range.min !== undefined && range.max !== undefined) {
    if (numericVal < range.min) return 'below_range';
    if (numericVal > range.max) return 'above_range';
    return 'within_range';
  }

  if (range.min !== undefined) {
    return numericVal < range.min ? 'below_range' : 'within_range';
  }

  if (range.max !== undefined) {
    return numericVal > range.max ? 'above_range' : 'within_range';
  }

  return 'range_unavailable';
}

/**
 * Intelligent client-side clinical report extraction engine.
 * Reads raw clinical text, tokenizes lines, extracts entities, and generates verifiable provenance snippets.
 */
export async function processClinicalDocument(
  file: { name: string; size: number; content: string; type?: string; facility?: string; serviceDate?: string },
  onProgress?: (stage: string, percent: number) => void
): Promise<ExtractionResult> {
  const reportId = `REP-${Date.now().toString(36).toUpperCase()}`;
  const now = new Date().toISOString();
  const serviceDate = file.serviceDate || new Date().toISOString().split('T')[0];
  const facility = file.facility || 'Clinical Diagnostic Service';

  const processingLog: ExtractionResult['processingLog'] = [];

  // Stage 1: Ingestion & Text Normalization
  onProgress?.('Document Ingestion & Text Normalization', 20);
  await new Promise(r => setTimeout(r, 400));
  processingLog.push({
    stage: 'Document Ingestion',
    timestamp: new Date().toISOString(),
    details: `Ingested ${file.name} (${Math.round(file.size / 1024)} KB). Extracted ${file.content.split('\n').length} lines of text.`,
    status: 'complete',
  });

  // Stage 2: Clinical Entity Tokenization
  onProgress?.('Clinical Entity Recognition & Lab Regex Matching', 50);
  await new Promise(r => setTimeout(r, 450));
  processingLog.push({
    stage: 'Entity Recognition',
    timestamp: new Date().toISOString(),
    details: 'Scanning for laboratory analytes, units, reference intervals, and medication patterns.',
    status: 'complete',
  });

  const extractedLabs: LabResult[] = [];
  const extractedMedications: Medication[] = [];
  const extractedConditions: Condition[] = [];

  const lines = file.content.split('\n');

  // Regex rules for parsing laboratory lines
  // Example formats:
  // "Glucose, Fasting       168       HIGH   70 - 99            mg/dL"
  // "Urine Microalbumin/Cr  24                < 30                 mg/g"
  // "Cystatin-C Biomarker   0.82              [Range Not Provided] mg/L"
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line || line.startsWith('===') || line.startsWith('---') || line.toLowerCase().includes('patient:')) continue;

    // Check for medication lines
    const medMatch = line.match(/^(\d+\.|\*|-)?\s*([A-Za-z\s]+?)\s+(\d+\s*(?:mg|mcg|g|IU|mL|units))\s*(?:oral tablet|oral capsule|tablet|capsule|injection)?\s*[-–—:]\s*(.+)/i);
    if (medMatch) {
      const medName = medMatch[2].trim();
      const strength = medMatch[3].trim();
      const frequency = medMatch[4].trim();

      extractedMedications.push({
        id: `MED-EXT-${Date.now()}-${extractedMedications.length}`,
        name: medName,
        strength,
        route: 'Oral',
        frequency,
        prescribingContext: line.includes('NEW') ? 'Newly initiated therapy' : 'Continued outpatient regimen',
        isActive: true,
        reportDate: serviceDate,
        provenance: {
          category: 'extracted_from_report',
          sourceDocumentId: reportId,
          sourceDocumentName: file.name,
          facility,
          pageNumber: 1,
          section: 'Medications / Prescriptions',
          exactSnippet: line,
          timestamp: now,
        },
        verification: {
          status: 'needs_review',
          confidence: 94,
          originalValue: `${medName} ${strength}`,
        },
      });
      continue;
    }

    // Check for condition lines
    const condMatch = line.match(/(?:ADMISSION DIAGNOSIS|Clinical Indication|Diagnosis|Assessment|Problem):\s*(.+)/i);
    if (condMatch) {
      const condName = condMatch[1].trim();
      extractedConditions.push({
        id: `COND-EXT-${Date.now()}-${extractedConditions.length}`,
        name: condName,
        clinicalStatus: condName.toLowerCase().includes('negative') || condName.toLowerCase().includes('resolved') ? 'resolved' : 'active',
        onsetDate: serviceDate,
        provenance: {
          category: 'extracted_from_report',
          sourceDocumentId: reportId,
          sourceDocumentName: file.name,
          facility,
          pageNumber: 1,
          section: 'Clinical Diagnosis / Problem List',
          exactSnippet: line,
          timestamp: now,
        },
        verification: {
          status: 'needs_review',
          confidence: 91,
          originalValue: condName,
        },
      });
      continue;
    }

    // Check for tabular lab lines
    // Pattern: [Test Name]  [Result]  (Optional Flag)  [Reference Range]  [Units]
    // Or delimited lines
    const labLineRegex = /^([A-Za-z0-9\s,\-/\(\)]+?)\s{2,}([<>]?\s*[0-9.]+)\s+(?:(HIGH|LOW|CRITICAL|NORMAL|FLAG)\s+)?([<>]?\s*[0-9.]+(?:\s*[-–—to]+\s*[0-9.]+)?|\[.*?\]|[A-Za-z\s]+)\s+([A-Za-z0-9/%E\^μ\.\-]+)$/i;
    const match = line.match(labLineRegex);

    if (match) {
      const testName = match[1].trim();
      const rawValue = match[2].trim();
      const rawRefRange = match[4].trim();
      const unit = match[5].trim();

      const numVal = parseFloat(rawValue.replace(/[^0-9.]/g, ''));
      const parsedRange = parseReferenceRange(rawRefRange);
      const status = evaluateRangeStatus(numVal, parsedRange);

      // Determine category based on test name
      let category: LabResult['category'] = 'General';
      const lowerName = testName.toLowerCase();
      if (lowerName.includes('glucose') || lowerName.includes('a1c') || lowerName.includes('glycemic')) {
        category = 'Endocrine';
      } else if (lowerName.includes('cholesterol') || lowerName.includes('triglyceride') || lowerName.includes('lipid') || lowerName.includes('ldl') || lowerName.includes('hdl')) {
        category = 'Lipid';
      } else if (lowerName.includes('creatinine') || lowerName.includes('egfr') || lowerName.includes('bun') || lowerName.includes('microalbumin') || lowerName.includes('renal')) {
        category = 'Renal';
      } else if (lowerName.includes('sodium') || lowerName.includes('potassium') || lowerName.includes('chloride') || lowerName.includes('calcium') || lowerName.includes('alt') || lowerName.includes('ast') || lowerName.includes('metabolic')) {
        category = 'Metabolic';
      } else if (lowerName.includes('wbc') || lowerName.includes('rbc') || lowerName.includes('platelet') || lowerName.includes('hemoglobin') || lowerName.includes('hematocrit')) {
        category = 'Hematology';
      } else if (lowerName.includes('urine') || lowerName.includes('urinalysis') || lowerName.includes('gravity')) {
        category = 'Urinalysis';
      }

      // Confidence evaluation
      const confidence = parsedRange ? 98 : 82; // Lower confidence if reference range had to be marked unavailable

      extractedLabs.push({
        id: `LAB-EXT-${Date.now()}-${extractedLabs.length}`,
        reportId,
        testName,
        category,
        value: isNaN(numVal) ? rawValue : numVal,
        unit,
        referenceRange: parsedRange,
        status,
        reportDate: serviceDate,
        observation: status === 'range_unavailable' 
          ? 'Reference range was not explicitly specified in the source document.'
          : status === 'above_range' 
            ? `Reported value exceeds upper reference limit (${parsedRange?.max ?? parsedRange?.text}).`
            : status === 'below_range'
              ? `Reported value is below lower reference limit (${parsedRange?.min ?? parsedRange?.text}).`
              : 'Reported value is within laboratory reference interval.',
        provenance: {
          category: 'extracted_from_report',
          sourceDocumentId: reportId,
          sourceDocumentName: file.name,
          facility,
          pageNumber: 1,
          section: 'Laboratory Analytes',
          exactSnippet: line,
          timestamp: now,
        },
        verification: {
          status: confidence < 85 ? 'low_confidence' : 'needs_review',
          confidence,
          originalValue: isNaN(numVal) ? rawValue : numVal,
          originalUnit: unit,
          originalRange: rawRefRange,
        },
      });
    }
  }

  // Stage 3: Anomaly & Reference Range Evaluation
  onProgress?.('Reference Range Validation & Cross-Referencing', 80);
  await new Promise(r => setTimeout(r, 350));
  processingLog.push({
    stage: 'Reference Range Evaluation',
    timestamp: new Date().toISOString(),
    details: `Extracted ${extractedLabs.length} laboratory tests, ${extractedMedications.length} medications, and ${extractedConditions.length} diagnoses.`,
    status: 'complete',
  });

  // Stage 4: Staging to Human-in-the-Loop Review Queue
  onProgress?.('Staging to Human-in-the-Loop Review Queue', 100);
  await new Promise(r => setTimeout(r, 250));
  processingLog.push({
    stage: 'Staging to Review Queue',
    timestamp: new Date().toISOString(),
    details: 'All extracted fields prepared with provenance metadata for human review.',
    status: 'complete',
  });

  const overallConfidence = extractedLabs.length > 0
    ? Math.round(extractedLabs.reduce((acc, l) => acc + l.verification.confidence, 0) / extractedLabs.length)
    : 95;

  const report: MedicalReport = {
    id: reportId,
    title: file.name.replace(/\.[^/.]+$/, '').replace(/_/g, ' '),
    facility,
    serviceDate,
    uploadDate: now,
    type: extractedMedications.length > 0 && extractedLabs.length < 3 ? 'discharge_summary' : 'lab_panel',
    fileType: 'text',
    fileName: file.name,
    fileSize: `${Math.round(file.size / 1024) || 1} KB`,
    rawText: file.content,
    processingStatus: 'extracted',
    overallConfidence,
    extractedCount: {
      labs: extractedLabs.length,
      medications: extractedMedications.length,
      conditions: extractedConditions.length,
    },
  };

  return {
    report,
    extractedLabs,
    extractedMedications,
    extractedConditions,
    processingLog,
  };
}
