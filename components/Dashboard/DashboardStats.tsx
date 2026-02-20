// components/Dashboard/DashboardStats.tsx
'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  Users, 
  FileText, 
  Activity, 
  TrendingUp,
  Calendar,
  CheckCircle2
} from 'lucide-react';
import type { CurrentUser } from '@/hooks/useCurrentUser';

interface DashboardStatsProps {
  user: CurrentUser;
}

interface StatCardProps {
  title: string;
  value: string | number;
  change?: string;
  icon: React.ReactNode;
  trend?: 'up' | 'down' | 'neutral';
}

function StatCard({ title, value, change, icon, trend = 'neutral' }: StatCardProps) {
  return (
    <Card className="glass-semantic hover:shadow-glow-semantic transition-all duration-300">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium text-content-secondary">
          {title}
        </CardTitle>
        <div className="p-2 rounded-lg bg-gradient-brand-semantic">
          <div className="text-white">
            {icon}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-2xl sm:text-3xl font-bold text-content-primary mb-1">
          {value}
        </div>
        {change && (
          <p className={`text-xs ${
            trend === 'up' 
              ? 'text-alert-success-text' 
              : trend === 'down' 
              ? 'text-alert-error-text' 
              : 'text-content-tertiary'
          }`}>
            {change}
          </p>
        )}
      </CardContent>
    </Card>
  );
}

export function DashboardStats({ user }: DashboardStatsProps) {
  // Mock data - replace with real data from API
  const stats = [
    {
      title: 'ผู้ป่วยทั้งหมด',
      value: '1,234',
      change: '+12% จากเดือนที่แล้ว',
      icon: <Users className="w-4 h-4" />,
      trend: 'up' as const,
    },
    {
      title: 'Pre-Counseling',
      value: '156',
      change: 'เดือนนี้',
      icon: <FileText className="w-4 h-4" />,
      trend: 'neutral' as const,
    },
    {
      title: 'Post-Counseling',
      value: '89',
      change: 'เดือนนี้',
      icon: <Activity className="w-4 h-4" />,
      trend: 'neutral' as const,
    },
    {
      title: 'Coverage Rate',
      value: '68%',
      change: '+5% จากเดือนที่แล้ว',
      icon: <TrendingUp className="w-4 h-4" />,
      trend: 'up' as const,
    },
  ];

  // Add additional stats for SUPERADMIN
  if (user.role === 'SUPERADMIN') {
    stats.push(
      {
        title: 'คลินิกที่ดำเนินการ',
        value: '12',
        change: 'เดือนนี้',
        icon: <Calendar className="w-4 h-4" />,
        trend: 'neutral' as const,
      },
      {
        title: 'Drug Cost Saving',
        value: '45,230',
        change: 'บาท (เดือนนี้)',
        icon: <CheckCircle2 className="w-4 h-4" />,
        trend: 'up' as const,
      }
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
      {stats.map((stat, index) => (
        <StatCard
          key={index}
          title={stat.title}
          value={stat.value}
          change={stat.change}
          icon={stat.icon}
          trend={stat.trend}
        />
      ))}
    </div>
  );
}