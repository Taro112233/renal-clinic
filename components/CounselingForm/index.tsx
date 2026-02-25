// components/CounselingForm/index.tsx
'use client';

import React, { useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Loader2, Save, X, RotateCcw } from 'lucide-react';
import { toast } from 'sonner';

import { useSelectOptions } from '@/hooks/useSelectOptions';
import { useCounselingForm } from '@/hooks/useCounselingForm';
import { useCurrentUser } from '@/hooks/useCurrentUser';

import { Section01_BasicInfo } from './Section01_BasicInfo';
import { Section02_Medications } from './Section02_Medications';
import { Section03_History } from './Section03_History';
import { Section04_ADR } from './Section04_ADR';
import { Section05_EyeScreening } from './Section05_EyeScreening';
import { Section06_Compliance } from './Section06_Compliance';
import { Section07_LeftoverMeds } from './Section07_LeftoverMeds';
import { Section08_HealthBehavior } from './Section08_HealthBehavior';
import { Section09_DRP } from './Section09_DRP';
import { Section10_Other } from './Section10_Other';
import { Section11_LabValues } from './Section11_LabValues';
import { Section12_Cyclophosphamide } from './Section12_Cyclophosphamide';
import { SectionNote } from './SectionNote';

import type {
  CounselingFormValues,
  EyeAppointmentStatus,
  ConsultEyeResult,
  PopupHQAction,
  NonComplianceItemForm,
  CyclophosphamideRoute,
  CreateCounselingRequest,
} from '@/types/counseling';

const today = new Date().toISOString().split('T')[0];

const defaultValues: CounselingFormValues = {
  date: today,
  patientId: '',
  counselingType: 'PRE',
  hasDmards: false,
  currentDmards: [],
  otherMeds: '',
  historyNote: '',
  adrStatus: 'NO',
  adrDescription: '',
  hasHQ: false,
  eyeScreeningStatus: '',
  eyeAppointmentStatus: '',
  consultEyeResult: '',
  prevEyeDate: '',
  eyeResult: '',
  nextEyeDate: '',
  popupHQAction: '',
  complianceStatus: 'COMPLIANT',
  nonComplianceItems: [],
  leftoverMeds: [],
  alcoholStatus: '',
  herbStatus: '',
  smokingStatus: '',
  nsaidFromOther: '',
  hasDrp: false,
  drpItems: [],
  contraceptionMethod: '',
  hasME: false,
  meType: '',
  meDescription: '',
  meLevel: '',
  labDate: '',
  wbc: '', absoluteNeutrophil: '', neutrophilPercent: '',
  ast: '', alt: '', alp: '', uricAcid: '',
  creatinine: '', albumin: '', hsCRP: '',
  labLevel: '',
  hasCyclophosphamide: false,
  cyclophosphamideRoute: '',
  cyclophosphamideCumulativeDose: '',
  note: '',
};

function validate(values: CounselingFormValues) {
  const errors: Partial<Record<keyof CounselingFormValues, string>> = {};
  if (!values.date) errors.date = 'กรุณาระบุวันที่';
  if (!values.patientId) errors.patientId = 'กรุณาค้นหาและเลือกผู้ป่วย';
  if (!values.complianceStatus) errors.complianceStatus = 'กรุณาเลือกสถานะ compliance';
  return errors;
}

function toPayload(values: CounselingFormValues): CreateCounselingRequest {
  const parseFloat_ = (v: string) => v !== '' ? parseFloat(v) : undefined;
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
    alcoholStatus: values.alcoholStatus || undefined,
    herbStatus: values.herbStatus || undefined,
    smokingStatus: values.smokingStatus || undefined,
    nsaidFromOther: values.nsaidFromOther || undefined,
    hasDrp: values.hasDrp,
    drpItems: values.drpItems.filter(i => i.drugName.trim() !== ''),
    contraceptionMethod: values.contraceptionMethod || undefined,
    hasME: values.hasME,
    meType: values.meType || undefined,
    meDescription: values.meDescription || undefined,
    meLevel: values.meLevel || undefined,
    labDate: values.labDate || undefined,
    wbc: parseFloat_(values.wbc),
    absoluteNeutrophil: parseFloat_(values.absoluteNeutrophil),
    neutrophilPercent: parseFloat_(values.neutrophilPercent),
    ast: parseFloat_(values.ast),
    alt: parseFloat_(values.alt),
    alp: parseFloat_(values.alp),
    uricAcid: parseFloat_(values.uricAcid),
    creatinine: parseFloat_(values.creatinine),
    albumin: parseFloat_(values.albumin),
    hsCRP: parseFloat_(values.hsCRP),
    labLevel: values.labLevel || undefined,
    hasCyclophosphamide: values.hasCyclophosphamide,
    cyclophosphamideRoute: (values.cyclophosphamideRoute as CyclophosphamideRoute) || undefined,
    cyclophosphamideCumulativeDose: parseFloat_(values.cyclophosphamideCumulativeDose),
    note: values.note || undefined,
  };
}

export function CounselingForm() {
  const router = useRouter();
  const { user } = useCurrentUser();
  const { data: optionsData } = useSelectOptions();
  const {
    patient, patientLoading, patientRecords,
    selectedRecordId, setSelectedRecordId,
    lookupPatient, clearPatient,
    createPatient, creatingPatient,
    loadingRecord, loadPreviousRecord,
    submitting, submitCounseling,
  } = useCounselingForm();

  const [values, setValues] = useState<CounselingFormValues>(defaultValues);
  const [errors, setErrors] = useState<Partial<Record<keyof CounselingFormValues, string>>>({});

  const setField = useCallback(<K extends keyof CounselingFormValues>(
    key: K,
    value: CounselingFormValues[K]
  ) => {
    setValues(prev => ({ ...prev, [key]: value }));
    setErrors(prev => ({ ...prev, [key]: undefined }));
  }, []);

  const labValues: Record<string, string> = {
    wbc: values.wbc,
    absoluteNeutrophil: values.absoluteNeutrophil,
    neutrophilPercent: values.neutrophilPercent,
    ast: values.ast,
    alt: values.alt,
    alp: values.alp,
    uricAcid: values.uricAcid,
    creatinine: values.creatinine,
    albumin: values.albumin,
    hsCRP: values.hsCRP,
  };

  const handleLabValueChange = (key: string, val: string) => {
    setValues(prev => ({ ...prev, [key]: val }));
  };

  const handleLoadRecord = useCallback(async (recordId: string) => {
    const record = await loadPreviousRecord(recordId);
    if (!record) return;
    setValues(prev => ({
      ...prev,
      counselingType: record.counselingType,
      hasDmards: record.hasDmards,
      currentDmards: record.currentDmards,
      otherMeds: record.otherMeds ?? '',
      historyNote: record.historyNote ?? '',
      adrStatus: record.adrStatus,
      adrDescription: record.adrDescription ?? '',
      hasHQ: record.hasHQ,
      eyeScreeningStatus: record.eyeScreeningStatus ?? '',
      eyeAppointmentStatus: record.eyeAppointmentStatus ?? '',
      consultEyeResult: record.consultEyeResult ?? '',
      prevEyeDate: record.prevEyeDate ? record.prevEyeDate.split('T')[0] : '',
      eyeResult: record.eyeResult ?? '',
      nextEyeDate: record.nextEyeDate ? record.nextEyeDate.split('T')[0] : '',
      popupHQAction: record.popupHQAction ?? '',
      complianceStatus: record.complianceStatus,
      nonComplianceItems: record.nonComplianceItems ?? [],
      leftoverMeds: record.leftoverMeds ?? [],
      alcoholStatus: record.alcoholStatus ?? '',
      herbStatus: record.herbStatus ?? '',
      smokingStatus: record.smokingStatus ?? '',
      nsaidFromOther: record.nsaidFromOther ?? '',
      hasDrp: record.hasDrp,
      drpItems: record.drpItems ?? [],
      contraceptionMethod: record.contraceptionMethod ?? '',
      hasME: record.hasME,
      meType: record.meType ?? '',
      meDescription: record.meDescription ?? '',
      meLevel: record.meLevel ?? '',
      hasCyclophosphamide: record.hasCyclophosphamide,
      cyclophosphamideRoute: record.cyclophosphamideRoute ?? '',
      cyclophosphamideCumulativeDose: record.cyclophosphamideCumulativeDose?.toString() ?? '',
      note: record.note ?? '',
    }));
    toast.info('โหลดข้อมูลจาก record ก่อนหน้าแล้ว');
  }, [loadPreviousRecord]);

  // Sync patientId
  React.useEffect(() => {
    setField('patientId', patient?.id ?? '');
  }, [patient, setField]);

  // ─── Cancel = ล้างฟอร์ม (ไม่ navigate) ──────────
  const handleCancel = () => {
    setValues({ ...defaultValues, date: new Date().toISOString().split('T')[0] });
    setErrors({});
    clearPatient();
    toast.info('ล้างฟอร์มแล้ว');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const errs = validate(values);
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      toast.error('กรุณากรอกข้อมูลที่จำเป็นให้ครบถ้วน');
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
    await submitCounseling(toPayload(values));
  };

  const getOptions = (category: string) =>
    (optionsData[category] ?? []).filter((o: { isActive: boolean }) => o.isActive);

  const prefixOptions = getOptions('prefix').map((o: { value: string; label: string }) => ({
    value: o.value,
    label: o.label,
  }));

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="relative min-h-screen"
    >
      <div className="fixed inset-0 bg-linear-to-br from-brand-primary/10 via-brand-secondary/10 to-brand-tertiary/10 pointer-events-none" />

      <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="mb-6"
        >
          <h1 className="text-2xl font-bold text-content-primary mb-1">บันทึก Counseling</h1>
          <p className="text-content-secondary text-sm">
            กรอกข้อมูลการให้คำปรึกษาผู้ป่วยคลินิกโรคข้อรูมาติซัม
          </p>
        </motion.div>

        <form onSubmit={handleSubmit} noValidate>
          <div className="space-y-4">

            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>
              <Section01_BasicInfo
                date={values.date}
                patientId={values.patientId}
                counselingType={values.counselingType}
                onDateChange={(v) => setField('date', v)}
                onCounselingTypeChange={(v) => setField('counselingType', v)}
                patient={patient}
                patientLoading={patientLoading}
                patientRecords={patientRecords}
                onLookup={lookupPatient}
                onClear={clearPatient}
                onCreatePatient={createPatient}
                creatingPatient={creatingPatient}
                selectedRecordId={selectedRecordId}
                onRecordSelect={setSelectedRecordId}
                onLoadRecord={handleLoadRecord}
                loadingRecord={loadingRecord}
                errors={{
                  date: errors.date,
                  patientId: errors.patientId,
                  counselingType: errors.counselingType as string | undefined,
                }}
                prefixOptions={prefixOptions}
              />
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
              <Section02_Medications
                hasDmards={values.hasDmards}
                currentDmards={values.currentDmards}
                otherMeds={values.otherMeds}
                onHasDmardsChange={(v) => setField('hasDmards', v)}
                onCurrentDmardsChange={(v) => setField('currentDmards', v)}
                onOtherMedsChange={(v) => setField('otherMeds', v)}
                dmardOptions={getOptions('dmard')}
              />
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.22 }}>
              <Section03_History
                historyNote={values.historyNote}
                onChange={(v) => setField('historyNote', v)}
              />
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.24 }}>
              <Section04_ADR
                adrStatus={values.adrStatus}
                adrDescription={values.adrDescription}
                onAdrStatusChange={(v) => setField('adrStatus', v)}
                onAdrDescriptionChange={(v) => setField('adrDescription', v)}
                error={errors.adrStatus as string | undefined}
              />
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.26 }}>
              <Section05_EyeScreening
                hasHQ={values.hasHQ}
                eyeScreeningStatus={values.eyeScreeningStatus}
                eyeAppointmentStatus={values.eyeAppointmentStatus}
                consultEyeResult={values.consultEyeResult}
                prevEyeDate={values.prevEyeDate}
                eyeResult={values.eyeResult}
                nextEyeDate={values.nextEyeDate}
                popupHQAction={values.popupHQAction}
                onHasHQChange={(v) => setField('hasHQ', v)}
                onEyeScreeningStatusChange={(v) => setField('eyeScreeningStatus', v)}
                onEyeAppointmentStatusChange={(v) => setField('eyeAppointmentStatus', v)}
                onConsultEyeResultChange={(v) => setField('consultEyeResult', v)}
                onPrevEyeDateChange={(v) => setField('prevEyeDate', v)}
                onEyeResultChange={(v) => setField('eyeResult', v)}
                onNextEyeDateChange={(v) => setField('nextEyeDate', v)}
                onPopupHQActionChange={(v) => setField('popupHQAction', v)}
                eyeScreeningStatusOptions={getOptions('eye_screening_status')}
                eyeResultOptions={getOptions('eye_result')}
              />
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.28 }}>
              <Section06_Compliance
                complianceStatus={values.complianceStatus}
                nonComplianceItems={values.nonComplianceItems}
                onComplianceStatusChange={(v) => setField('complianceStatus', v)}
                onNonComplianceItemsChange={(v) => setField('nonComplianceItems', v)}
                error={errors.complianceStatus as string | undefined}
              />
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
              <Section07_LeftoverMeds
                leftoverMeds={values.leftoverMeds}
                onChange={(v) => setField('leftoverMeds', v)}
              />
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.32 }}>
              <Section08_HealthBehavior
                alcoholStatus={values.alcoholStatus}
                herbStatus={values.herbStatus}
                smokingStatus={values.smokingStatus}
                nsaidFromOther={values.nsaidFromOther}
                onAlcoholChange={(v) => setField('alcoholStatus', v)}
                onHerbChange={(v) => setField('herbStatus', v)}
                onSmokingChange={(v) => setField('smokingStatus', v)}
                onNsaidChange={(v) => setField('nsaidFromOther', v)}
                alcoholOptions={getOptions('alcohol')}
                herbOptions={getOptions('herb')}
                smokingOptions={getOptions('smoking')}
              />
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.34 }}>
              <Section09_DRP
                hasDrp={values.hasDrp}
                drpItems={values.drpItems}
                onHasDrpChange={(v) => setField('hasDrp', v)}
                onDrpItemsChange={(v) => setField('drpItems', v)}
                drpTypeOptions={getOptions('drp_type')}
              />
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.36 }}>
              <Section10_Other
                contraceptionMethod={values.contraceptionMethod}
                hasME={values.hasME}
                meType={values.meType}
                meDescription={values.meDescription}
                meLevel={values.meLevel}
                onContraceptionChange={(v) => setField('contraceptionMethod', v)}
                onHasMEChange={(v) => setField('hasME', v)}
                onMeTypeChange={(v) => setField('meType', v)}
                onMeDescriptionChange={(v) => setField('meDescription', v)}
                onMeLevelChange={(v) => setField('meLevel', v)}
                contraceptionOptions={getOptions('contraception')}
                meTypeOptions={getOptions('me_type')}
              />
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.38 }}>
              <Section11_LabValues
                labDate={values.labDate}
                labValues={labValues}
                labLevel={values.labLevel}
                onLabDateChange={(v) => setField('labDate', v)}
                onLabValueChange={handleLabValueChange}
                onLabLevelChange={(v) => setField('labLevel', v)}
              />
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
              <Section12_Cyclophosphamide
                hasCyclophosphamide={values.hasCyclophosphamide}
                cyclophosphamideRoute={values.cyclophosphamideRoute}
                cyclophosphamideCumulativeDose={values.cyclophosphamideCumulativeDose}
                onHasCYCChange={(v) => setField('hasCyclophosphamide', v)}
                onRouteChange={(v) => setField('cyclophosphamideRoute', v)}
                onCumulativeDoseChange={(v) => setField('cyclophosphamideCumulativeDose', v)}
              />
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.42 }}>
              <SectionNote
                note={values.note}
                onChange={(v) => setField('note', v)}
              />
            </motion.div>

            {/* ─── Action Bar ─────────────────────────────── */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.45 }}
              className="sticky bottom-4 z-20"
            >
              <div className="bg-surface-overlay backdrop-blur-md border border-border-primary rounded-xl p-4 shadow-elevation-3 flex flex-col sm:flex-row items-center justify-between gap-3">
                <p className="text-sm text-content-secondary order-2 sm:order-1">
                  บันทึกในชื่อ:{' '}
                  <span className="font-semibold text-content-primary">
                    {user?.fullName ?? user?.name ?? '—'}
                  </span>
                  {selectedRecordId && (
                    <span className="ml-2 text-alert-warning-text font-medium">
                      · อัปเดต record เดิม
                    </span>
                  )}
                </p>

                <div className="flex items-center gap-3 order-1 sm:order-2 w-full sm:w-auto">
                  {/* ล้างฟอร์ม */}
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleCancel}
                    disabled={submitting}
                    className="flex-1 sm:flex-none gap-1.5"
                  >
                    <RotateCcw className="w-4 h-4" />
                    ล้างฟอร์ม
                  </Button>

                  {/* บันทึก */}
                  <Button
                    type="submit"
                    disabled={submitting}
                    className="flex-1 sm:flex-none gap-1.5 gradient-brand-semantic hover:opacity-90"
                  >
                    {submitting ? (
                      <><Loader2 className="w-4 h-4 animate-spin" />กำลังบันทึก...</>
                    ) : selectedRecordId ? (
                      <><Save className="w-4 h-4" />อัปเดต</>
                    ) : (
                      <><Save className="w-4 h-4" />บันทึก</>
                    )}
                  </Button>
                </div>
              </div>
            </motion.div>

          </div>
        </form>
      </div>
    </motion.div>
  );
}