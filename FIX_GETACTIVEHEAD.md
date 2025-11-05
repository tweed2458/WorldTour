# Fix pour l'erreur "getActiveHead" - Guide Rapide

## 🔴 Problème
```
/node_modules/unhead/dist/index.mjs?v=ea4ac053' does not provide an export named 'getActiveHead'
```

## ✅ Solution Appliquée

### Changements effectués :

1. **Remplacement de @nuxt/icon par nuxt-icon** (plus stable)
2. **Mise à jour de Nuxt vers 3.14.159** (dernière version stable)
3. **Ajout de overrides pour unhead** (forcer versions compatibles)
4. **Amélioration du script de reset** (nettoyage plus complet)

## 🚀 Comment Appliquer le Fix

### Étape 1 : Récupérer les derniers changements

```bash
git pull origin claude/universal-museum-guide-app-011CUpuwzfd9Z96NZDzt2g8o
```

### Étape 2 : Lancer le script de nettoyage complet

**Sur Windows (PowerShell ou CMD):**
```cmd
reset-frontend.bat
```

**Sur macOS/Linux:**
```bash
chmod +x reset-frontend.sh
./reset-frontend.sh
```

### Étape 3 : Démarrer le frontend

```bash
cd apps\frontend
npm run dev
```

## 📝 Que fait le script de reset ?

Le script effectue un nettoyage complet :

1. ✅ Nettoie le cache npm
2. ✅ Supprime node_modules, .nuxt, .output, dist, .cache
3. ✅ Supprime le cache global Nuxt (~/.nuxt)
4. ✅ Réinstalle toutes les dépendances avec `--force`
5. ✅ Prépare Nuxt avec `nuxt prepare`

## 🔧 Si le problème persiste

### Option 1 : Nettoyage manuel ultra-complet (Windows)

```cmd
cd apps\frontend

# Nettoyer le cache npm
npm cache clean --force

# Supprimer TOUT
rmdir /s /q node_modules
rmdir /s /q .nuxt
rmdir /s /q .output
rmdir /s /q dist
rmdir /s /q .cache
del /f package-lock.json

# Supprimer le cache global Nuxt
rmdir /s /q %USERPROFILE%\.nuxt

# Réinstaller
npm install --force

# Préparer
npm run postinstall

# Démarrer
npm run dev
```

### Option 2 : Vérifier les versions installées

```bash
cd apps\frontend
npm list nuxt nuxt-icon @nuxtjs/i18n unhead
```

Vous devriez voir :
- nuxt@3.14.159
- nuxt-icon@0.6.10
- @nuxtjs/i18n@8.5.5
- unhead@1.11.7

### Option 3 : Supprimer le lock file et node_modules à la racine

Parfois, le problème vient du monorepo :

```bash
# À la racine du projet
del package-lock.json
rmdir /s /q node_modules

# Réinstaller tout
npm install

# Puis réinstaller le frontend
cd apps\frontend
npm install --force
```

## 🆘 Dépannage avancé

### Erreur : "Cannot find module 'nuxt-icon'"

Si vous voyez cette erreur, c'est que nuxt-icon n'est pas installé correctement :

```bash
cd apps\frontend
npm install nuxt-icon --force
```

### Erreur : "Module not found: Can't resolve 'unhead'"

Ajoutez unhead manuellement :

```bash
cd apps\frontend
npm install unhead@1.11.7 @unhead/vue@1.11.7 --force
```

### Le serveur démarre mais affiche des erreurs dans le navigateur

1. Videz le cache du navigateur (Ctrl + Shift + Delete)
2. Redémarrez le serveur
3. Ouvrez en navigation privée

### Vérifier que Icon fonctionne

Dans n'importe quel composant, essayez :

```vue
<template>
  <Icon name="mdi:home" />
</template>
```

Si ça s'affiche, Icon fonctionne !

## 📚 Différences entre @nuxt/icon et nuxt-icon

| Fonctionnalité | @nuxt/icon | nuxt-icon |
|---------------|-----------|-----------|
| Stabilité | ⚠️ Problèmes avec unhead | ✅ Stable |
| API | Identique | Identique |
| Performance | Similaire | Similaire |
| Compatibilité | Issues avec Nuxt 3.13+ | ✅ Compatible |

**Bonne nouvelle** : L'API est identique, donc aucun changement de code nécessaire !

## ✅ Checklist de vérification

Avant de démarrer :

- [ ] J'ai exécuté `git pull` pour récupérer les derniers changements
- [ ] J'ai exécuté `reset-frontend.bat` (ou `.sh`)
- [ ] Le script s'est terminé sans erreur
- [ ] J'ai vérifié que nuxt-icon est installé (`npm list nuxt-icon`)
- [ ] J'ai démarré avec `npm run dev`
- [ ] Le serveur démarre sans erreur "getActiveHead"

## 🎉 Tout fonctionne ?

Si tout est OK, vous devriez voir :

```
Nuxt 3.14.159 with Nitro 2.x.x

  ➜ Local:    http://localhost:3000/
  ➜ Network:  http://192.168.x.x:3000/

✔ Vite server built in XXXms
✔ Nuxt Nitro server built in XXXms
```

Accédez à http://localhost:3000 et profitez ! 🚀

---

**Note** : Si vous continuez à avoir des problèmes, partagez le message d'erreur complet pour un diagnostic plus précis.
