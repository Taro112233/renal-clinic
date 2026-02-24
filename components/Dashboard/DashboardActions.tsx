// components/Dashboard/DashboardActions.tsx
'use client';

import React from 'react';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { 
  Plus, 
  FileText, 
  Users, 
  BarChart3,
  Settings,
  Download,
  Calendar,
  Pill,
  Activity
} from 'lucide-react';
import type { CurrentUser } from '@/hooks/useCurrentUser';

interface DashboardActionsProps {
  user: CurrentUser;
}

interface QuickActionProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  href: string;
  variant?: 'default' | 'outline';
}

function QuickAction({ title, description, icon, href, variant = 'outline' }: QuickActionProps) {
  return (
    <Link href={href} className="block h-full">
      <Card className="h-full hover:shadow-elevation-2 transition-all duration-300 hover:scale-[1.02] cursor-pointer group">
        <CardContent className="pt-6 pb-6">
          <div className="flex items-start gap-4">
            <div className={`p-3 rounded-lg ${
              variant === 'default' 
                ? 'gradient-brand-semantic' 
                : 'bg-surface-secondary group-hover:bg-gradient-brand-semantic'
            } transition-all duration-300`}>
              <div className={variant === 'default' ? 'text-white' : 'text-content-primary group-hover:text-white'}>
                {icon}
              </div>
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-content-primary mb-1 group-hover:text-primary transition-colors">
                {title}
              </h3>
              <p className="text-sm text-content-secondary line-clamp-2">
                {description}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}

export function DashboardActions({ user }: DashboardActionsProps) {
  // Common actions for all approved users
  const commonActions: QuickActionProps[] = [
    {
      title: 'บันทึก Pre-Counseling',
      description: 'บันทึกข้อมูลการให้คำปรึกษาก่อนใช้ยา',
      icon: <Plus className="w-5 h-5" />,
      href: '/counseling/new',
      variant: 'default',
    },
    {
      title: 'ดูรายการ Counseling',
      description: 'ตรวจสอบประวัติการให้คำปรึกษาทั้งหมด',
      icon: <FileText className="w-5 h-5" />,
      href: '/counseling',
    },
    {
      title: 'ทะเบียนผู้ป่วย',
      description: 'จัดการข้อมูลผู้ป่วยและประวัติการรักษา',
      icon: <Users className="w-5 h-5" />,
      href: '/patients',
    },
    {
      title: 'บันทึกข้อมูลคลินิก',
      description: 'บันทึกข้อมูลรอบคลินิกและจำนวนผู้ป่วย',
      icon: <Calendar className="w-5 h-5" />,
      href: '/clinic-sessions',
    },
  ];

  // Additional actions for SUPERADMIN
  const adminActions: QuickActionProps[] = [
    {
      title: 'ดาวน์โหลดรายงาน',
      description: 'Export รายงานประจำเดือน/ปีงบประมาณ',
      icon: <Download className="w-5 h-5" />,
      href: '/reports',
    },
    {
      title: 'Drug Cost Saving',
      description: 'บันทึกและดูมูลค่ายาที่ประหยัดได้',
      icon: <Pill className="w-5 h-5" />,
      href: '/drug-saving',
    },
    {
      title: 'จัดการผู้ใช้',
      description: 'อนุมัติและจัดการสิทธิ์ผู้ใช้งาน',
      icon: <Settings className="w-5 h-5" />,
      href: '/admin',
    },
    {
      title: 'Dashboard แบบเต็ม',
      description: 'ดูสถิติและกราฟแบบละเอียด',
      icon: <BarChart3 className="w-5 h-5" />,
      href: '/analytics',
    },
  ];

  const actions = user.role === 'SUPERADMIN' 
    ? [...commonActions, ...adminActions]
    : commonActions;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-content-primary">การดำเนินการด่วน</h2>
          <p className="text-sm text-content-secondary mt-1">
            เลือกรายการเพื่อเริ่มการทำงาน
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
        {actions.map((action, index) => (
          <QuickAction
            key={index}
            title={action.title}
            description={action.description}
            icon={action.icon}
            href={action.href}
            variant={action.variant}
          />
        ))}
      </div>

      {/* Recent Activity Section (Placeholder) */}
      {user.role === 'SUPERADMIN' && (
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>กิจกรรมล่าสุด</CardTitle>
            <CardDescription>
              รายการอัปเดตและกิจกรรมที่สำคัญในระบบ
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-center py-8 text-content-secondary">
              <Activity className="w-12 h-12 mx-auto mb-3 opacity-50" />
              <p className="text-sm">ยังไม่มีกิจกรรมล่าสุด</p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}