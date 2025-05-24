import { v2 as cloudinary } from 'cloudinary';
import { NextResponse } from 'next/server';

import { cloudinaryConfig } from '@/lib/cloudinary';
import { getPublicIdFromUrl } from '@/lib/cloudinary';
import { getCurrentUser } from '@/lib/jwt';
import prisma from '@/lib/prisma';
import { deleteImageServer } from '@/lib/upload/server';

cloudinary.config(cloudinaryConfig);

export async function DELETE() {
  try {
    const currentUser = await getCurrentUser();
    if (!currentUser) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { id: currentUser.id },
      select: {
        id: true,
        avatarUrl: true,
      },
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Supprimer l'avatar dans Cloudinary s'il existe
    if (user.avatarUrl) {
      const publicId = getPublicIdFromUrl(user.avatarUrl);
      if (publicId) {
        try {
          await deleteImageServer(publicId);
        } catch (error) {
          console.error('Error deleting avatar:', error);
        }
      }
    }

    // Mettre à jour l'utilisateur sans avatar
    await prisma.user.update({
      where: { id: user.id },
      data: { avatarUrl: null },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting avatar:', error);
    return NextResponse.json(
      { error: "Une erreur s'est produite" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    // Vérifier l'authentification
    const currentUser = await getCurrentUser();
    if (!currentUser) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Récupérer l'utilisateur complet avec l'ancien avatar
    const user = await prisma.user.findUnique({
      where: { id: currentUser.id },
      select: {
        id: true,
        avatarUrl: true,
      },
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Récupérer l'URL de l'avatar depuis le body
    const { avatarUrl } = await request.json();
    if (!avatarUrl) {
      return NextResponse.json(
        { error: 'Avatar URL is required' },
        { status: 400 }
      );
    }

    // Supprimer l'ancien avatar s'il existe
    if (user.avatarUrl) {
      const publicId = getPublicIdFromUrl(user.avatarUrl);
      if (publicId) {
        try {
          await deleteImageServer(publicId);
        } catch (error) {
          console.error('Error deleting old avatar:', error);
          // On continue malgré l'erreur de suppression
        }
      }
    }

    // Mettre à jour l'avatar de l'utilisateur
    const updatedUser = await prisma.user.update({
      where: { id: user.id },
      data: { avatarUrl },
      select: {
        id: true,
        username: true,
        email: true,
        avatarUrl: true,
        role: true,
      },
    });

    return NextResponse.json({ user: updatedUser });
  } catch (error) {
    console.error('Error updating avatar:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
