import { SocialPlatform } from '@prisma/client';
import { NextResponse } from 'next/server';

import { getCurrentUser } from '@/lib/jwt';
import prisma from '@/lib/prisma';

interface ISocialProfileInput {
  platform: SocialPlatform;
  value: string | null;
}

export async function GET() {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const profiles = await prisma.userSocialProfile.findMany({
      where: { userId: user.id },
      select: {
        platform: true,
        username: true,
        url: true,
      },
    });

    return NextResponse.json({ profiles });
  } catch (error) {
    console.error('Error fetching social profiles:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function PATCH(request: Request) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { profiles } = (await request.json()) as {
      profiles: ISocialProfileInput[];
    };

    if (!Array.isArray(profiles)) {
      return NextResponse.json(
        { error: 'Invalid profiles format' },
        { status: 400 }
      );
    }

    // Vérifier que toutes les plateformes sont valides
    const platformValues = Object.values(SocialPlatform);
    const invalidPlatforms = profiles.filter(
      p => !platformValues.includes(p.platform)
    );
    if (invalidPlatforms.length > 0) {
      return NextResponse.json(
        {
          error: 'Invalid platforms',
          platforms: invalidPlatforms.map(p => p.platform),
        },
        { status: 400 }
      );
    }

    // Traiter toutes les mises à jour en une seule transaction
    const result = await prisma.$transaction(async tx => {
      // 1. Supprimer les profils avec une valeur nulle ou vide
      const profilesToDelete = profiles.filter(
        p => p.value === null || p.value === ''
      );
      if (profilesToDelete.length > 0) {
        await tx.userSocialProfile.deleteMany({
          where: {
            userId: user.id,
            platform: {
              in: profilesToDelete.map(p => p.platform),
            },
          },
        });
      }

      // 2. Mettre à jour ou créer les profils avec une valeur
      const profilesToUpdate = profiles.filter(
        (p): p is { platform: SocialPlatform; value: string } => !!p.value
      );
      for (const profile of profilesToUpdate) {
        await tx.userSocialProfile.upsert({
          where: {
            userId_platform: {
              userId: user.id,
              platform: profile.platform,
            },
          },
          update: {
            username: profile.value,
            url: profile.value.startsWith('http') ? profile.value : null,
          },
          create: {
            userId: user.id,
            platform: profile.platform,
            username: profile.value,
            url: profile.value.startsWith('http') ? profile.value : null,
          },
        });
      }

      // 3. Récupérer la liste mise à jour
      return tx.userSocialProfile.findMany({
        where: { userId: user.id },
        select: {
          platform: true,
          username: true,
          url: true,
        },
      });
    });

    return NextResponse.json({ profiles: result });
  } catch (error) {
    console.error('Error updating social profiles:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
