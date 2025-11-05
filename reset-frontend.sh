#!/bin/bash

echo "🧹 Nettoyage du frontend..."

cd apps/frontend

# Supprimer les fichiers de cache et build
rm -rf node_modules
rm -rf .nuxt
rm -rf .output
rm -rf dist
rm -f package-lock.json

echo "📦 Installation des dépendances avec les bonnes versions..."

# Installer les dépendances
npm install

echo "✅ Frontend réinitialisé avec succès!"
echo ""
echo "Pour démarrer le frontend:"
echo "  cd apps/frontend"
echo "  npm run dev"
