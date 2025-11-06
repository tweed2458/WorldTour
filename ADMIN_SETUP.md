# 🛡️ World Tour - Guide de Configuration Admin

Guide complet pour installer et utiliser le panneau d'administration de World Tour.

## 📋 Table des matières

1. [Prérequis](#prérequis)
2. [Installation](#installation)
3. [Configuration de la base de données](#configuration-de-la-base-de-données)
4. [Démarrage](#démarrage)
5. [Utilisation](#utilisation)
6. [Comptes admin de test](#comptes-admin-de-test)
7. [Troubleshooting](#troubleshooting)

---

## Prérequis

Avant de commencer, assurez-vous d'avoir :

- ✅ Node.js 18+ installé
- ✅ PostgreSQL installé et en cours d'exécution
- ✅ Les applications frontend et backend déjà configurées

Si ce n'est pas encore fait, consultez d'abord [SETUP.md](./SETUP.md) pour l'installation de base.

---

## Installation

### Étape 1 : Installation des dépendances

Depuis la racine du projet :

```bash
# Installer toutes les dépendances (y compris frontend-admin)
npm install
```

Ou spécifiquement pour le frontend-admin :

```bash
cd apps/frontend-admin
npm install
```

---

## Configuration de la base de données

### Étape 2 : Appliquer le nouveau schéma

Le panneau admin nécessite des modifications du schéma de base de données :
- Ajout du rôle admin aux utilisateurs
- Relation entre utilisateurs admin et lieux

**Appliquer les changements :**

```bash
cd apps/backend

# Option A : Utiliser db:push (recommandé pour le dev)
npx prisma db push

# Option B : Créer et appliquer une migration
npx prisma migrate dev --name add-admin-roles
```

### Étape 3 : Seed la base de données

Les données de seed incluent maintenant 3 comptes admin :

```bash
cd apps/backend
npm run db:seed
```

**Ce qui sera créé :**

✅ 6 lieux (Louvre, Tour Eiffel, Notre-Dame, Versailles, Orsay, Sacré-Cœur)
✅ 1 utilisateur standard (test@example.com)
✅ 3 utilisateurs admin avec leurs lieux assignés :
  - Admin Louvre → Musée du Louvre
  - Admin Eiffel → Tour Eiffel
  - Admin Versailles → Château de Versailles

---

## Démarrage

### Option 1 : Démarrer uniquement l'admin

```bash
# Terminal 1 : Backend (port 3001)
npm run dev:backend

# Terminal 2 : Frontend Admin (port 3002)
npm run dev:admin
```

### Option 2 : Démarrer toutes les applications

```bash
# Démarre frontend, frontend-admin ET backend simultanément
npm run dev:all
```

**Résultat attendu :**

```
✔ Frontend:        http://localhost:3000
✔ Frontend Admin:  http://localhost:3002
✔ Backend:         http://localhost:3001
```

---

## Utilisation

### 1. Accéder au panneau admin

Ouvrez votre navigateur sur : **http://localhost:3002**

### 2. Se connecter

Utilisez l'un des comptes admin créés par le seed.

#### Compte Admin Louvre
```
Email:     admin.louvre@example.com
Password:  admin123
Lieux:     Musée du Louvre
```

#### Compte Admin Tour Eiffel
```
Email:     admin.eiffel@example.com
Password:  admin123
Lieux:     Tour Eiffel
```

#### Compte Admin Versailles
```
Email:     admin.versailles@example.com
Password:  admin123
Lieux:     Château de Versailles
```

### 3. Dashboard

Après connexion, vous verrez :
- La liste de tous les lieux que vous gérez
- Pour chaque lieu : photo, nom, type, note, nombre de POIs
- Cliquez sur un lieu pour l'éditer

### 4. Éditer un lieu

**Informations modifiables :**

- ✏️ Nom du lieu
- 📍 Type (musée, monument, parc, etc.)
- 🌍 Coordonnées GPS (latitude/longitude)
- 📝 Description complète
- ⭐ À voir absolument (liste)
- 🕐 Horaires de visite
- 🌤️ Meilleur moment pour visiter
- 📸 Photos (URLs, une par ligne)

**Cliquez sur "Enregistrer" pour sauvegarder vos modifications.**

### 5. Gérer les Points d'Intérêt (POI)

En bas de la page d'édition d'un lieu, vous trouvez la section "Points d'intérêt".

#### Créer un POI

1. Cliquez sur **"Ajouter un POI"**
2. Remplissez le formulaire :
   - Nom du point d'intérêt
   - Description
   - Photos (URLs, une par ligne)
   - URL du guide audio (optionnel)
3. Cliquez sur **"Enregistrer"**

#### Modifier un POI

1. Cliquez sur l'icône **✏️** à côté du POI
2. Modifiez les informations
3. Cliquez sur **"Enregistrer"**

#### Supprimer un POI

1. Cliquez sur l'icône **🗑️** à côté du POI
2. Confirmez la suppression

⚠️ **Attention** : La suppression d'un POI est **irréversible**.

---

## Comptes admin de test

### Créer un nouveau compte admin manuellement

Si vous voulez créer un admin supplémentaire :

```sql
-- Connexion à PostgreSQL
psql -U user -d worldtour

-- Créer un nouvel utilisateur admin
INSERT INTO "User" (email, name, password, role)
VALUES ('admin@example.com', 'Nouvel Admin', '$2b$10$hashedpassword', 'admin');

-- Récupérer l'ID du nouvel admin
SELECT id FROM "User" WHERE email = 'admin@example.com';

-- Assigner un lieu à cet admin (remplacez :adminId et :placeId)
UPDATE "Place" SET "adminId" = :adminId WHERE id = :placeId;
```

**Note** : Le mot de passe doit être hashé avec bcrypt. Utilisez le seed ou un script Node.js pour générer le hash.

### Script pour hasher un mot de passe

Créez un fichier temporaire `hash-password.js` :

```javascript
import bcrypt from 'bcrypt'

const password = 'votremotdepasse'
const hash = await bcrypt.hash(password, 10)
console.log('Hashed password:', hash)
```

Exécutez :

```bash
node hash-password.js
```

---

## Troubleshooting

### ❌ Erreur : "Access denied. Admin role required"

**Cause** : Vous essayez de vous connecter avec un compte qui n'a pas le rôle `admin`.

**Solution** :

1. Vérifiez le rôle dans la base de données :
   ```sql
   SELECT email, role FROM "User" WHERE email = 'votre@email.com';
   ```

2. Si le rôle est `user`, changez-le en `admin` :
   ```sql
   UPDATE "User" SET role = 'admin' WHERE email = 'votre@email.com';
   ```

### ❌ Dashboard vide après connexion

**Cause** : L'admin n'est assigné à aucun lieu.

**Solution** :

```sql
-- Vérifier les lieux assignés
SELECT u.email, p.name
FROM "User" u
LEFT JOIN "Place" p ON p."adminId" = u.id
WHERE u.role = 'admin';

-- Assigner un lieu (remplacez les IDs)
UPDATE "Place" SET "adminId" = 1 WHERE id = 1;
```

### ❌ Erreur 403 lors de l'édition d'un lieu

**Cause** : Vous essayez d'éditer un lieu qui ne vous appartient pas.

**Solution** :

Seul l'admin assigné à un lieu peut le modifier. Vérifiez l'ownership :

```sql
SELECT
  p.id,
  p.name,
  p."adminId",
  u.email as admin_email
FROM "Place" p
LEFT JOIN "User" u ON p."adminId" = u.id
WHERE p.id = :placeId;
```

### ❌ Cannot connect to backend

**Cause** : Le backend n'est pas démarré ou tourne sur un autre port.

**Solution** :

1. Vérifiez que le backend tourne :
   ```bash
   cd apps/backend
   npm run dev
   ```

2. Vérifiez le port dans la config :
   ```bash
   # apps/frontend-admin/.env
   NUXT_PUBLIC_API_BASE=http://localhost:3001/api
   ```

### ❌ Erreur de CORS

**Erreur dans la console** : "CORS policy: No 'Access-Control-Allow-Origin' header"

**Solution** :

Vérifiez que le backend a CORS activé :

```typescript
// apps/backend/src/index.ts
await fastify.register(cors, {
  origin: true,  // ← Doit être true ou une liste d'origines
  credentials: true
})
```

### ❌ Port 3002 déjà utilisé

**Erreur** : "Port 3002 is already in use"

**Solution** :

Changez le port dans le package.json :

```json
// apps/frontend-admin/package.json
{
  "scripts": {
    "dev": "nuxt dev --port 3003"
  }
}
```

---

## 📊 Schéma des données

### Relations admin

```
User (role: admin)
  ↓ (1 à plusieurs)
Place (adminId)
  ↓ (1 à plusieurs)
PointOfInterest (placeId)
```

**Règles :**
- Un admin peut gérer 0 à N lieux
- Un lieu peut avoir 0 ou 1 admin (pas plus)
- Un lieu peut avoir N points d'intérêt
- Un POI appartient à 1 seul lieu

---

## 🌍 Multi-langue

Le panneau admin est disponible en 6 langues :

- 🇫🇷 Français (défaut)
- 🇬🇧 English
- 🇮🇹 Italiano
- 🇪🇸 Español
- 🇩🇪 Deutsch
- 🇵🇹 Português

Le sélecteur de langue est dans la barre de navigation en haut à droite.

---

## 🔐 Sécurité

### En développement

- Les mots de passe des comptes de test sont simples (`admin123`)
- Le JWT secret est par défaut

### En production

⚠️ **IMPORTANT** : Avant de déployer en production :

1. **Changez tous les mots de passe**
   ```bash
   # Utilisez des mots de passe forts
   node hash-password.js
   ```

2. **Changez le JWT secret**
   ```bash
   # apps/backend/.env
   JWT_SECRET=UnSecretTrèsLongEtComplexe123!@#
   ```

3. **Configurez HTTPS**
   ```bash
   # apps/frontend-admin/.env
   NUXT_PUBLIC_API_BASE=https://votre-api.com/api
   ```

4. **Limitez les origines CORS**
   ```typescript
   // apps/backend/src/index.ts
   await fastify.register(cors, {
     origin: ['https://admin.votre-site.com'],
     credentials: true
   })
   ```

---

## 📚 Documentation complète

Pour plus de détails sur le panneau admin :

📖 **[apps/frontend-admin/README.md](./apps/frontend-admin/README.md)** - Documentation complète du frontend admin

Pour la documentation générale du projet :

📖 **[README.md](./README.md)** - Vue d'ensemble du projet
📖 **[SETUP.md](./SETUP.md)** - Installation complète
📖 **[GEOLOCALISATION.md](./GEOLOCALISATION.md)** - Feature géolocalisation

---

## ✅ Checklist de démarrage rapide

- [ ] PostgreSQL en cours d'exécution
- [ ] Base de données créée
- [ ] `npm install` à la racine
- [ ] `npx prisma db push` dans apps/backend
- [ ] `npm run db:seed` dans apps/backend
- [ ] Backend démarré (`npm run dev:backend`)
- [ ] Frontend Admin démarré (`npm run dev:admin`)
- [ ] Ouvert http://localhost:3002
- [ ] Connecté avec un compte admin
- [ ] Dashboard affiche les lieux gérés

**Tout fonctionne ?** 🎉 Vous êtes prêt à gérer vos lieux !

---

**Besoin d'aide ?** Créez une issue sur le repository GitHub.
