Directory structure:
└── taro112233-nextjs-starter-2026/
    ├── README.md
    ├── components.json
    ├── eslint.config.mjs
    ├── INSTRUCTIONS.md
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
    │   ├── api/
    │   │   ├── arcjet/
    │   │   │   └── route.ts
    │   │   ├── auth/
    │   │   │   └── [...all]/
    │   │   │       └── route.ts
    │   │   └── profile/
    │   │       ├── route.ts
    │   │       └── avatar/
    │   │           └── route.ts
    │   ├── login/
    │   │   └── page.tsx
    │   ├── privacy-policy/
    │   │   └── page.tsx
    │   ├── profile/
    │   │   └── page.tsx
    │   ├── register/
    │   │   └── page.tsx
    │   └── terms-of-service/
    │       └── page.tsx
    ├── components/
    │   ├── AuthGuard.tsx
    │   ├── CookieConsent/
    │   │   └── index.tsx
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
    │   ├── useCurrentUser.ts
    │   ├── useProfile.ts
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
    │   └── schemas/
    │       └── better-auth.prisma
    ├── scripts/
    │   ├── merge-schemas.js
    │   └── merge-seeds.js
    └── types/
        ├── cookie.d.ts
        └── profile.ts