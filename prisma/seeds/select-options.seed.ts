// prisma/seeds/select-options.seed.ts
import { PrismaClient } from '@prisma/client';

export async function seedSelectOptions(prisma: PrismaClient) {
  console.log('🌱 Seeding select options...');

  const options: {
    category: string;
    value: string;
    label: string;
    sortOrder: number;
    metadata?: Record<string, unknown>;
  }[] = [
    // ──────────────────────────────────────
    // prefix
    // ──────────────────────────────────────
    { category: 'prefix', value: 'นาย', label: 'นาย', sortOrder: 1 },
    { category: 'prefix', value: 'นาง', label: 'นาง', sortOrder: 2 },
    { category: 'prefix', value: 'นางสาว', label: 'นางสาว', sortOrder: 3 },
    { category: 'prefix', value: 'เด็กชาย', label: 'เด็กชาย', sortOrder: 4 },
    { category: 'prefix', value: 'เด็กหญิง', label: 'เด็กหญิง', sortOrder: 5 },

    // ──────────────────────────────────────
    // dmard
    // ──────────────────────────────────────
    { category: 'dmard', value: 'MTX', label: 'MTX', sortOrder: 1 },
    { category: 'dmard', value: 'SSZ', label: 'SSZ', sortOrder: 2 },
    { category: 'dmard', value: 'AZA', label: 'Aza', sortOrder: 3 },
    { category: 'dmard', value: 'HCQ', label: 'HCQ', sortOrder: 4 },
    { category: 'dmard', value: 'LEF', label: 'LEF', sortOrder: 5 },
    { category: 'dmard', value: 'MMF', label: 'MMF', sortOrder: 6 },
    { category: 'dmard', value: 'CYA', label: 'CyA', sortOrder: 7 },
    { category: 'dmard', value: 'CYCP_ORAL', label: 'CycP oral', sortOrder: 8 },
    { category: 'dmard', value: 'CYCP_IV', label: 'CycP IV', sortOrder: 9 },
    { category: 'dmard', value: 'PRED', label: 'Pred', sortOrder: 10 },
    { category: 'dmard', value: 'ADALIMUMAB', label: 'adalimumab', sortOrder: 11 },
    { category: 'dmard', value: 'NINTEDANIB', label: 'nintedanib', sortOrder: 12 },
    { category: 'dmard', value: 'RTX', label: 'RTX', sortOrder: 13 },

    // ──────────────────────────────────────
    // eye_screening_status
    // ──────────────────────────────────────
    { category: 'eye_screening_status', value: 'NORMAL', label: 'ตาปกติ', sortOrder: 1 },
    { category: 'eye_screening_status', value: 'PROBLEM', label: 'มีปัญหาตา', sortOrder: 2 },
    { category: 'eye_screening_status', value: 'NEW_MACULOPATHY', label: 'New Dx maculopathy', sortOrder: 3 },
    { category: 'eye_screening_status', value: 'HX_NO_MACULOPATHY', label: 'Hx เคยได้ CQ/HQ แต่ no maculopathy', sortOrder: 4 },
    { category: 'eye_screening_status', value: 'HX_MACULOPATHY', label: 'Hx เคย Dx maculopathy', sortOrder: 5 },
    { category: 'eye_screening_status', value: 'UD_EYE', label: 'มี U/D Eye เดิม', sortOrder: 6 },
    { category: 'eye_screening_status', value: 'SLE_RETINOPATHY', label: 'SLE retinopathy', sortOrder: 7 },
    { category: 'eye_screening_status', value: 'NOT_ASSESSED', label: 'ไม่ได้ซัก', sortOrder: 8 },

    // ──────────────────────────────────────
    // eye_result
    // ──────────────────────────────────────
    { category: 'eye_result', value: 'NO_MACULOPATHY', label: 'no maculopathy', sortOrder: 1 },
    { category: 'eye_result', value: 'RO_MACULOPATHY', label: 'R/O maculopathy', sortOrder: 2 },
    { category: 'eye_result', value: 'DX_MACULOPATHY', label: 'Dx maculopathy', sortOrder: 3 },
    { category: 'eye_result', value: 'POSTAL_RESULT', label: 'ไปรษณีย์มูลผลตรวจที่เจน', sortOrder: 4 },
    { category: 'eye_result', value: 'OTHER_EYE_DX', label: 'EYE Dx อื่นๆ', sortOrder: 5 },

    // ──────────────────────────────────────
    // alcohol
    // ──────────────────────────────────────
    { category: 'alcohol', value: 'YES_BEER', label: 'Yes เบียร์', sortOrder: 2 },
    { category: 'alcohol', value: 'YES_LIQUOR', label: 'Yes เหล้า/40', sortOrder: 3 },
    { category: 'alcohol', value: 'YES_BEER_LIQUOR', label: 'Yes เบียร์+เหล้า', sortOrder: 4 },
    { category: 'alcohol', value: 'YES_HERBAL_LIQUOR', label: 'Yes ยาดอง', sortOrder: 5 },
    { category: 'alcohol', value: 'YES_OCCASIONAL', label: 'Yes ตามเทศกาล', sortOrder: 6 },

    // ──────────────────────────────────────
    // herb
    // ──────────────────────────────────────
    { category: 'herb', value: 'HERB_ROOT', label: 'สมุนไพร รากไม้/แดกอก', sortOrder: 2 },
    { category: 'herb', value: 'HERB_PRODUCT', label: 'สมุนไพรสำเร็จรูป', sortOrder: 3 },
    { category: 'herb', value: 'SUPPLEMENT', label: 'อาหารเสริม', sortOrder: 4 },
    { category: 'herb', value: 'VITAMIN', label: 'วิตามินบำรุง', sortOrder: 5 },
    { category: 'herb', value: 'CANNABIS', label: 'กัญชา', sortOrder: 6 },
    { category: 'herb', value: 'KRATOM', label: 'กระท้อม', sortOrder: 7 },
    { category: 'herb', value: 'OTHER', label: 'อื่นๆ', sortOrder: 8 },
    { category: 'herb', value: 'MEDICAL_FOOD', label: 'นม/อาหารทางการแพทย์', sortOrder: 9 },

    // ──────────────────────────────────────
    // smoking
    // ──────────────────────────────────────
    { category: 'smoking', value: 'YES_CIGARETTE', label: 'Yes บุหรี่', sortOrder: 2 },
    { category: 'smoking', value: 'YES_ROLLING', label: 'Yes ยาเส้น', sortOrder: 3 },
    { category: 'smoking', value: 'YES_ECIG', label: 'Yes บุหรี่ไฟฟ้า', sortOrder: 4 },
    { category: 'smoking', value: 'YES_MULTIPLE', label: 'Yes สูบหลายอย่าง', sortOrder: 5 },

    // ──────────────────────────────────────
    // drp_type
    // ──────────────────────────────────────
    { category: 'drp_type', value: 'FORGOT_ALLERGY', label: 'ลืมยาเดิม/แพ้เดิม', sortOrder: 1 },
    { category: 'drp_type', value: 'FORGOT_EXISTING', label: 'ลืมยาที่แพ้', sortOrder: 2 },
    { category: 'drp_type', value: 'MONITORABLE', label: 'มียาตรวจได้', sortOrder: 3 },
    { category: 'drp_type', value: 'DOSE_ERROR', label: 'Dose สูง/ต่ำไป', sortOrder: 4 },
    { category: 'drp_type', value: 'WRONG_METHOD', label: 'ผิดวิธี/interval/route/DF', sortOrder: 5 },
    { category: 'drp_type', value: 'WRONG_QUANTITY', label: 'ผิดจำนวน', sortOrder: 6 },
    { category: 'drp_type', value: 'DUPLICATE_PCO', label: 'ยาซ้ำ P\'co', sortOrder: 7 },
    { category: 'drp_type', value: 'DUPLICATE_DI', label: 'ยาซ้ำ DI', sortOrder: 8 },
    { category: 'drp_type', value: 'ONLINE_MISMATCH', label: 'online ไม่ตรง Paperless', sortOrder: 9 },
    { category: 'drp_type', value: 'DRUG_SHORTAGE', label: 'ยาขาด', sortOrder: 10 },
    { category: 'drp_type', value: 'WRONG_HOSPITAL_CRITERIA', label: 'ผิดเงื่อนไขรพ.', sortOrder: 11 },
    { category: 'drp_type', value: 'INCOMPLETE_ORDER', label: 'คำสั่งไม่สมบูรณ์/กำกวม', sortOrder: 12 },
    { category: 'drp_type', value: 'WRONG_HISTORY', label: 'Hx เดิม ผิด', sortOrder: 13 },
    { category: 'drp_type', value: 'ADR_FOUND', label: 'เจอ ADR', sortOrder: 14 },
    { category: 'drp_type', value: 'MED_RECONCILIATION', label: 'Med RC กับแผนก/รพ/ที่อื่น', sortOrder: 15 },
    { category: 'drp_type', value: 'OTHER', label: 'อื่นๆ', sortOrder: 16 },

    // ──────────────────────────────────────
    // me_type
    // ──────────────────────────────────────
    { category: 'me_type', value: 'PRESCRIBING', label: 'prescribing', sortOrder: 1 },
    { category: 'me_type', value: 'PROCESSING', label: 'processing', sortOrder: 2 },
    { category: 'me_type', value: 'DISPENSING', label: 'dispensing', sortOrder: 3 },
    { category: 'me_type', value: 'POSTAL', label: 'ยาปณ.', sortOrder: 4 },
    { category: 'me_type', value: 'FROM_IPD', label: 'จาก IPD', sortOrder: 5 },

    // ──────────────────────────────────────
    // contraception
    // ──────────────────────────────────────
    { category: 'contraception', value: 'NO_NEED', label: 'No need', sortOrder: 1 },
    { category: 'contraception', value: 'NO_RISK', label: 'No risk preg', sortOrder: 2 },
    { category: 'contraception', value: 'STERILIZED', label: 'ทำหมันแล้ว', sortOrder: 3 },
    { category: 'contraception', value: 'OCP', label: 'Yes OCPs', sortOrder: 4 },
    { category: 'contraception', value: 'CONDOM', label: 'Yes condom', sortOrder: 5 },
    { category: 'contraception', value: 'INJECTION_IMPLANT', label: 'ฉีด/ฝัง ยาคุม', sortOrder: 6 },
    { category: 'contraception', value: 'NONE', label: 'No คุม', sortOrder: 7 },
    { category: 'contraception', value: 'OTHER', label: 'อื่นๆ', sortOrder: 8 },
  ];

  let created = 0;
  let skipped = 0;

  for (const option of options) {
    try {
      await prisma.selectOption.upsert({
        where: {
          category_value: {
            category: option.category,
            value: option.value,
          },
        },
        update: {
          label: option.label,
          sortOrder: option.sortOrder,
          // ไม่ override isActive ถ้ามีอยู่แล้ว
        },
        create: {
          category: option.category,
          value: option.value,
          label: option.label,
          sortOrder: option.sortOrder,
          isActive: true,
          metadata: option.metadata ?? null,
        },
      });
      created++;
    } catch (err) {
      console.error(`  ❌ Failed: ${option.category}/${option.value}`, err);
      skipped++;
    }
  }

  console.log(`  ✅ SelectOptions: ${created} upserted, ${skipped} failed`);
}