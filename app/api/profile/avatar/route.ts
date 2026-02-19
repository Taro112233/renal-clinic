// app/api/profile/avatar/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { validateFile } from '@/lib/file-validation';

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

export async function POST(request: NextRequest) {
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
    
    let formData: FormData;
    try {
      formData = await request.formData();
    } catch {
      return NextResponse.json(
        { success: false, error: 'Invalid form data' },
        { status: 400 }
      );
    }
    
    const file = formData.get('avatar') as File;
    
    if (!file) {
      return NextResponse.json(
        { success: false, error: 'No file provided' },
        { status: 400 }
      );
    }

    // Validate file
    const validation = validateFile(file);
    if (!validation.isValid) {
      return NextResponse.json(
        { success: false, error: validation.error },
        { status: 400 }
      );
    }

    // Only allow images
    if (!file.type.startsWith('image/')) {
      return NextResponse.json(
        { success: false, error: 'รองรับเฉพาะไฟล์รูปภาพ' },
        { status: 400 }
      );
    }

    // Upload to Vercel Blob
    const { put } = await import('@vercel/blob');
    
    const timestamp = Date.now();
    const path = `avatars/${betterAuthUser.id}/${timestamp}-avatar.${file.type.split('/')[1]}`;
    
    const blob = await put(path, file, {
      access: 'public',
      addRandomSuffix: false,
    });

    // Update user image
    const updatedUser = await prisma.user.update({
      where: { id: betterAuthUser.id },
      data: { image: blob.url },
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

    console.log(`✅ Avatar updated for user: ${betterAuthUser.id}`);

    return NextResponse.json({
      success: true,
      data: updatedUser,
      message: 'อัปเดตรูปโปรไฟล์สำเร็จ',
    });
    
  } catch (error) {
    console.error('Avatar upload error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}