import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

async function main() {
  console.log("🧹 Nettoyage de la base de données...")

  // 1. Supprimer les articles
  await prisma.article.deleteMany()
  console.log("✓ Articles supprimés")

  // 2. Supprimer les jeux
  await prisma.game.deleteMany()
  console.log("✓ Jeux supprimés")

  // 3. Supprimer les plateformes
  await prisma.platform.deleteMany()
  console.log("✓ Plateformes supprimées")

  // 4. Supprimer les catégories
  await prisma.category.deleteMany()
  console.log("✓ Catégories supprimées")

  // 5. Supprimer les entreprises
  await prisma.company.deleteMany()
  console.log("✓ Entreprises supprimées")

  // 6. Supprimer les utilisateurs
  await prisma.user.deleteMany()
  console.log("✓ Utilisateurs supprimés")

  console.log("✨ Base de données nettoyée avec succès")
}

main()
  .catch((e) => {
    console.error("Erreur lors du nettoyage:", e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
