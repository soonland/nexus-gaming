import { hash } from 'bcryptjs';
import { NextResponse } from 'next/server';
import { z } from 'zod';

import prisma from '@/lib/prisma';

const registerSchema = z.object({
  email: z.string().email(),
  username: z.string().min(3),
  password: z.string().min(8),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const validatedData = registerSchema.parse(body);

    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [
          { email: validatedData.email },
          { username: validatedData.username },
        ],
      },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: "Email ou nom d'utilisateur déjà utilisé" },
        { status: 400 }
      );
    }

    const hashedPassword = await hash(validatedData.password, 12);

    const user = await prisma.$transaction(async tx => {
      // Create user
      const newUser = await tx.user.create({
        data: {
          email: validatedData.email,
          username: validatedData.username,
          password: hashedPassword,
          role: 'USER',
          isActive: true,
        },
      });

      // Create default system alert preferences
      await tx.notificationPreference.create({
        data: {
          userId: newUser.id,
          type: 'SYSTEM_ALERT',
          email: false,
          inApp: true, // System alerts always enabled for in-app
        },
      });

      // Create welcome notification
      await tx.systemNotification.create({
        data: {
          userId: newUser.id,
          type: 'SYSTEM_ALERT',
          level: 'info',
          title: 'Bienvenue sur Nexus Gaming',
          message: 'Nous sommes ravis de vous compter parmi nous !',
        },
      });

      return newUser;
    });

    return NextResponse.json(
      {
        data: {
          id: user.id,
          email: user.email,
          username: user.username,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation error', details: error.errors },
        { status: 400 }
      );
    }

    console.error('Error creating user:', error);
    return NextResponse.json(
      { error: 'Une erreur est survenue lors de la création du compte' },
      { status: 500 }
    );
  }
}
