#!/bin/bash

echo "🔍 Vérification du déploiement..."

# Vérifier si le dossier dist existe
echo -e "\n📁 Vérification des dossiers de build..."
if [ -d "packages/backend/dist" ]; then
    echo "✅ Le dossier backend/dist existe"
    echo "Contenu de dist:"
    ls -la packages/backend/dist
else
    echo "❌ Le dossier backend/dist n'existe pas"
fi

# Vérifier le déploiement Vercel
echo -e "\n🚀 Vérification du déploiement Vercel..."
vercel ls

# Vérifier les fonctions serverless
echo -e "\n⚡ Vérification des fonctions serverless..."
vercel inspect --timeout 30

# Afficher les logs récents
echo -e "\n📝 Derniers logs du déploiement..."
vercel logs

echo -e "\n✨ Vérification terminée"
