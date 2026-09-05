import {
  Patient,
  MedicalReport,
  LabResult,
  Medication,
  Condition,
  Allergy,
  AuditLogEntry,
} from '../types/clinical';

export const initialPatient: Patient = {
  id: 'PT-100482',
  name: 'Eleanor Vance',
  mrn: 'ML-98421-E',
  dateOfBirth: '1968-03-14',
  age: 58,
  biologicalSex: 'Female',
  bloodType: 'A Positive',
  emergencyContact: {
    name: 'Thomas Vance',
    relation: 'Spouse',
    phone: '(555) 234-8910',
  },
  userNotes: 'Under ongoing outpatient management for glycemic control and cardiovascular risk reduction. Follows moderate carbohydrate diet and walks 30 minutes daily.',
};

export const initialAllergies: Allergy[] = [
  {
    id: 'ALG-001',
    substance: 'Penicillin VK',
    reaction: 'Urticaria (hives), facial swelling, and mild dyspnea',
    severity: 'severe',
    reportedDate: '2018-05-12',
    provenance: {
      category: 'user_provided',
      exactSnippet: 'Patient verbally reported severe penicillin reaction during emergency dental work in 2018.',
      timestamp: '2025-01-10T10:30:00Z',
    },
    verification: {
      status: 'verified',
      confidence: 100,
      verifiedBy: 'Eleanor Vance (Patient)',
      verifiedAt: '2025-01-10T10:30:00Z',
    },
  },
  {
    id: 'ALG-002',
    substance: 'Sulfa Antibiotics (Sulfamethoxazole)',
    reaction: 'Maculopapular cutaneous rash',
    severity: 'moderate',
    reportedDate: '2021-09-03',
    provenance: {
      category: 'user_provided',
      exactSnippet: 'Bactrim prescribed for urinary tract infection resulted in widespread rash across arms and chest.',
      timestamp: '2025-01-10T10:32:00Z',
    },
    verification: {
      status: 'verified',
      confidence: 100,
      verifiedBy: 'Eleanor Vance (Patient)',
      verifiedAt: '2025-01-10T10:32:00Z',
    },
  },
];

export const initialConditions: Condition[] = [
  {
    id: 'COND-001',
    name: 'Type 2 Diabetes Mellitus without acute complications',
    clinicalStatus: 'active',
    onsetDate: '2019-11-15',
    notes: 'Managed with Metformin and lifestyle modifications. Hemoglobin A1c trending downward.',
    provenance: {
      category: 'extracted_from_report',
      sourceDocumentId: 'REP-2025-0612',
      sourceDocumentName: 'Comprehensive Metabolic & Lipid Panel',
      facility: 'Metro Health Clinical Laboratories',
      pageNumber: 1,
      section: 'Clinical Indication / Diagnosis',
      exactSnippet: 'Clinical Indication: ICD-10 E11.9 - Type 2 Diabetes Mellitus without complications. Ongoing monitoring.',
      timestamp: '2025-06-12T14:22:00Z',
    },
    verification: {
      status: 'verified',
      confidence: 96,
      verifiedBy: 'Eleanor Vance',
      verifiedAt: '2025-06-14T09:15:00Z',
    },
  },
  {
    id: 'COND-002',
    name: 'Essential (Primary) Hypertension',
    clinicalStatus: 'active',
    onsetDate: '2017-04-20',
    notes: 'Well controlled on Lisinopril 20mg daily. Home blood pressure typically 124-132 / 76-82 mmHg.',
    provenance: {
      category: 'extracted_from_report',
      sourceDocumentId: 'REP-2025-0612',
      sourceDocumentName: 'Comprehensive Metabolic & Lipid Panel',
      facility: 'Metro Health Clinical Laboratories',
      pageNumber: 1,
      section: 'Problem List / Diagnoses',
      exactSnippet: 'Co-morbidities: Essential hypertension (I10), Hyperlipidemia (E78.5).',
      timestamp: '2025-06-12T14:22:00Z',
    },
    verification: {
      status: 'verified',
      confidence: 94,
      verifiedBy: 'Eleanor Vance',
      verifiedAt: '2025-06-14T09:16:00Z',
    },
  },
  {
    id: 'COND-003',
    name: 'Mixed Hyperlipidemia',
    clinicalStatus: 'active',
    onsetDate: '2020-08-10',
    notes: 'Treated with Atorvastatin 20mg. Triglycerides and LDL have normalized in most recent Jan 2026 panel.',
    provenance: {
      category: 'extracted_from_report',
      sourceDocumentId: 'REP-2025-1018',
      sourceDocumentName: 'Endocrine Follow-Up Panel',
      facility: 'Valley Endocrine & Diabetes Center',
      pageNumber: 2,
      section: 'Assessment',
      exactSnippet: 'Assessment: Mixed hyperlipidemia under moderate statin therapy.',
      timestamp: '2025-10-18T16:05:00Z',
    },
    verification: {
      status: 'verified',
      confidence: 92,
      verifiedBy: 'Eleanor Vance',
      verifiedAt: '2025-10-20T11:00:00Z',
    },
  },
  {
    id: 'COND-004',
    name: 'Diabetic Peripheral Neuropathy (Early Sensory)',
    clinicalStatus: 'active',
    onsetDate: '2025-08-01',
    notes: 'Intermittent bilateral tingling and numbness in toes and distal soles. Monofilament exam slightly decreased at halluces.',
    provenance: {
      category: 'user_provided',
      exactSnippet: 'Patient reported onset of evening tingling in feet starting late summer 2025. Noted in patient self-intake.',
      timestamp: '2025-09-01T15:00:00Z',
    },
    verification: {
      status: 'verified',
      confidence: 100,
      verifiedBy: 'Eleanor Vance (Patient)',
      verifiedAt: '2025-09-01T15:00:00Z',
    },
  },
];

export const initialMedications: Medication[] = [
  {
    id: 'MED-001',
    name: 'Metformin Hydrochloride',
    strength: '1000 mg',
    route: 'Oral',
    frequency: '1 tablet twice daily with morning and evening meals',
    prescribingContext: 'Glycemic control in Type 2 Diabetes Mellitus',
    isActive: true,
    startDate: '2020-02-15',
    reportDate: '2025-10-18',
    provenance: {
      category: 'extracted_from_report',
      sourceDocumentId: 'REP-2025-1018',
      sourceDocumentName: 'Endocrine Follow-Up Panel',
      facility: 'Valley Endocrine & Diabetes Center',
      pageNumber: 1,
      section: 'Current Medications',
      exactSnippet: 'Metformin HCl 1000 mg PO BID with meals. Patient reports good gastrointestinal tolerance.',
      timestamp: '2025-10-18T16:05:00Z',
    },
    verification: {
      status: 'verified',
      confidence: 98,
      verifiedBy: 'Eleanor Vance',
      verifiedAt: '2025-10-20T11:02:00Z',
    },
  },
  {
    id: 'MED-002',
    name: 'Lisinopril',
    strength: '20 mg',
    route: 'Oral',
    frequency: '1 tablet once daily every morning',
    prescribingContext: 'Antihypertensive and renal protective therapy',
    isActive: true,
    startDate: '2017-05-01',
    reportDate: '2025-06-12',
    provenance: {
      category: 'extracted_from_report',
      sourceDocumentId: 'REP-2025-0612',
      sourceDocumentName: 'Comprehensive Metabolic & Lipid Panel',
      facility: 'Metro Health Clinical Laboratories',
      pageNumber: 1,
      section: 'Medication Profile',
      exactSnippet: 'Lisinopril 20 mg tablet oral daily. Prescribed by Dr. Robert Chen, Internal Medicine.',
      timestamp: '2025-06-12T14:22:00Z',
    },
    verification: {
      status: 'verified',
      confidence: 96,
      verifiedBy: 'Eleanor Vance',
      verifiedAt: '2025-06-14T09:18:00Z',
    },
  },
  {
    id: 'MED-003',
    name: 'Atorvastatin Calcium',
    strength: '20 mg',
    route: 'Oral',
    frequency: '1 tablet once daily at bedtime',
    prescribingContext: 'Lipid-lowering therapy and ASCVD primary prevention',
    isActive: true,
    startDate: '2020-09-10',
    reportDate: '2025-06-12',
    provenance: {
      category: 'extracted_from_report',
      sourceDocumentId: 'REP-2025-0612',
      sourceDocumentName: 'Comprehensive Metabolic & Lipid Panel',
      facility: 'Metro Health Clinical Laboratories',
      pageNumber: 1,
      section: 'Medication Profile',
      exactSnippet: 'Atorvastatin 20 mg PO QHS. Adherent.',
      timestamp: '2025-06-12T14:22:00Z',
    },
    verification: {
      status: 'verified',
      confidence: 97,
      verifiedBy: 'Eleanor Vance',
      verifiedAt: '2025-06-14T09:19:00Z',
    },
  },
  {
    id: 'MED-004',
    name: 'Cholecalciferol (Vitamin D3)',
    strength: '2000 IU',
    route: 'Oral',
    frequency: '1 softgel once daily with breakfast',
    prescribingContext: 'Supplementation for insufficiency (source level 24 ng/mL)',
    isActive: true,
    startDate: '2025-10-25',
    reportDate: '2025-10-25',
    provenance: {
      category: 'user_provided',
      exactSnippet: 'Added by patient following Valley Endocrine recommendation regarding 24 ng/mL 25-OH Vitamin D finding.',
      timestamp: '2025-10-25T08:30:00Z',
    },
    verification: {
      status: 'verified',
      confidence: 100,
      verifiedBy: 'Eleanor Vance (Patient)',
      verifiedAt: '2025-10-25T08:30:00Z',
    },
  },
];

export const initialReports: MedicalReport[] = [
  {
    id: 'REP-2025-0612',
    title: 'Comprehensive Metabolic & Lipid Panel',
    facility: 'Metro Health Clinical Laboratories - North Campus',
    serviceDate: '2025-06-12',
    uploadDate: '2025-06-13T10:14:00Z',
    type: 'lab_panel',
    fileType: 'pdf',
    fileName: 'MetroHealth_CMP_Lipids_June2025.pdf',
    fileSize: '342 KB',
    processingStatus: 'extracted',
    overallConfidence: 96,
    extractedCount: {
      labs: 12,
      medications: 2,
      conditions: 2,
    },
    rawText: `METRO HEALTH CLINICAL LABORATORIES
Patient: Eleanor Vance | DOB: 03/14/1968 | MRN: ML-98421-E | Ordering Physician: Dr. Robert Chen, MD
Collection Date/Time: 06/12/2025 07:45 AM | Status: Final Report

COMPREHENSIVE METABOLIC PANEL
Test Name              Result    Flag   Reference Range    Units
Glucose, Fasting       168       HIGH   70 - 99            mg/dL
BUN                    16               7 - 20             mg/dL
Creatinine, Serum      0.92             0.50 - 1.10        mg/dL
eGFR (CKD-EPI)         74               > 60               mL/min/1.73m2
Sodium                 139              135 - 145          mmol/L
Potassium              4.4              3.5 - 5.1          mmol/L
Chloride               102              98 - 107           mmol/L
Carbon Dioxide (CO2)   24               21 - 31            mmol/L
Calcium                9.3              8.6 - 10.2         mg/dL
Total Protein          7.1              6.3 - 8.2          g/dL
Albumin                4.3              3.8 - 4.9          g/dL
Total Bilirubin        0.6              0.2 - 1.2          mg/dL
Alkaline Phosphatase   68               44 - 121           U/L
ALT (SGPT)             36        HIGH   7 - 35             U/L
AST (SGOT)             28               8 - 33             U/L

GLYCEMIC & LIPID PANEL
Hemoglobin A1c         8.4       HIGH   4.0 - 5.6          %
Total Cholesterol      224       HIGH   125 - 200          mg/dL
Triglycerides          210       HIGH   < 150              mg/dL
HDL Cholesterol        42        LOW    > 50               mg/dL
LDL Cholesterol (calc) 140       HIGH   < 100              mg/dL

DIAGNOSTIC CODING & MEDICATION RECORD
ICD-10: E11.9 (Type 2 diabetes mellitus), I10 (Essential hypertension)
Active Meds: Lisinopril 20mg PO QD, Atorvastatin 20mg PO QHS`,
  },
  {
    id: 'REP-2025-1018',
    title: 'Endocrine Follow-Up Panel & Microalbumin',
    facility: 'Valley Endocrine & Diabetes Center',
    serviceDate: '2025-10-18',
    uploadDate: '2025-10-19T09:40:00Z',
    type: 'lab_panel',
    fileType: 'pdf',
    fileName: 'ValleyEndo_FollowUp_Oct2025.pdf',
    fileSize: '418 KB',
    processingStatus: 'extracted',
    overallConfidence: 94,
    extractedCount: {
      labs: 10,
      medications: 1,
      conditions: 1,
    },
    rawText: `VALLEY ENDOCRINE & DIABETES CENTER
Specialty Care Report - Glycemic Response Assessment
Patient: Eleanor Vance | Age: 57 | Date: 10/18/2025 08:30 AM
Attending Specialist: Dr. Maya Lin, MD (Endocrinology)

LABORATORY INVESTIGATION
Test Name              Result    Flag   Reference Range    Units
Glucose, Fasting       142       HIGH   70 - 99            mg/dL
Hemoglobin A1c         7.5       HIGH   4.0 - 5.6          %
Total Cholesterol      198              125 - 200          mg/dL
Triglycerides          175       HIGH   < 150              mg/dL
HDL Cholesterol        45        LOW    > 50               mg/dL
LDL Cholesterol        118       HIGH   < 100              mg/dL
Creatinine, Serum      0.88             0.50 - 1.10        mg/dL
eGFR                   78               > 60               mL/min/1.73m2
Urine Microalbumin/Cr  38        HIGH   < 30               mg/g
Vitamin D, 25-Hydroxy  24        LOW    30 - 100           ng/mL

CLINICAL IMPRESSION
A1c has improved from 8.4% to 7.5% following titration of Metformin to 1000mg BID.
Microalbuminuria noted at 38 mg/g; ensure ACE-inhibitor (Lisinopril) continuation.
Vitamin D insufficiency identified (24 ng/mL). Recommend OTC Cholecalciferol 2000 IU daily.`,
  },
  {
    id: 'REP-2026-0122',
    title: 'Annual Comprehensive Metabolic, Lipid & Hematology Panel',
    facility: 'Quest Diagnostics - Regional Reference Lab',
    serviceDate: '2026-01-22',
    uploadDate: '2026-01-23T08:15:00Z',
    type: 'lab_panel',
    fileType: 'pdf',
    fileName: 'Quest_AnnualComprehensive_Jan2026.pdf',
    fileSize: '512 KB',
    processingStatus: 'extracted',
    overallConfidence: 98,
    extractedCount: {
      labs: 15,
      medications: 0,
      conditions: 0,
    },
    rawText: `QUEST DIAGNOSTICS - CLINICAL REFERENCE LABORATORY
Accession Number: QDL-2026-98104 | Final Laboratory Report
Patient: Eleanor Vance | MRN: ML-98421-E | Specimen: Whole Blood / Serum
Collected: 01/22/2026 07:15 AM | Received: 01/22/2026 11:30 AM

COMPREHENSIVE METABOLIC
Test Name                   Result   Flag   Reference Range    Units
Glucose, Fasting            118      HIGH   70 - 99            mg/dL
BUN                         14              7 - 20             mg/dL
Creatinine                  0.85            0.50 - 1.10        mg/dL
eGFR                        81              > 60               mL/min/1.73m2
Sodium                      141             135 - 145          mmol/L
Potassium                   4.6             3.5 - 5.1          mmol/L
Chloride                    104             98 - 107           mmol/L
Carbon Dioxide (CO2)        26              21 - 31            mmol/L
Calcium                     9.4             8.6 - 10.2         mg/dL
Total Protein               6.9             6.3 - 8.2          g/dL
Albumin                     4.2             3.8 - 4.9          g/dL
ALT                         26              7 - 35             U/L
AST                         22              8 - 33             U/L

GLYCEMIC & LIPID RESPONSE
Hemoglobin A1c              6.8      HIGH   4.0 - 5.6          %
Total Cholesterol           172             125 - 200          mg/dL
Triglycerides               138             < 150              mg/dL
HDL Cholesterol             52              > 50               mg/dL
LDL Cholesterol             92              < 100              mg/dL

HEMATOLOGY (CBC)
White Blood Cells (WBC)     6.8             4.0 - 11.0         x10E3/uL
Red Blood Cells (RBC)       4.42            3.80 - 5.10        x10E6/uL
Hemoglobin                  13.6            11.7 - 15.5        g/dL
Hematocrit                  40.2            35.0 - 45.0        %
Platelets                   245             140 - 415          x10E3/uL

SPECIAL INVESTIGATION / CARDIAC MARKER
hs-CRP (High-Sens C-Reactive) 2.1           [No Range Stated]  mg/L`,
  },
];

export const initialLabResults: LabResult[] = [
  // --- Jan 22, 2026 Panel (Latest) ---
  {
    id: 'LAB-2026-001',
    reportId: 'REP-2026-0122',
    testName: 'Hemoglobin A1c',
    category: 'Endocrine',
    value: 6.8,
    unit: '%',
    referenceRange: { min: 4.0, max: 5.6, text: '4.0 - 5.6 %' },
    status: 'above_range',
    reportDate: '2026-01-22',
    observation: 'Significant longitudinal decline from 8.4% (June 2025) and 7.5% (Oct 2025). Reflects improved 90-day glycemic control.',
    provenance: {
      category: 'extracted_from_report',
      sourceDocumentId: 'REP-2026-0122',
      sourceDocumentName: 'Annual Comprehensive Metabolic, Lipid & Hematology Panel',
      facility: 'Quest Diagnostics',
      pageNumber: 1,
      section: 'Glycemic & Lipid Response',
      exactSnippet: 'Hemoglobin A1c: 6.8 % [Ref: 4.0 - 5.6 %] High',
      timestamp: '2026-01-23T08:15:00Z',
    },
    verification: {
      status: 'verified',
      confidence: 99,
      verifiedBy: 'Eleanor Vance',
      verifiedAt: '2026-01-24T14:10:00Z',
    },
  },
  {
    id: 'LAB-2026-002',
    reportId: 'REP-2026-0122',
    testName: 'Fasting Glucose',
    category: 'Metabolic',
    value: 118,
    unit: 'mg/dL',
    referenceRange: { min: 70, max: 99, text: '70 - 99 mg/dL' },
    status: 'above_range',
    reportDate: '2026-01-22',
    observation: 'Improved from 168 mg/dL (June 2025) and 142 mg/dL (Oct 2025). Remains mildly above fasting threshold.',
    provenance: {
      category: 'extracted_from_report',
      sourceDocumentId: 'REP-2026-0122',
      sourceDocumentName: 'Annual Comprehensive Metabolic, Lipid & Hematology Panel',
      facility: 'Quest Diagnostics',
      pageNumber: 1,
      section: 'Comprehensive Metabolic',
      exactSnippet: 'Glucose, Fasting: 118 mg/dL [Ref: 70 - 99 mg/dL] High',
      timestamp: '2026-01-23T08:15:00Z',
    },
    verification: {
      status: 'verified',
      confidence: 99,
      verifiedBy: 'Eleanor Vance',
      verifiedAt: '2026-01-24T14:10:00Z',
    },
  },
  {
    id: 'LAB-2026-003',
    reportId: 'REP-2026-0122',
    testName: 'Total Cholesterol',
    category: 'Lipid',
    value: 172,
    unit: 'mg/dL',
    referenceRange: { min: 125, max: 200, text: '125 - 200 mg/dL' },
    status: 'within_range',
    reportDate: '2026-01-22',
    observation: 'Normalized into target range under Atorvastatin 20mg therapy (previously 224 mg/dL).',
    provenance: {
      category: 'extracted_from_report',
      sourceDocumentId: 'REP-2026-0122',
      sourceDocumentName: 'Annual Comprehensive Metabolic, Lipid & Hematology Panel',
      facility: 'Quest Diagnostics',
      pageNumber: 1,
      section: 'Glycemic & Lipid Response',
      exactSnippet: 'Total Cholesterol: 172 mg/dL [Ref: 125 - 200 mg/dL]',
      timestamp: '2026-01-23T08:15:00Z',
    },
    verification: {
      status: 'verified',
      confidence: 98,
      verifiedBy: 'Eleanor Vance',
      verifiedAt: '2026-01-24T14:11:00Z',
    },
  },
  {
    id: 'LAB-2026-004',
    reportId: 'REP-2026-0122',
    testName: 'Triglycerides',
    category: 'Lipid',
    value: 138,
    unit: 'mg/dL',
    referenceRange: { max: 150, text: '< 150 mg/dL' },
    status: 'within_range',
    reportDate: '2026-01-22',
    observation: 'Normalized below 150 mg/dL threshold (down from 210 mg/dL in June 2025).',
    provenance: {
      category: 'extracted_from_report',
      sourceDocumentId: 'REP-2026-0122',
      sourceDocumentName: 'Annual Comprehensive Metabolic, Lipid & Hematology Panel',
      facility: 'Quest Diagnostics',
      pageNumber: 1,
      section: 'Glycemic & Lipid Response',
      exactSnippet: 'Triglycerides: 138 mg/dL [Ref: < 150 mg/dL]',
      timestamp: '2026-01-23T08:15:00Z',
    },
    verification: {
      status: 'verified',
      confidence: 97,
      verifiedBy: 'Eleanor Vance',
      verifiedAt: '2026-01-24T14:11:00Z',
    },
  },
  {
    id: 'LAB-2026-005',
    reportId: 'REP-2026-0122',
    testName: 'HDL Cholesterol',
    category: 'Lipid',
    value: 52,
    unit: 'mg/dL',
    referenceRange: { min: 50, text: '> 50 mg/dL' },
    status: 'within_range',
    reportDate: '2026-01-22',
    observation: 'Reached desired female target range (>50 mg/dL). Previous readings: 42 mg/dL, 45 mg/dL.',
    provenance: {
      category: 'extracted_from_report',
      sourceDocumentId: 'REP-2026-0122',
      sourceDocumentName: 'Annual Comprehensive Metabolic, Lipid & Hematology Panel',
      facility: 'Quest Diagnostics',
      pageNumber: 1,
      section: 'Glycemic & Lipid Response',
      exactSnippet: 'HDL Cholesterol: 52 mg/dL [Ref: > 50 mg/dL]',
      timestamp: '2026-01-23T08:15:00Z',
    },
    verification: {
      status: 'verified',
      confidence: 98,
      verifiedBy: 'Eleanor Vance',
      verifiedAt: '2026-01-24T14:12:00Z',
    },
  },
  {
    id: 'LAB-2026-006',
    reportId: 'REP-2026-0122',
    testName: 'LDL Cholesterol (Calculated)',
    category: 'Lipid',
    value: 92,
    unit: 'mg/dL',
    referenceRange: { max: 100, text: '< 100 mg/dL' },
    status: 'within_range',
    reportDate: '2026-01-22',
    observation: 'Attained primary prevention target < 100 mg/dL for diabetic patient profile.',
    provenance: {
      category: 'extracted_from_report',
      sourceDocumentId: 'REP-2026-0122',
      sourceDocumentName: 'Annual Comprehensive Metabolic, Lipid & Hematology Panel',
      facility: 'Quest Diagnostics',
      pageNumber: 1,
      section: 'Glycemic & Lipid Response',
      exactSnippet: 'LDL Cholesterol: 92 mg/dL [Ref: < 100 mg/dL]',
      timestamp: '2026-01-23T08:15:00Z',
    },
    verification: {
      status: 'verified',
      confidence: 97,
      verifiedBy: 'Eleanor Vance',
      verifiedAt: '2026-01-24T14:12:00Z',
    },
  },
  {
    id: 'LAB-2026-007',
    reportId: 'REP-2026-0122',
    testName: 'Serum Creatinine',
    category: 'Renal',
    value: 0.85,
    unit: 'mg/dL',
    referenceRange: { min: 0.50, max: 1.10, text: '0.50 - 1.10 mg/dL' },
    status: 'within_range',
    reportDate: '2026-01-22',
    observation: 'Stable kidney filtration marker across all recorded reports (0.92 -> 0.88 -> 0.85).',
    provenance: {
      category: 'extracted_from_report',
      sourceDocumentId: 'REP-2026-0122',
      sourceDocumentName: 'Annual Comprehensive Metabolic, Lipid & Hematology Panel',
      facility: 'Quest Diagnostics',
      pageNumber: 1,
      section: 'Comprehensive Metabolic',
      exactSnippet: 'Creatinine: 0.85 mg/dL [Ref: 0.50 - 1.10 mg/dL]',
      timestamp: '2026-01-23T08:15:00Z',
    },
    verification: {
      status: 'verified',
      confidence: 99,
      verifiedBy: 'Eleanor Vance',
      verifiedAt: '2026-01-24T14:12:00Z',
    },
  },
  {
    id: 'LAB-2026-008',
    reportId: 'REP-2026-0122',
    testName: 'eGFR (CKD-EPI Formula)',
    category: 'Renal',
    value: 81,
    unit: 'mL/min/1.73m2',
    referenceRange: { min: 60, text: '> 60 mL/min/1.73m2' },
    status: 'within_range',
    reportDate: '2026-01-22',
    observation: 'Estimated glomerular filtration rate within normal preservation limits for age.',
    provenance: {
      category: 'extracted_from_report',
      sourceDocumentId: 'REP-2026-0122',
      sourceDocumentName: 'Annual Comprehensive Metabolic, Lipid & Hematology Panel',
      facility: 'Quest Diagnostics',
      pageNumber: 1,
      section: 'Comprehensive Metabolic',
      exactSnippet: 'eGFR: 81 mL/min/1.73m2 [Ref: > 60 mL/min/1.73m2]',
      timestamp: '2026-01-23T08:15:00Z',
    },
    verification: {
      status: 'verified',
      confidence: 98,
      verifiedBy: 'Eleanor Vance',
      verifiedAt: '2026-01-24T14:12:00Z',
    },
  },
  {
    id: 'LAB-2026-009',
    reportId: 'REP-2026-0122',
    testName: 'Potassium, Serum',
    category: 'Metabolic',
    value: 4.6,
    unit: 'mmol/L',
    referenceRange: { min: 3.5, max: 5.1, text: '3.5 - 5.1 mmol/L' },
    status: 'within_range',
    reportDate: '2026-01-22',
    observation: 'Electrolyte stability confirmed while taking Lisinopril 20mg.',
    provenance: {
      category: 'extracted_from_report',
      sourceDocumentId: 'REP-2026-0122',
      sourceDocumentName: 'Annual Comprehensive Metabolic, Lipid & Hematology Panel',
      facility: 'Quest Diagnostics',
      pageNumber: 1,
      section: 'Comprehensive Metabolic',
      exactSnippet: 'Potassium: 4.6 mmol/L [Ref: 3.5 - 5.1 mmol/L]',
      timestamp: '2026-01-23T08:15:00Z',
    },
    verification: {
      status: 'verified',
      confidence: 99,
      verifiedBy: 'Eleanor Vance',
      verifiedAt: '2026-01-24T14:13:00Z',
    },
  },
  {
    id: 'LAB-2026-010',
    reportId: 'REP-2026-0122',
    testName: 'hs-CRP (High-Sensitivity C-Reactive Protein)',
    category: 'General',
    value: 2.1,
    unit: 'mg/L',
    referenceRange: null, // Explicit null test for Requirement #7: Range unavailable
    status: 'range_unavailable',
    reportDate: '2026-01-22',
    observation: 'Inflammatory / cardiovascular risk marker. Note: Laboratory did not provide reference range interval on source report.',
    provenance: {
      category: 'extracted_from_report',
      sourceDocumentId: 'REP-2026-0122',
      sourceDocumentName: 'Annual Comprehensive Metabolic, Lipid & Hematology Panel',
      facility: 'Quest Diagnostics',
      pageNumber: 1,
      section: 'Special Investigation / Cardiac Marker',
      exactSnippet: 'hs-CRP (High-Sens C-Reactive): 2.1 mg/L [No Range Stated]',
      timestamp: '2026-01-23T08:15:00Z',
    },
    verification: {
      status: 'needs_review',
      confidence: 84,
      editNotes: 'Reference range not stated on report. Requires physician contextual interpretation.',
    },
  },
  {
    id: 'LAB-2026-011',
    reportId: 'REP-2026-0122',
    testName: 'Hemoglobin (Blood)',
    category: 'Hematology',
    value: 13.6,
    unit: 'g/dL',
    referenceRange: { min: 11.7, max: 15.5, text: '11.7 - 15.5 g/dL' },
    status: 'within_range',
    reportDate: '2026-01-22',
    observation: 'Normal female red blood cell oxygen-carrying capacity.',
    provenance: {
      category: 'extracted_from_report',
      sourceDocumentId: 'REP-2026-0122',
      sourceDocumentName: 'Annual Comprehensive Metabolic, Lipid & Hematology Panel',
      facility: 'Quest Diagnostics',
      pageNumber: 1,
      section: 'Hematology (CBC)',
      exactSnippet: 'Hemoglobin: 13.6 g/dL [Ref: 11.7 - 15.5 g/dL]',
      timestamp: '2026-01-23T08:15:00Z',
    },
    verification: {
      status: 'verified',
      confidence: 99,
      verifiedBy: 'Eleanor Vance',
      verifiedAt: '2026-01-24T14:14:00Z',
    },
  },

  // --- Oct 18, 2025 Panel ---
  {
    id: 'LAB-2025-101',
    reportId: 'REP-2025-1018',
    testName: 'Hemoglobin A1c',
    category: 'Endocrine',
    value: 7.5,
    unit: '%',
    referenceRange: { min: 4.0, max: 5.6, text: '4.0 - 5.6 %' },
    status: 'above_range',
    reportDate: '2025-10-18',
    observation: 'Intermediate evaluation after Metformin optimization.',
    provenance: {
      category: 'extracted_from_report',
      sourceDocumentId: 'REP-2025-1018',
      sourceDocumentName: 'Endocrine Follow-Up Panel',
      facility: 'Valley Endocrine & Diabetes Center',
      pageNumber: 1,
      section: 'Laboratory Investigation',
      exactSnippet: 'Hemoglobin A1c: 7.5 % [Ref: 4.0 - 5.6 %] High',
      timestamp: '2025-10-19T09:40:00Z',
    },
    verification: {
      status: 'verified',
      confidence: 96,
      verifiedBy: 'Eleanor Vance',
      verifiedAt: '2025-10-20T11:05:00Z',
    },
  },
  {
    id: 'LAB-2025-102',
    reportId: 'REP-2025-1018',
    testName: 'Fasting Glucose',
    category: 'Metabolic',
    value: 142,
    unit: 'mg/dL',
    referenceRange: { min: 70, max: 99, text: '70 - 99 mg/dL' },
    status: 'above_range',
    reportDate: '2025-10-18',
    provenance: {
      category: 'extracted_from_report',
      sourceDocumentId: 'REP-2025-1018',
      sourceDocumentName: 'Endocrine Follow-Up Panel',
      facility: 'Valley Endocrine & Diabetes Center',
      pageNumber: 1,
      section: 'Laboratory Investigation',
      exactSnippet: 'Glucose, Fasting: 142 mg/dL [Ref: 70 - 99 mg/dL] High',
      timestamp: '2025-10-19T09:40:00Z',
    },
    verification: {
      status: 'verified',
      confidence: 96,
      verifiedBy: 'Eleanor Vance',
      verifiedAt: '2025-10-20T11:05:00Z',
    },
  },
  {
    id: 'LAB-2025-103',
    reportId: 'REP-2025-1018',
    testName: 'Total Cholesterol',
    category: 'Lipid',
    value: 198,
    unit: 'mg/dL',
    referenceRange: { min: 125, max: 200, text: '125 - 200 mg/dL' },
    status: 'within_range',
    reportDate: '2025-10-18',
    provenance: {
      category: 'extracted_from_report',
      sourceDocumentId: 'REP-2025-1018',
      sourceDocumentName: 'Endocrine Follow-Up Panel',
      facility: 'Valley Endocrine & Diabetes Center',
      pageNumber: 1,
      section: 'Laboratory Investigation',
      exactSnippet: 'Total Cholesterol: 198 mg/dL [Ref: 125 - 200 mg/dL]',
      timestamp: '2025-10-19T09:40:00Z',
    },
    verification: {
      status: 'verified',
      confidence: 94,
      verifiedBy: 'Eleanor Vance',
      verifiedAt: '2025-10-20T11:06:00Z',
    },
  },
  {
    id: 'LAB-2025-104',
    reportId: 'REP-2025-1018',
    testName: 'Triglycerides',
    category: 'Lipid',
    value: 175,
    unit: 'mg/dL',
    referenceRange: { max: 150, text: '< 150 mg/dL' },
    status: 'above_range',
    reportDate: '2025-10-18',
    provenance: {
      category: 'extracted_from_report',
      sourceDocumentId: 'REP-2025-1018',
      sourceDocumentName: 'Endocrine Follow-Up Panel',
      facility: 'Valley Endocrine & Diabetes Center',
      pageNumber: 1,
      section: 'Laboratory Investigation',
      exactSnippet: 'Triglycerides: 175 mg/dL [Ref: < 150 mg/dL] High',
      timestamp: '2025-10-19T09:40:00Z',
    },
    verification: {
      status: 'verified',
      confidence: 95,
      verifiedBy: 'Eleanor Vance',
      verifiedAt: '2025-10-20T11:06:00Z',
    },
  },
  {
    id: 'LAB-2025-105',
    reportId: 'REP-2025-1018',
    testName: 'HDL Cholesterol',
    category: 'Lipid',
    value: 45,
    unit: 'mg/dL',
    referenceRange: { min: 50, text: '> 50 mg/dL' },
    status: 'below_range',
    reportDate: '2025-10-18',
    provenance: {
      category: 'extracted_from_report',
      sourceDocumentId: 'REP-2025-1018',
      sourceDocumentName: 'Endocrine Follow-Up Panel',
      facility: 'Valley Endocrine & Diabetes Center',
      pageNumber: 1,
      section: 'Laboratory Investigation',
      exactSnippet: 'HDL Cholesterol: 45 mg/dL [Ref: > 50 mg/dL] Low',
      timestamp: '2025-10-19T09:40:00Z',
    },
    verification: {
      status: 'verified',
      confidence: 95,
      verifiedBy: 'Eleanor Vance',
      verifiedAt: '2025-10-20T11:06:00Z',
    },
  },
  {
    id: 'LAB-2025-106',
    reportId: 'REP-2025-1018',
    testName: 'Urine Microalbumin/Creatinine Ratio',
    category: 'Renal',
    value: 38,
    unit: 'mg/g',
    referenceRange: { max: 30, text: '< 30 mg/g' },
    status: 'above_range',
    reportDate: '2025-10-18',
    observation: 'Early microalbuminuria marker. Physician advised strict BP management and ACE inhibitor continuity.',
    provenance: {
      category: 'extracted_from_report',
      sourceDocumentId: 'REP-2025-1018',
      sourceDocumentName: 'Endocrine Follow-Up Panel',
      facility: 'Valley Endocrine & Diabetes Center',
      pageNumber: 1,
      section: 'Laboratory Investigation',
      exactSnippet: 'Urine Microalbumin/Cr: 38 mg/g [Ref: < 30 mg/g] High',
      timestamp: '2025-10-19T09:40:00Z',
    },
    verification: {
      status: 'verified',
      confidence: 96,
      verifiedBy: 'Eleanor Vance',
      verifiedAt: '2025-10-20T11:07:00Z',
    },
  },
  {
    id: 'LAB-2025-107',
    reportId: 'REP-2025-1018',
    testName: 'Vitamin D, 25-Hydroxy',
    category: 'General',
    value: 24,
    unit: 'ng/mL',
    referenceRange: { min: 30, max: 100, text: '30 - 100 ng/mL' },
    status: 'below_range',
    reportDate: '2025-10-18',
    observation: 'Insufficiency identified (< 30 ng/mL). Patient subsequently initiated 2000 IU OTC cholecalciferol.',
    provenance: {
      category: 'extracted_from_report',
      sourceDocumentId: 'REP-2025-1018',
      sourceDocumentName: 'Endocrine Follow-Up Panel',
      facility: 'Valley Endocrine & Diabetes Center',
      pageNumber: 1,
      section: 'Laboratory Investigation',
      exactSnippet: 'Vitamin D, 25-Hydroxy: 24 ng/mL [Ref: 30 - 100 ng/mL] Low',
      timestamp: '2025-10-19T09:40:00Z',
    },
    verification: {
      status: 'verified',
      confidence: 95,
      verifiedBy: 'Eleanor Vance',
      verifiedAt: '2025-10-20T11:08:00Z',
    },
  },

  // --- June 12, 2025 Panel (Baseline) ---
  {
    id: 'LAB-2025-001',
    reportId: 'REP-2025-0612',
    testName: 'Hemoglobin A1c',
    category: 'Endocrine',
    value: 8.4,
    unit: '%',
    referenceRange: { min: 4.0, max: 5.6, text: '4.0 - 5.6 %' },
    status: 'above_range',
    reportDate: '2025-06-12',
    observation: 'Baseline elevated reading at initiation of intensive diabetes review.',
    provenance: {
      category: 'extracted_from_report',
      sourceDocumentId: 'REP-2025-0612',
      sourceDocumentName: 'Comprehensive Metabolic & Lipid Panel',
      facility: 'Metro Health Clinical Laboratories',
      pageNumber: 1,
      section: 'Glycemic & Lipid Panel',
      exactSnippet: 'Hemoglobin A1c: 8.4 % [Ref: 4.0 - 5.6 %] High',
      timestamp: '2025-06-12T14:22:00Z',
    },
    verification: {
      status: 'verified',
      confidence: 98,
      verifiedBy: 'Eleanor Vance',
      verifiedAt: '2025-06-14T09:20:00Z',
    },
  },
  {
    id: 'LAB-2025-002',
    reportId: 'REP-2025-0612',
    testName: 'Fasting Glucose',
    category: 'Metabolic',
    value: 168,
    unit: 'mg/dL',
    referenceRange: { min: 70, max: 99, text: '70 - 99 mg/dL' },
    status: 'above_range',
    reportDate: '2025-06-12',
    provenance: {
      category: 'extracted_from_report',
      sourceDocumentId: 'REP-2025-0612',
      sourceDocumentName: 'Comprehensive Metabolic & Lipid Panel',
      facility: 'Metro Health Clinical Laboratories',
      pageNumber: 1,
      section: 'Comprehensive Metabolic Panel',
      exactSnippet: 'Glucose, Fasting: 168 mg/dL [Ref: 70 - 99 mg/dL] High',
      timestamp: '2025-06-12T14:22:00Z',
    },
    verification: {
      status: 'verified',
      confidence: 97,
      verifiedBy: 'Eleanor Vance',
      verifiedAt: '2025-06-14T09:20:00Z',
    },
  },
  {
    id: 'LAB-2025-003',
    reportId: 'REP-2025-0612',
    testName: 'Total Cholesterol',
    category: 'Lipid',
    value: 224,
    unit: 'mg/dL',
    referenceRange: { min: 125, max: 200, text: '125 - 200 mg/dL' },
    status: 'above_range',
    reportDate: '2025-06-12',
    provenance: {
      category: 'extracted_from_report',
      sourceDocumentId: 'REP-2025-0612',
      sourceDocumentName: 'Comprehensive Metabolic & Lipid Panel',
      facility: 'Metro Health Clinical Laboratories',
      pageNumber: 1,
      section: 'Glycemic & Lipid Panel',
      exactSnippet: 'Total Cholesterol: 224 mg/dL [Ref: 125 - 200 mg/dL] High',
      timestamp: '2025-06-12T14:22:00Z',
    },
    verification: {
      status: 'verified',
      confidence: 98,
      verifiedBy: 'Eleanor Vance',
      verifiedAt: '2025-06-14T09:21:00Z',
    },
  },
  {
    id: 'LAB-2025-004',
    reportId: 'REP-2025-0612',
    testName: 'Triglycerides',
    category: 'Lipid',
    value: 210,
    unit: 'mg/dL',
    referenceRange: { max: 150, text: '< 150 mg/dL' },
    status: 'above_range',
    reportDate: '2025-06-12',
    provenance: {
      category: 'extracted_from_report',
      sourceDocumentId: 'REP-2025-0612',
      sourceDocumentName: 'Comprehensive Metabolic & Lipid Panel',
      facility: 'Metro Health Clinical Laboratories',
      pageNumber: 1,
      section: 'Glycemic & Lipid Panel',
      exactSnippet: 'Triglycerides: 210 mg/dL [Ref: < 150 mg/dL] High',
      timestamp: '2025-06-12T14:22:00Z',
    },
    verification: {
      status: 'verified',
      confidence: 97,
      verifiedBy: 'Eleanor Vance',
      verifiedAt: '2025-06-14T09:21:00Z',
    },
  },
  {
    id: 'LAB-2025-005',
    reportId: 'REP-2025-0612',
    testName: 'HDL Cholesterol',
    category: 'Lipid',
    value: 42,
    unit: 'mg/dL',
    referenceRange: { min: 50, text: '> 50 mg/dL' },
    status: 'below_range',
    reportDate: '2025-06-12',
    provenance: {
      category: 'extracted_from_report',
      sourceDocumentId: 'REP-2025-0612',
      sourceDocumentName: 'Comprehensive Metabolic & Lipid Panel',
      facility: 'Metro Health Clinical Laboratories',
      pageNumber: 1,
      section: 'Glycemic & Lipid Panel',
      exactSnippet: 'HDL Cholesterol: 42 mg/dL [Ref: > 50 mg/dL] Low',
      timestamp: '2025-06-12T14:22:00Z',
    },
    verification: {
      status: 'verified',
      confidence: 98,
      verifiedBy: 'Eleanor Vance',
      verifiedAt: '2025-06-14T09:22:00Z',
    },
  },
  {
    id: 'LAB-2025-006',
    reportId: 'REP-2025-0612',
    testName: 'ALT (Alanine Aminotransferase)',
    category: 'Metabolic',
    value: 36,
    unit: 'U/L',
    referenceRange: { min: 7, max: 35, text: '7 - 35 U/L' },
    status: 'above_range',
    reportDate: '2025-06-12',
    observation: 'Borderline elevated hepatic transaminase in June 2025; normalized to 26 U/L by Jan 2026.',
    provenance: {
      category: 'extracted_from_report',
      sourceDocumentId: 'REP-2025-0612',
      sourceDocumentName: 'Comprehensive Metabolic & Lipid Panel',
      facility: 'Metro Health Clinical Laboratories',
      pageNumber: 1,
      section: 'Comprehensive Metabolic Panel',
      exactSnippet: 'ALT (SGPT): 36 U/L [Ref: 7 - 35 U/L] High',
      timestamp: '2025-06-12T14:22:00Z',
    },
    verification: {
      status: 'verified',
      confidence: 96,
      verifiedBy: 'Eleanor Vance',
      verifiedAt: '2025-06-14T09:22:00Z',
    },
  },
];

export const initialAuditLogs: AuditLogEntry[] = [
  {
    id: 'AUD-001',
    timestamp: '2026-01-24T14:10:00Z',
    action: 'verified',
    targetType: 'lab',
    targetId: 'LAB-2026-001',
    targetName: 'Hemoglobin A1c (6.8%)',
    performedBy: 'Eleanor Vance',
    reason: 'Verified against Quest paper report received in mail.',
  },
  {
    id: 'AUD-002',
    timestamp: '2025-10-25T08:30:00Z',
    action: 'user_added',
    targetType: 'medication',
    targetId: 'MED-004',
    targetName: 'Cholecalciferol 2000 IU',
    performedBy: 'Eleanor Vance (Patient)',
    reason: 'Initiated OTC supplementation following endocrinology consultation.',
  },
  {
    id: 'AUD-003',
    timestamp: '2025-09-01T15:00:00Z',
    action: 'user_added',
    targetType: 'condition',
    targetId: 'COND-004',
    targetName: 'Diabetic Peripheral Neuropathy (Early Sensory)',
    performedBy: 'Eleanor Vance (Patient)',
    reason: 'Documented onset of symptoms for upcoming neurology consult.',
  },
];

export const samplePrebuiltReports = [
  {
    id: 'SAMPLE-DISCHARGE-2026',
    title: 'Mercy General Hospital — Discharge Summary & Outpatient Medications',
    facility: 'Mercy General Hospital - Cardiology Wing',
    serviceDate: '2026-02-10',
    type: 'discharge_summary' as const,
    fileType: 'text' as const,
    fileName: 'MercyGeneral_DischargeSummary_Feb2026.txt',
    fileSize: '280 KB',
    description: 'Post-observation discharge evaluation including 3 medication reconciliation items and 1 resolved acute observation.',
    rawText: `MERCY GENERAL HOSPITAL
DIVISION OF CARDIOVASCULAR MEDICINE
HOSPITAL DISCHARGE SUMMARY
Patient: Eleanor Vance | DOB: 03/14/1968 | MRN: ML-98421-E
Admission Date: 02/09/2026 | Discharge Date: 02/10/2026
Attending Physician: Dr. Marcus Vance, MD, FACC

ADMISSION DIAGNOSIS:
Transient atypical chest discomfort under exertion, ruled negative for acute coronary syndrome.
Serial troponin-I negative (<0.01 ng/mL x3). ECG: Normal sinus rhythm, no ischemic ST changes.

DISCHARGE MEDICATIONS:
1. Metformin 1000 mg oral tablet - 1 tablet twice daily with meals (Continue home regimen)
2. Lisinopril 20 mg oral tablet - 1 tablet once daily in the morning (Continue home regimen)
3. Atorvastatin 20 mg oral tablet - 1 tablet nightly at bedtime (Continue home regimen)
4. Enteric-Coated Aspirin 81 mg oral tablet - 1 tablet once daily in morning with food (NEW INITIATION)

FOLLOW-UP RECOMMENDATIONS:
- Outpatient stress echocardiography in 4 weeks with primary cardiologist.
- Low sodium, heart-healthy diabetic diet.
- Resume regular daily walking.`,
    extractedPreview: {
      labs: [
        { testName: 'Troponin-I (High Sens)', value: '<0.01', unit: 'ng/mL', ref: '< 0.04 ng/mL', status: 'within_range' as const, confidence: 97 },
      ],
      medications: [
        { name: 'Aspirin (Enteric-Coated)', strength: '81 mg', route: 'Oral', frequency: '1 tablet daily with food', context: 'Secondary antiplatelet prevention' },
      ],
      conditions: [
        { name: 'Atypical Chest Pain (Ruled negative for ACS)', clinicalStatus: 'resolved' as const },
      ],
    },
  },
  {
    id: 'SAMPLE-RENAL-2026',
    title: 'BioReference Laboratories — Renal Function & Urinalysis Profile',
    facility: 'BioReference Health Network',
    serviceDate: '2026-02-18',
    type: 'lab_panel' as const,
    fileType: 'text' as const,
    fileName: 'BioReference_RenalProfile_Feb2026.txt',
    fileSize: '195 KB',
    description: 'Specialized renal follow-up evaluating microalbuminuria response to medication.',
    rawText: `BIOREFERENCE LABORATORIES
RENAL FUNCTION & URINARY PROTEIN PANEL
Patient: Eleanor Vance | DOB: 03/14/1968 | Specimen: Serum & Random Urine
Date Reported: 02/18/2026 09:20 AM | Ordering Clinician: Dr. Maya Lin

ANALYTE                    RESULT    FLAG    REFERENCE INTERVAL   UNITS
Urine Microalbumin/Cr      24                < 30                 mg/g
Serum Creatinine           0.86              0.50 - 1.10          mg/dL
eGFR (CKD-EPI)             80                > 60                 mL/min/1.73m2
Blood Urea Nitrogen (BUN)  15                7 - 20               mg/dL
Serum Uric Acid            5.2               2.6 - 6.0            mg/dL
Urinary Protein/Creatinine 0.12              < 0.20               mg/mg
Urinary Specific Gravity   1.018             1.005 - 1.030        [Ratio]
Cystatin-C Biomarker       0.82              [Range Not Provided] mg/L`,
    extractedPreview: {
      labs: [
        { testName: 'Urine Microalbumin/Cr Ratio', value: 24, unit: 'mg/g', ref: '< 30 mg/g', status: 'within_range' as const, confidence: 99 },
        { testName: 'Serum Creatinine', value: 0.86, unit: 'mg/dL', ref: '0.50 - 1.10 mg/dL', status: 'within_range' as const, confidence: 99 },
        { testName: 'eGFR', value: 80, unit: 'mL/min/1.73m2', ref: '> 60 mL/min/1.73m2', status: 'within_range' as const, confidence: 98 },
        { testName: 'BUN', value: 15, unit: 'mg/dL', ref: '7 - 20 mg/dL', status: 'within_range' as const, confidence: 98 },
        { testName: 'Cystatin-C Biomarker', value: 0.82, unit: 'mg/L', ref: null, status: 'range_unavailable' as const, confidence: 82 },
      ],
      medications: [],
      conditions: [],
    },
  },
];
