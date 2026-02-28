// components/CounselingDetail/index.tsx
'use client';

import React, { useState, useCallback, useEffect } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle, Loader2, Save } from 'lucide-react';

import { useCounselingDetail } from '@/hooks/useCounselingDetail';
import { useSelectOptions } from '@/hooks/useSelectOptions';
import { useCurrentUser } from '@/hooks/useCurrentUser';

import { DetailHeader } from './DetailHeader';
import { CounselingDetailSkeleton } from './DetailSkeleton';

// reuse form sections
import { Section01_BasicInfo } from '@/components/CounselingForm/Section01_BasicInfo';
import { Section02_Medications } from '@/components/CounselingForm/Section02_Medications';
import { Section03_History } from '@/components/CounselingForm/Section03_History';
import { Section04_ADR } from '@/components/CounselingForm/Section04_ADR';
import { Section05_EyeScreening } from '@/components/CounselingForm/Section05_EyeScreening';
import { Section06_Compliance } from '@/components/CounselingForm/Section06_Compliance';
import { Section07_LeftoverMeds } from '@/components/CounselingForm/Section07_LeftoverMeds';
import { Section08_HealthBehavior } from '@/components/CounselingForm/Section08_HealthBehavior';
import { Section09_DRP } from '@/components/CounselingForm/Section09_DRP';
import { Section10_Other } from '@/components/CounselingForm/Section10_Other';
import { Section11_LabValues } from '@/components/CounselingForm/Section11_LabValues';
import { Section12_Cyclophosphamide } from '@/components/CounselingForm/Section12_Cyclophosphamide';
import { SectionNote } from '@/components/CounselingForm/SectionNote';

import type {
  CounselingFormValues,
  EyeAppointmentStatus,
  ConsultEyeResult,
  PopupHQAction,
  NonComplianceItemForm,
  CyclophosphamideRoute,
  CreateCounselingRequest,
} from '@/types/counseling';
import { Button } from '../ui/button';

// ─── helpers ──────────────────────────────────────────────────────────────

function recordToFormValues(record: NonNullable<ReturnType<typeof useCounselingDetail>['record']>): CounselingFormValues {
  return {
    date: record.date.split('T')[0],
    patientId: record.patient.id,
    counselingType: record.counselingType,
    hasDmards: record.hasDmards,
    currentDmards: record.currentDmards,
    otherMeds: record.otherMeds ?? '',
    historyNote: record.historyNote ?? '',
    adrStatus: record.adrStatus as CounselingFormValues['adrStatus'],
    adrDescription: record.adrDescription ?? '',
    hasHQ: record.hasHQ,
    eyeScreeningStatus: record.eyeScreeningStatus ?? '',
    eyeAppointmentStatus: (record.eyeAppointmentStatus ?? '') as EyeAppointmentStatus | '',
    consultEyeResult: (record.consultEyeResult ?? '') as ConsultEyeResult | '',
    prevEyeDate: record.prevEyeDate ? record.prevEyeDate.split('T')[0] : '',
    eyeResult: record.eyeResult ?? '',
    nextEyeDate: record.nextEyeDate ? record.nextEyeDate.split('T')[0] : '',
    popupHQAction: (record.popupHQAction ?? '') as PopupHQAction | '',
    complianceStatus: record.complianceStatus as CounselingFormValues['complianceStatus'],
    nonComplianceItems: record.nonComplianceItems.map(i => ({
      orderNumber: i.orderNumber,
      type: i.type as NonComplianceItemForm['type'],
      description: i.description ?? '',
    })),
    leftoverMeds: (record.leftoverMeds as { drugName: string; quantity: number }[]) ?? [],
    alcoholStatus: record.alcoholStatus,
    herbStatus: record.herbStatus,
    smokingStatus: record.smokingStatus,
    nsaidFromOther: record.nsaidFromOther ?? '',
    hasDrp: record.hasDrp,
    drpItems: record.drpItems.map(d => ({
      orderNumber: d.orderNumber,
      drugCode: d.drugCode ?? '',
      drugName: d.drugName,
      drpType: d.drpType,
      consultResult: d.consultResult ?? '',
    })),
    contraceptionMethod: record.contraceptionMethod ?? '',
    hasME: record.hasME,
    meType: record.meType ?? '',
    meDescription: record.meDescription ?? '',
    meLevel: record.meLevel ?? '',
    labDate: record.labDate ? record.labDate.split('T')[0] : '',
    wbc: record.wbc?.toString() ?? '',
    absoluteNeutrophil: record.absoluteNeutrophil?.toString() ?? '',
    neutrophilPercent: record.neutrophilPercent?.toString() ?? '',
    ast: record.ast?.toString() ?? '',
    alt: record.alt?.toString() ?? '',
    alp: record.alp?.toString() ?? '',
    uricAcid: record.uricAcid?.toString() ?? '',
    creatinine: record.creatinine?.toString() ?? '',
    albumin: record.albumin?.toString() ?? '',
    hsCRP: record.hsCRP?.toString() ?? '',
    labLevel: record.labLevel ?? '',
    hasCyclophosphamide: record.hasCyclophosphamide,
    cyclophosphamideRoute: (record.cyclophosphamideRoute ?? '') as CyclophosphamideRoute | '',
    cyclophosphamideCumulativeDose: record.cyclophosphamideCumulativeDose?.toString() ?? '',
    note: record.note ?? '',
  };
}

function toPayload(values: CounselingFormValues): CreateCounselingRequest {
  const pf = (v: string) => v !== '' ? parseFloat(v) : undefined;
  return {
    date: values.date,
    patientId: values.patientId,
    counselingType: values.counselingType,
    hasDmards: values.hasDmards,
    currentDmards: values.currentDmards,
    otherMeds: values.otherMeds || undefined,
    historyNote: values.historyNote || undefined,
    adrStatus: values.adrStatus,
    adrDescription: values.adrDescription || undefined,
    hasHQ: values.hasHQ,
    eyeScreeningStatus: values.eyeScreeningStatus || undefined,
    eyeAppointmentStatus: (values.eyeAppointmentStatus as EyeAppointmentStatus) || undefined,
    consultEyeResult: (values.consultEyeResult as ConsultEyeResult) || undefined,
    prevEyeDate: values.prevEyeDate || undefined,
    eyeResult: values.eyeResult || undefined,
    nextEyeDate: values.nextEyeDate || undefined,
    popupHQAction: (values.popupHQAction as PopupHQAction) || undefined,
    complianceStatus: values.complianceStatus,
    nonComplianceItems: values.nonComplianceItems.filter(i => i.type !== '') as NonComplianceItemForm[],
    leftoverMeds: values.leftoverMeds.filter(i => i.drugName.trim() !== ''),
    alcoholStatus: values.alcoholStatus,
    herbStatus: values.herbStatus,
    smokingStatus: values.smokingStatus,
    nsaidFromOther: values.nsaidFromOther || undefined,
    hasDrp: values.hasDrp,
    drpItems: values.drpItems.filter(i => i.drugName.trim() !== ''),
    contraceptionMethod: values.contraceptionMethod || undefined,
    hasME: values.hasME,
    meType: values.meType || undefined,
    meDescription: values.meDescription || undefined,
    meLevel: values.meLevel || undefined,
    labDate: values.labDate || undefined,
    wbc: pf(values.wbc), absoluteNeutrophil: pf(values.absoluteNeutrophil),
    neutrophilPercent: pf(values.neutrophilPercent), ast: pf(values.ast),
    alt: pf(values.alt), alp: pf(values.alp), uricAcid: pf(values.uricAcid),
    creatinine: pf(values.creatinine), albumin: pf(values.albumin), hsCRP: pf(values.hsCRP),
    labLevel: values.labLevel || undefined,
    hasCyclophosphamide: values.hasCyclophosphamide,
    cyclophosphamideRoute: (values.cyclophosphamideRoute as CyclophosphamideRoute) || undefined,
    cyclophosphamideCumulativeDose: pf(values.cyclophosphamideCumulativeDose),
    note: values.note || undefined,
  };
}

// ─── Main component ────────────────────────────────────────────────────────

interface Props { id: string }

export function CounselingDetail({ id }: Props) {
  const { user } = useCurrentUser();
  const { record, loading, error, updating, updateRecord } = useCounselingDetail(id);
  const { data: optionsData } = useSelectOptions();

  const [isEditing, setIsEditing] = useState(false);
  const [values, setValues] = useState<CounselingFormValues | null>(null);
  const [formErrors, setFormErrors] = useState<Partial<Record<keyof CounselingFormValues, string>>>({});

  // Sync values when record loads or edit mode toggled off
  useEffect(() => {
    if (record) setValues(recordToFormValues(record));
  }, [record]);

  const canEdit = !!user && (
    user.role === 'SUPERADMIN' ||
    (record ? record.pharmacistId === user.id : false)
  );

  const setField = useCallback(<K extends keyof CounselingFormValues>(
    key: K, value: CounselingFormValues[K],
  ) => {
    setValues(prev => prev ? { ...prev, [key]: value } : prev);
    setFormErrors(prev => ({ ...prev, [key]: undefined }));
  }, []);

  const handleCancelEdit = () => {
    if (record) setValues(recordToFormValues(record));
    setFormErrors({});
    setIsEditing(false);
  };

  const handleSave = async () => {
    if (!values) return;
    if (!values.patientId) {
      setFormErrors({ patientId: 'ไม่พบข้อมูลผู้ป่วย' });
      toast.error('ข้อมูลไม่ครบถ้วน');
      return;
    }
    const ok = await updateRecord(toPayload(values));
    if (ok) setIsEditing(false);
  };

  const getOptions = (category: string) =>
    (optionsData[category] ?? []).filter((o: { isActive: boolean }) => o.isActive);

  const prefixOptions = getOptions('prefix').map((o: { value: string; label: string }) => ({
    value: o.value, label: o.label,
  }));

  if (loading) return <CounselingDetailSkeleton />;

  if (error || !record || !values) {
    return (
      <div className="relative min-h-screen">
        <div className="fixed inset-0 bg-linear-to-br from-brand-primary/10 via-brand-secondary/10 to-brand-tertiary/10 pointer-events-none" />
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error ?? 'ไม่พบข้อมูล'}</AlertDescription>
          </Alert>
        </div>
      </div>
    );
  }

  // Fake patient object for Section01 (read-only view when not editing)
  const patientForSection01 = {
    id: record.patient.id,
    hn: record.patient.hn,
    prefix: record.patient.prefix,
    firstName: record.patient.firstName,
    lastName: record.patient.lastName,
    gender: record.patient.gender,
    dateOfBirth: record.patient.dateOfBirth,
    caseType: record.patient.caseType,
    status: record.patient.status,
    healthScheme: record.patient.healthScheme,
    diagnoses: record.patient.diagnoses ?? [], 
  };

  const labValues: Record<string, string> = {
    wbc: values.wbc, absoluteNeutrophil: values.absoluteNeutrophil,
    neutrophilPercent: values.neutrophilPercent, ast: values.ast,
    alt: values.alt, alp: values.alp, uricAcid: values.uricAcid,
    creatinine: values.creatinine, albumin: values.albumin, hsCRP: values.hsCRP,
  };

  const sectionDelay = (n: number) => ({ delay: 0.05 * n });

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="relative min-h-screen"
    >
      <div className="fixed inset-0 bg-linear-to-br from-brand-primary/10 via-brand-secondary/10 to-brand-tertiary/10 pointer-events-none" />

      <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={sectionDelay(1)}>
          <DetailHeader
            record={record}
            isEditing={isEditing}
            saving={updating}
            canEdit={canEdit}
            onEditToggle={() => setIsEditing(true)}
            onSave={handleSave}
            onCancelEdit={handleCancelEdit}
          />
        </motion.div>

        <div className="space-y-4">

          {/* Section 01 — Basic Info (patient ค้นหาไม่ได้ในโหมดแก้ไข เพราะ record ผูกกับผู้ป่วยแล้ว) */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={sectionDelay(2)}>
            <Section01_BasicInfo
              date={values.date}
              patientId={values.patientId}
              counselingType={values.counselingType}
              onDateChange={v => setField('date', v)}
              onCounselingTypeChange={v => setField('counselingType', v)}
              // ส่ง patient object เข้าโดยตรง — ล็อกไว้ ค้นหาใหม่ไม่ได้
              patient={patientForSection01 as Parameters<typeof Section01_BasicInfo>[0]['patient']}
              patientLoading={false}
              patientRecords={[]}
              onLookup={async () => 'found'}
              onClear={() => {}}
              onCreatePatient={async () => false}
              creatingPatient={false}
              selectedRecordId={null}
              onRecordSelect={() => {}}
              onLoadRecord={() => {}}
              loadingRecord={false}
              errors={{
                date: formErrors.date,
                patientId: formErrors.patientId,
              }}
              prefixOptions={prefixOptions}
            />
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={sectionDelay(3)}>
            <Section02_Medications
              hasDmards={values.hasDmards}
              currentDmards={values.currentDmards}
              otherMeds={values.otherMeds}
              onHasDmardsChange={v => setField('hasDmards', v)}
              onCurrentDmardsChange={v => setField('currentDmards', v)}
              onOtherMedsChange={v => setField('otherMeds', v)}
              dmardOptions={getOptions('dmard')}
            />
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={sectionDelay(4)}>
            <Section03_History
              historyNote={values.historyNote}
              onChange={v => setField('historyNote', v)}
            />
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={sectionDelay(5)}>
            <Section04_ADR
              adrStatus={values.adrStatus}
              adrDescription={values.adrDescription}
              onAdrStatusChange={v => setField('adrStatus', v)}
              onAdrDescriptionChange={v => setField('adrDescription', v)}
            />
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={sectionDelay(6)}>
            <Section05_EyeScreening
              hasHQ={values.hasHQ}
              eyeScreeningStatus={values.eyeScreeningStatus}
              eyeAppointmentStatus={values.eyeAppointmentStatus}
              consultEyeResult={values.consultEyeResult}
              prevEyeDate={values.prevEyeDate}
              eyeResult={values.eyeResult}
              nextEyeDate={values.nextEyeDate}
              popupHQAction={values.popupHQAction}
              onHasHQChange={v => setField('hasHQ', v)}
              onEyeScreeningStatusChange={v => setField('eyeScreeningStatus', v)}
              onEyeAppointmentStatusChange={v => setField('eyeAppointmentStatus', v)}
              onConsultEyeResultChange={v => setField('consultEyeResult', v)}
              onPrevEyeDateChange={v => setField('prevEyeDate', v)}
              onEyeResultChange={v => setField('eyeResult', v)}
              onNextEyeDateChange={v => setField('nextEyeDate', v)}
              onPopupHQActionChange={v => setField('popupHQAction', v)}
              eyeScreeningStatusOptions={getOptions('eye_screening_status')}
              eyeResultOptions={getOptions('eye_result')}
            />
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={sectionDelay(7)}>
            <Section06_Compliance
              complianceStatus={values.complianceStatus}
              nonComplianceItems={values.nonComplianceItems}
              onComplianceStatusChange={v => setField('complianceStatus', v)}
              onNonComplianceItemsChange={v => setField('nonComplianceItems', v)}
            />
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={sectionDelay(8)}>
            <Section07_LeftoverMeds
              leftoverMeds={values.leftoverMeds}
              onChange={v => setField('leftoverMeds', v)}
            />
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={sectionDelay(9)}>
            <Section08_HealthBehavior
              alcoholStatus={values.alcoholStatus}
              herbStatus={values.herbStatus}
              smokingStatus={values.smokingStatus}
              nsaidFromOther={values.nsaidFromOther}
              onAlcoholChange={v => setField('alcoholStatus', v)}
              onHerbChange={v => setField('herbStatus', v)}
              onSmokingChange={v => setField('smokingStatus', v)}
              onNsaidChange={v => setField('nsaidFromOther', v)}
              alcoholOptions={getOptions('alcohol')}
              herbOptions={getOptions('herb')}
              smokingOptions={getOptions('smoking')}
            />
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={sectionDelay(10)}>
            <Section09_DRP
              hasDrp={values.hasDrp}
              drpItems={values.drpItems}
              onHasDrpChange={v => setField('hasDrp', v)}
              onDrpItemsChange={v => setField('drpItems', v)}
              drpTypeOptions={getOptions('drp_type')}
            />
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={sectionDelay(11)}>
            <Section10_Other
              contraceptionMethod={values.contraceptionMethod}
              hasME={values.hasME}
              meType={values.meType}
              meDescription={values.meDescription}
              meLevel={values.meLevel}
              onContraceptionChange={v => setField('contraceptionMethod', v)}
              onHasMEChange={v => setField('hasME', v)}
              onMeTypeChange={v => setField('meType', v)}
              onMeDescriptionChange={v => setField('meDescription', v)}
              onMeLevelChange={v => setField('meLevel', v)}
              contraceptionOptions={getOptions('contraception')}
              meTypeOptions={getOptions('me_type')}
            />
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={sectionDelay(12)}>
            <Section11_LabValues
              labDate={values.labDate}
              labValues={labValues}
              labLevel={values.labLevel}
              onLabDateChange={v => setField('labDate', v)}
              onLabValueChange={(key, val) => setValues(prev => prev ? { ...prev, [key]: val } : prev)}
              onLabLevelChange={v => setField('labLevel', v)}
            />
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={sectionDelay(13)}>
            <Section12_Cyclophosphamide
              hasCyclophosphamide={values.hasCyclophosphamide}
              cyclophosphamideRoute={values.cyclophosphamideRoute}
              cyclophosphamideCumulativeDose={values.cyclophosphamideCumulativeDose}
              onHasCYCChange={v => setField('hasCyclophosphamide', v)}
              onRouteChange={v => setField('cyclophosphamideRoute', v)}
              onCumulativeDoseChange={v => setField('cyclophosphamideCumulativeDose', v)}
            />
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={sectionDelay(14)}>
            <SectionNote
              note={values.note}
              onChange={v => setField('note', v)}
            />
          </motion.div>

          {/* Sticky save bar — shows only in edit mode */}
          {isEditing && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="sticky bottom-4 z-20"
            >
              <div className="bg-surface-overlay backdrop-blur-md border border-border-primary rounded-xl p-4 shadow-elevation-3 flex items-center justify-between gap-3">
                <p className="text-sm text-alert-warning-text font-medium">
                  กำลังแก้ไข — กด &quot;บันทึก&quot; เพื่อยืนยันการเปลี่ยนแปลง
                </p>
                <div className="flex items-center gap-2 shrink-0">
                  <Button variant="outline" size="sm" onClick={handleCancelEdit} disabled={updating}>
                    ยกเลิก
                  </Button>
                  <Button
                    size="sm"
                    onClick={handleSave}
                    disabled={updating}
                    className="gradient-brand-semantic hover:opacity-90 gap-1.5"
                  >
                    {updating
                      ? <><Loader2 className="w-4 h-4 animate-spin" />กำลังบันทึก...</>
                      : <><Save className="w-4 h-4" />บันทึก</>
                    }
                  </Button>
                </div>
              </div>
            </motion.div>
          )}

        </div>
      </div>
    </motion.div>
  );
}