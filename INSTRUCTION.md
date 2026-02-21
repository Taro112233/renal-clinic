# 📋 Project Instruction: RheuPharmCare System
ความสมบูรณ์: 50% | Phase: MVP Development

## 1. 🎯 Project Overview

### ชื่อระบบ
**RheuPharmCare** — ระบบบันทึกกิจกรรมบริบาลเภสัชกรรมคลินิกโรคข้อรูมาติซัม

### Pain Points
1. เภสัชกรจดกระดาษ → คีย์ซ้ำลง Google Sheet
2. สรุปรายงานแบบ manual (filter, นับมือ, pivot table)
3. ไม่มี real-time Dashboard/KPI
4. เสียเวลาทำรายงานส่งกลุ่มงานทุกเดือน

### เป้าหมาย
- บันทึกข้อมูล counseling ผ่าน คอม/มือถือ/iPad (responsive)
- Dashboard & KPI แบบ real-time (filter วันที่/เดือน/ปีงบ)
- Export Excel ตาม template กลุ่มงาน
- ลดเวลา: จด→คีย์→นับ → จิ้มบันทึก→ดูผลทันที

---

## 2. 👥 User Roles (RBAC)

| Role | สิทธิ์ |
|------|-------|
| **USER** | รออนุมัติ |
| **ADMIN** (เภสัชกร) | บันทึก C/L, ดู Dashboard ตัวเอง, ดูข้อมูลผู้ป่วย |
| **SUPERADMIN** (หัวหน้า) | ดู Dashboard ภาพรวม, Export รายงาน, จัดการข้อมูลอ้างอิง, จัดการ users |

**ใช้ RBAC จาก:** `lib/role-helpers.ts`  
**เพิ่ม actions:** `counseling.create`, `counseling.view_own`, `counseling.view_all`, `patients.manage`, `reports.export`, `drug-saving.manage`, `clinic-session.manage`

---

## 3. 📊 Database Schema

### Core Models

**Patient** (ทะเบียนผู้ป่วย)
- HN (unique), prefix, firstName, lastName, gender, DOB
- caseType (NEW/OLD), status (ACTIVE/DISCHARGED/REFERRED/DECEASED)
- healthScheme (UC/SSS/CSMBS/OTHER)
- diagnoses[] → PatientDiagnosis
- counselingRecords[] → CounselingRecord

**PatientDiagnosis**
- diagnosis (enum: RA, SLE, SSC, UCTD, GOUT, PSORA, SPA, OVERLAP_SYNDROME, DERMATOMYOSITIS, BEHCETS_DISEASE, POLYMYALGIA_RHEUMATICA, OTHER)
- isPrimary, diagnosedAt, note

**CounselingRecord** (หลัก — เทียบ sheet "ข้อมูลที่คีย์จากงานCL")
- Basic: date, sequenceNumber, patientId, pharmacistId, counselingType (PRE/POST)
- Meds: currentDmards, hasDmards, otherMeds
- History: historyNote
- ADR: adrStatus (NO/YES_DMARD/YES_HQ/YES_OTHER/YES_DMARD_HQ/YES_DMARD_OTHER), adrDescription
- HQ Screening: hasHQ, eyeScreeningStatus, eyeAppointmentStatus, consultEyeResult, prevEyeDate, eyeResult, nextEyeDate, popupHQAction
- Compliance: complianceStatus (COMPLIANT/NON_COMPLIANT), nonComplianceItems[] (max 3)
- Leftover: leftoverMeds (text: "ยา=จำนวน, ยา=จำนวน")
- Behaviors: alcoholStatus, herbStatus, smokingStatus, nsaidFromOther
- DRP: hasDrp, drpItems[] (max 2)
- Other: contraceptionMethod, hasME, meDescription, meLevel (A-G)
- Labs: labDate, wbc, absoluteNeutrophil, neutrophilPercent, ast, alt, alp, uricAcid, creatinine, albumin, hsCRP, labLevel
- Cyclophosphamide: hasCyclophosphamide, cyclophosphamideRoute (ORAL/IV), cyclophosphamideCumulativeDose

**NonComplianceItem** (max 3 per record)
- orderNumber (1-3), type (WRONG_METHOD/FORGOT_DOSE/SELF_ADJUST/LOSS_FOLLOWUP), description

**DrpItem** (max 2 per record)
- orderNumber (1-2), drugName, drpType, consultResult (accept/not accept/pending)

**DrugSavingRecord**
- month, year, fiscalYear, drugCode, drugName, unitPrice, quantity, totalSaving, isDmard

**DrugMaster**
- drugCode (unique), drugName, unitPrice, isDmard, isHQ, isActive

**ClinicSession**
- date, month, year, fiscalYear
- totalScheduledPatients, noShowCount, walkInCount, postalCount
- pharmacistId, note

**Full schema:** See `prisma/schema.prisma` in documents

---

## 4. 📱 UI Pages & Features

### 4.1 Dashboard (`/dashboard`)
**Default:** เดือนปัจจุบัน | **Filter:** เดือน/ปีงบ/custom date range

**KPI Cards:**
1. จำนวน counseling (Pre + Post)
2. New vs Old case ratio
3. % Coverage pre-counseling
4. พบ ADE (%)
5. ปัญหา non-compliance (%)
6. มูลค่ายาเหลือ (บาท)

**Sections:**
- **A. Workload:** Bar chart (C/L/เดือน), Pie (New vs Old), Table (workload เภสัชกร), Bar (Dx distribution)
- **B. Quality:** ADE, HQ Screening, Adherence, Health Behavior, DRP Consult, Cyclophosphamide
- **C. Efficiency:** เฉลี่ยเคส/เดือน, เฉลี่ยเคส/เภสัช/เดือน, % Coverage
- **D. Drug Saving:** มูลค่ารวม, Stacked bar (DMARDs vs ทั่วไป), %ประหยัด

### 4.2 Pre-Counseling Form (`/counseling/new`)
**UX:** Responsive (iPad/mobile), ใช้ dropdown/select มากสุด, conditional fields, auto-save draft

**12 Sections:**
1. ข้อมูลพื้นฐาน (วันที่, HN search + auto-fill, คำนำหน้า, ชื่อ, นามสกุล, เภสัชกร auto, Case, Dx multi-select, สิทธิ์)
2. ข้อมูลยา (มี DMARDs toggle → text, ยาอื่น)
3. ซักประวัติ (textarea)
4. ADR Assessment (select, textarea if ≠ No)
5. HQ/CQ Eye Screening *[if hasHQ]* (ซัก Eye, มีนัด, consult result, dates, POP-HQ)
6. Compliance (radio, repeatable non-compliance items max 3)
7. ยาเหลือ (text format)
8. พฤติกรรมสุขภาพ (Alcohol, Herb, Smoking, NSAID)
9. DRP/Consult (toggle, repeatable max 2)
10. อื่นๆ (คุมกำเนิด, ME toggle → รายละเอียด + level)
11. Lab Values *[optional]* (วันที่, 10 values)
12. Cyclophosphamide *[conditional]* (toggle → route, cumulative dose)

**Actions:** 💾 บันทึก | 📋 บันทึก & เพิ่มใหม่ | 🗑️ ยกเลิก

### 4.3 Counseling List (`/counseling`)
- Table view, Filter (วันที่/เภสัชกร/HN/Dx)
- Click → ดูรายละเอียด/แก้ไข
- Bulk export Excel

### 4.4 Patient Registry (`/patients`)
- ค้นหา (HN/ชื่อ/นามสกุล)
- ดู profile + ประวัติ counseling
- เพิ่ม/แก้ไขข้อมูล

### 4.5 Clinic Session (`/clinic-sessions`)
- บันทึกรอบคลินิก (จำนวนนัด, ไม่มา, มาเพิ่ม, ส่งปณ.)

### 4.6 Drug Saving (`/drug-saving`)
- เลือกเดือน/ปี, Table (ยา/ราคา/จำนวน/มูลค่า)
- Auto-calculate, Summary (DMARDs vs ทั่วไป)

### 4.7 Reports (`/reports`)
- Export Excel ตาม template "reportส่งกลุ่มงาน"
- เลือกปีงบ/ช่วงเดือน

---

## 5. 🔧 Technical Stack

### ใช้ Template ที่มี
- **Auth:** Better Auth (no change)
- **Theme:** Semantic design tokens (Medical Teal default) — **อ้างอิง THEME_REFERENCE.md**
- **Components:** Shadcn/UI
- **Forms:** react-hook-form + zod
- **Charts:** recharts
- **Animation:** framer-motion
- **Toast:** sonner
- **Security:** Arcjet (login/register only)
- **File Upload:** Vercel Blob (if needed)

### API Routes ต้องสร้าง
```
POST/GET/PATCH/DELETE /api/counseling[/:id]
POST/GET/PATCH        /api/patients[/:id]
POST/GET              /api/clinic-sessions
POST/GET/PATCH        /api/drug-saving[/:id]
GET/POST              /api/drug-master
GET                   /api/dashboard/{summary,workload,quality,efficiency,drug-saving}
GET                   /api/reports/export
```

### Navigation (เพิ่มใน AppHeader.tsx)
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

---

## 6. 📐 Design Guidelines

- **ภาษา:** ไทย (UI labels, buttons, messages)
- **Responsive:** Mobile-first (375px → 1024px iPad → desktop)
- **Design Tokens:** ใช้ semantic tokens — **ดู THEME_REFERENCE.md**
- **Components:** Shadcn/UI ทั้งหมด
- **Validation:** zod schemas
- **Loading States:** Skeleton components (ตาม ProfileSkeleton pattern)
- **Error Handling:** Toast notifications (sonner)

---

## 7. 🎨 THEME REFERENCE

### Available Semantic Tokens

#### Surfaces (Backgrounds)
```tsx
bg-surface-primary      // Main app background
bg-surface-secondary    // Card/panel backgrounds
bg-surface-tertiary     // Elevated surfaces
bg-surface-interactive  // Hover backgrounds
bg-surface-overlay      // Modal overlays (0.95 opacity)
```

#### Content (Text)
```tsx
text-content-primary    // Primary text (high contrast)
text-content-secondary  // Secondary text (medium)
text-content-tertiary   // Tertiary text (muted)
text-content-inverse    // Dark text on light (for light mode)
text-content-disabled   // Disabled state text
```

#### Borders
```tsx
border-border-primary   // Default borders (more visible)
border-border-secondary // Subtle borders
border-border-interactive // Focus/hover borders (brand color)
border-border-glass     // Glass morphism borders (20% opacity)
border-border-subtle    // Very subtle borders
```

#### Interactive Elements
```tsx
bg-primary + text-on-primary              // Primary buttons
bg-interactive-primary                     // Primary interactive
bg-interactive-primary-hover              // Primary hover state
bg-interactive-secondary                  // Secondary buttons
bg-interactive-secondary-hover            // Secondary hover
bg-interactive-disabled                   // Disabled buttons

// Shortcuts
bg-accent + text-accent-foreground        // Accent containers
bg-muted + text-muted-foreground          // Muted backgrounds
```

#### Alerts (State Colors)
```tsx
// Success (Green)
bg-alert-success-bg
border-alert-success-border
text-alert-success-text
text-alert-success-icon

// Warning (Yellow/Orange)
bg-alert-warning-bg
border-alert-warning-border
text-alert-warning-text
text-alert-warning-icon

// Error (Red)
bg-alert-error-bg
border-alert-error-border
text-alert-error-text
text-alert-error-icon

// Info (Blue)
bg-alert-info-bg
border-alert-info-border
text-alert-info-text
text-alert-info-icon
```

#### Special Effects
```tsx
glass-semantic              // Glass morphism effect
glass-strong-semantic       // Strong glass effect
gradient-brand-semantic     // Brand gradient (teal → lighter teal)
gradient-text-semantic      // Gradient text effect
shadow-glow-semantic        // Subtle brand glow
shadow-glow-strong-semantic // Strong brand glow
```

#### Shadows
```tsx
shadow-elevation-1  // 0 2px 8px
shadow-elevation-2  // 0 4px 16px
shadow-elevation-3  // 0 8px 24px
shadow-elevation-4  // 0 16px 40px
```

### Theme Modes

**Default:** Medical Teal (Dark Mode)  
**Available Themes:** Medical Teal, Clinical Blue, Wellness Green, Research Purple  
**Light/Dark:** Each theme has light/dark variants

**Theme Switching:**
```tsx
import { useTheme } from '@/hooks/useTheme';

function MyComponent() {
  const { theme, mode, changeTheme, toggleMode } = useTheme();
  // theme = 'medical' | 'clinical' | 'wellness' | 'research'
  // mode = 'light' | 'dark'
}
```

### Critical Rules

1. **NEVER use hard-coded colors** (e.g., `bg-blue-500`) — always use semantic tokens
2. **Default to semantic tokens** over Tailwind's base colors
3. **Conditional styling:** Use semantic alert colors for status indicators
4. **Glass effects:** Use `glass-semantic` utility for modern overlays
5. **Gradients:** Use `gradient-brand-semantic` for primary CTAs
6. **Shadows:** Use `shadow-elevation-*` for depth, `shadow-glow-semantic` for brand emphasis

---

## 8. 📅 Thai Fiscal Year Helpers
```typescript
// lib/fiscal-year.ts
export function getThaiFixcalYear(date: Date): string {
  const year = date.getFullYear();
  const month = date.getMonth() + 1; // 1-12
  const buddhistYear = year + 543;
  const fiscalBuddhistYear = month >= 10 ? buddhistYear + 1 : buddhistYear;
  return String(fiscalBuddhistYear).slice(-2); // "68", "69"
}

export const thaiMonthAbbr: Record<number, string> = {
  10: 'ตค', 11: 'พย', 12: 'ธค',
  1: 'มค', 2: 'กพ', 3: 'มีค',
  4: 'เมย', 5: 'พค', 6: 'มิย',
  7: 'กค', 8: 'สค', 9: 'กย'
};
```

**ปีงบ 68** = ตค 2567 (Oct 2024) → กย 2568 (Sep 2025)  
**ปีงบ 69** = ตค 2568 (Oct 2025) → กย 2569 (Sep 2026)

---

## 9. 📊 Key Metrics Formulas
```typescript
// lib/kpi-calculator.ts
export const calculateMetrics = {
  coveragePre: (preCL: number, totalPatients: number) => 
    (preCL / totalPatients) * 100,
  
  adePercentage: (adeCount: number, preCLCount: number) => 
    (adeCount / preCLCount) * 100,
  
  nonCompliancePercentage: (ncCount: number, preCLCount: number) => 
    (ncCount / preCLCount) * 100,
  
  hqPercentage: (hqCount: number, preCLCount: number) => 
    (hqCount / preCLCount) * 100,
  
  acceptConsultPercentage: (accepted: number, totalDRP: number) => 
    (accepted / totalDRP) * 100,
  
  avgCasePerPharmacistPerMonth: (cases: number, clinicSessions: number) => 
    cases / clinicSessions,
  
  drugSaving: (unitPrice: number, quantity: number) => 
    unitPrice * quantity,
};
```

---

## 10. ✅ Development Phases

### Phase 1 — MVP (Priority)
1. ☐ Patient registry CRUD
2. ☐ Counseling form (Pre-C/L)
3. ☐ Counseling list
4. ☐ Basic dashboard (KPI cards)

### Phase 2 — Dashboard & Reports
5. ☐ Full dashboard with charts
6. ☐ Date range filter
7. ☐ Export Excel report
8. ☐ Clinic session management

### Phase 3 — Enhancement
9. ☐ Drug saving module
10. ☐ Drug master management
11. ☐ Performance optimization

### Phase 4 — Nice-to-Have
12. ☐ Post-counseling form
13. ☐ Patient timeline view
14. ☐ Data migration script

---

## 11. 🔑 Excel → Database Mapping (Key Fields)

| Excel Column | DB Field | Type |
|---|---|---|
| DD/MM/คศ. | CounselingRecord.date | DateTime |
| HN | Patient.hn → CounselingRecord.patientId | String (FK) |
| เภสัช | CounselingRecord.pharmacistId | String (FK to User) |
| Case | Patient.caseType | Enum (NEW/OLD) |
| Dx | PatientDiagnosis.diagnosis | Enum (RA/SLE/...) |
| สิทธิ์ | Patient.healthScheme | Enum (UC/SSS/CSMBS/OTHER) |
| มี DMARDs? | hasDmards + currentDmards | Boolean + String |
| ADR | adrStatus | Enum (NO/YES_DMARD/...) |
| มีนัด Eye ยัง | eyeAppointmentStatus | Enum (YES/NO/LOSS/EXTERNAL_SCREENING) |
| non-compliance? | complianceStatus | Enum (COMPLIANT/NON_COMPLIANT) |
| 1-non-com แบบใด | NonComplianceItem[0].type | Enum (WRONG_METHOD/...) |
| DRPs | hasDrp | Boolean |
| 1-ยา | DrpItem[0].drugName | String |
| ยาเหลือ | leftoverMeds | String ("ssz=100, losec=30") |
| WBC | wbc | Float |
| ME | hasME | Boolean |

**Full mapping:** See section 9 in original instruction

---

*Created: Feb 2026 | Stack: Next.js 15, Prisma, Better Auth, Tailwind CSS 4*