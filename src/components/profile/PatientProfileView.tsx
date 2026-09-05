import React, { useState } from 'react';
import { useMedLens } from '../../context/MedLensContext';
import { Card } from '../common/Card';
import { Button } from '../common/Button';
import { Modal } from '../common/Modal';
import { ProvenanceBadge } from '../common/Badge';
import {
  User,
  AlertCircle,
  Plus,
  HeartPulse,
  Pill,
  FileCheck,
} from 'lucide-react';

export const PatientProfileView: React.FC = () => {
  const {
    patient,
    updatePatientProfile,
    allergies,
    addUserAllergy,
    conditions,
    addUserCondition,
    medications,
    addUserMedication,
  } = useMedLens();

  // Modals for adding user-reported information
  const [isAddAllergyOpen, setIsAddAllergyOpen] = useState(false);
  const [isAddConditionOpen, setIsAddConditionOpen] = useState(false);
  const [isAddMedOpen, setIsAddMedOpen] = useState(false);

  // Form states
  const [allergySubstance, setAllergySubstance] = useState('');
  const [allergyReaction, setAllergyReaction] = useState('');
  const [allergySeverity, setAllergySeverity] = useState<'mild' | 'moderate' | 'severe' | 'life_threatening'>('moderate');

  const [conditionName, setConditionName] = useState('');
  const [conditionNotes, setConditionNotes] = useState('');

  const [medName, setMedName] = useState('');
  const [medStrength, setMedStrength] = useState('');
  const [medFrequency, setMedFrequency] = useState('');

  // Demographics editing
  const [isEditingNotes, setIsEditingNotes] = useState(false);
  const [notesText, setNotesText] = useState(patient.userNotes || '');

  const handleSaveNotes = () => {
    updatePatientProfile({ userNotes: notesText });
    setIsEditingNotes(false);
  };

  const handleCreateAllergy = (e: React.FormEvent) => {
    e.preventDefault();
    if (!allergySubstance) return;
    addUserAllergy({
      substance: allergySubstance,
      reaction: allergyReaction || 'Self-reported reaction',
      severity: allergySeverity,
      reportedDate: new Date().toISOString().split('T')[0],
    });
    setAllergySubstance('');
    setAllergyReaction('');
    setIsAddAllergyOpen(false);
  };

  const handleCreateCondition = (e: React.FormEvent) => {
    e.preventDefault();
    if (!conditionName) return;
    addUserCondition({
      name: conditionName,
      clinicalStatus: 'active',
      onsetDate: new Date().toISOString().split('T')[0],
      notes: conditionNotes,
    });
    setConditionName('');
    setConditionNotes('');
    setIsAddConditionOpen(false);
  };

  const handleCreateMedication = (e: React.FormEvent) => {
    e.preventDefault();
    if (!medName) return;
    addUserMedication({
      name: medName,
      strength: medStrength,
      frequency: medFrequency,
      route: 'Oral',
      isActive: true,
      reportDate: new Date().toISOString().split('T')[0],
      prescribingContext: 'Patient self-reported OTC / outside medication',
    });
    setMedName('');
    setMedStrength('');
    setMedFrequency('');
    setIsAddMedOpen(false);
  };

  const userConditions = conditions.filter(c => c.provenance.category === 'user_provided');
  const userMedications = medications.filter(m => m.provenance.category === 'user_provided');

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-full bg-teal-100 text-teal-800 flex items-center justify-center font-bold text-xl ring-4 ring-teal-50">
            {patient.name.split(' ').map(n => n[0]).join('')}
          </div>
          <div>
            <div className="flex items-center gap-2.5">
              <h2 className="text-xl font-bold text-slate-900">{patient.name}</h2>
              <span className="px-2 py-0.5 rounded text-xs font-semibold bg-slate-100 text-slate-700 border border-slate-200">
                MRN: {patient.mrn}
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Born {patient.dateOfBirth} ({patient.age} years) • Biological Sex: {patient.biologicalSex} • Blood: {patient.bloodType || 'Unknown'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <ProvenanceBadge category="user_provided" size="md" />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Demographics & User-Reported Health Profile */}
        <div className="space-y-6">
          <Card
            header={
              <div className="flex items-center gap-2">
                <User className="w-4 h-4 text-teal-700" />
                <span className="font-semibold text-slate-900">Patient Identity & Emergency Contact</span>
              </div>
            }
          >
            <div className="space-y-3 text-xs">
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="text-slate-500">Legal Name:</span>
                <span className="font-semibold text-slate-800">{patient.name}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="text-slate-500">Date of Birth:</span>
                <span className="font-semibold text-slate-800">{patient.dateOfBirth}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="text-slate-500">Biological Sex:</span>
                <span className="font-semibold text-slate-800">{patient.biologicalSex}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="text-slate-500">Blood Type:</span>
                <span className="font-semibold text-slate-800">{patient.bloodType || 'A+'}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="text-slate-500">Emergency Contact:</span>
                <span className="font-semibold text-slate-800">
                  {patient.emergencyContact?.name} ({patient.emergencyContact?.relation})
                </span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-slate-500">Emergency Phone:</span>
                <span className="font-mono text-slate-800">{patient.emergencyContact?.phone}</span>
              </div>
            </div>
          </Card>

          {/* User Self-Reported Symptoms & Clinical Notes */}
          <Card
            header={
              <div className="flex items-center justify-between w-full">
                <div className="flex items-center gap-2">
                  <FileCheck className="w-4 h-4 text-teal-700" />
                  <span className="font-semibold text-slate-900">Patient Clinical Notes & Symptoms</span>
                </div>
                {!isEditingNotes && (
                  <button
                    type="button"
                    onClick={() => {
                      setNotesText(patient.userNotes || '');
                      setIsEditingNotes(true);
                    }}
                    className="text-xs text-teal-700 hover:text-teal-900 font-medium"
                  >
                    Edit
                  </button>
                )}
              </div>
            }
          >
            {!isEditingNotes ? (
              <p className="text-xs text-slate-700 leading-relaxed bg-slate-50 p-3 rounded-lg border border-slate-200">
                {patient.userNotes || 'No notes provided by patient.'}
              </p>
            ) : (
              <div className="space-y-2">
                <textarea
                  rows={4}
                  value={notesText}
                  onChange={(e) => setNotesText(e.target.value)}
                  className="w-full text-xs p-2.5 border border-slate-300 rounded-md focus:ring-1 focus:ring-teal-500"
                  placeholder="Record current symptoms, exercise habits, or notes for your doctor..."
                />
                <div className="flex justify-end gap-2">
                  <Button variant="ghost" size="sm" onClick={() => setIsEditingNotes(false)}>
                    Cancel
                  </Button>
                  <Button variant="primary" size="sm" onClick={handleSaveNotes}>
                    Save Notes
                  </Button>
                </div>
              </div>
            )}
            <div className="mt-3 flex items-center justify-between text-[11px] text-slate-400">
              <span>Origin: Self-Reported Intake</span>
              <ProvenanceBadge category="user_provided" size="xs" />
            </div>
          </Card>
        </div>

        {/* Right 2 Columns: Allergies, User-Reported Conditions & Outside Medications */}
        <div className="lg:col-span-2 space-y-6">
          {/* Allergies Card */}
          <Card
            header={
              <div className="flex items-center justify-between w-full">
                <div className="flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-rose-600" />
                  <span className="font-semibold text-slate-900">Allergies & Adverse Reactions</span>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setIsAddAllergyOpen(true)}
                  leftIcon={<Plus className="w-3.5 h-3.5" />}
                  className="text-xs"
                >
                  Add Allergy
                </Button>
              </div>
            }
          >
            <div className="space-y-3">
              {allergies.map((allergy) => (
                <div
                  key={allergy.id}
                  className="p-3.5 rounded-lg border border-slate-200 bg-white hover:border-slate-300 transition-colors"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-slate-900 text-sm">{allergy.substance}</span>
                        <span
                          className={`text-[10px] uppercase font-bold px-1.5 py-0.5 rounded ${
                            allergy.severity === 'severe' || allergy.severity === 'life_threatening'
                              ? 'bg-rose-100 text-rose-800'
                              : 'bg-amber-100 text-amber-800'
                          }`}
                        >
                          {allergy.severity.replace('_', ' ')}
                        </span>
                      </div>
                      <p className="text-xs text-slate-600 mt-1">{allergy.reaction}</p>
                    </div>

                    <ProvenanceBadge category={allergy.provenance.category} size="xs" />
                  </div>
                  <div className="mt-2.5 pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400 font-mono">
                    <span>Recorded: {allergy.reportedDate}</span>
                    <span>Audit: {allergy.id}</span>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* User-Reported Conditions & Symptoms */}
          <Card
            header={
              <div className="flex items-center justify-between w-full">
                <div className="flex items-center gap-2">
                  <HeartPulse className="w-4 h-4 text-teal-700" />
                  <span className="font-semibold text-slate-900">
                    Self-Reported Conditions & Diagnoses
                  </span>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setIsAddConditionOpen(true)}
                  leftIcon={<Plus className="w-3.5 h-3.5" />}
                  className="text-xs"
                >
                  Add Condition
                </Button>
              </div>
            }
          >
            {userConditions.length > 0 ? (
              <div className="space-y-3">
                {userConditions.map((cond) => (
                  <div key={cond.id} className="p-3.5 rounded-lg border border-slate-200 bg-white">
                    <div className="flex items-start justify-between gap-2">
                      <h4 className="font-semibold text-sm text-slate-900">{cond.name}</h4>
                      <ProvenanceBadge category="user_provided" size="xs" />
                    </div>
                    {cond.notes && <p className="text-xs text-slate-600 mt-1">{cond.notes}</p>}
                    <div className="mt-2 text-[11px] text-slate-400">
                      Reported Onset: {cond.onsetDate || 'Not specified'}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-slate-500 italic py-2">
                No user-entered conditions recorded. Conditions extracted from medical reports appear in the Conditions & History tab.
              </p>
            )}
          </Card>

          {/* User-Reported Over-the-Counter & Outside Medications */}
          <Card
            header={
              <div className="flex items-center justify-between w-full">
                <div className="flex items-center gap-2">
                  <Pill className="w-4 h-4 text-purple-600" />
                  <span className="font-semibold text-slate-900">
                    Self-Reported OTC / Outside Medications
                  </span>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setIsAddMedOpen(true)}
                  leftIcon={<Plus className="w-3.5 h-3.5" />}
                  className="text-xs"
                >
                  Add Medication
                </Button>
              </div>
            }
          >
            {userMedications.length > 0 ? (
              <div className="space-y-3">
                {userMedications.map((med) => (
                  <div key={med.id} className="p-3.5 rounded-lg border border-slate-200 bg-white">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <span className="font-semibold text-sm text-slate-900">{med.name}</span>
                        {med.strength && (
                          <span className="ml-2 font-mono text-xs text-teal-800 bg-teal-50 px-1.5 py-0.2 rounded border border-teal-200">
                            {med.strength}
                          </span>
                        )}
                      </div>
                      <ProvenanceBadge category="user_provided" size="xs" />
                    </div>
                    <div className="text-xs text-slate-600 mt-1">{med.frequency}</div>
                    <div className="mt-2 text-[11px] text-slate-400">
                      Context: {med.prescribingContext || 'Patient Self-Reported'}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-slate-500 italic py-2">
                No OTC or outside supplements recorded. Prescription medications extracted from reports appear in the Medications tab.
              </p>
            )}
          </Card>
        </div>
      </div>

      {/* Add Allergy Modal */}
      <Modal
        isOpen={isAddAllergyOpen}
        onClose={() => setIsAddAllergyOpen(false)}
        title="Add User-Reported Allergy"
        subtitle="This information will be explicitly tagged as [User Provided]."
      >
        <form onSubmit={handleCreateAllergy} className="space-y-4 text-xs">
          <div>
            <label className="block font-medium text-slate-700 mb-1">Substance / Medication Name *</label>
            <input
              type="text"
              required
              value={allergySubstance}
              onChange={(e) => setAllergySubstance(e.target.value)}
              placeholder="e.g. Latex, Penicillin, Peanuts"
              className="w-full px-3 py-2 border border-slate-300 rounded-md focus:ring-1 focus:ring-teal-500"
            />
          </div>
          <div>
            <label className="block font-medium text-slate-700 mb-1">Reaction Symptoms</label>
            <input
              type="text"
              value={allergyReaction}
              onChange={(e) => setAllergyReaction(e.target.value)}
              placeholder="e.g. Hives, difficulty breathing, rash"
              className="w-full px-3 py-2 border border-slate-300 rounded-md focus:ring-1 focus:ring-teal-500"
            />
          </div>
          <div>
            <label className="block font-medium text-slate-700 mb-1">Severity Level</label>
            <select
              value={allergySeverity}
              onChange={(e) => setAllergySeverity(e.target.value as any)}
              className="w-full px-3 py-2 border border-slate-300 rounded-md focus:ring-1 focus:ring-teal-500"
            >
              <option value="mild">Mild (minor itching, redness)</option>
              <option value="moderate">Moderate (extensive rash, hives)</option>
              <option value="severe">Severe (swelling, respiratory difficulty)</option>
              <option value="life_threatening">Life Threatening (Anaphylaxis)</option>
            </select>
          </div>
          <div className="pt-2 flex justify-end gap-2">
            <Button variant="ghost" size="sm" type="button" onClick={() => setIsAddAllergyOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" size="sm" type="submit">
              Save Allergy
            </Button>
          </div>
        </form>
      </Modal>

      {/* Add Condition Modal */}
      <Modal
        isOpen={isAddConditionOpen}
        onClose={() => setIsAddConditionOpen(false)}
        title="Add User-Reported Condition"
        subtitle="This information will be explicitly tagged as [User Provided]."
      >
        <form onSubmit={handleCreateCondition} className="space-y-4 text-xs">
          <div>
            <label className="block font-medium text-slate-700 mb-1">Condition / Symptom Name *</label>
            <input
              type="text"
              required
              value={conditionName}
              onChange={(e) => setConditionName(e.target.value)}
              placeholder="e.g. Migraine with aura, Asthma"
              className="w-full px-3 py-2 border border-slate-300 rounded-md focus:ring-1 focus:ring-teal-500"
            />
          </div>
          <div>
            <label className="block font-medium text-slate-700 mb-1">Notes / Description</label>
            <textarea
              rows={3}
              value={conditionNotes}
              onChange={(e) => setConditionNotes(e.target.value)}
              placeholder="Provide frequency, triggers, or history..."
              className="w-full px-3 py-2 border border-slate-300 rounded-md focus:ring-1 focus:ring-teal-500"
            />
          </div>
          <div className="pt-2 flex justify-end gap-2">
            <Button variant="ghost" size="sm" type="button" onClick={() => setIsAddConditionOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" size="sm" type="submit">
              Save Condition
            </Button>
          </div>
        </form>
      </Modal>

      {/* Add Medication Modal */}
      <Modal
        isOpen={isAddMedOpen}
        onClose={() => setIsAddMedOpen(false)}
        title="Add User-Reported Medication or Supplement"
        subtitle="This information will be explicitly tagged as [User Provided]."
      >
        <form onSubmit={handleCreateMedication} className="space-y-4 text-xs">
          <div>
            <label className="block font-medium text-slate-700 mb-1">Medication / Supplement Name *</label>
            <input
              type="text"
              required
              value={medName}
              onChange={(e) => setMedName(e.target.value)}
              placeholder="e.g. Melatonin, Magnesium Glycinate"
              className="w-full px-3 py-2 border border-slate-300 rounded-md focus:ring-1 focus:ring-teal-500"
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-medium text-slate-700 mb-1">Strength / Dose</label>
              <input
                type="text"
                value={medStrength}
                onChange={(e) => setMedStrength(e.target.value)}
                placeholder="e.g. 5 mg, 400 mg"
                className="w-full px-3 py-2 border border-slate-300 rounded-md focus:ring-1 focus:ring-teal-500"
              />
            </div>
            <div>
              <label className="block font-medium text-slate-700 mb-1">Frequency</label>
              <input
                type="text"
                value={medFrequency}
                onChange={(e) => setMedFrequency(e.target.value)}
                placeholder="e.g. 1 tablet at bedtime"
                className="w-full px-3 py-2 border border-slate-300 rounded-md focus:ring-1 focus:ring-teal-500"
              />
            </div>
          </div>
          <div className="pt-2 flex justify-end gap-2">
            <Button variant="ghost" size="sm" type="button" onClick={() => setIsAddMedOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" size="sm" type="submit">
              Save Medication
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
