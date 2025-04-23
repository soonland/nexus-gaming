/* eslint-disable no-console */
import { PrismaClient, Role } from '@prisma/client';
import { hash } from 'bcrypt';
const prisma = new PrismaClient();

const SALT_ROUNDS = 10;

export const seedEditorial = async () => {
  try {
    // Create test users for each editorial role if they don't exist
    const users = [
      {
        username: 'senior_editor',
        email: 'senior.editor@nx-gaming.com',
        role: Role.SENIOR_EDITOR,
      },
      {
        username: 'editor1',
        email: 'editor1@nx-gaming.com',
        role: Role.EDITOR,
      },
      {
        username: 'editor2',
        email: 'editor2@nx-gaming.com',
        role: Role.EDITOR,
      },
      {
        username: 'moderator',
        email: 'moderator@nx-gaming.com',
        role: Role.MODERATOR,
      },
    ];

    for (const user of users) {
      const existingUser = await prisma.user.findFirst({
        where: { email: user.email },
      });

      if (!existingUser) {
        const hashedPassword = await hash('Test123!@#', SALT_ROUNDS);
        await prisma.user.create({
          data: {
            ...user,
            password: hashedPassword,
            isActive: true,
          },
        });
        console.log(`✅ Created ${user.role} user: ${user.username}`);
      } else {
        console.log(`ℹ️ ${user.role} user already exists: ${user.username}`);
      }
    }
  } catch (error) {
    console.error('Error seeding editorial team:', error);
    throw error;
  }
};
