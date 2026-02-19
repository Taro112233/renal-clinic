คิดว่า **ยังไม่เหมาะสม** สำหรับใส่ใน Project Knowledge/Instructions ของ Claude AI โดยตรง เพราะ:

## ปัญหาที่พบ

1. **ยาวเกินไป (1,249 บรรทัด)** - Claude อาจไม่ได้ใช้ข้อมูลทั้งหมดอย่างมีประสิทธิภาพ
2. **มีรายละเอียดที่ซ้าซ้อน** - เช่น code examples ที่ยาวๆ ซึ่งควรอยู่ในตัวไฟล์จริง
3. **ขาดการจัดลำดับความสำคัญ** - ข้อมูลที่ critical กับ nice-to-know ปนกัน
4. **Format ไม่เหมาะกับการ reference** - เป็น tutorial แบบยาวมากกว่า quick reference

---

# 📋 NextJS Starter Template - Instruction Guide

## 🎯 Core Identity

**Production-ready Next.js 15 starter** with enterprise-grade auth (Better Auth), security (Arcjet), and RBAC system for healthcare/medical applications.

**Tech Stack:** Next.js 15 + React 19 + TypeScript + Prisma + PostgreSQL (Neon) + Tailwind v4 + Shadcn/UI

---

## 🏗️ Architecture Overview

### Authentication System
- **Better Auth** (`lib/auth.ts`) - Email/password + Google OAuth
- **Session:** 7-day expiry, tracks IP/userAgent
- **User fields:** firstName, lastName, phone, role (USER|ADMIN|SUPERADMIN), status, isActive
- **Hook:** `useCurrentUser()` - provides user, loading, isAuthenticated, isAdmin, logout, refetch

### Security (Arcjet)
**Three instances** in `lib/arcjet-config.ts`:
1. `arcjetAuth` - Auth endpoints (5 req/15min, no bots)
2. `arcjetAPI` - General APIs (20 req/min, allow search engines)
3. `arcjetUpload` - File uploads (5 req/min, no bots)

**Helper functions:**
- `getClientIP(request)` - Extract client IP safely
- `handleArcjetDecision(decision)` - Standardized error responses
- `getRateLimitInfo(decision)` - Rate limit headers

**Security logging** (`lib/security-logger.ts`):
- Events: rate_limit, bot_blocked, shield_blocked, rce_attempt, suspicious_payload
- Functions: `logSecurityEvent()`, `getSecurityStats()`, `getThreatLevel()`

### RBAC System (`lib/role-helpers.ts`)
**Hierarchy:** USER (1) → ADMIN (2) → SUPERADMIN (3)

**Key functions:**
- `hasPermission(role, action)` - Check action permission
- `canManageUser(currentRole, targetRole)` - Check user management rights
- `canAccessAdminPanel(role)` - Admin panel access
- `getRoleInfo(role)` - Display info (labels, colors, icons)

**Permission actions:**
```
USER: profile.view, profile.edit
ADMIN: + users.view_all, dashboard.access
SUPERADMIN: all actions
```

### Theme System (`lib/theme-manager.ts`)
**4 themes:** Medical Teal (default), Clinical Blue, Wellness Green, Research Purple

**Design tokens** (`app/globals.css`):
```
Tier 1: Raw colors (--color-primary, --color-background)
Tier 2: Global semantic (--color-brand-primary)
Tier 3: Contextual (--color-content-primary, --color-surface-primary, --color-interactive-primary)
```

**Hook:** `useTheme()` - activeTheme, mode, isDark, changeTheme(), toggleMode()
**Flash prevention:** Inline script in `app/layout.tsx` reads localStorage before render

### File System
**Validation** (`lib/file-validation.ts`):
- Max size: 10MB, Max files: 5
- Allowed: JPEG, PNG, GIF, WebP, PDF
- Functions: `validateFile()`, `validateFiles()`, `sanitizeFilename()`

**Upload** (`lib/file-upload.ts`):
- `uploadFile(file, userId?, requestId?)` - Uploads to Vercel Blob
- `uploadMultipleFiles(files[], userId?, requestId?)` - Concurrent uploads
- Path: `requests/{requestId}/{timestamp}-{random}-{filename}`

---

## 📁 Project Structure

```
app/
├── api/
│   ├── auth/[...all]/route.ts    # Better Auth handler (protected by Arcjet)
│   ├── profile/route.ts          # GET, PATCH profile
│   └── profile/avatar/route.ts   # POST avatar upload
├── login/page.tsx                # Login page
├── register/page.tsx             # Registration page
├── profile/page.tsx              # Profile management
├── globals.css                   # Semantic design system
└── layout.tsx                    # Root layout + AuthGuard

components/
├── ui/                           # Shadcn/UI components
├── shared/                       # AppHeader, EmptyState, LoadingState
├── ProfilePage/                  # ProfileHeader, PersonalInfoSection, AccountSection
├── RichTextEditor/               # Tiptap editor (RichTextEditor, RichTextViewer, MenuBar)
├── theme/CompactThemeSelector.tsx
└── AuthGuard.tsx                 # Auto redirects unauthenticated users

hooks/
├── useCurrentUser.ts             # Auth hook
├── useProfile.ts                 # Profile CRUD
├── useTheme.ts                   # Theme management
└── use-mobile.ts                 # Responsive breakpoint

lib/
├── auth.ts                       # Better Auth config
├── auth-client.ts                # Client-side auth
├── arcjet-config.ts              # 3 Arcjet instances
├── security-logger.ts            # Security events
├── role-helpers.ts               # RBAC functions
├── theme-manager.ts              # Theme system
├── file-upload.ts & file-validation.ts
├── rich-text-utils.ts            # Extract/truncate rich text
└── prisma.ts                     # Prisma client (Neon adapter)

prisma/
├── schema.prisma                 # Generated (merged)
└── schemas/better-auth.prisma    # User, Session, Account models
```

---

## 🔐 Database Schema

```prisma
model User {
  id            String    @id @default(cuid())
  email         String    @unique
  name          String
  emailVerified Boolean   @default(false)
  image         String?
  
  firstName     String    @default("")
  lastName      String    @default("")
  phone         String?
  role          UserRole  @default(USER)
  status        String    @default("ACTIVE")
  isActive      Boolean   @default(true)
  lastLogin     DateTime?
  
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt
  
  sessions      Session[]
  accounts      Account[]
  
  @@index([email])
  @@index([role])
}

enum UserRole { USER, ADMIN, SUPERADMIN }
```

**Commands:**
```bash
pnpm schema:merge      # Merge schemas from prisma/schemas/
pnpm db:generate       # Generate Prisma client
pnpm db:push          # Push to database
pnpm db:studio        # Open Prisma Studio
pnpm db:fresh         # Full reset + seed with demo data
```

---

## 🚀 Common Workflows

### Adding a Protected Page
```typescript
// app/new-page/page.tsx
'use client'
export default function NewPage() {
  const { user, loading } = useCurrentUser()
  if (loading) return <LoadingState />
  if (!user) return null  // AuthGuard redirects
  return <div>Content</div>
}

// Add to navigation in components/shared/AppHeader.tsx
```

### Adding an API Route
```typescript
// app/api/new-endpoint/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { arcjetAPI } from '@/lib/arcjet-config'

export async function POST(request: NextRequest) {
  // 1. Arcjet protection
  const decision = await arcjetAPI.protect(request)
  if (decision.isDenied()) {
    return NextResponse.json({ error: 'Rate limit' }, { status: 429 })
  }
  
  // 2. Authentication check
  const session = await auth.api.getSession({ headers: request.headers })
  if (!session?.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  
  // 3. Authorization check (if needed)
  if (!hasPermission(session.user.role, 'action.name')) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }
  
  // 4. Your logic
  return NextResponse.json({ success: true })
}
```

### Adding a Role Permission
```typescript
// lib/role-helpers.ts
const adminActions = [
  // ...existing
  'new-feature.access',
]

// In component/API
import { hasPermission } from '@/lib/role-helpers'
if (!hasPermission(user.role, 'new-feature.access')) {
  return <div>Access denied</div>
}
```

### Adding a Theme
```typescript
// 1. lib/theme-manager.ts
export const MEDICAL_THEMES: Theme[] = [
  // ...
  { id: "orange", name: "Medical Orange", colors: [...], preview: Pill, accent: "..." },
]

// 2. app/globals.css
[data-theme*="orange"] {
  --color-primary: oklch(0.65 0.15 40);
  --color-brand-primary: oklch(0.65 0.15 40);
  /* ... other overrides */
}
```

---

## ✅ Critical Patterns

### Server Component First
```typescript
// Default to server components
// Use 'use client' only for: useState, useEffect, event handlers, browser APIs
```

### Type Safety
```typescript
import { User, UserRole } from '@prisma/client'
import type { UserProfile } from '@/types/profile'
// Always use Zod for API validation
```

### Error Handling
```typescript
// API: Always return { success: boolean, data?, error? }
// Client: Check error, show toast, handle gracefully
```

### Loading States
```typescript
if (loading) return <Skeleton />
if (error) return <Alert variant="destructive">{error}</Alert>
if (!data) return null
```

### Semantic Design Tokens
```typescript
// ✅ Use semantic tokens
className="bg-surface-primary text-content-primary border-border-primary"

// ❌ Don't use raw colors
className="bg-gray-900 text-white border-gray-700"
```

### Security Checklist
- ✅ Validate input server-side (Zod)
- ✅ Check authentication on every protected route
- ✅ Check authorization with `hasPermission()`
- ✅ Use Arcjet on all API routes
- ✅ Sanitize filenames with `sanitizeFilename()`
- ✅ Never use raw SQL (use Prisma)
- ✅ Log security events

---

## 🌍 Environment Variables

```bash
DATABASE_URL="postgresql://..."
DIRECT_URL="postgresql://..."
BETTER_AUTH_SECRET="..."  # openssl rand -base64 32
BETTER_AUTH_URL="http://localhost:3000"
GOOGLE_CLIENT_ID="..."
GOOGLE_CLIENT_SECRET="..."
ARCJET_KEY="ajkey_..."
BLOB_READ_WRITE_TOKEN="vercel_blob_rw_..."
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

---

## 🎓 Key Principles

1. **Server-first:** Default to server components
2. **Type-safe:** TypeScript strict mode, Prisma types, Zod validation
3. **Secure by default:** Arcjet on all routes, validate everything, log security events
4. **Semantic design:** Use 3-tier token system, never raw colors
5. **Role-based:** Check permissions explicitly, use hierarchy
6. **Error-resilient:** Handle all states (loading, error, empty, success)
7. **Performance-conscious:** Dynamic imports, caching, optimistic updates

---

## 📚 Quick Reference

**Auth:** `useCurrentUser()` → user, loading, isAuthenticated, logout
**Profile:** `useProfile()` → profile, updateProfile(), uploadAvatar()
**Theme:** `useTheme()` → activeTheme, mode, changeTheme(), toggleMode()
**RBAC:** `hasPermission(role, action)`, `canManageUser(currentRole, targetRole)`
**Security:** `arcjetAuth`, `arcjetAPI`, `arcjetUpload` + `logSecurityEvent()`
**Files:** `validateFile()`, `uploadFile()`, `sanitizeFilename()`
**Rich Text:** `<RichTextEditor>`, `<RichTextViewer>`, `extractTextFromRichText()`

---

## 🚢 Deployment (Vercel)

1. Connect repo to Vercel
2. Set all environment variables
3. Auto-deploy on push to main
4. Run migrations: `pnpm db:migrate:prod`