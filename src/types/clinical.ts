export type ProvenanceCategory = 'user_provided' | 'extracted_from_report' | 'ai_generated';

export type VerificationStatus = 
  | 'needs_review' 
  | 'verified' 
  | 'edited' 
  | 'low_confidence' 
  | 'conflicting';

export type RangeStatus = 
  | 'within_range' 
  | 'above_range' 
  | 'below_range' 
  | 'range_unavailable';

export interface Provenance {
  category: ProvenanceCategory;
  sourceDocumentId?: string;
  sourceDocumentName?: string;
  facility?: string;
  pageNumber?: number;
  section?: string;
  exactSnippet?: string;
  timestamp: string;
}

export interface VerificationInfo {
  status: VerificationStatus;
  confidence: number; // 0 - 100
  verifiedBy?: string;
  verifiedAt?: string;
  originalValue?: string | number;
  originalUnit?: string;
  originalRange?: string;
  editNotes?: string;
}

export interface ReferenceRange {
  min?: number;
  max?: number;
  text?: string;
}

export interface LabResult {
  id: string;
  reportId: string;
  testName: string;
  category: 'Metabolic' | 'Lipid' | 'Hematology' | 'Renal' | 'Endocrine' | 'Urinalysis' | 'General';
  value: number | string;
  unit: string;
  referenceRange: ReferenceRange | null;
  status: RangeStatus;
  reportDate: string;
  observation?: string;
  provenance: Provenance;
  verification: VerificationInfo;
}

export interface Medication {
  id: string;
  name: string;
  strength?: string;
  route?: string;
  frequency?: string;
  prescribingContext?: string;
  isActive: boolean;
  startDate?: string;
  reportDate: string;
  provenance: Provenance;
  verification: VerificationInfo;
}

export interface Condition {
  id: string;
  name: string;
  clinicalStatus: 'active' | 'resolved' | 'historical';
  onsetDate?: string;
  notes?: string;
  provenance: Provenance;
  verification: VerificationInfo;
}

export interface Allergy {
  id: string;
  substance: string;
  reaction: string;
  severity: 'mild' | 'moderate' | 'severe' | 'life_threatening';
  reportedDate: string;
  provenance: Provenance;
  verification: VerificationInfo;
}

export interface MedicalReport {
  id: string;
  title: string;
  facility: string;
  serviceDate: string;
  uploadDate: string;
  type: 'lab_panel' | 'discharge_summary' | 'imaging_note' | 'consult_note';
  fileType: 'pdf' | 'image' | 'text';
  fileName: string;
  fileSize: string;
  rawText: string;
  processingStatus: 'idle' | 'processing' | 'extracted' | 'error';
  overallConfidence: number;
  extractedCount: {
    labs: number;
    medications: number;
    conditions: number;
  };
}

export interface Patient {
  id: string;
  name: string;
  mrn: string;
  dateOfBirth: string;
  age: number;
  biologicalSex: 'Female' | 'Male' | 'Other';
  bloodType?: string;
  emergencyContact?: {
    name: string;
    relation: string;
    phone: string;
  };
  userNotes?: string;
}

export interface TimelineEvent {
  id: string;
  date: string;
  title: string;
  description: string;
  type: 'report' | 'lab' | 'medication' | 'condition' | 'user_note';
  provenanceCategory: ProvenanceCategory;
  badgeText?: string;
  status?: RangeStatus | VerificationStatus;
  referenceId?: string;
}

export interface AuditLogEntry {
  id: string;
  timestamp: string;
  action: 'extracted' | 'verified' | 'edited' | 'rejected' | 'user_added';
  targetType: 'lab' | 'medication' | 'condition' | 'report' | 'patient';
  targetId: string;
  targetName: string;
  previousValue?: string;
  newValue?: string;
  performedBy: string;
  reason?: string;
}

export interface FilterOptions {
  searchQuery: string;
  category: string;
  rangeStatus: string;
  verificationStatus: string;
  dateRange: string;
}
