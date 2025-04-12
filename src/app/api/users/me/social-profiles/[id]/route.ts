import { NextResponse } from 'next/server';

import { getCurrentUser } from '@/lib/jwt';
import prisma from '@/lib/prisma';
import { cleanUsername, generatePlatformUrl } from '@/lib/social';
import type { IUserSocialProfileData } from '@/types/social';

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const user = await getCurrentUser();
  if (!user) {
    return new NextResponse('Unauthorized', { status: 401 });
  }

  const { id } = await params;
  if (!id) {
    return new NextResponse('Profile ID is required', { status: 400 });
  }
  try {
    const body: IUserSocialProfileData = await request.json();
    const cleanedUsername = cleanUsername(body.username);

    const profile = await prisma.userSocialProfile.findFirst({
      where: {
        id,
        userId: user.id,
      },
    });

    if (!profile) {
      return new NextResponse('Profile not found', { status: 404 });
    }

    const existingProfile = await prisma.userSocialProfile.findFirst({
      where: {
        userId: user.id,
        platform: body.platform,
        id: { not: id },
      },
    });

    if (existingProfile) {
      return new NextResponse('Profile already exists for this platform', {
        status: 400,
      });
    }

    const updatedProfile = await prisma.userSocialProfile.update({
      where: { id },
      data: {
        platform: body.platform,
        username: cleanedUsername,
        url: generatePlatformUrl(body.platform, cleanedUsername),
      },
    });

    return NextResponse.json(updatedProfile);
  } catch (error) {
    console.error('Error updating social profile:', error);
    return new NextResponse('Internal server error', { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const user = await getCurrentUser();
  if (!user) {
    return new NextResponse('Unauthorized', { status: 401 });
  }

  try {
    const profile = await prisma.userSocialProfile.findFirst({
      where: {
        id,
        userId: user.id,
      },
    });

    if (!profile) {
      return new NextResponse('Profile not found', { status: 404 });
    }

    await prisma.userSocialProfile.delete({
      where: { id },
    });

    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error('Error deleting social profile:', error);
    return new NextResponse('Internal server error', { status: 500 });
  }
}
