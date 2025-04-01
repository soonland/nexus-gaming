#!/bin/bash

#!/bin/bash

URL=$(vercel ls --prod | grep nexus-gaming | awk '{print $2}')

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

# Test de la route health
echo -e "\n🏥 Test de la route health check..."
HEALTH_CHECK=$(curl -s "${URL}/api/health")
if [[ $HEALTH_CHECK == *"status"* ]]; then
    echo "✅ Route health check OK:"
    echo $HEALTH_CHECK
else
    echo "❌ Route health check failed"
    echo $HEALTH_CHECK
fi

# Vérifier la documentation Swagger
echo -e "\n📚 Test de la documentation Swagger..."
SWAGGER_CHECK=$(curl -s "${URL}/api/documentation")
if [[ $SWAGGER_CHECK == *"swagger"* ]]; then
    echo "✅ Documentation Swagger accessible"
else
    echo "❌ Documentation Swagger non accessible"
fi

# Vérifier les fonctions serverless
echo -e "\n⚡ Vérification des fonctions serverless..."
vercel inspect --timeout 30

# Afficher les logs récents
echo -e "\n📝 Derniers logs du déploiement..."
vercel logs

echo -e "\n✨ Vérification terminée"
