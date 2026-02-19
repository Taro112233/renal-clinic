// app/api/profile/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';
import { normalizeRole } from '@/lib/auth-helpers';
import type { UserRole } from '@prisma/client';

interface BetterAuthUser {
  id: string;
  email: string;
  name: string;
  role?: 'USER' | 'ADMIN' | 'SUPERADMIN';
  firstName?: string;
  lastName?: string;
  phone?: string;
  image?: string;
}

const UpdateProfileSchema = z.object({
  firstName: z.string().min(1, 'กรุณากรอกชื่อ').max(100),
  lastName: z.string().min(1, 'กรุณากรอกนามสกุล').max(100),
  phone: z.string().max(20).optional(),
});

// GET /api/profile - Get current user profile
export async function GET(request: NextRequest) {
  try {
    const session = await auth.api.getSession({
      headers: request.headers,
    });
    
    if (!session?.user) {
      return NextResponse.json(
        { success: false, error: 'Authentication required' },
        { status: 401 }
      );
    }

    const betterAuthUser = session.user as BetterAuthUser;
    
    const user = await prisma.user.findUnique({
      where: { id: betterAuthUser.id },
      select: {
        id: true,
        email: true,
        name: true,
        firstName: true,
        lastName: true,
        phone: true,
        image: true,
        role: true,
        status: true,
        isActive: true,
        emailVerified: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    if (!user) {
      return NextResponse.json(
        { success: false, error: 'User not found' },
        { status: 404 }
      );
    }

    // Normalize role to ensure type safety
    const normalizedUser = {
      ...user,
      role: normalizeRole(user.role) as UserRole,
    };

    return NextResponse.json({
      success: true,
      data: normalizedUser,
    });
    
  } catch (error) {
    console.error('Get profile error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// PATCH /api/profile - Update user profile
export async function PATCH(request: NextRequest) {
  try {
    const session = await auth.api.getSession({
      headers: request.headers,
    });
    
    if (!session?.user) {
      return NextResponse.json(
        { success: false, error: 'Authentication required' },
        { status: 401 }
      );
    }

    const betterAuthUser = session.user as BetterAuthUser;
    const body = await request.json();
    
    const validation = UpdateProfileSchema.safeParse(body);
    
    if (!validation.success) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Invalid input data',
          details: validation.error.issues.map(err => ({
            field: err.path.join('.'),
            message: err.message,
          })),
        },
        { status: 400 }
      );
    }

    const { firstName, lastName, phone } = validation.data;

    // Update name field to match Better Auth convention
    const fullName = `${firstName} ${lastName}`;

    const updatedUser = await prisma.user.update({
      where: { id: betterAuthUser.id },
      data: {
        firstName,
        lastName,
        phone: phone || null,
        name: fullName, // Update Better Auth name field
      },
      select: {
        id: true,
        email: true,
        name: true,
        firstName: true,
        lastName: true,
        phone: true,
        image: true,
        role: true,
        status: true,
        isActive: true,
        emailVerified: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    // Normalize role
    const normalizedUser = {
      ...updatedUser,
      role: normalizeRole(updatedUser.role) as UserRole,
    };

    console.log(`✅ Profile updated for user: ${betterAuthUser.id}`);

    return NextResponse.json({
      success: true,
      data: normalizedUser,
      message: 'อัปเดตข้อมูลสำเร็จ',
    });
    
  } catch (error) {
    console.error('Update profile error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}