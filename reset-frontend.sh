#!/bin/bash

echo "============================================"
echo " Nettoyage complet du frontend"
echo "============================================"
echo ""

cd apps/frontend

echo "[1/5] Suppression des caches npm..."
npm cache clean --force

echo "[2/5] Suppression des fichiers de cache et build..."
rm -rf node_modules
rm -rf .nuxt
rm -rf .output
rm -rf dist
rm -rf .cache
rm -f package-lock.json

echo "[3/5] Suppression du dossier Nuxt global (si existe)..."
rm -rf ~/.nuxt

echo "[4/5] Installation des dépendances (cela peut prendre quelques minutes)..."
npm install --force

echo "[5/5] Préparation de Nuxt..."
npm run postinstall

echo ""
echo "============================================"
echo " Frontend réinitialisé avec succès!"
echo "============================================"
echo ""
echo "Pour démarrer le frontend:"
echo "  cd apps/frontend"
echo "  npm run dev"
echo ""
