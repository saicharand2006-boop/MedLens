import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import {
  Patient,
  MedicalReport,
  LabResult,
  Medication,
  Condition,
  Allergy,
  TimelineEvent,
  AuditLogEntry,
} from '../types/clinical';
import {
  initialPatient,
  initialReports,
  initialLabResults,
  initialMedications,
  initialConditions,
  initialAllergies,
  initialAuditLogs,
} from '../data/mockClinicalData';

export type ActiveTab = 
  | 'dashboard' 
  | 'profile' 
  | 'reports' 
  | 'labs' 
  | 'medications' 
  | 'conditions' 
  | 'timeline' 
  | 'comparison' 
  | 'summary';

interface MedLensContextType {
  patient: Patient;
  reports: MedicalReport[];
  labResults: LabResult[];
  medications: Medication[];
  conditions: Condition[];
  allergies: Allergy[];
  auditLogs: AuditLogEntry[];
  timelineEvents: TimelineEvent[];
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  selectedReport: MedicalReport | null;
  setSelectedReport: (report: MedicalReport | null) => void;
  selectedLabResult: LabResult | null;
  setSelectedLabResult: (lab: LabResult | null) => void;
  isAuditDrawerOpen: boolean;
  setIsAuditDrawerOpen: (open: boolean) => void;
  isReviewModalOpen: boolean;
  setIsReviewModalOpen: (open: boolean) => void;
  isUploadModalOpen: boolean;
  setIsUploadModalOpen: (open: boolean) => void;
  pendingReviewCount: number;

  // Actions
  verifyLabResult: (id: string, notes?: string) => void;
  editLabResult: (id: string, updates: Partial<LabResult>, reason?: string) => void;
  verifyMedication: (id: string) => void;
  verifyCondition: (id: string) => void;
  verifyAllPendingHighConfidence: () => void;
  addReportWithExtracts: (
    report: MedicalReport,
    labs: LabResult[],
    meds: Medication[],
    conds: Condition[]
  ) => void;
  addUserAllergy: (allergy: Omit<Allergy, 'id' | 'provenance' | 'verification'>) => void;
  addUserCondition: (condition: Omit<Condition, 'id' | 'provenance' | 'verification'>) => void;
  addUserMedication: (medication: Omit<Medication, 'id' | 'provenance' | 'verification'>) => void;
  updatePatientProfile: (updates: Partial<Patient>) => void;
  resetToDemoData: () => void;
  exportRecordJSON: () => void;
}

const MedLensContext = createContext<MedLensContextType | undefined>(undefined);

const STORAGE_KEY = 'medlens_clinical_state_v1';

export const MedLensProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Load initial state from LocalStorage if available
  const [patient, setPatient] = useState<Patient>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_patient`);
    return saved ? JSON.parse(saved) : initialPatient;
  });

  const [reports, setReports] = useState<MedicalReport[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_reports`);
    return saved ? JSON.parse(saved) : initialReports;
  });

  const [labResults, setLabResults] = useState<LabResult[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_labs`);
    return saved ? JSON.parse(saved) : initialLabResults;
  });

  const [medications, setMedications] = useState<Medication[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_medications`);
    return saved ? JSON.parse(saved) : initialMedications;
  });

  const [conditions, setConditions] = useState<Condition[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_conditions`);
    return saved ? JSON.parse(saved) : initialConditions;
  });

  const [allergies, setAllergies] = useState<Allergy[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_allergies`);
    return saved ? JSON.parse(saved) : initialAllergies;
  });

  const [auditLogs, setAuditLogs] = useState<AuditLogEntry[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_audit`);
    return saved ? JSON.parse(saved) : initialAuditLogs;
  });

  // UI state
  const [activeTab, setActiveTab] = useState<ActiveTab>('dashboard');
  const [selectedReport, setSelectedReport] = useState<MedicalReport | null>(null);
  const [selectedLabResult, setSelectedLabResult] = useState<LabResult | null>(null);
  const [isAuditDrawerOpen, setIsAuditDrawerOpen] = useState(false);
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);

  // Sync to local storage
  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY}_patient`, JSON.stringify(patient));
    localStorage.setItem(`${STORAGE_KEY}_reports`, JSON.stringify(reports));
    localStorage.setItem(`${STORAGE_KEY}_labs`, JSON.stringify(labResults));
    localStorage.setItem(`${STORAGE_KEY}_medications`, JSON.stringify(medications));
    localStorage.setItem(`${STORAGE_KEY}_conditions`, JSON.stringify(conditions));
    localStorage.setItem(`${STORAGE_KEY}_allergies`, JSON.stringify(allergies));
    localStorage.setItem(`${STORAGE_KEY}_audit`, JSON.stringify(auditLogs));
  }, [patient, reports, labResults, medications, conditions, allergies, auditLogs]);

  // Compute pending review count
  const pendingReviewCount = useMemo(() => {
    const pendingLabs = labResults.filter(l => l.verification.status === 'needs_review' || l.verification.status === 'low_confidence').length;
    const pendingMeds = medications.filter(m => m.verification.status === 'needs_review').length;
    const pendingConds = conditions.filter(c => c.verification.status === 'needs_review').length;
    return pendingLabs + pendingMeds + pendingConds;
  }, [labResults, medications, conditions]);

  // Build unified chronological timeline
  const timelineEvents = useMemo<TimelineEvent[]>(() => {
    const events: TimelineEvent[] = [];

    reports.forEach(r => {
      events.push({
        id: `EV-REP-${r.id}`,
        date: r.serviceDate,
        title: `Medical Report: ${r.title}`,
        description: `Facility: ${r.facility}. Extracted ${r.extractedCount.labs} lab results, ${r.extractedCount.medications} medications.`,
        type: 'report',
        provenanceCategory: 'extracted_from_report',
        badgeText: r.facility,
        referenceId: r.id,
      });
    });

    labResults.forEach(l => {
      events.push({
        id: `EV-LAB-${l.id}`,
        date: l.reportDate,
        title: `${l.testName}: ${l.value} ${l.unit}`,
        description: l.observation || (l.referenceRange?.text ? `Reference Range: ${l.referenceRange.text}` : 'Reference range unavailable in source'),
        type: 'lab',
        provenanceCategory: l.provenance.category,
        badgeText: l.testName,
        status: l.status,
        referenceId: l.id,
      });
    });

    medications.forEach(m => {
      events.push({
        id: `EV-MED-${m.id}`,
        date: m.startDate || m.reportDate,
        title: `Medication Record: ${m.name} ${m.strength || ''}`,
        description: `${m.frequency || ''} ${m.prescribingContext ? `• ${m.prescribingContext}` : ''}`,
        type: 'medication',
        provenanceCategory: m.provenance.category,
        badgeText: m.route || 'Oral',
        referenceId: m.id,
      });
    });

    conditions.forEach(c => {
      events.push({
        id: `EV-COND-${c.id}`,
        date: c.onsetDate || '2020-01-01',
        title: `Condition: ${c.name}`,
        description: c.notes || `Clinical Status: ${c.clinicalStatus}`,
        type: 'condition',
        provenanceCategory: c.provenance.category,
        badgeText: c.clinicalStatus,
        referenceId: c.id,
      });
    });

    // Sort descending by date
    return events.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [reports, labResults, medications, conditions]);

  // Actions
  const verifyLabResult = (id: string, notes?: string) => {
    const target = labResults.find(l => l.id === id);
    if (!target) return;

    setLabResults(prev =>
      prev.map(l => {
        if (l.id !== id) return l;
        return {
          ...l,
          verification: {
            ...l.verification,
            status: 'verified',
            verifiedBy: 'Human Reviewer (User)',
            verifiedAt: new Date().toISOString(),
            editNotes: notes || l.verification.editNotes,
          },
        };
      })
    );

    const auditEntry: AuditLogEntry = {
      id: `AUD-${Date.now()}`,
      timestamp: new Date().toISOString(),
      action: 'verified',
      targetType: 'lab',
      targetId: id,
      targetName: `${target.testName} (${target.value} ${target.unit})`,
      performedBy: 'Human Reviewer (User)',
      reason: notes || 'Verified accurate against source report snippet.',
    };
    setAuditLogs(prev => [auditEntry, ...prev]);
  };

  const editLabResult = (id: string, updates: Partial<LabResult>, reason?: string) => {
    const target = labResults.find(l => l.id === id);
    if (!target) return;

    const prevStr = `${target.testName}: ${target.value} ${target.unit}`;
    const newStr = `${updates.testName || target.testName}: ${updates.value !== undefined ? updates.value : target.value} ${updates.unit || target.unit}`;

    setLabResults(prev =>
      prev.map(l => {
        if (l.id !== id) return l;
        return {
          ...l,
          ...updates,
          verification: {
            ...l.verification,
            status: 'edited',
            verifiedBy: 'Human Reviewer (User)',
            verifiedAt: new Date().toISOString(),
            originalValue: l.verification.originalValue !== undefined ? l.verification.originalValue : l.value,
            originalUnit: l.verification.originalUnit !== undefined ? l.verification.originalUnit : l.unit,
            editNotes: reason || 'Manual user correction applied to extraction.',
          },
        };
      })
    );

    const auditEntry: AuditLogEntry = {
      id: `AUD-${Date.now()}`,
      timestamp: new Date().toISOString(),
      action: 'edited',
      targetType: 'lab',
      targetId: id,
      targetName: target.testName,
      previousValue: prevStr,
      newValue: newStr,
      performedBy: 'Human Reviewer (User)',
      reason: reason || 'Corrected extracted value or reference unit.',
    };
    setAuditLogs(prev => [auditEntry, ...prev]);
  };

  const verifyMedication = (id: string) => {
    const target = medications.find(m => m.id === id);
    if (!target) return;

    setMedications(prev =>
      prev.map(m => (m.id === id ? {
        ...m,
        verification: {
          ...m.verification,
          status: 'verified',
          verifiedBy: 'Human Reviewer (User)',
          verifiedAt: new Date().toISOString(),
        }
      } : m))
    );

    setAuditLogs(prev => [
      {
        id: `AUD-${Date.now()}`,
        timestamp: new Date().toISOString(),
        action: 'verified',
        targetType: 'medication',
        targetId: id,
        targetName: target.name,
        performedBy: 'Human Reviewer (User)',
        reason: 'Confirmed medication prescription from report.',
      },
      ...prev,
    ]);
  };

  const verifyCondition = (id: string) => {
    const target = conditions.find(c => c.id === id);
    if (!target) return;

    setConditions(prev =>
      prev.map(c => (c.id === id ? {
        ...c,
        verification: {
          ...c.verification,
          status: 'verified',
          verifiedBy: 'Human Reviewer (User)',
          verifiedAt: new Date().toISOString(),
        }
      } : c))
    );

    setAuditLogs(prev => [
      {
        id: `AUD-${Date.now()}`,
        timestamp: new Date().toISOString(),
        action: 'verified',
        targetType: 'condition',
        targetId: id,
        targetName: target.name,
        performedBy: 'Human Reviewer (User)',
        reason: 'Confirmed clinical diagnosis from source report.',
      },
      ...prev,
    ]);
  };

  const verifyAllPendingHighConfidence = () => {
    const now = new Date().toISOString();
    let verifiedCount = 0;

    setLabResults(prev =>
      prev.map(l => {
        if ((l.verification.status === 'needs_review' || l.verification.status === 'low_confidence') && l.verification.confidence >= 90) {
          verifiedCount++;
          return {
            ...l,
            verification: {
              ...l.verification,
              status: 'verified',
              verifiedBy: 'Human Reviewer (Batch)',
              verifiedAt: now,
            },
          };
        }
        return l;
      })
    );

    setMedications(prev =>
      prev.map(m => {
        if (m.verification.status === 'needs_review' && m.verification.confidence >= 90) {
          verifiedCount++;
          return {
            ...m,
            verification: {
              ...m.verification,
              status: 'verified',
              verifiedBy: 'Human Reviewer (Batch)',
              verifiedAt: now,
            },
          };
        }
        return m;
      })
    );

    setConditions(prev =>
      prev.map(c => {
        if (c.verification.status === 'needs_review' && c.verification.confidence >= 90) {
          verifiedCount++;
          return {
            ...c,
            verification: {
              ...c.verification,
              status: 'verified',
              verifiedBy: 'Human Reviewer (Batch)',
              verifiedAt: now,
            },
          };
        }
        return c;
      })
    );

    setAuditLogs(prev => [
      {
        id: `AUD-${Date.now()}`,
        timestamp: now,
        action: 'verified',
        targetType: 'report',
        targetId: 'BATCH',
        targetName: 'Batch Verification',
        performedBy: 'Human Reviewer',
        reason: `Batch verified ${verifiedCount} high-confidence extracted items (>=90%).`,
      },
      ...prev,
    ]);
  };

  const addReportWithExtracts = (
    report: MedicalReport,
    labs: LabResult[],
    meds: Medication[],
    conds: Condition[]
  ) => {
    setReports(prev => [report, ...prev]);
    if (labs.length > 0) setLabResults(prev => [...labs, ...prev]);
    if (meds.length > 0) setMedications(prev => [...meds, ...prev]);
    if (conds.length > 0) setConditions(prev => [...conds, ...prev]);

    setAuditLogs(prev => [
      {
        id: `AUD-${Date.now()}`,
        timestamp: new Date().toISOString(),
        action: 'extracted',
        targetType: 'report',
        targetId: report.id,
        targetName: report.title,
        performedBy: 'Clinical Extraction Engine',
        reason: `Processed report: ${labs.length} labs, ${meds.length} meds, ${conds.length} conditions staged for review.`,
      },
      ...prev,
    ]);
  };

  const addUserAllergy = (data: Omit<Allergy, 'id' | 'provenance' | 'verification'>) => {
    const id = `ALG-USR-${Date.now()}`;
    const newAllergy: Allergy = {
      ...data,
      id,
      provenance: {
        category: 'user_provided',
        exactSnippet: `Patient manually entered: ${data.substance} (${data.reaction}, ${data.severity})`,
        timestamp: new Date().toISOString(),
      },
      verification: {
        status: 'verified',
        confidence: 100,
        verifiedBy: `${patient.name} (Patient Self-Report)`,
        verifiedAt: new Date().toISOString(),
      },
    };
    setAllergies(prev => [newAllergy, ...prev]);
    setAuditLogs(prev => [
      {
        id: `AUD-${Date.now()}`,
        timestamp: new Date().toISOString(),
        action: 'user_added',
        targetType: 'patient',
        targetId: id,
        targetName: `Allergy: ${data.substance}`,
        performedBy: patient.name,
        reason: 'User self-intake entry.',
      },
      ...prev,
    ]);
  };

  const addUserCondition = (data: Omit<Condition, 'id' | 'provenance' | 'verification'>) => {
    const id = `COND-USR-${Date.now()}`;
    const newCond: Condition = {
      ...data,
      id,
      provenance: {
        category: 'user_provided',
        exactSnippet: `Patient self-reported condition: ${data.name}. Notes: ${data.notes || 'None'}`,
        timestamp: new Date().toISOString(),
      },
      verification: {
        status: 'verified',
        confidence: 100,
        verifiedBy: `${patient.name} (Patient Self-Report)`,
        verifiedAt: new Date().toISOString(),
      },
    };
    setConditions(prev => [newCond, ...prev]);
    setAuditLogs(prev => [
      {
        id: `AUD-${Date.now()}`,
        timestamp: new Date().toISOString(),
        action: 'user_added',
        targetType: 'condition',
        targetId: id,
        targetName: `Condition: ${data.name}`,
        performedBy: patient.name,
        reason: 'User self-intake entry.',
      },
      ...prev,
    ]);
  };

  const addUserMedication = (data: Omit<Medication, 'id' | 'provenance' | 'verification'>) => {
    const id = `MED-USR-${Date.now()}`;
    const newMed: Medication = {
      ...data,
      id,
      provenance: {
        category: 'user_provided',
        exactSnippet: `Patient manually registered medication: ${data.name} ${data.strength || ''} ${data.frequency || ''}`,
        timestamp: new Date().toISOString(),
      },
      verification: {
        status: 'verified',
        confidence: 100,
        verifiedBy: `${patient.name} (Patient Self-Report)`,
        verifiedAt: new Date().toISOString(),
      },
    };
    setMedications(prev => [newMed, ...prev]);
    setAuditLogs(prev => [
      {
        id: `AUD-${Date.now()}`,
        timestamp: new Date().toISOString(),
        action: 'user_added',
        targetType: 'medication',
        targetId: id,
        targetName: `Medication: ${data.name}`,
        performedBy: patient.name,
        reason: 'User self-intake entry.',
      },
      ...prev,
    ]);
  };

  const updatePatientProfile = (updates: Partial<Patient>) => {
    setPatient(prev => ({ ...prev, ...updates }));
    setAuditLogs(prev => [
      {
        id: `AUD-${Date.now()}`,
        timestamp: new Date().toISOString(),
        action: 'edited',
        targetType: 'patient',
        targetId: patient.id,
        targetName: 'Patient Demographics',
        performedBy: patient.name,
        reason: 'Updated patient profile information.',
      },
      ...prev,
    ]);
  };

  const resetToDemoData = () => {
    localStorage.removeItem(`${STORAGE_KEY}_patient`);
    localStorage.removeItem(`${STORAGE_KEY}_reports`);
    localStorage.removeItem(`${STORAGE_KEY}_labs`);
    localStorage.removeItem(`${STORAGE_KEY}_medications`);
    localStorage.removeItem(`${STORAGE_KEY}_conditions`);
    localStorage.removeItem(`${STORAGE_KEY}_allergies`);
    localStorage.removeItem(`${STORAGE_KEY}_audit`);

    setPatient(initialPatient);
    setReports(initialReports);
    setLabResults(initialLabResults);
    setMedications(initialMedications);
    setConditions(initialConditions);
    setAllergies(initialAllergies);
    setAuditLogs(initialAuditLogs);
    setSelectedReport(null);
    setSelectedLabResult(null);
    setIsAuditDrawerOpen(false);
    setIsReviewModalOpen(false);
    setIsUploadModalOpen(false);
    setActiveTab('dashboard');
  };

  const exportRecordJSON = () => {
    const exportBundle = {
      format: 'MedLens-Clinical-Intelligence-v1',
      exportedAt: new Date().toISOString(),
      clinicalDisclaimer: 'MedLens is an information organization and comprehension tool, NOT a diagnostic system.',
      patient,
      summaryMetrics: {
        totalReports: reports.length,
        totalLabResults: labResults.length,
        activeMedications: medications.filter(m => m.isActive).length,
        activeConditions: conditions.filter(c => c.clinicalStatus === 'active').length,
        knownAllergies: allergies.length,
      },
      reports,
      laboratoryResults: labResults,
      medications,
      conditions,
      allergies,
      auditLog: auditLogs,
    };

    const blob = new Blob([JSON.stringify(exportBundle, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `MedLens_Record_${patient.name.replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <MedLensContext.Provider
      value={{
        patient,
        reports,
        labResults,
        medications,
        conditions,
        allergies,
        auditLogs,
        timelineEvents,
        activeTab,
        setActiveTab,
        selectedReport,
        setSelectedReport,
        selectedLabResult,
        setSelectedLabResult,
        isAuditDrawerOpen,
        setIsAuditDrawerOpen,
        isReviewModalOpen,
        setIsReviewModalOpen,
        isUploadModalOpen,
        setIsUploadModalOpen,
        pendingReviewCount,

        verifyLabResult,
        editLabResult,
        verifyMedication,
        verifyCondition,
        verifyAllPendingHighConfidence,
        addReportWithExtracts,
        addUserAllergy,
        addUserCondition,
        addUserMedication,
        updatePatientProfile,
        resetToDemoData,
        exportRecordJSON,
      }}
    >
      {children}
    </MedLensContext.Provider>
  );
};

export const useMedLens = (): MedLensContextType => {
  const context = useContext(MedLensContext);
  if (!context) {
    throw new Error('useMedLens must be used within a MedLensProvider');
  }
  return context;
};
