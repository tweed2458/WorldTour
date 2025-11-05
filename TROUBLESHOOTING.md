# Guide de Dépannage - World Tour

## 🔧 Problèmes Courants et Solutions

### 1. Erreur "does not provide an export named 'getActiveHead'" (Frontend)

**Symptôme:**
```
does not provide an export named 'getActiveHead'
```
ou erreurs similaires au démarrage du frontend.

**Cause:** Incompatibilité de versions entre Nuxt et ses modules, ou cache corrompu.

**Solutions:**

#### Solution A : Utiliser le script de réinitialisation (Recommandé)

**Windows:**
```bash
# À la racine du projet
reset-frontend.bat
```

**macOS/Linux:**
```bash
# À la racine du projet
chmod +x reset-frontend.sh
./reset-frontend.sh
```

#### Solution B : Réinitialisation manuelle

```bash
cd apps/frontend

# Supprimer les caches et dépendances
rm -rf node_modules .nuxt .output dist package-lock.json

# Réinstaller avec les bonnes versions
npm install

# Démarrer
npm run dev
```

**Windows (PowerShell):**
```powershell
cd apps\frontend

# Supprimer les caches et dépendances
Remove-Item -Recurse -Force node_modules, .nuxt, .output, dist, package-lock.json -ErrorAction SilentlyContinue

# Réinstaller
npm install

# Démarrer
npm run dev
```

#### Solution C : Si le problème persiste

```bash
cd apps/frontend

# Nettoyer le cache npm
npm cache clean --force

# Supprimer tout
rm -rf node_modules .nuxt .output dist package-lock.json

# Réinstaller avec des versions fixes
npm install

# Si toujours problématique, forcer la réinstallation
npm install --force
```

---

### 2. Erreur "ERREUR: erreur de syntaxe sur ou près de « WITH »" lors de `db:migrate`

**Symptôme:**
```
Error: ERREUR: erreur de syntaxe sur ou près de « WITH »
```

**Cause:** Problème de compatibilité avec certaines versions de PostgreSQL ou configuration locale.

**Solutions:**

#### Solution A : Utiliser `db:push` (Recommandé pour le développement)

Au lieu d'utiliser `npm run db:migrate`, utilisez :

```bash
cd apps/backend

# Générer le client Prisma
npm run db:generate

# Synchroniser le schéma avec la base (sans créer de fichiers de migration)
npm run db:push

# Peupler la base avec des données de test
npm run db:seed
```

**Avantages de `db:push`:**
- Plus rapide pour le développement
- Pas de fichiers de migration à gérer
- Fonctionne avec toutes les versions de PostgreSQL

#### Solution B : Vérifier la version de PostgreSQL

```bash
# Vérifier la version
psql --version

# Doit être PostgreSQL 12+ pour de meilleures performances
```

Si vous avez une version ancienne :
- Mettez à jour PostgreSQL vers la version 14 ou plus récente
- Ou continuez avec `db:push`

#### Solution C : Réinitialiser complètement la base de données

```bash
cd apps/backend

# Supprimer la base et recréer
psql -U postgres -c "DROP DATABASE IF EXISTS worldtour;"
psql -U postgres -c "CREATE DATABASE worldtour;"

# Puis utiliser db:push
npm run db:generate
npm run db:push
npm run db:seed
```

---

### 3. Erreur de connexion à PostgreSQL

**Symptôme:**
```
Error: Can't reach database server at localhost:5432
```

**Solutions:**

1. **Vérifier que PostgreSQL est démarré:**

   **Windows:**
   ```bash
   # Dans Services, vérifier que "PostgreSQL" est démarré
   # Ou via ligne de commande (Administrateur)
   net start postgresql-x64-14
   ```

   **macOS:**
   ```bash
   brew services start postgresql@14
   ```

   **Linux:**
   ```bash
   sudo systemctl start postgresql
   sudo systemctl status postgresql
   ```

2. **Vérifier les identifiants dans `.env`:**

   ```env
   # apps/backend/.env
   DATABASE_URL="postgresql://VOTRE_USER:VOTRE_PASSWORD@localhost:5432/worldtour?schema=public"
   ```

   Remplacez `VOTRE_USER` et `VOTRE_PASSWORD` par vos vrais identifiants PostgreSQL.

3. **Vérifier que la base de données existe:**

   ```bash
   psql -U postgres -l | grep worldtour

   # Si elle n'existe pas, créez-la
   psql -U postgres -c "CREATE DATABASE worldtour;"
   ```

---

### 3. Erreur "Cannot find module" ou dépendances manquantes

**Solutions:**

```bash
# Supprimer tous les node_modules
rm -rf node_modules
rm -rf apps/frontend/node_modules
rm -rf apps/backend/node_modules

# Supprimer les lock files
rm package-lock.json
rm apps/frontend/package-lock.json
rm apps/backend/package-lock.json

# Réinstaller tout
npm install
cd apps/frontend && npm install && cd ../..
cd apps/backend && npm install && cd ../..
```

---

### 4. Le frontend ne se connecte pas au backend

**Symptôme:** Les données ne s'affichent pas, erreurs CORS ou 404

**Solutions:**

1. **Vérifier que le backend est démarré:**
   ```bash
   # Le backend doit tourner sur le port 3001
   curl http://localhost:3001/health
   # Doit retourner: {"status":"ok",...}
   ```

2. **Vérifier la configuration frontend:**
   ```bash
   # apps/frontend/.env
   NUXT_PUBLIC_API_BASE=http://localhost:3001/api
   ```

3. **Redémarrer les deux serveurs:**
   ```bash
   # Terminal 1 - Backend
   cd apps/backend
   npm run dev

   # Terminal 2 - Frontend
   cd apps/frontend
   npm run dev
   ```

---

### 5. Erreur Prisma Client après modification du schéma

**Symptôme:**
```
Invalid `prisma.user.findUnique()` invocation
```

**Solution:**

```bash
cd apps/backend

# Régénérer le client Prisma
npm run db:generate

# Puis pousser le nouveau schéma
npm run db:push
```

---

### 6. Port 3000 ou 3001 déjà utilisé

**Symptôme:**
```
Error: Port 3000 is already in use
```

**Solutions:**

1. **Trouver et tuer le processus:**

   **Windows:**
   ```bash
   netstat -ano | findstr :3000
   taskkill /PID <PID> /F
   ```

   **macOS/Linux:**
   ```bash
   lsof -ti:3000 | xargs kill -9
   lsof -ti:3001 | xargs kill -9
   ```

2. **Ou changer le port:**
   ```bash
   # Frontend
   PORT=3002 npm run dev

   # Backend - modifier apps/backend/.env
   PORT=3003
   ```

---

### 7. Mot de passe bcrypt du test user ne fonctionne pas

Si vous ne pouvez pas vous connecter avec le compte de test, générez un nouveau hash :

```bash
# Dans Node.js REPL
node
> const bcrypt = require('bcrypt')
> bcrypt.hash('password123', 10).then(console.log)
# Copiez le hash généré
```

Puis modifiez `apps/backend/src/seed.ts` avec le nouveau hash.

---

### 8. Prisma Studio pour déboguer

Pour visualiser et modifier les données facilement :

```bash
cd apps/backend
npm run db:studio
```

Cela ouvre une interface web sur `http://localhost:5555` pour gérer vos données.

---

### 9. Réinitialiser complètement le projet

Si rien ne fonctionne, voici comment tout réinitialiser :

```bash
# 1. Supprimer tous les node_modules et builds
rm -rf node_modules apps/*/node_modules apps/*/.nuxt apps/*/dist

# 2. Supprimer la base de données
psql -U postgres -c "DROP DATABASE IF EXISTS worldtour;"
psql -U postgres -c "CREATE DATABASE worldtour;"

# 3. Réinstaller
npm install

# 4. Backend
cd apps/backend
npm run db:generate
npm run db:push
npm run db:seed

# 5. Tester
npm run dev
```

---

### 10. Erreurs TypeScript dans le frontend

**Solution:**

```bash
cd apps/frontend

# Supprimer le cache Nuxt
rm -rf .nuxt

# Redémarrer
npm run dev
```

---

## 📝 Commandes Utiles

### Backend
```bash
cd apps/backend

npm run dev              # Démarrer en mode développement
npm run db:generate      # Générer le client Prisma
npm run db:push          # Synchroniser le schéma (développement)
npm run db:migrate       # Créer des migrations (production)
npm run db:seed          # Peupler avec des données de test
npm run db:reset         # Réinitialiser la base complètement
npm run db:studio        # Ouvrir Prisma Studio
```

### Frontend
```bash
cd apps/frontend

npm run dev              # Démarrer en mode développement
npm run build            # Build pour production
npm run preview          # Prévisualiser le build
```

### Monorepo
```bash
npm run dev              # Démarrer frontend ET backend simultanément
```

---

## 🆘 Besoin d'aide supplémentaire ?

1. Vérifier les logs détaillés dans le terminal
2. Consulter la documentation Prisma : https://www.prisma.io/docs
3. Consulter la documentation Nuxt : https://nuxt.com/docs
4. Vérifier les issues GitHub du projet

---

## ✅ Checklist de vérification

Avant de demander de l'aide, vérifiez :

- [ ] PostgreSQL est installé et démarré
- [ ] La base de données `worldtour` existe
- [ ] Le fichier `.env` est configuré correctement dans `apps/backend`
- [ ] Les dépendances sont installées (`npm install`)
- [ ] Le client Prisma est généré (`npm run db:generate`)
- [ ] Le schéma est synchronisé (`npm run db:push`)
- [ ] Les données de test sont chargées (`npm run db:seed`)
- [ ] Le backend démarre sans erreur sur le port 3001
- [ ] Le frontend démarre sans erreur sur le port 3000
