// app/api/admin/users/[id]/role/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import {
  hasAdminAccess,
  normalizeRole,
  getRoleHierarchy,
  canManageUser,
} from '@/lib/auth-helpers';
import { z } from 'zod';
import type { UserRole } from '@prisma/client';

interface BetterAuthUser {
  id: string;
  email: string;
  name: string;
  role?: string;
}

const UpdateRoleSchema = z.object({
  role: z.enum(['USER', 'ADMIN', 'SUPERADMIN']),
});

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: targetUserId } = await params;

    const session = await auth.api.getSession({ headers: request.headers });
    if (!session?.user) {
      return NextResponse.json(
        { success: false, error: 'Authentication required' },
        { status: 401 }
      );
    }

    const currentUser = session.user as BetterAuthUser;
    const currentRole = normalizeRole(currentUser.role);

    if (!hasAdminAccess(currentRole)) {
      return NextResponse.json(
        { success: false, error: 'Insufficient privileges' },
        { status: 403 }
      );
    }

    const body = await request.json();
    const validation = UpdateRoleSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json(
        { success: false, error: 'Invalid role value' },
        { status: 400 }
      );
    }

    const { role: newRole } = validation.data;
    const isSelf = currentUser.id === targetUserId;

    // Fetch target user
    const targetUser = await prisma.user.findUnique({
      where: { id: targetUserId },
      select: { id: true, role: true, name: true, email: true },
    });

    if (!targetUser) {
      return NextResponse.json(
        { success: false, error: 'User not found' },
        { status: 404 }
      );
    }

    const targetRole = normalizeRole(targetUser.role);

    if (isSelf) {
      // Self-edit: ปรับตัวเองได้ แต่ห้ามขึ้นไปเกินตำแหน่งตัวเอง
      // (ลดตำแหน่งตัวเองได้เท่านั้น หรือ assign role เดิม)
      if (getRoleHierarchy(newRole as UserRole) > getRoleHierarchy(currentRole)) {
        return NextResponse.json(
          { success: false, error: 'Cannot assign a role higher than your own' },
          { status: 403 }
        );
      }
    } else {
      // Edit others: target ต้องมี hierarchy ต่ำกว่า actor
      if (!canManageUser(currentRole, targetRole)) {
        return NextResponse.json(
          {
            success: false,
            error: 'Cannot manage a user with equal or higher role',
          },
          { status: 403 }
        );
      }

      // ห้าม assign role เกินตัวเอง
      if (getRoleHierarchy(newRole as UserRole) > getRoleHierarchy(currentRole)) {
        return NextResponse.json(
          { success: false, error: 'Cannot assign a role higher than your own' },
          { status: 403 }
        );
      }
    }

    const updatedUser = await prisma.user.update({
      where: { id: targetUserId },
      data: { role: newRole as UserRole },
      select: {
        id: true,
        email: true,
        name: true,
        firstName: true,
        lastName: true,
        role: true,
        status: true,
        isActive: true,
        emailVerified: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    console.log(
      `✅ Role updated: ${targetUser.email} → ${newRole} (by ${currentUser.email}${isSelf ? ' [self]' : ''})`
    );

    return NextResponse.json({
      success: true,
      data: { ...updatedUser, role: normalizeRole(updatedUser.role) },
      message: `อัปเดตตำแหน่ง${isSelf ? 'ของคุณ' : `ของ ${targetUser.name}`} เป็น ${newRole} สำเร็จ`,
    });
  } catch (error) {
    console.error('Admin update role error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}