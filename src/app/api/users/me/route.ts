import { hash } from 'bcryptjs';
import { NextResponse } from 'next/server';

import { getCurrentUser } from '@/lib/jwt';
import { comparePassword } from '@/lib/password';
import prisma from '@/lib/prisma';

interface IUpdateProfileBody {
  username?: string;
  email?: string;
  currentPassword?: string;
  newPassword?: string;
}

export async function PUT(request: Request) {
  try {
    // Vérifier l'authentification
    const currentUser = await getCurrentUser();
    if (!currentUser) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Récupérer l'utilisateur complet depuis la base de données
    const user = await prisma.user.findUnique({
      where: { id: currentUser.id },
      select: {
        id: true,
        username: true,
        email: true,
        password: true,
      },
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const body = (await request.json()) as IUpdateProfileBody;
    const updateData: Record<string, unknown> = {};

    // Vérifier si le username est déjà pris
    if (body.username && body.username !== user.username) {
      const existingUser = await prisma.user.findUnique({
        where: { username: body.username },
      });
      if (existingUser) {
        return NextResponse.json(
          { error: "Ce nom d'utilisateur est déjà pris" },
          { status: 400 }
        );
      }
      updateData.username = body.username;
    }

    // Vérifier si l'email est déjà pris
    if (body.email && body.email !== user.email) {
      const existingUser = await prisma.user.findUnique({
        where: { email: body.email },
      });
      if (existingUser) {
        return NextResponse.json(
          { error: 'Cet email est déjà utilisé' },
          { status: 400 }
        );
      }
      updateData.email = body.email;
    }

    // Gérer le changement de mot de passe
    if (body.currentPassword && body.newPassword) {
      const validPassword = await comparePassword(
        body.currentPassword,
        user.password
      );

      if (!validPassword) {
        return NextResponse.json(
          { error: 'Mot de passe actuel incorrect' },
          { status: 400 }
        );
      }

      updateData.password = await hash(body.newPassword, 12);
      updateData.lastPasswordChange = new Date();
    }

    // Si rien à mettre à jour
    if (Object.keys(updateData).length === 0) {
      return NextResponse.json({ message: 'No changes to apply' });
    }

    // Mettre à jour l'utilisateur
    const updatedUser = await prisma.user.update({
      where: { id: user.id },
      data: updateData,
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
    console.error('Error updating user profile:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
