// types/counseling.ts

export type CounselingType = 'PRE' | 'POST';
export type AdrStatus = 'NO' | 'YES_DMARD' | 'YES_HQ' | 'YES_OTHER' | 'YES_DMARD_HQ' | 'YES_DMARD_OTHER';
export type EyeAppointmentStatus = 'YES' | 'NO' | 'LOSS' | 'EXTERNAL_SCREENING';
export type ConsultEyeResult = 'YES' | 'NO' | 'NOT_SUGGESTED';
export type PopupHQAction = 'SET_NEW' | 'UPDATE' | 'EXISTING' | 'NONE';
export type ComplianceStatus = 'COMPLIANT' | 'NON_COMPLIANT' | 'UNABLE_TO_ASSESS';
export type NonComplianceType = 'WRONG_METHOD' | 'FORGOT_DOSE' | 'SELF_ADJUST' | 'LOSS_FOLLOWUP' | 'STOPPED_DUE_TO_ADR';
export type CyclophosphamideRoute = 'ORAL' | 'IV';
export type HealthScheme = 'UC' | 'SSS' | 'CSMBS' | 'OTHER';
export type CaseType = 'NEW' | 'OLD';
export type RheuDiagnosis =
  | 'RA' | 'SLE' | 'SSC' | 'UCTD' | 'GOUT' | 'PSORA'
  | 'SPA' | 'OVERLAP_SYNDROME' | 'DERMATOMYOSITIS'
  | 'BEHCETS_DISEASE' | 'POLYMYALGIA_RHEUMATICA' | 'OTHER';

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

export interface LeftoverMedItem {
  drugName: string;
  quantity: number;
}

export interface CounselingFormValues {
  // Section 1 - ข้อมูลพื้นฐาน
  date: string;
  patientId: string;
  counselingType: CounselingType;

  // Section 2 - ข้อมูลยา
  hasDmards: boolean;
  currentDmards: string[];
  otherMeds: string;

  // Section 3 - ซักประวัติ
  historyNote: string;

  // Section 4 - ADR
  adrStatus: AdrStatus;
  adrDescription: string;

  // Section 5 - HQ Eye Screening
  hasHQ: boolean;
  eyeScreeningStatus: string;
  eyeAppointmentStatus: EyeAppointmentStatus | '';
  consultEyeResult: ConsultEyeResult | '';
  prevEyeDate: string;
  eyeResult: string;
  nextEyeDate: string;
  popupHQAction: PopupHQAction | '';

  // Section 6 - Compliance
  complianceStatus: ComplianceStatus;
  nonComplianceItems: NonComplianceItemForm[];

  // Section 7 - ยาเหลือ
  leftoverMeds: LeftoverMedItem[];

  // Section 8 - Health Behavior
  alcoholStatus: string;
  herbStatus: string;
  smokingStatus: string;
  nsaidFromOther: string;

  // Section 9 - DRP
  hasDrp: boolean;
  drpItems: DrpItemForm[];

  // Section 10 - อื่นๆ
  contraceptionMethod: string;
  hasME: boolean;
  meType: string;
  meDescription: string;
  meLevel: string;

  // Section 11 - Lab Values
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

  // Section 12 - Cyclophosphamide
  hasCyclophosphamide: boolean;
  cyclophosphamideRoute: CyclophosphamideRoute | '';
  cyclophosphamideCumulativeDose: string;

  // Note
  note: string;
}

export interface PatientSummary {
  id: string;
  hn: string;
  prefix: string | null;
  firstName: string;
  lastName: string;
  gender: 'M' | 'F';
  dateOfBirth: string | null;
  caseType: CaseType;
  status: string;
  healthScheme: HealthScheme;
  diagnoses: {
    id: string;
    diagnosis: RheuDiagnosis;
    isPrimary: boolean;
  }[];
}

export interface CounselingRecordSummary {
  id: string;
  date: string;
  counselingType: CounselingType;
  pharmacist: { id: string; name: string };
}

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
  leftoverMeds?: LeftoverMedItem[];
  alcoholStatus?: string;
  herbStatus?: string;
  smokingStatus?: string;
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