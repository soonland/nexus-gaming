import { type NextRequest, NextResponse } from 'next/server';

import { authenticateToken } from '@/lib/auth';
import { canToggleUserStatus } from '@/lib/permissions';
import prisma from '@/lib/prisma';

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await authenticateToken(request);
    if (!session?.user) {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
    }
    const { id } = await params;

    // Récupérer l'utilisateur cible
    const targetUser = await prisma.user.findUnique({
      where: { id },
    });

    if (!targetUser) {
      return NextResponse.json(
        { error: 'Utilisateur non trouvé' },
        { status: 404 }
      );
    }

    // Vérifier que l'utilisateur est en cours de désactivation
    if (!targetUser.deactivationRequestedAt) {
      return NextResponse.json(
        { error: 'Aucune désactivation en cours' },
        { status: 400 }
      );
    }

    // Vérifier les permissions
    if (!canToggleUserStatus(session.user.role, session.user.id, targetUser)) {
      return NextResponse.json(
        { error: 'Permission refusée' },
        { status: 403 }
      );
    }

    // Annuler la désactivation
    const updatedUser = await prisma.user.update({
      where: { id },
      data: {
        deactivationRequestedAt: null,
      },
    });

    return NextResponse.json({
      success: true,
      message: 'Désactivation annulée',
      user: updatedUser,
    });
  } catch (error) {
    console.error('Error canceling deactivation:', error);
    return NextResponse.json(
      { error: "Erreur lors de l'annulation de la désactivation" },
      { status: 500 }
    );
  }
}
