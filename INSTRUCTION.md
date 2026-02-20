# 📋 Project Instruction: ระบบบันทึกและรายงานผลการบริบาลเภสัชกรรมคลินิกโรคข้อรูมาติซัม
ความสมบูรณ์ของ Instruction: 50%
ขณะนี้กำลังทำส่วนของ: Dashboard หลังจาก login สำเร็จ และ หน้ารออนุมัติ

## Rheumatology Pharmaceutical Care Recording & Reporting System

---

## 1. 🎯 Project Overview

### ชื่อระบบ
**RheuPharmCare** — ระบบบันทึกกิจกรรมบริบาลเภสัชกรรม (Pharmaceutical Care) คลินิกโรคข้อรูมาติซัม (Rheumatology Clinic)

### Pain Point ปัจจุบัน
1. เภสัชกรจดบันทึกข้อมูล Pre-counseling ลงกระดาษ → ต้องมาคีย์ซ้ำลง Google Spreadsheet
2. สรุปรายงานผลประจำเดือนโดย manual: filter, นับมือ, ผูก pivot table แบบมั่วๆ
3. ไม่มี Dashboard / KPI แบบ real-time
4. เสียเวลาทำรายงานส่งกลุ่มงานทุกเดือน ต้องนับข้อมูลซ้ำซ้อน

### เป้าหมาย
สร้าง Web Application ที่:
- **บันทึกข้อมูล** การ counseling ผู้ป่วยได้ง่ายผ่าน คอม/มือถือ/ไอแพด (responsive)
- **Dashboard & KPI** แบบ real-time เลือกช่วงเวลา/เดือน/ปีงบประมาณได้
- **Export รายงาน** เป็น Excel ที่ format ตรงกับ template ที่กลุ่มงานต้องการ
- **ลดเวลา** จากการจด→คีย์→นับ manual → เป็น จิ้มบันทึก→ดูผลทันที

---

## 2. 👥 User Roles & Access

### ใช้ RBAC ที่มีใน Template (lib/role-helpers.ts)

| Role | สิทธิ์ |
|------|-------|
| **USER** (ผู้ใช้ที่ยังไม่อนุมัติ)|
| **ADMIN** (เภสัชกร) | บันทึกข้อมูล C/L, ดู Dashboard ข้อมูลตัวเอง, ดูข้อมูลผู้ป่วย |
| **SUPERADMIN** (หัวหน้ากลุ่มงาน) | ดู Dashboard ภาพรวม, Export รายงาน, จัดการข้อมูลอ้างอิง, ดูข้อมูลเภสัชกรทุกคน จัดการ users, system config ทั้งหมด |

---

## 3. 📊 Database Schema Design

### 3.1 Patient Registry (ทะเบียนผู้ป่วย — เทียบจาก sheet "Reg. pt")

```prisma
model Patient {
  id            String    @id @default(cuid())
  hn            String    @unique              // Hospital Number — PK จากระบบ HIS
  prefix        String?                         // คำนำหน้า: นาย, นาง, นางสาว, เด็กชาย, เด็กหญิง
  firstName     String
  lastName      String
  gender        Gender                          // M, F
  dateOfBirth   DateTime?
  
  // Clinical status
  caseType      CaseType  @default(NEW)         // NEW = New case, OLD = Old case (Follow-up)
  status        PatientStatus @default(ACTIVE)   // ACTIVE, DISCHARGED, REFERRED, DECEASED
  
  // ข้อมูลสิทธิ์
  healthScheme  HealthScheme                    // UC, ปกส., ขรก./ท้องถิ่น, อื่นๆ
  
  // Diagnosis — ผู้ป่วย 1 คน อาจมีมากกว่า 1 Dx
  diagnoses     PatientDiagnosis[]
  
  // Clinic info
  newClinicDate DateTime?                       // วันที่มาคลินิกครั้งแรก
  referDate     DateTime?                       // วันที่ refer/discharge
  referNote     String?
  
  // Relations
  counselingRecords CounselingRecord[]
  
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt
  createdBy     String                          // userId ของคนสร้าง
  
  @@index([hn])
  @@index([lastName, firstName])
  @@map("patients")
}

enum Gender {
  M
  F
}

enum CaseType {
  NEW
  OLD
}

enum PatientStatus {
  ACTIVE
  DISCHARGED
  REFERRED
  DECEASED
}

enum HealthScheme {
  UC                  // บัตรทอง
  SSS                 // ประกันสังคม
  CSMBS               // ขรก./ท้องถิ่น (Civil Servant Medical Benefit Scheme)
  OTHER               // อื่นๆ
}
```

### 3.2 Patient Diagnosis (เทียบจาก column "Dx")

```prisma
model PatientDiagnosis {
  id          String   @id @default(cuid())
  patientId   String
  patient     Patient  @relation(fields: [patientId], references: [id], onDelete: Cascade)
  diagnosis   RheuDiagnosis
  isPrimary   Boolean  @default(false)
  diagnosedAt DateTime?
  note        String?
  
  createdAt   DateTime @default(now())
  
  @@index([patientId])
  @@map("patient_diagnoses")
}

enum RheuDiagnosis {
  RA                    // Rheumatoid Arthritis
  SLE                   // Systemic Lupus Erythematosus
  SSC                   // Systemic Sclerosis (Scleroderma)
  UCTD                  // Undifferentiated Connective Tissue Disease
  GOUT                  // Gout
  PSORA                 // Psoriatic Arthritis
  SPA                   // Spondyloarthritis
  OVERLAP_SYNDROME      // Overlap Syndrome
  DERMATOMYOSITIS       // Dermatomyositis
  BEHCETS_DISEASE       // Behcet's Disease
  POLYMYALGIA_RHEUMATICA // Polymyalgia Rheumatica
  OTHER                 // อื่นๆ
}
```

### 3.3 Counseling Record (เทียบจาก sheet "ข้อมูลที่คีย์จากงานCL" — 1 row = 1 record)

**นี่คือ table หลักที่เภสัชกรจะบันทึกข้อมูลผ่านหน้าฟอร์ม**

```prisma
model CounselingRecord {
  id              String    @id @default(cuid())
  
  // === ข้อมูลพื้นฐาน ===
  date            DateTime                      // วันที่ทำ C/L (DD/MM/YYYY)
  sequenceNumber  Int?                          // ลำดับในวันนั้น
  patientId       String
  patient         Patient   @relation(fields: [patientId], references: [id])
  pharmacistId    String                        // userId ของเภสัชกรที่ทำ
  pharmacist      User      @relation(fields: [pharmacistId], references: [id])
  counselingType  CounselingType                // PRE or POST
  
  // === ข้อมูลยา ===
  currentDmards   String?                       // ยา DMARDs ที่ใช้อยู่ (text, เช่น "MTX, HCQ, Pred")
  hasDmards       Boolean   @default(false)     // มี DMARDs หรือไม่
  otherMeds       String?                       // ยาอื่นๆ
  
  // === ซักประวัติ ===
  historyNote     String?                       // Note จากการซักประวัติ (free text)
  
  // === ADR (Adverse Drug Reaction) ===
  adrStatus       AdrStatus @default(NO)        // No, Yes จาก DMARD, Yes จาก HQ, Yes จากยาอื่นๆ, Yes จาก DMARDs+HQ, Yes จาก DMARDs+ยาอื่นๆ
  adrDescription  String?                       // รายละเอียด ADR
  
  // === HQ/CQ Eye Screening (เฉพาะคนที่ใช้ HQ/CQ) ===
  hasHQ              Boolean  @default(false)   // คนไข้มีใช้ยา HQ/CQ?
  eyeScreeningStatus String?                    // ซัก Eye → ตาปกติ, มีปัญหา, ไม่ได้ซัก
  eyeAppointmentStatus EyeAppointmentStatus?    // Yes, No, loss นัด EYE, screen ที่รพ.อื่น/คลินิกอื่น
  consultEyeResult   ConsultEyeResult?          // [if No/loss] Yes = OK consult, No, ไม่ได้ suggest นัด
  prevEyeDate        DateTime?                  // prev. EYE date
  eyeResult          String?                    // EYEล่าสุด: no maculopathy, maculopathy, etc.
  nextEyeDate        DateTime?                  // next EYE date
  popupHQAction      PopupHQAction?             // set new pop, update pop, มี pop-up เดิม, no
  
  // === Compliance / Adherence ===
  complianceStatus   ComplianceStatus            // กินถูก+ครบ, non-compliance
  nonComplianceItems NonComplianceItem[]         // รายละเอียดปัญหา (1-3 รายการ)
  
  // === ยาเหลือ (Leftover medications) ===
  leftoverMeds    String?                       // Text: "ssz=100, losec=30, naproxen=30"
  
  // === Health Behavior ===
  alcoholStatus   String?                       // No, Yes เบียร์, Yes เหล้า/40, Yes เบียร์+เหล้า, Yes ตามเทศกาล
  herbStatus      String?                       // No, อาหารเสริม, นม/อาหารทางการแพทย์
  smokingStatus   String?                       // No, Yes บุหรี่, Yes ยาเส้น
  nsaidFromOther  String?                       // NSAID จากที่อื่น (free text)
  
  // === DRP (Drug Related Problem) / Consult ===
  hasDrp          Boolean  @default(false)      // พบ DRP?
  drpItems        DrpItem[]                     // รายละเอียด DRP (1-2 รายการ)
  
  // === Contraception ===
  contraceptionMethod String?                   // วิธีคุมกำเนิด
  
  // === Medication Error ===
  hasME           Boolean  @default(false)      // พบ ME?
  meDescription   String?                       // รายละเอียด ME
  meLevel         String?                       // Level: A-G (NCC MERP)
  
  // === Lab Values (เจาะแลป) ===
  labDate         DateTime?                     // วันที่เจาะแลป
  wbc             Float?                        // WBC (5000-10000 cells/mm3)
  absoluteNeutrophil Float?                     // Absolute Neutrophil Count
  neutrophilPercent  Float?                     // Neutrophil %
  ast             Float?                        // AST (0-31 U/L)
  alt             Float?                        // ALT (0-34 U/L)
  alp             Float?                        // ALP (40-150 U/L)
  uricAcid        Float?                        // Uric acid (3.6-8.2 mg/dL)
  creatinine      Float?                        // Creatinine (0.55-1.02 mg/dL)
  albumin         Float?                        // Albumin (3.5-5.2 gm/dL)
  hsCRP           Float?                        // hsCRP (<1 mg/L)
  labLevel        String?                       // ระดับปกติ/ผิดปกติ
  
  // === Cyclophosphamide (ถ้ามี) ===
  hasCyclophosphamide Boolean @default(false)
  cyclophosphamideRoute CyclophosphamideRoute?  // ORAL or IV
  cyclophosphamideCumulativeDose Float?         // Cumulative dose (mg)
  
  // === Other Notes ===
  note            String?                       // Note อื่นๆ
  
  // === Meta ===
  createdAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt
  
  @@index([date])
  @@index([patientId])
  @@index([pharmacistId])
  @@index([date, pharmacistId])
  @@map("counseling_records")
}

enum CounselingType {
  PRE
  POST
}

enum AdrStatus {
  NO
  YES_DMARD               // Yes จาก DMARD
  YES_HQ                  // Yes จาก HQ
  YES_OTHER               // Yes จากยาอื่นๆ
  YES_DMARD_HQ            // Yes จาก DMARDs + HQ
  YES_DMARD_OTHER         // Yes จาก DMARDs + ยาอื่นๆ
}

enum EyeAppointmentStatus {
  YES                     // มีนัด Eye
  NO                      // ยังไม่มีนัด
  LOSS                    // loss นัด EYE
  EXTERNAL_SCREENING      // screen ที่รพ.อื่น/คลินิกอื่น
}

enum ConsultEyeResult {
  YES                     // OK consult แล้ว
  NO                      // ไม่
  NOT_SUGGESTED           // ไม่ได้ suggest นัด
}

enum PopupHQAction {
  SET_NEW                 // set new pop
  UPDATE                  // update pop-up
  EXISTING                // มี pop-up เดิม
  NONE                    // no
}

enum ComplianceStatus {
  COMPLIANT               // กินถูก+ครบ
  NON_COMPLIANT           // non-compliance
}

enum CyclophosphamideRoute {
  ORAL
  IV
}
```

### 3.4 Non-Compliance Item (ปัญหา non-compliance — สูงสุด 3 รายการ/ครั้ง)

```prisma
model NonComplianceItem {
  id                String   @id @default(cuid())
  counselingRecordId String
  counselingRecord   CounselingRecord @relation(fields: [counselingRecordId], references: [id], onDelete: Cascade)
  
  orderNumber       Int                          // 1, 2, or 3
  type              NonComplianceType             // ประเภทปัญหา
  description       String?                       // รายละเอียด/ยาที่เกี่ยวข้อง
  
  @@index([counselingRecordId])
  @@map("non_compliance_items")
}

enum NonComplianceType {
  WRONG_METHOD          // ผิดวิธี/จำผิด
  FORGOT_DOSE           // ลืมกินยา
  SELF_ADJUST           // ปรับ/หยุดยาเอง
  LOSS_FOLLOWUP         // Loss f/u, ขาดยา
}
```

### 3.5 DRP Item (Drug Related Problem — สูงสุด 2 รายการ/ครั้ง)

```prisma
model DrpItem {
  id                String   @id @default(cuid())
  counselingRecordId String
  counselingRecord   CounselingRecord @relation(fields: [counselingRecordId], references: [id], onDelete: Cascade)
  
  orderNumber       Int                          // 1 or 2
  drugName          String                       // ชื่อยาที่เกี่ยวข้อง
  drpType           String                       // ประเภท DRP (free text หรือ enum ตามต้องการ)
  consultResult     String?                      // ผล consult: accept, not accept, pending
  
  @@index([counselingRecordId])
  @@map("drp_items")
}
```

### 3.6 Drug Saving Record (มูลค่ายาเหลือ — เทียบจาก sheet "Rheu DrugSaving")

```prisma
model DrugSavingRecord {
  id          String   @id @default(cuid())
  month       Int                               // เดือน (1-12)
  year        Int                               // ปี คศ. (2025, 2026, ...)
  fiscalYear  String                            // ปีงบประมาณ เช่น "68", "69"
  
  drugCode    String                            // รหัสยา เช่น "1M013B"
  drugName    String                            // ชื่อยา เช่น "MTX 2.5 mg tab"
  unitPrice   Float                             // ราคาต่อเม็ด/หน่วย (บาท)
  quantity    Int                               // จำนวนเม็ด/หน่วยที่ซักหักยาเหลือได้
  totalSaving Float                             // = unitPrice × quantity
  
  isDmard     Boolean  @default(false)          // เป็นยากลุ่ม DMARDs?
  
  createdBy   String                            // userId
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
  
  @@unique([month, year, drugCode])
  @@index([fiscalYear])
  @@index([month, year])
  @@map("drug_saving_records")
}
```

### 3.7 Clinic Session (ข้อมูลรอบคลินิก — เทียบจาก report row "ได้ทำคลินิกกี่ครั้ง")

```prisma
model ClinicSession {
  id                    String   @id @default(cuid())
  date                  DateTime                 // วันที่ออกคลินิก
  month                 Int                      // เดือน
  year                  Int                      // ปี
  fiscalYear            String                   // ปีงบ
  
  totalScheduledPatients Int                     // จำนวนคนไข้ตามนัดในระบบ
  noShowCount           Int     @default(0)      // จำนวนที่ไม่มา
  walkInCount           Int     @default(0)      // มาเพิ่มนอกนัด
  postalCount           Int     @default(0)      // ส่งไปรษณีย์
  
  pharmacistId          String?                  // เภสัชกรที่ออกคลินิก
  
  note                  String?
  createdBy             String
  createdAt             DateTime @default(now())
  updatedAt             DateTime @updatedAt
  
  @@index([month, year])
  @@index([date])
  @@map("clinic_sessions")
}
```

### 3.8 Drug Master (ข้อมูลยาอ้างอิง)

```prisma
model DrugMaster {
  id          String   @id @default(cuid())
  drugCode    String   @unique                  // รหัสยา
  drugName    String                            // ชื่อยา
  unitPrice   Float                             // ราคาต่อหน่วย
  isDmard     Boolean  @default(false)          // เป็น DMARD?
  isHQ        Boolean  @default(false)          // เป็น HQ/CQ?
  isActive    Boolean  @default(true)
  
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
  
  @@map("drug_masters")
}
```

---

## 4. 📱 UI Pages & Features

### 4.1 หน้าแรก / Dashboard (สำหรับทุก Role)

**Route:** `/dashboard`

แสดง overview KPI ของเดือนปัจจุบัน (default) พร้อม date range filter:
- Dropdown เลือก: เดือน, ปีงบประมาณ, หรือ custom date range
- Default: เดือนปัจจุบัน

**KPI Cards (สรุปภาพรวม):**
1. จำนวนผู้ป่วยที่ได้รับ counseling (Pre + Post) ← นับจาก CounselingRecord
2. New vs Old case ratio
3. % Coverage pre-counseling ← (จำนวน C/L ÷ จำนวนคนไข้ที่มาคลินิก)
4. พบ ADE (%ของผู้ป่วย pre)
5. ปัญหา non-compliance (% ของผู้ป่วย pre)
6. มูลค่ายาที่ประหยัดได้ (บาท)

**Dashboard Sections (แต่ละ section เป็น card/chart):**

#### Section A: ปริมาณงาน (Workload)
- Bar chart: จำนวน C/L รายเดือน (แยก Pre/Post)
- Pie chart: New vs Old case
- Table: Workload เภสัชกร — ชื่อเภสัช | จำนวนเคส | จำนวนครั้งออกคลินิก
- Bar chart: Dx distribution (กี่เคสต่อ Diagnosis)

#### Section B: คุณภาพ (Quality — Clinical Outcomes)

**B1: ADE (Adverse Drug Event)**
- Card: จำนวนผู้ป่วยพบ ADE + %ของ pre-counseling
- Pie chart: ADE แยกตามแหล่ง (จาก DMARDs, จาก HQ, จากยาอื่นๆ, DMARDs+HQ, DMARDs+ยาอื่นๆ)
- Card: WBC < 4,000 (leukopenia) ในคนที่ได้ DMARDs — กี่ครั้ง

**B2: HQ/CQ Maculopathy Prevention**
- Card: จำนวน + % ผู้ป่วยที่มีใช้ยา HQ
- Breakdown: 
  - มีนัด Eye = Yes / screen ที่รพ.อื่น → จำนวน
  - มีนัด Eye = No / loss นัด EYE → จำนวน → ใน OK consult EYE = Yes กี่คน (%)
- Pie chart: set POP-HQ distribution (set new pop, update pop, มี pop-up เดิม, no) + %
- Card: Rx PreC/L suggest HQ screening → accept screening % 

**B3: Adherence**
- Card: จำนวนราย + ครั้ง ที่พบปัญหา non-compliance + %
- Pie chart: ประเภทปัญหา non-compliance (ผิดวิธี/จำผิด, ลืมกินยา, ปรับ/หยุดยาเอง, Loss f/u ขาดยา) + %

**B4: Health Behavior**
- Bar chart: Alcohol, Smoking, Herb/Supplement, NSAID จากที่อื่น — จำนวนราย

**B5: DRP Consult**
- Card: DRP consult กี่ครั้ง, แพทย์ accept กี่ครั้ง, % accept
- Card: Medication Error — จำนวนครั้ง, แยก level

**B6: Cyclophosphamide Monitoring** (ถ้ามี data)
- Card: กินกี่คน, ฉีดกี่คน
- Card: Cumulative dose เฉลี่ย + จำนวน & % ที่ >36g

#### Section C: ประสิทธิภาพ (Efficiency)
- Card: จำนวนเฉลี่ยเคสต่อเดือน = รวมเคสทั้งหมด ÷ จำนวนเดือน
- Table: จำนวนเฉลี่ยเคสต่อเภสัชต่อเดือน = เคสเภสัชนั้น ÷ จำนวนครั้งออกคลินิกเดือนนั้น
- Card: % Coverage C/L = จำนวนเคส C/L ÷ จำนวนคนไข้ที่มาคลินิก

#### Section D: มูลค่ายาเหลือ (Drug Cost Saving)
- Card: มูลค่ารวมรายเดือน, รายปีงบ, เฉลี่ยรายเดือน
- Stacked bar chart: มูลค่าแยก ยาทั่วไป vs ยากลุ่ม DMARDs
- Card: %มูลค่ายาที่ประหยัดได้ (เทียบกับมูลค่ายาที่จ่ายทั้งหมด — ถ้ามี denominator)

---

### 4.2 หน้าบันทึก Pre-Counseling (หน้าหลักที่ใช้บ่อยสุด)

**Route:** `/counseling/new`

**UX Requirements:**
- **ต้อง responsive** ใช้ได้ดีบน iPad / มือถือ
- **เร็ว ง่าย** — ใช้ dropdown/select ให้มากที่สุด ลด free text
- **Conditional fields** — ซ่อน/แสดง field ตามเงื่อนไข (เช่น Eye screening แสดงเฉพาะคนมี HQ)
- **Auto-save** หรือ draft mode — กันข้อมูลหาย
- **Search patient by HN** — พิมพ์ HN → auto-fill ข้อมูลผู้ป่วย (ถ้าเป็นคนไข้เดิม)

**Form Sections (ตามลำดับการกรอกจริง):**

#### Section 1: ข้อมูลพื้นฐาน
- **วันที่** (date picker, default = วันนี้)
- **HN** (text input + search) → ถ้าพบใน registry → auto-fill ชื่อ/Dx/สิทธิ์
- **คำนำหน้า, ชื่อ, นามสกุล** (auto-fill หรือกรอกใหม่)
- **เภสัชกร** (auto = ผู้ใช้ login อยู่)
- **Case** = New / Old (radio button)
- **Dx** (multi-select จาก enum: RA, SLE, SSC, UCTD, Gout, PsorA, SpA, Overlap syndrome, Dermatomyositis, Behcet's disease, Polymyalgia rheumatica, อื่นๆ)
- **สิทธิ์** (select: UC, ปกส., ขรก./ท้องถิ่น, อื่นๆ)

#### Section 2: ข้อมูลยา
- **มี DMARDs?** (toggle) → ถ้า Yes → text input ชื่อยา DMARDs
- **ยาอื่น** (text input)

#### Section 3: การซักประวัติ
- **ซักประวัติ** (textarea — free text, สำหรับบันทึกสิ่งที่ผู้ป่วยเล่า)

#### Section 4: ADR Assessment
- **ADR** (select: No, Yes จาก DMARD, Yes จาก HQ, Yes จากยาอื่นๆ, Yes จาก DMARDs+HQ, Yes จาก DMARDs+ยาอื่นๆ)
- **อธิบาย ADR** (textarea — แสดงเมื่อ ADR ≠ No)

#### Section 5: HQ/CQ Eye Screening *(conditional: แสดงเฉพาะเมื่อ มี HQ = true)*
- **ซัก Eye** (text note)
- **มีนัด Eye ยัง?** (select: Yes, No, loss นัด EYE, screen ที่รพ.อื่น/คลินิกอื่น)
- *[if No / loss]*: **OK consult EYE** (select: Yes, No, ไม่ได้ suggest นัด)
- **prev. EYE date** (date picker)
- **EYEล่าสุด** (text: no maculopathy, maculopathy, etc.)
- **next EYE date** (date picker)
- **set POP-HQ** (select: set new pop, update pop-up, มี pop-up เดิม, no)

#### Section 6: Compliance
- **กินยา** (radio: กินถูก+ครบ / non-compliance)
- *[if non-compliance]*: **ปัญหา non-compliance** (repeatable, max 3):
  - **ประเภท** (select: ผิดวิธี/จำผิด, ลืมกินยา, ปรับ/หยุดยาเอง, Loss f/u ขาดยา)
  - **รายละเอียด** (text — ระบุยาหรือเหตุผล)

#### Section 7: ยาเหลือ
- **ยาเหลือ** (text — format: "ยา=จำนวน, ยา=จำนวน" เช่น "folic=80, HQ=30, MTX=20")
  - *Note: ข้อมูลนี้จะไปใช้คำนวณ Drug Saving ต่อ*

#### Section 8: พฤติกรรมสุขภาพ
- **Alcohol** (select: No, Yes เบียร์, Yes เหล้า, Yes เบียร์+เหล้า, Yes ตามเทศกาล)
- **Herb/Supplement** (select: No, อาหารเสริม, นม/อาหารทางการแพทย์)
- **Smoking** (select: No, Yes บุหรี่, Yes ยาเส้น)
- **NSAID จากที่อื่น** (text)

#### Section 9: DRP / Consult
- **พบ DRP?** (toggle)
- *[if Yes]*: **รายละเอียด DRP** (repeatable, max 2):
  - **ยา** (text)
  - **DRPs แบบใด** (text)
  - **ผล consult** (select: accept, not accept, pending)

#### Section 10: อื่นๆ
- **วิธีคุมกำเนิด** (text)
- **ME** (toggle) → **รายละเอียด ME** (text) → **ME Level** (select A-G)
- **Note อื่นๆ** (textarea)

#### Section 11: Lab Values (optional — กรอกถ้ามี)
- **วันที่เจาะแลป** (date picker)
- **WBC, ANC, Neutrophil %, AST, ALT, ALP, Uric acid, Creatinine, Albumin, hsCRP** (number inputs)

#### Section 12: Cyclophosphamide (conditional — เฉพาะคนที่มี)
- **ได้ Cyclophosphamide?** (toggle)
- **Route** (select: กิน/ฉีด)
- **Cumulative dose (mg)** (number)

**Action Buttons:**
- 💾 **บันทึก** (submit)
- 📋 **บันทึก & เพิ่มรายการใหม่** (submit → reset form พร้อมวันที่เดิม)
- 🗑️ **ยกเลิก** (discard)

---

### 4.3 หน้าดูรายการ Counseling Records

**Route:** `/counseling`

- **Table view** แสดงรายการ counseling records
- Filter: วันที่, เภสัชกร, HN, Dx
- Click → ดูรายละเอียด / แก้ไข
- Bulk export to Excel

---

### 4.4 หน้าทะเบียนผู้ป่วย

**Route:** `/patients`

- ค้นหาด้วย HN, ชื่อ, นามสกุล
- ดู profile ผู้ป่วย + ประวัติ counseling ทั้งหมด
- เพิ่ม/แก้ไขข้อมูลผู้ป่วย

---

### 4.5 หน้าบันทึกข้อมูลคลินิก (Clinic Session)

**Route:** `/clinic-sessions`

- บันทึกข้อมูลรอบคลินิกแต่ละวัน: จำนวนคนไข้นัด, ไม่มา, มาเพิ่มนอกนัด, ส่งปณ.
- ใช้คำนวณ % Coverage

---

### 4.6 หน้าบันทึกมูลค่ายาเหลือ (Drug Saving)

**Route:** `/drug-saving`

- เลือกเดือน/ปี
- Table: รายการยา | ราคาต่อเม็ด | จำนวนที่เหลือ | มูลค่า
- สามารถเพิ่มยาจาก Drug Master
- Auto-calculate saving = ราคา × จำนวน
- Summary: รวมมูลค่า DMARDs vs ยาทั่วไป

---

### 4.7 หน้า Export รายงาน

**Route:** `/reports`

- เลือกปีงบประมาณ / ช่วงเดือน
- Export เป็น Excel (.xlsx) ในรูปแบบเดียวกับ sheet "reportส่งกลุ่มงาน"
- รายงานประกอบด้วย (auto-calculate จากข้อมูลในระบบ):

**โครงสร้างรายงาน Excel (เทียบจาก template เดิม):**

```
สรุปรายงานผลการดำเนินงานบริบาลเภสัชกรรมคลินิกโรคข้อรูมาติซัม
ปีงบประมาณ ____

                                  | เป้าหมาย | ตค | พย | ธค | ... | กย | รวมปีงบ
──────────────────────────────────────────────────────────────────────────────
ได้ทำคลินิกกี่ครั้งจากทั้งหมด        |          | x/y | x/y | ...
จำนวนคนไข้ตามนัดในระบบ (พุธ)       |          | 515 | 551 | ...
ไม่มา                              |          | 68  | 63  | ...
มาเพิ่มนอกนัด                       |          | ... | ...
ส่งปณ.                             |          | 294 | 234 | ...
เป้าผู้ป่วยคลินิก Rheu              |          | ... | ...  
เป้าผู้ป่วยมาคลินิก Rheu             |          | ... | ...

pre-counseling                     | ตามจริง   | 108 | 112 | ...
%coverage pre-counseling           | ≥60%     | 24.2| 23.0| ...
post-counseling                    | ตามจริง   | 1   | 0   | ...
รวมจำนวนครั้งให้บริการ (Pre & Post)  | ตามจริง   | 109 | 112 | ...

Clinical outcome I: ADE
พบ ADE (ราย)                       | ตามจริง   | 20  | 14  | ...
คิดเป็น% (ของผป pre)               | ตามจริง   | 18.5| 12.5| ...
ADE leukopenia (WBC<4,000)        | ดึง HomC  | 8   | 2   | ...
- จาก DMARDs                       |          | 13  | 9   | ...
- จาก HQ                           |          | 2   | 1   | ...
- จากยาอื่นๆ                        |          | 4   | 4   | ...

Clinical outcome II: HQ/CQ Maculopathy Prevention
pt on HQ/CQ                        |          | 58  | 33  | ...
%pt on HQ                          |          | 53.2| 29.5| ...
Set pop-up msg-HQ (ครั้ง)           |          | 45  | 18  | ...
  set new pop                      |          | 24  | 5   | ...
  update pop-up                    |          | 12  | 5   | ...
  มี pop-up เดิม                   |          | 9   | 8   | ...
Rx suggest HQ screening            |          | 21  | 3   | ...
accept screening                   |          | 8   | 1   | ...
คิดเป็น %                          |          | 25.0| 33.3| ...

Adherence
ปัญหา non-compliance (ราย)          | ตามจริง   | 27  | 34  | ...
คิดเป็น%                           |          | 25.0| 30.4| ...
ประเภท non-compliance (ครั้ง)       |          | 29  | 36  | ...

พบใช้ NSAID ยาชุด                  |          | 2   | 6   | ...
พบใช้ Herb/Supplement              |          | 5   | 3   | ...
Smoking                            |          | 3   | 6   | ...
Alcohol                            |          | 6   | 7   | ...

Consult
DRP consult (ครั้ง)                 | ตามจริง   | 2   | 1   | ...
accept consult                     |          | 2   | 1   | ...
%adherence to intervention         | ≥80%     | 100 | 100 | ...

med. cost saving (บาท)             |          |35560|38141| ...

Medication Error
พบ dispensing ME                   | ไม่พบ E up| ... | ... | ...
```

---

## 5. 🔧 Technical Implementation Notes

### 5.1 ใช้ Template ที่มีอยู่

- **Auth**: Better Auth ที่ setup ไว้แล้ว — ไม่ต้องเปลี่ยน
- **RBAC**: ใช้ `hasPermission()` จาก `lib/role-helpers.ts`
  - เพิ่ม actions ใหม่: `counseling.create`, `counseling.view_own`, `counseling.view_all`, `patients.manage`, `reports.export`, `drug-saving.manage`, `clinic-session.manage`
- **Security**: ใช้ Arcjet instances ที่มี (ใช้แค่สำหรับการ login/register)
- **Theme**: ใช้ semantic design tokens ที่มี (Medical Teal = default theme)
- **File Upload**: ใช้ Vercel Blob ที่ setup ไว้ (ถ้าจำเป็น)

### 5.2 API Routes ที่ต้องสร้าง

```
POST   /api/counseling              — สร้าง counseling record
GET    /api/counseling              — ดูรายการ (filter by date, pharmacist, etc.)
GET    /api/counseling/:id          — ดูรายละเอียด record
PATCH  /api/counseling/:id          — แก้ไข record
DELETE /api/counseling/:id          — ลบ record

GET    /api/patients                — ค้นหาผู้ป่วย (by HN, name)
POST   /api/patients                — สร้างผู้ป่วยใหม่
GET    /api/patients/:id            — ดูข้อมูลผู้ป่วย + ประวัติ
PATCH  /api/patients/:id            — แก้ไขข้อมูลผู้ป่วย

POST   /api/clinic-sessions         — บันทึก clinic session
GET    /api/clinic-sessions         — ดูรายการ clinic sessions

POST   /api/drug-saving             — บันทึกมูลค่ายาเหลือ
GET    /api/drug-saving             — ดูรายการ drug saving
PATCH  /api/drug-saving/:id         — แก้ไข

GET    /api/drug-master              — ดูรายการยา master
POST   /api/drug-master              — เพิ่มยาใน master (Admin)

GET    /api/dashboard/summary       — KPI summary (query by date range)
GET    /api/dashboard/workload      — Workload data
GET    /api/dashboard/quality       — Quality indicators
GET    /api/dashboard/efficiency    — Efficiency indicators
GET    /api/dashboard/drug-saving   — Drug saving summary

GET    /api/reports/export           — Export Excel report
```

### 5.3 Navigation Structure

เพิ่มใน `AppHeader.tsx`:

```typescript
const navItems = [
  { href: "/", label: "Home" },
  { href: "/dashboard", label: "Dashboard", authRequired: true },
  { href: "/counseling/new", label: "บันทึก C/L", authRequired: true },
  { href: "/counseling", label: "รายการ C/L", authRequired: true },
  { href: "/patients", label: "ทะเบียนผู้ป่วย", authRequired: true },
  { href: "/reports", label: "รายงาน", authRequired: true, adminOnly: true },
];
```

### 5.4 Thai Fiscal Year Calculation

ปีงบประมาณไทย: ตุลาคม → กันยายน
- ปีงบ 68 = ตค 2567 (Oct 2024) → กย 2568 (Sep 2025)
- ปีงบ 69 = ตค 2568 (Oct 2025) → กย 2569 (Sep 2026)

```typescript
// Helper function
function getThaiFixcalYear(date: Date): string {
  const year = date.getFullYear();
  const month = date.getMonth() + 1; // 1-12
  const buddhistYear = year + 543;
  // ถ้าเดือน ตค-ธค = ปีงบใหม่
  const fiscalBuddhistYear = month >= 10 ? buddhistYear + 1 : buddhistYear;
  return String(fiscalBuddhistYear).slice(-2); // "68", "69"
}

// เดือนไทย mapping สำหรับ reports
const thaiMonthAbbr = {
  10: 'ตค', 11: 'พย', 12: 'ธค',
  1: 'มค', 2: 'กพ', 3: 'มีค',
  4: 'เมย', 5: 'พค', 6: 'มิย',
  7: 'กค', 8: 'สค', 9: 'กย'
};
```

### 5.5 Key Computed Metrics (Dashboard Formulas)

```
% Coverage Pre-C/L = (จำนวน pre-counseling ÷ จำนวนผู้ป่วยมาคลินิก) × 100
% ADE = (จำนวนราย ADE ÷ จำนวน pre-counseling) × 100
% Non-compliance = (จำนวนราย non-compliance ÷ จำนวน pre-counseling) × 100
% pt on HQ = (จำนวนคนมี HQ ÷ จำนวน pre-counseling) × 100
% Accept consult = (accept ÷ DRP consult ทั้งหมด) × 100
เฉลี่ยเคส/เภสัช/เดือน = จำนวนเคสเภสัชนั้น ÷ จำนวนครั้งออกคลินิก
มูลค่ายาเหลือ = Σ(ราคาต่อเม็ด × จำนวนเม็ดเหลือ) ← แยก DMARDs vs ยาทั่วไป
```

---

## 6. 📂 Data Migration (เอาไว้ภายหลัง ตอนนี้ทำเป็นแบบ New database ไปก่อน)

### Initial data import จาก Excel ปัจจุบัน

ควรมี script สำหรับ import ข้อมูลจาก Google Spreadsheet/Excel เดิมเข้าระบบ:

1. **Import Reg. pt** → สร้าง Patient records
2. **Import ข้อมูลที่คีย์จากงาน CL** → สร้าง CounselingRecord + NonComplianceItem + DrpItem
3. **Import Rheu DrugSaving** → สร้าง DrugSavingRecord + DrugMaster
4. **Import reportส่งกลุ่มงาน** → สร้าง ClinicSession (ข้อมูลรอบคลินิก)

**Mapping สำคัญ:**
- Column "เภสัช" → match กับ User table (ภ.อิ่มจิต → pharmacistId)
- Column "HN" → match กับ Patient.hn
- ข้อมูลที่เป็น "-" หรือ empty → null
- Date format: ปี คศ. (2025, 2026)

---

## 7. ✅ Priority & Phases

### Phase 1 — MVP (สำคัญที่สุด)
1. ☐ Database schema (Prisma models)
2. ☐ Patient registry CRUD
3. ☐ Counseling form (บันทึก Pre-C/L)
4. ☐ Counseling list (ดูรายการ)
5. ☐ Basic dashboard (KPI cards)

### Phase 2 — Dashboard & Reports
6. ☐ Full dashboard with charts (recharts)
7. ☐ Date range filter (เดือน/ปีงบ/custom)
8. ☐ Export Excel report (ตาม template)
9. ☐ Clinic session management

### Phase 3 — Drug Saving & Enhancement
10. ☐ Drug saving module
11. ☐ Drug master management
12. ☐ Data migration script
13. ☐ Performance optimization

### Phase 4 — Nice-to-Have
14. ☐ Post-counseling form
15. ☐ Patient timeline view
16. ☐ PowerPoint auto-generate (for presentations)
17. ☐ Push notification / reminder

---

## 8. 📐 Design Guidelines

- ใช้ **semantic design tokens** ที่มีใน template (`bg-surface-primary`, `text-content-primary`, etc.)
- ใช้ **Shadcn/UI** components ทั้งหมด (Card, Table, Input, Select, etc.)
- ใช้ **recharts** สำหรับ chart (มีใน dependencies แล้ว)
- ใช้ **framer-motion** สำหรับ animation (มีอยู่แล้ว)
- ใช้ **sonner** สำหรับ toast notification
- ใช้ **react-hook-form + zod** สำหรับ form validation
- ภาษาหลัก UI: **ไทย** (labels, buttons, messages)
- Responsive: **Mobile-first** — ต้องใช้ได้ดีบน iPad (1024px) และมือถือ (375px)

---

## 9. 🔑 Key Column Mapping (Excel → Database)

| Excel Column | DB Field | Type | Options/Notes |
|---|---|---|---|
| DD/MM/ คศ. | CounselingRecord.date | DateTime | วันที่ C/L |
| ลำดับ | CounselingRecord.sequenceNumber | Int | ลำดับในวัน |
| HN | Patient.hn → CounselingRecord.patientId | String | FK to Patient |
| คำนำหน้า | Patient.prefix | String | นาย/นาง/นางสาว |
| ชื่อ | Patient.firstName | String | |
| นามสกุล | Patient.lastName | String | |
| เภสัช | CounselingRecord.pharmacistId | FK to User | ภ.อิ่มจิต → userId |
| Case | Patient.caseType | Enum | New, Old |
| Dx | PatientDiagnosis.diagnosis | Enum | RA, SLE, SSC, UCTD, Gout, PsorA, SpA, Overlap, Dermatomyositis, Behcet's, PMR, อื่นๆ |
| สิทธิ์ | Patient.healthScheme | Enum | UC, ปกส.(SSS), ขรก./ท้องถิ่น(CSMBS), อื่นๆ |
| มี DMARDs? | CounselingRecord.currentDmards + hasDmards | String + Bool | ชื่อยา DMARDs |
| ยาอื่น | CounselingRecord.otherMeds | String | |
| ซักประวัติ | CounselingRecord.historyNote | String | free text |
| ADR | CounselingRecord.adrStatus | Enum | No, Yes จาก DMARD, Yes จาก HQ, Yes จากยาอื่นๆ |
| อธิบาย ADR | CounselingRecord.adrDescription | String | |
| ซัก Eye (คนมีHQ) | CounselingRecord.eyeScreeningStatus | String | ตาปกติ, มีปัญหา |
| มีนัด Eye ยัง | CounselingRecord.eyeAppointmentStatus | Enum | Yes, No, loss นัด EYE, screen ที่รพ.อื่น |
| [if No] OK consult EYE | CounselingRecord.consultEyeResult | Enum | Yes, No, ไม่ได้ suggest นัด |
| prev. EYE: D/M/คศ | CounselingRecord.prevEyeDate | DateTime | |
| EYEล่าสุด | CounselingRecord.eyeResult | String | no maculopathy, etc. |
| next EYE: D/M/คศ | CounselingRecord.nextEyeDate | DateTime | |
| set POP-HQ | CounselingRecord.popupHQAction | Enum | set new pop, update pop, มี pop-up เดิม, no |
| non-compliance? | CounselingRecord.complianceStatus | Enum | กินถูก+ครบ(COMPLIANT), non-compliance(NON_COMPLIANT) |
| 1-non-com แบบใด | NonComplianceItem[0].type | Enum | ผิดวิธี/จำผิด, ลืมกินยา, ปรับ/หยุดยาเอง, Loss f/u ขาดยา |
| 1-อธิบาย NON-Compliance | NonComplianceItem[0].description | String | |
| 2-non-com แบบใด | NonComplianceItem[1].type | Enum | (same) |
| 2-อธิบาย NON-Compliance | NonComplianceItem[1].description | String | |
| 3-non-com แบบใด | NonComplianceItem[2].type | Enum | (same) |
| ยาเหลือ | CounselingRecord.leftoverMeds | String | "ssz=100, losec=30" |
| Alc | CounselingRecord.alcoholStatus | String | No, Yes เบียร์, Yes เหล้า/40, Yes เบียร์+เหล้า, Yes ตามเทศกาล |
| Herb/Supplement | CounselingRecord.herbStatus | String | No, อาหารเสริม, นม/อาหารทางการแพทย์ |
| Smoking | CounselingRecord.smokingStatus | String | No, Yes บุหรี่, Yes ยาเส้น |
| NSAID จากที่อื่น | CounselingRecord.nsaidFromOther | String | free text |
| DRPs | CounselingRecord.hasDrp | Boolean | Yes → true |
| 1-ยา | DrpItem[0].drugName | String | |
| 1-DRPs แบบใด | DrpItem[0].drpType | String | |
| 1-ผล consult | DrpItem[0].consultResult | String | accept/not accept |
| วิธีคุมกำเนิด | CounselingRecord.contraceptionMethod | String | |
| Note อื่นๆ | CounselingRecord.note | String | |
| ME | CounselingRecord.hasME | Boolean | |
| รายละเอียด ME | CounselingRecord.meDescription | String | |
| วันที่เจาะแลป | CounselingRecord.labDate | DateTime | |
| WBC | CounselingRecord.wbc | Float | normal: 5000-10000 |
| ANC | CounselingRecord.absoluteNeutrophil | Float | |
| Neutrophil % | CounselingRecord.neutrophilPercent | Float | normal: 35-75% |
| AST | CounselingRecord.ast | Float | normal: 0-31 U/L |
| ALT | CounselingRecord.alt | Float | normal: 0-34 U/L |
| ALP | CounselingRecord.alp | Float | normal: 40-150 U/L |
| Uric acid | CounselingRecord.uricAcid | Float | normal: 3.6-8.2 mg/dL |
| Creatinine | CounselingRecord.creatinine | Float | normal: 0.55-1.02 mg/dL |
| Albumin | CounselingRecord.albumin | Float | normal: 3.5-5.2 gm/dL |
| hsCRP | CounselingRecord.hsCRP | Float | normal: <1 mg/L |
| level | CounselingRecord.labLevel | String | A-G (ใน column A, B, E, C, F, G ← NCC MERP levels สำหรับ patient assessment) |

---

*สร้างโดย: AI-assisted analysis จาก Google Spreadsheet ต้นฉบับ + requirement gathering document*
*วันที่: กุมภาพันธ์ 2569*