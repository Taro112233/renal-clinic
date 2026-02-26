// types/counseling.ts

export type CounselingType = 'PRE' | 'POST';
export type AdrStatus = 'NO' | 'YES_DMARD' | 'YES_HQ' | 'YES_OTHER' | 'YES_DMARD_HQ' | 'YES_DMARD_OTHER';
export type EyeAppointmentStatus = 'YES' | 'NO' | 'LOSS' | 'EXTERNAL_SCREENING';
export type ConsultEyeResult = 'YES' | 'NO' | 'NOT_SUGGESTED';
export type PopupHQAction = 'SET_NEW' | 'UPDATE' | 'EXISTING' | 'NONE';
export type ComplianceStatus = 'COMPLIANT' | 'NON_COMPLIANT' | 'UNABLE_TO_ASSESS';
export type NonComplianceType = 'WRONG_METHOD' | 'FORGOT_DOSE' | 'SELF_ADJUST' | 'LOSS_FOLLOWUP' | 'STOPPED_DUE_TO_ADR';
export type CyclophosphamideRoute = 'ORAL' | 'IV';
export type RheuDiagnosis =
  | 'RA' | 'SLE' | 'SSC' | 'UCTD' | 'GOUT' | 'PSORA' | 'SPA'
  | 'OVERLAP_SYNDROME' | 'DERMATOMYOSITIS' | 'BEHCETS_DISEASE'
  | 'POLYMYALGIA_RHEUMATICA' | 'OTHER';

export interface NonComplianceItemForm {
  orderNumber: number;
  type: NonComplianceType | '';
  description?: string;
}

export interface DrpItemForm {
  orderNumber: number;
  drugCode?: string;
  drugName: string;
  drpType: string;
  consultResult?: string;
}

export interface LeftoverMedForm {
  drugName: string;
  quantity: number;
}

export interface DiagnosisSummary {
  id: string;
  diagnosis: RheuDiagnosis;
  isPrimary: boolean;
}

export interface PatientSummary {
  id: string;
  hn: string;
  prefix?: string | null;
  firstName: string;
  lastName: string;
  gender: 'M' | 'F';
  dateOfBirth?: string | null;
  caseType: 'NEW' | 'OLD';
  status: string;
  healthScheme: 'UC' | 'SSS' | 'CSMBS' | 'OTHER';
  diagnoses: DiagnosisSummary[];
}

export interface CounselingRecordSummary {
  id: string;
  date: string;
  counselingType: CounselingType;
  pharmacist: { id: string; name: string };
}

// ─── Form state (internal React state, string for number inputs) ───────────
export interface CounselingFormValues {
  date: string;
  patientId: string;
  counselingType: CounselingType;

  hasDmards: boolean;
  currentDmards: string[];
  otherMeds: string;

  historyNote: string;

  adrStatus: AdrStatus;
  adrDescription: string;

  hasHQ: boolean;
  eyeScreeningStatus: string;
  eyeAppointmentStatus: EyeAppointmentStatus | '';
  consultEyeResult: ConsultEyeResult | '';
  prevEyeDate: string;
  eyeResult: string;
  nextEyeDate: string;
  popupHQAction: PopupHQAction | '';

  complianceStatus: ComplianceStatus;
  nonComplianceItems: NonComplianceItemForm[];

  leftoverMeds: LeftoverMedForm[];

  // ✅ เปลี่ยนเป็น string[] (multiselect)
  alcoholStatus: string[];
  herbStatus: string[];
  smokingStatus: string[];
  nsaidFromOther: string;

  hasDrp: boolean;
  drpItems: DrpItemForm[];

  contraceptionMethod: string;

  hasME: boolean;
  meType: string;
  meDescription: string;
  meLevel: string;

  labDate: string;
  wbc: string;
  absoluteNeutrophil: string;
  neutrophilPercent: string;
  ast: string;
  alt: string;
  alp: string;
  uricAcid: string;
  creatinine: string;
  albumin: string;
  hsCRP: string;
  labLevel: string;

  hasCyclophosphamide: boolean;
  cyclophosphamideRoute: CyclophosphamideRoute | '';
  cyclophosphamideCumulativeDose: string;

  note: string;
}

// ─── API request payload ──────────────────────────────────────────────────
export interface CreateCounselingRequest {
  date: string;
  patientId: string;
  counselingType: CounselingType;

  hasDmards: boolean;
  currentDmards: string[];
  otherMeds?: string;

  historyNote?: string;

  adrStatus: AdrStatus;
  adrDescription?: string;

  hasHQ: boolean;
  eyeScreeningStatus?: string;
  eyeAppointmentStatus?: EyeAppointmentStatus;
  consultEyeResult?: ConsultEyeResult;
  prevEyeDate?: string;
  eyeResult?: string;
  nextEyeDate?: string;
  popupHQAction?: PopupHQAction;

  complianceStatus: ComplianceStatus;
  nonComplianceItems: NonComplianceItemForm[];

  leftoverMeds?: LeftoverMedForm[];

  // ✅ เปลี่ยนเป็น string[] (multiselect)
  alcoholStatus?: string[];
  herbStatus?: string[];
  smokingStatus?: string[];
  nsaidFromOther?: string;

  hasDrp: boolean;
  drpItems: DrpItemForm[];

  contraceptionMethod?: string;

  hasME: boolean;
  meType?: string;
  meDescription?: string;
  meLevel?: string;

  labDate?: string;
  wbc?: number;
  absoluteNeutrophil?: number;
  neutrophilPercent?: number;
  ast?: number;
  alt?: number;
  alp?: number;
  uricAcid?: number;
  creatinine?: number;
  albumin?: number;
  hsCRP?: number;
  labLevel?: string;

  hasCyclophosphamide: boolean;
  cyclophosphamideRoute?: CyclophosphamideRoute;
  cyclophosphamideCumulativeDose?: number;

  note?: string;
}