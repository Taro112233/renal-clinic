// components/PendingApproval/PendingApprovalContent.tsx
'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  CheckCircle2, 
  Clock, 
  Mail, 
  UserCheck, 
  Shield,
  Info
} from 'lucide-react';
import { format } from 'date-fns';
import { th } from 'date-fns/locale';
import type { CurrentUser } from '@/hooks/useCurrentUser';

interface PendingApprovalContentProps {
  user: CurrentUser;
}

export function PendingApprovalContent({ user }: PendingApprovalContentProps) {
  return (
    <div className="space-y-6">
      {/* Alert Message */}
      <Alert className="bg-alert-info-bg border-alert-info-border">
        <Info className="h-5 w-5 text-alert-info-icon" />
        <AlertDescription className="text-alert-info-text ml-2">
          บัญชีของคุณอยู่ระหว่างรอการอนุมัติจากผู้ดูแลระบบ 
          คุณจะสามารถเข้าใช้งานระบบได้เมื่อได้รับการอนุมัติแล้ว
        </AlertDescription>
      </Alert>

      {/* Account Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <UserCheck className="w-5 h-5" />
            ข้อมูลบัญชี
          </CardTitle>
          <CardDescription>
            ข้อมูลที่คุณลงทะเบียนไว้
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-4">
          {/* Email */}
          <div className="flex items-center gap-3">
            <Mail className="w-5 h-5 text-content-secondary shrink-0" />
            <div className="min-w-0 flex-1">
              <p className="text-sm font-medium text-content-secondary">อีเมล</p>
              <p className="text-base text-content-primary break-all">{user.email}</p>
            </div>
          </div>

          {/* Name */}
          <div className="flex items-center gap-3">
            <UserCheck className="w-5 h-5 text-content-secondary shrink-0" />
            <div className="min-w-0 flex-1">
              <p className="text-sm font-medium text-content-secondary">ชื่อ-นามสกุล</p>
              <p className="text-base text-content-primary">
                {user.firstName} {user.lastName}
              </p>
            </div>
          </div>

          {/* Registration Date */}
          <div className="flex items-center gap-3">
            <Clock className="w-5 h-5 text-content-secondary shrink-0" />
            <div className="min-w-0 flex-1">
              <p className="text-sm font-medium text-content-secondary">ลงทะเบียนเมื่อ</p>
              <p className="text-base text-content-primary">
                {format(new Date(user.createdAt), 'dd MMMM yyyy, HH:mm', { locale: th })} น.
              </p>
            </div>
          </div>

          {/* Role */}
          <div className="flex items-center gap-3">
            <Shield className="w-5 h-5 text-content-secondary shrink-0" />
            <div className="min-w-0 flex-1">
              <p className="text-sm font-medium text-content-secondary">สิทธิ์การใช้งาน</p>
              <p className="text-base text-content-primary">ผู้ใช้งานทั่วไป (รอการอนุมัติ)</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Next Steps */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5" />
            ขั้นตอนต่อไป
          </CardTitle>
          <CardDescription>
            สิ่งที่จะเกิดขึ้นหลังจากนี้
          </CardDescription>
        </CardHeader>

        <CardContent>
          <ol className="space-y-4">
            <li className="flex gap-4">
              <div className="flex items-center justify-center w-8 h-8 rounded-full bg-alert-info-bg text-alert-info-text shrink-0 font-bold">
                1
              </div>
              <div>
                <p className="font-medium text-content-primary">รอการตรวจสอบ</p>
                <p className="text-sm text-content-secondary mt-1">
                  ผู้ดูแลระบบจะตรวจสอบข้อมูลของคุณ
                </p>
              </div>
            </li>

            <li className="flex gap-4">
              <div className="flex items-center justify-center w-8 h-8 rounded-full bg-alert-info-bg text-alert-info-text shrink-0 font-bold">
                2
              </div>
              <div>
                <p className="font-medium text-content-primary">ได้รับการอนุมัติ</p>
                <p className="text-sm text-content-secondary mt-1">
                  คุณจะได้รับอีเมลแจ้งเตือนเมื่อบัญชีได้รับการอนุมัติ
                </p>
              </div>
            </li>

            <li className="flex gap-4">
              <div className="flex items-center justify-center w-8 h-8 rounded-full bg-alert-success-bg text-alert-success-text shrink-0 font-bold">
                3
              </div>
              <div>
                <p className="font-medium text-content-primary">เริ่มใช้งาน</p>
                <p className="text-sm text-content-secondary mt-1">
                  คุณสามารถเข้าใช้งานระบบได้เต็มรูปแบบ
                </p>
              </div>
            </li>
          </ol>
        </CardContent>
      </Card>

      {/* Help Section */}
      <Card className="bg-surface-secondary border-border-secondary">
        <CardContent className="pt-6 pb-6">
          <div className="text-center">
            <Mail className="w-12 h-12 mx-auto mb-4 text-content-secondary" />
            <h3 className="font-semibold text-content-primary mb-2">
              ต้องการความช่วยเหลือ?
            </h3>
            <p className="text-sm text-content-secondary mb-4">
              หากมีข้อสงสัยเกี่ยวกับการอนุมัติบัญชี กรุณาติดต่อผู้ดูแลระบบ
            </p>
            <a 
              href="mailto:admin@example.com" 
              className="text-primary hover:underline text-sm font-medium"
            >
              admin@example.com
            </a>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}