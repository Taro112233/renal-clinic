// components/CounselingForm/Section01_BasicInfo.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Select, SelectContent, SelectItem,
  SelectTrigger, SelectValue,
} from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Search, UserPlus, AlertCircle,
  CheckCircle2, Loader2, X,
} from 'lucide-react';
import type {
  PatientSummary, CounselingRecordSummary,
  CounselingType, RheuDiagnosis,
} from '@/types/counseling';
import type { CreatePatientPayload } from '@/hooks/useCounselingForm';
import { cn } from '@/lib/utils';

// ─── Static label maps ───────────────────────────
const diagnosisLabels: Record<string, string> = {
  RA: 'RA', SLE: 'SLE', SSC: 'SSc', UCTD: 'UCTD', GOUT: 'Gout',
  PSORA: 'PsA', SPA: 'SpA', OVERLAP_SYNDROME: 'Overlap',
  DERMATOMYOSITIS: 'DM/PM', BEHCETS_DISEASE: "Behçet's",
  POLYMYALGIA_RHEUMATICA: 'PMR', OTHER: 'อื่นๆ',
};

const ALL_DIAGNOSES: RheuDiagnosis[] = [
  'RA', 'SLE', 'SSC', 'UCTD', 'GOUT', 'PSORA', 'SPA',
  'OVERLAP_SYNDROME', 'DERMATOMYOSITIS', 'BEHCETS_DISEASE',
  'POLYMYALGIA_RHEUMATICA', 'OTHER',
];

const healthSchemeLabels: Record<string, string> = {
  UC: 'บัตรทอง (UC)', SSS: 'ประกันสังคม (SSS)',
  CSMBS: 'ข้าราชการ (CSMBS)', OTHER: 'อื่นๆ',
};

// ─── New Patient Form types ───────────────────────
interface DiagnosisEntry {
  diagnosis: RheuDiagnosis;
  isPrimary: boolean;
}

interface NewPatientForm {
  prefix: string;
  firstName: string;
  lastName: string;
  gender: 'M' | 'F' | '';
  dateOfBirth: string;
  caseType: 'NEW' | 'OLD';
  healthScheme: 'UC' | 'SSS' | 'CSMBS' | 'OTHER' | '';
  diagnoses: DiagnosisEntry[];
}

type NewPatientErrors = Partial<Record<keyof NewPatientForm, string>>;

const defaultNewPatient: NewPatientForm = {
  prefix: '',
  firstName: '',
  lastName: '',
  gender: '',
  dateOfBirth: '',
  caseType: 'NEW',
  healthScheme: '',
  diagnoses: [],
};

function validateNewPatient(form: NewPatientForm): NewPatientErrors {
  const errs: NewPatientErrors = {};
  if (!form.firstName.trim()) errs.firstName = 'กรุณากรอกชื่อ';
  if (!form.lastName.trim()) errs.lastName = 'กรุณากรอกนามสกุล';
  if (!form.gender) errs.gender = 'กรุณาเลือกเพศ';
  if (!form.healthScheme) errs.healthScheme = 'กรุณาเลือกสิทธิ์';
  return errs;
}

// ─── Props ────────────────────────────────────────
interface Props {
  date: string;
  patientId: string;
  counselingType: CounselingType;
  onDateChange: (v: string) => void;
  onCounselingTypeChange: (v: CounselingType) => void;
  patient: PatientSummary | null;
  patientLoading: boolean;
  patientRecords: CounselingRecordSummary[];
  onLookup: (hn: string) => Promise<'found' | 'not_found'>;
  onClear: () => void;
  onCreatePatient: (payload: CreatePatientPayload) => Promise<boolean>;
  creatingPatient: boolean;
  onLoadRecord: (recordId: string) => void;
  loadingRecord: boolean;
  errors?: Partial<Record<'date' | 'patientId' | 'counselingType', string>>;
  prefixOptions?: { value: string; label: string }[];
}

// ─── Component ────────────────────────────────────
export function Section01_BasicInfo({
  date, counselingType,
  onDateChange, onCounselingTypeChange,
  patient, patientLoading, patientRecords,
  onLookup, onClear, onCreatePatient, creatingPatient,
  onLoadRecord, loadingRecord,
  errors = {},
  prefixOptions = [],
}: Props) {
  const [hnInput, setHnInput] = useState<string>('');
  const [selectedRecord, setSelectedRecord] = useState<string>('');
  const [showNewForm, setShowNewForm] = useState<boolean>(false);
  const [newPatient, setNewPatient] = useState<NewPatientForm>(defaultNewPatient);
  const [newPatientErrors, setNewPatientErrors] = useState<NewPatientErrors>({});

  // Reset new-patient state when patient is resolved
  useEffect(() => {
    if (patient) {
      setShowNewForm(false);
      setNewPatient(defaultNewPatient);
      setNewPatientErrors({});
      setSelectedRecord('');
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [patient?.id]);

  // ─── Search ───────────────────────────────────
  const handleSearch = async () => {
    if (!hnInput.trim()) return;
    const result = await onLookup(hnInput.trim());
    if (result === 'not_found') {
      setShowNewForm(true);
      setNewPatient(defaultNewPatient);
    } else {
      setShowNewForm(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') { e.preventDefault(); handleSearch(); }
  };

  // ─── Record selector ──────────────────────────
  const handleRecordChange = (val: string) => {
    setSelectedRecord(val);
    if (val && val !== 'new') onLoadRecord(val);
  };

  // ─── New Patient helpers ──────────────────────
  const setNPField = <K extends keyof NewPatientForm>(key: K, val: NewPatientForm[K]) => {
    setNewPatient(prev => ({ ...prev, [key]: val }));
    setNewPatientErrors(prev => ({ ...prev, [key]: undefined }));
  };

  const toggleDiagnosis = (dx: RheuDiagnosis) => {
    const exists = newPatient.diagnoses.find(d => d.diagnosis === dx);
    if (exists) {
      setNPField('diagnoses', newPatient.diagnoses.filter(d => d.diagnosis !== dx));
    } else {
      setNPField('diagnoses', [...newPatient.diagnoses, { diagnosis: dx, isPrimary: false }]);
    }
  };

  const setPrimary = (dx: RheuDiagnosis) => {
    setNPField('diagnoses', newPatient.diagnoses.map(d => ({
      ...d,
      isPrimary: d.diagnosis === dx,
    })));
  };

  const handleCreatePatient = async () => {
    const errs = validateNewPatient(newPatient);
    if (Object.keys(errs).length > 0) {
      setNewPatientErrors(errs);
      return;
    }
    const ok = await onCreatePatient({
      hn: hnInput.trim(),
      prefix: newPatient.prefix || undefined,
      firstName: newPatient.firstName,
      lastName: newPatient.lastName,
      gender: newPatient.gender as 'M' | 'F',
      dateOfBirth: newPatient.dateOfBirth || undefined,
      caseType: newPatient.caseType,
      healthScheme: newPatient.healthScheme as 'UC' | 'SSS' | 'CSMBS' | 'OTHER',
      diagnoses: newPatient.diagnoses,
    });
    if (!ok) return;
    setShowNewForm(false);
  };

  const handleDiscardNewForm = () => {
    setShowNewForm(false);
    setNewPatient(defaultNewPatient);
    setNewPatientErrors({});
  };

  // ─── Render ───────────────────────────────────
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base">
          <div className="w-6 h-6 rounded-full gradient-brand-semantic flex items-center justify-center text-white text-xs font-bold shrink-0">
            1
          </div>
          ข้อมูลพื้นฐาน
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-5">

        {/* Date + Counseling Type */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="date">วันที่ *</Label>
            <Input
              id="date"
              type="date"
              value={date}
              onChange={(e) => onDateChange(e.target.value)}
              className={errors.date ? 'border-alert-error-border' : ''}
            />
            {errors.date && <p className="text-sm text-alert-error-text">{errors.date}</p>}
          </div>

          <div className="space-y-2">
            <Label>ประเภท C/L *</Label>
            <div className="flex gap-2">
              {(['PRE', 'POST'] as CounselingType[]).map((type) => (
                <button
                  key={type}
                  type="button"
                  onClick={() => onCounselingTypeChange(type)}
                  className={cn(
                    'flex-1 py-2 px-3 rounded-md border text-sm font-medium transition-all',
                    counselingType === type
                      ? 'gradient-brand-semantic text-white border-transparent'
                      : 'border-border-primary text-content-secondary hover:bg-surface-interactive'
                  )}
                >
                  {type === 'PRE' ? 'Pre-CL' : 'Post-CL'}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* HN Search */}
        <div className="space-y-2">
          <Label htmlFor="hn">ค้นหาผู้ป่วย (HN) *</Label>
          <div className="flex gap-2">
            <Input
              id="hn"
              value={hnInput}
              onChange={(e) => setHnInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="กรอก HN แล้วกด Enter หรือกดค้นหา"
              disabled={patientLoading || !!patient}
            />
            {patient ? (
              <Button
                type="button"
                variant="outline"
                onClick={() => { onClear(); setHnInput(''); setShowNewForm(false); }}
                className="shrink-0 gap-1.5 text-content-secondary"
              >
                <X className="w-4 h-4" />
                เปลี่ยน
              </Button>
            ) : (
              <Button
                type="button"
                variant="outline"
                onClick={handleSearch}
                disabled={patientLoading || !hnInput.trim()}
                className="shrink-0"
              >
                {patientLoading
                  ? <Loader2 className="w-4 h-4 animate-spin" />
                  : <Search className="w-4 h-4" />
                }
              </Button>
            )}
          </div>
          {errors.patientId && !patient && !showNewForm && (
            <p className="text-sm text-alert-error-text flex items-center gap-1">
              <AlertCircle className="w-3 h-3" />
              {errors.patientId}
            </p>
          )}
        </div>

        {/* Loading skeleton */}
        {patientLoading && (
          <div className="rounded-lg border border-border-primary p-4 space-y-3">
            <Skeleton className="h-5 w-48" />
            <Skeleton className="h-4 w-64" />
            <div className="flex gap-2">
              <Skeleton className="h-6 w-16" />
              <Skeleton className="h-6 w-16" />
            </div>
          </div>
        )}

        {/* Existing patient card */}
        {!patientLoading && patient && (
          <div className="rounded-lg border border-border-interactive bg-surface-secondary p-4 space-y-3">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-alert-success-icon shrink-0" />
              <div>
                <p className="font-semibold text-content-primary">
                  {patient.prefix} {patient.firstName} {patient.lastName}
                </p>
                <p className="text-sm text-content-secondary">HN: {patient.hn}</p>
              </div>
            </div>

            <div className="flex flex-wrap gap-1.5">
              <Badge variant="outline" className="text-xs border-border-secondary text-content-secondary">
                {patient.gender === 'M' ? '♂ ชาย' : '♀ หญิง'}
              </Badge>
              <Badge
                variant="outline"
                className={cn(
                  'text-xs',
                  patient.caseType === 'NEW'
                    ? 'bg-alert-info-bg text-alert-info-text border-alert-info-border'
                    : 'bg-surface-tertiary text-content-secondary border-border-secondary'
                )}
              >
                {patient.caseType === 'NEW' ? 'New case' : 'Old case'}
              </Badge>
              <Badge variant="outline" className="text-xs border-border-secondary text-content-secondary">
                {healthSchemeLabels[patient.healthScheme] ?? patient.healthScheme}
              </Badge>
              {patient.diagnoses.map(d => (
                <Badge
                  key={d.id}
                  variant={d.isPrimary ? 'default' : 'outline'}
                  className={cn(
                    'text-xs',
                    d.isPrimary
                      ? 'gradient-brand-semantic text-white border-transparent'
                      : 'border-border-secondary text-content-secondary bg-transparent'
                  )}
                >
                  {diagnosisLabels[d.diagnosis] ?? d.diagnosis}
                  {d.isPrimary && ' ★'}
                </Badge>
              ))}
            </div>

            {/* Previous record selector */}
            {patientRecords.length > 0 && (
              <div className="space-y-1.5 pt-1 border-t border-border-subtle">
                <Label className="text-xs text-content-secondary">
                  โหลดข้อมูลจาก record ก่อนหน้า
                </Label>
                <Select
                  value={selectedRecord}
                  onValueChange={handleRecordChange}
                  disabled={loadingRecord}
                >
                  <SelectTrigger className="text-sm">
                    <SelectValue placeholder="— เพิ่มใหม่ (ฟอร์มว่าง) —" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="new">— เพิ่มใหม่ (ฟอร์มว่าง) —</SelectItem>
                    {patientRecords.map((r) => (
                      <SelectItem key={r.id} value={r.id}>
                        {new Date(r.date).toLocaleDateString('th-TH', {
                          day: '2-digit', month: 'short', year: '2-digit',
                        })}
                        {' '}{r.counselingType === 'PRE' ? 'Pre' : 'Post'}-CL
                        {' '}· {r.pharmacist.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {loadingRecord && (
                  <p className="text-xs text-content-tertiary animate-pulse">กำลังโหลด record...</p>
                )}
              </div>
            )}
          </div>
        )}

        {/* New Patient Inline Form */}
        {!patientLoading && showNewForm && !patient && (
          <div className="rounded-lg border border-alert-warning-border bg-alert-warning-bg p-4 space-y-4">

            {/* Header */}
            <div className="flex items-start justify-between gap-2">
              <div className="flex items-center gap-2">
                <UserPlus className="w-4 h-4 text-alert-warning-icon shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-alert-warning-text">
                    ไม่พบ HN {hnInput} ในระบบ
                  </p>
                  <p className="text-xs text-alert-warning-text opacity-80 mt-0.5">
                    กรอกข้อมูลเพื่อเพิ่มผู้ป่วยใหม่
                  </p>
                </div>
              </div>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={handleDiscardNewForm}
                className="h-7 w-7 shrink-0"
              >
                <X className="w-3.5 h-3.5" />
              </Button>
            </div>

            {/* Form fields */}
            <div className="space-y-3 bg-surface-primary/60 rounded-lg p-3">

              {/* Prefix + First + Last */}
              <div className="grid grid-cols-[100px_1fr_1fr] gap-2">
                <div className="space-y-1.5">
                  <Label className="text-xs">คำนำหน้า</Label>
                  {prefixOptions.length > 0 ? (
                    <Select value={newPatient.prefix} onValueChange={(v) => setNPField('prefix', v)}>
                      <SelectTrigger className="text-sm h-9">
                        <SelectValue placeholder="—" />
                      </SelectTrigger>
                      <SelectContent>
                        {prefixOptions.map(o => (
                          <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  ) : (
                    <Input
                      value={newPatient.prefix}
                      onChange={(e) => setNPField('prefix', e.target.value)}
                      placeholder="นาย/นาง"
                      className="text-sm h-9"
                    />
                  )}
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs">ชื่อ *</Label>
                  <Input
                    value={newPatient.firstName}
                    onChange={(e) => setNPField('firstName', e.target.value)}
                    placeholder="ชื่อจริง"
                    className={cn('text-sm h-9', newPatientErrors.firstName && 'border-alert-error-border')}
                  />
                  {newPatientErrors.firstName && (
                    <p className="text-xs text-alert-error-text">{newPatientErrors.firstName}</p>
                  )}
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs">นามสกุล *</Label>
                  <Input
                    value={newPatient.lastName}
                    onChange={(e) => setNPField('lastName', e.target.value)}
                    placeholder="นามสกุล"
                    className={cn('text-sm h-9', newPatientErrors.lastName && 'border-alert-error-border')}
                  />
                  {newPatientErrors.lastName && (
                    <p className="text-xs text-alert-error-text">{newPatientErrors.lastName}</p>
                  )}
                </div>
              </div>

              {/* Gender + DOB + Case */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                <div className="space-y-1.5">
                  <Label className="text-xs">เพศ *</Label>
                  <div className="flex gap-2">
                    {(['M', 'F'] as const).map(g => (
                      <button
                        key={g}
                        type="button"
                        onClick={() => setNPField('gender', g)}
                        className={cn(
                          'flex-1 py-1.5 px-2 rounded border text-sm transition-all',
                          newPatient.gender === g
                            ? 'gradient-brand-semantic text-white border-transparent'
                            : 'border-border-primary text-content-secondary hover:bg-surface-interactive',
                          newPatientErrors.gender && newPatient.gender === '' && 'border-alert-error-border'
                        )}
                      >
                        {g === 'M' ? '♂ ชาย' : '♀ หญิง'}
                      </button>
                    ))}
                  </div>
                  {newPatientErrors.gender && (
                    <p className="text-xs text-alert-error-text">{newPatientErrors.gender}</p>
                  )}
                </div>

                <div className="space-y-1.5">
                  <Label className="text-xs">วันเกิด</Label>
                  <Input
                    type="date"
                    value={newPatient.dateOfBirth}
                    onChange={(e) => setNPField('dateOfBirth', e.target.value)}
                    className="text-sm h-9"
                  />
                </div>

                <div className="space-y-1.5">
                  <Label className="text-xs">ประเภทเคส</Label>
                  <div className="flex gap-2">
                    {(['NEW', 'OLD'] as const).map(c => (
                      <button
                        key={c}
                        type="button"
                        onClick={() => setNPField('caseType', c)}
                        className={cn(
                          'flex-1 py-1.5 px-2 rounded border text-sm transition-all',
                          newPatient.caseType === c
                            ? 'gradient-brand-semantic text-white border-transparent'
                            : 'border-border-primary text-content-secondary hover:bg-surface-interactive'
                        )}
                      >
                        {c === 'NEW' ? 'New' : 'Old'}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Health Scheme */}
              <div className="space-y-1.5">
                <Label className="text-xs">สิทธิ์การรักษา *</Label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {(['UC', 'SSS', 'CSMBS', 'OTHER'] as const).map(s => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => setNPField('healthScheme', s)}
                      className={cn(
                        'py-1.5 px-2 rounded border text-xs font-medium transition-all',
                        newPatient.healthScheme === s
                          ? 'gradient-brand-semantic text-white border-transparent'
                          : 'border-border-primary text-content-secondary hover:bg-surface-interactive',
                        newPatientErrors.healthScheme && newPatient.healthScheme === '' && 'border-alert-error-border'
                      )}
                    >
                      {s === 'UC' ? 'บัตรทอง' : s === 'SSS' ? 'ประกันสังคม' : s === 'CSMBS' ? 'ข้าราชการ' : 'อื่นๆ'}
                    </button>
                  ))}
                </div>
                {newPatientErrors.healthScheme && (
                  <p className="text-xs text-alert-error-text">{newPatientErrors.healthScheme}</p>
                )}
              </div>

              {/* Diagnoses */}
              <div className="space-y-1.5">
                <Label className="text-xs">การวินิจฉัย</Label>
                <div className="flex flex-wrap gap-1.5">
                  {ALL_DIAGNOSES.map(dx => {
                    const selected = newPatient.diagnoses.find(d => d.diagnosis === dx);
                    return (
                      <button
                        key={dx}
                        type="button"
                        onClick={() => toggleDiagnosis(dx)}
                        className={cn(
                          'px-2.5 py-1 rounded-full text-xs font-medium border transition-all',
                          selected
                            ? 'gradient-brand-semantic text-white border-transparent'
                            : 'border-border-primary text-content-secondary hover:bg-surface-interactive'
                        )}
                      >
                        {diagnosisLabels[dx]}
                      </button>
                    );
                  })}
                </div>

                {/* Primary selector — shows only when 2+ diagnoses selected */}
                {newPatient.diagnoses.length > 1 && (
                  <div className="flex flex-wrap gap-1.5 pt-1 items-center">
                    <span className="text-xs text-content-tertiary">Primary:</span>
                    {newPatient.diagnoses.map(d => (
                      <button
                        key={d.diagnosis}
                        type="button"
                        onClick={() => setPrimary(d.diagnosis)}
                        className={cn(
                          'px-2 py-0.5 rounded text-xs border transition-all',
                          d.isPrimary
                            ? 'bg-alert-success-bg text-alert-success-text border-alert-success-border'
                            : 'border-border-primary text-content-tertiary hover:bg-surface-interactive'
                        )}
                      >
                        {diagnosisLabels[d.diagnosis]}{d.isPrimary ? ' ★' : ''}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Actions */}
            <div className="flex justify-end gap-2 pt-1">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleDiscardNewForm}
                disabled={creatingPatient}
              >
                ยกเลิก
              </Button>
              <Button
                type="button"
                size="sm"
                onClick={handleCreatePatient}
                disabled={creatingPatient}
                className="gradient-brand-semantic hover:opacity-90 gap-1.5"
              >
                {creatingPatient ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    กำลังบันทึก...
                  </>
                ) : (
                  <>
                    <UserPlus className="w-3.5 h-3.5" />
                    เพิ่มผู้ป่วยใหม่
                  </>
                )}
              </Button>
            </div>
          </div>
        )}

      </CardContent>
    </Card>
  );
}