// components/Dashboard/DashboardHeader.tsx
'use client';

import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Shield, Crown } from 'lucide-react';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { th } from 'date-fns/locale';
import type { CurrentUser } from '@/hooks/useCurrentUser';

interface DashboardHeaderProps {
  user: CurrentUser;
}

export function DashboardHeader({ user }: DashboardHeaderProps) {
  const getUserInitials = () => {
    return `${user.firstName.charAt(0)}${user.lastName.charAt(0)}`.toUpperCase();
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'สวัสดีตอนเช้า';
    if (hour < 18) return 'สวัสดีตอนบ่าย';
    return 'สวัสดีตอนเย็น';
  };

  return (
    <Card className="glass-semantic">
      <CardContent className="pt-6 pb-6">
        <div className="flex flex-col sm:flex-row items-center gap-6">
          {/* Avatar */}
          <div className="relative">
            <Avatar className="h-20 w-20 sm:h-24 sm:w-24 shadow-glow-semantic">
              {user.image && (
                <AvatarImage src={user.image} alt={user.fullName} />
              )}
              <AvatarFallback className="text-xl sm:text-2xl gradient-brand-semantic text-white">
                {getUserInitials()}
              </AvatarFallback>
            </Avatar>
          </div>

          {/* User Info */}
          <div className="flex-1 text-center sm:text-left">
            <p className="text-sm text-content-secondary mb-1">
              {getGreeting()}
            </p>
            <h1 className="text-2xl sm:text-3xl font-bold text-content-primary mb-2">
              {user.fullName}
            </h1>
            <p className="text-content-secondary mb-3">{user.email}</p>
            
            <div className="flex items-center gap-2 justify-center sm:justify-start flex-wrap">
              {/* Role Badge */}
              <Badge 
                variant="outline" 
                className={cn(
                  "px-2.5 py-1",
                  user.role === 'SUPERADMIN'
                    ? "bg-purple-100 dark:bg-purple-900/20 text-purple-700 dark:text-purple-300 border-purple-300 dark:border-purple-700"
                    : "bg-alert-info-bg text-alert-info-text border-alert-info-border"
                )}
              >
                {user.role === 'SUPERADMIN' ? (
                  <>
                    <Crown className="w-3.5 h-3.5 mr-1.5" />
                    ผู้ดูแลระบบสูงสุด
                  </>
                ) : (
                  <>
                    <Shield className="w-3.5 h-3.5 mr-1.5" />
                    เภสัชกร
                  </>
                )}
              </Badge>
              
              {/* Last Login */}
              <span className="text-xs text-content-tertiary">
                เข้าสู่ระบบล่าสุด: {format(new Date(), 'dd MMM yyyy, HH:mm', { locale: th })} น.
              </span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}