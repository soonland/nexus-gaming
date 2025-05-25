import { type NextRequest, NextResponse } from 'next/server';

import { getCurrentUser } from '@/lib/jwt';
import { canToggleUserStatus } from '@/lib/permissions';
import prisma from '@/lib/prisma';

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const tokenUser = await getCurrentUser();
    if (!tokenUser) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { isActive } = await request.json();

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

    // Vérifier les permissions
    if (!canToggleUserStatus(tokenUser.role, tokenUser.id, targetUser)) {
      return NextResponse.json(
        { error: 'Permission refusée' },
        { status: 403 }
      );
    }

    // Si c'est une désactivation initiée par l'utilisateur lui-même (pas un admin)
    const isAdmin = ['ADMIN', 'SYSADMIN'].includes(tokenUser.role);
    const isSelfDeactivation = !isActive && tokenUser.id === targetUser.id;

    if (isSelfDeactivation && !isAdmin) {
      const deactivationDate = new Date();
      const updatedUser = await prisma.user.update({
        where: { id },
        data: {
          deactivationRequestedAt: deactivationDate,
        },
      });

      // Calculer la date effective de désactivation (7 jours plus tard)
      const effectiveDate = new Date(deactivationDate);
      effectiveDate.setDate(effectiveDate.getDate() + 7);

      return NextResponse.json({
        success: true,
        message: 'Demande de désactivation enregistrée',
        deactivationEffectiveDate: effectiveDate.toISOString(),
        user: updatedUser,
      });
    }

    // Si c'est une activation/désactivation par un admin ou une activation par l'utilisateur
    const updatedUser = await prisma.user.update({
      where: { id },
      data: {
        isActive,
        deactivationRequestedAt: null, // Réinitialiser en cas d'activation
      },
    });

    return NextResponse.json({
      success: true,
      message: isActive ? 'Compte activé' : 'Compte désactivé',
      user: updatedUser,
    });
  } catch (error) {
    console.error('Error updating user status:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la mise à jour du statut' },
      { status: 500 }
    );
  }
}
