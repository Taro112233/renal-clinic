// components/PendingApproval/PendingApprovalHeader.tsx
'use client';

import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Clock, AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { CurrentUser } from '@/hooks/useCurrentUser';

interface PendingApprovalHeaderProps {
  user: CurrentUser;
}

export function PendingApprovalHeader({ user }: PendingApprovalHeaderProps) {
  const getUserInitials = () => {
    return `${user.firstName.charAt(0)}${user.lastName.charAt(0)}`.toUpperCase();
  };

  return (
    <Card className="border-alert-warning-border bg-alert-warning-bg/30">
      <CardContent className="pt-6 pb-6">
        <div className="flex flex-col sm:flex-row items-center gap-6">
          {/* Avatar */}
          <div className="relative">
            <Avatar className="h-24 w-24">
              {user.image && (
                <AvatarImage src={user.image} alt={user.fullName} />
              )}
              <AvatarFallback className="text-2xl gradient-brand-semantic text-white">
                {getUserInitials()}
              </AvatarFallback>
            </Avatar>
            
            {/* Pending Badge */}
            <div className="absolute -bottom-2 -right-2 bg-alert-warning-bg border-2 border-alert-warning-border rounded-full p-1.5">
              <Clock className="w-4 h-4 text-alert-warning-icon" />
            </div>
          </div>

          {/* User Info */}
          <div className="flex-1 text-center sm:text-left">
            <h2 className="text-2xl font-bold text-content-primary mb-2">
              {user.fullName}
            </h2>
            <p className="text-content-secondary mb-3">{user.email}</p>
            
            <Badge 
              variant="outline" 
              className={cn(
                "bg-alert-warning-bg text-alert-warning-text border-alert-warning-border",
                "px-3 py-1.5 text-sm"
              )}
            >
              <AlertCircle className="w-4 h-4 mr-2" />
              รอการอนุมัติ
            </Badge>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}