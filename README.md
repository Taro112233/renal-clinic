Directory structure:
└── taro112233-renal-clinic/
    ├── README.md
    ├── components.json
    ├── eslint.config.mjs
    ├── INSTRUCTION.md
    ├── middleware.ts
    ├── next.config.ts
    ├── package.json
    ├── pnpm-lock.yaml
    ├── pnpm-workspace.yaml
    ├── postcss.config.mjs
    ├── tsconfig.json
    ├── vercel.json
    ├── app/
    │   ├── globals.css
    │   ├── layout.tsx
    │   ├── not-found.tsx
    │   ├── page.tsx
    │   ├── admin/
    │   │   └── page.tsx
    │   ├── api/
    │   │   ├── admin/
    │   │   │   └── users/
    │   │   │       ├── route.ts
    │   │   │       └── [id]/
    │   │   │           └── role/
    │   │   │               └── route.ts
    │   │   ├── arcjet/
    │   │   │   └── route.ts
    │   │   ├── auth/
    │   │   │   └── [...all]/
    │   │   │       └── route.ts
    │   │   ├── counseling/
    │   │   │   ├── route.ts
    │   │   │   └── [id]/
    │   │   │       └── route.ts
    │   │   ├── patients/
    │   │   │   ├── route.ts
    │   │   │   └── lookup/
    │   │   │       └── route.ts
    │   │   ├── profile/
    │   │   │   ├── route.ts
    │   │   │   └── avatar/
    │   │   │       └── route.ts
    │   │   └── settings/
    │   │       └── select-options/
    │   │           ├── route.ts
    │   │           └── [id]/
    │   │               └── route.ts
    │   ├── counseling/
    │   │   └── new/
    │   │       └── page.tsx
    │   ├── dashboard/
    │   │   └── page.tsx
    │   ├── login/
    │   │   └── page.tsx
    │   ├── privacy-policy/
    │   │   └── page.tsx
    │   ├── profile/
    │   │   └── page.tsx
    │   ├── register/
    │   │   └── page.tsx
    │   ├── settings/
    │   │   └── page.tsx
    │   ├── showcase/
    │   │   └── page.tsx
    │   └── terms-of-service/
    │       └── page.tsx
    ├── components/
    │   ├── AuthGuard.tsx
    │   ├── AdminPage/
    │   │   ├── AdminSkeleton.tsx
    │   │   ├── index.tsx
    │   │   ├── PaginationBar.tsx
    │   │   ├── RoleSelector.tsx
    │   │   ├── UserCardList.tsx
    │   │   └── UserTable.tsx
    │   ├── CookieConsent/
    │   │   └── index.tsx
    │   ├── CounselingForm/
    │   │   ├── index.tsx
    │   │   ├── Section01_BasicInfo.tsx
    │   │   ├── Section02_Medications.tsx
    │   │   ├── Section03_History.tsx
    │   │   ├── Section04_ADR.tsx
    │   │   ├── Section05_EyeScreening.tsx
    │   │   ├── Section06_Compliance.tsx
    │   │   ├── Section07_LeftoverMeds.tsx
    │   │   ├── Section08_HealthBehavior.tsx
    │   │   ├── Section09_DRP.tsx
    │   │   ├── Section10_Other.tsx
    │   │   ├── Section11_LabValues.tsx
    │   │   ├── Section12_Cyclophosphamide.tsx
    │   │   └── SectionNote.tsx
    │   ├── Dashboard/
    │   │   ├── DashboardActions.tsx
    │   │   ├── DashboardContent.tsx
    │   │   ├── DashboardHeader.tsx
    │   │   ├── DashboardSkeleton.tsx
    │   │   ├── DashboardStats.tsx
    │   │   └── index.tsx
    │   ├── PendingApproval/
    │   │   ├── index.tsx
    │   │   ├── PendingApprovalContent.tsx
    │   │   ├── PendingApprovalHeader.tsx
    │   │   └── PendingApprovalSkeleton.tsx
    │   ├── ProfilePage/
    │   │   ├── AccountSection.tsx
    │   │   ├── index.tsx
    │   │   ├── PersonalInfoSection.tsx
    │   │   ├── ProfileHeader.tsx
    │   │   └── ProfileSkeleton.tsx
    │   ├── providers/
    │   │   └── AuthProvider.tsx
    │   ├── RichTextEditor/
    │   │   ├── index.ts
    │   │   ├── MenuBar.tsx
    │   │   ├── RichTextEditor.tsx
    │   │   └── RichTextViewer.tsx
    │   ├── SettingsPage/
    │   │   ├── index.tsx
    │   │   └── SelectOptionsManager.tsx
    │   ├── shared/
    │   │   ├── AppHeader.tsx
    │   │   ├── EmptyState.tsx
    │   │   └── LoadingState.tsx
    │   ├── TermsCheckbox/
    │   │   └── index.tsx
    │   ├── theme/
    │   │   └── CompactThemeSelector.tsx
    │   └── ui/
    │       ├── accordion.tsx
    │       ├── alert-dialog.tsx
    │       ├── alert.tsx
    │       ├── aspect-ratio.tsx
    │       ├── avatar.tsx
    │       ├── badge.tsx
    │       ├── breadcrumb.tsx
    │       ├── button-group.tsx
    │       ├── button.tsx
    │       ├── calendar.tsx
    │       ├── card.tsx
    │       ├── carousel.tsx
    │       ├── chart.tsx
    │       ├── checkbox.tsx
    │       ├── collapsible.tsx
    │       ├── command.tsx
    │       ├── context-menu.tsx
    │       ├── dialog.tsx
    │       ├── drawer.tsx
    │       ├── dropdown-menu.tsx
    │       ├── empty.tsx
    │       ├── field.tsx
    │       ├── form.tsx
    │       ├── hover-card.tsx
    │       ├── input-group.tsx
    │       ├── input-otp.tsx
    │       ├── input.tsx
    │       ├── item.tsx
    │       ├── kbd.tsx
    │       ├── label.tsx
    │       ├── menubar.tsx
    │       ├── navigation-menu.tsx
    │       ├── pagination.tsx
    │       ├── popover.tsx
    │       ├── progress.tsx
    │       ├── radio-group.tsx
    │       ├── resizable.tsx
    │       ├── scroll-area.tsx
    │       ├── select.tsx
    │       ├── separator.tsx
    │       ├── sheet.tsx
    │       ├── sidebar.tsx
    │       ├── skeleton.tsx
    │       ├── slider.tsx
    │       ├── sonner.tsx
    │       ├── spinner.tsx
    │       ├── switch.tsx
    │       ├── table.tsx
    │       ├── tabs.tsx
    │       ├── textarea.tsx
    │       ├── toast.tsx
    │       ├── toaster.tsx
    │       ├── toggle-group.tsx
    │       ├── toggle.tsx
    │       └── tooltip.tsx
    ├── hooks/
    │   ├── use-mobile.ts
    │   ├── use-theme-transition.ts
    │   ├── useAdminUsers.ts
    │   ├── useCounselingForm.ts
    │   ├── useCurrentUser.ts
    │   ├── useProfile.ts
    │   ├── useSelectOptions.ts
    │   └── useTheme.ts
    ├── lib/
    │   ├── arcjet-config.ts
    │   ├── auth-client.ts
    │   ├── auth-helpers.ts
    │   ├── auth.ts
    │   ├── config.ts
    │   ├── file-upload.ts
    │   ├── file-validation.ts
    │   ├── prisma.ts
    │   ├── rich-text-utils.ts
    │   ├── role-helpers.ts
    │   ├── security-logger.ts
    │   ├── theme-manager.ts
    │   └── utils.ts
    ├── prisma/
    │   ├── schema.prisma
    │   ├── seed.ts
    │   ├── schemas/
    │   │   ├── base.prisma
    │   │   ├── better-auth.prisma
    │   │   ├── counseling.prisma
    │   │   ├── drug.prisma
    │   │   └── patient.prisma
    │   └── seeds/
    │       └── select-options.seed.ts
    ├── scripts/
    │   ├── merge-schemas.js
    │   └── merge-seeds.js
    └── types/
        ├── cookie.d.ts
        ├── counseling.ts
        └── profile.ts