# World Tour - Admin Panel 🛡️

Interface d'administration pour gérer les lieux et points d'intérêt de l'application World Tour.

## 📋 Vue d'ensemble

Le panneau d'administration permet aux utilisateurs avec le rôle `admin` de :
- Éditer les informations de leurs lieux assignés
- Créer, modifier et supprimer des points d'intérêt (POI)
- Gérer les photos, horaires et descriptions

**Note importante** : Un admin peut être assigné à plusieurs lieux, mais un lieu ne peut avoir qu'un seul admin (ou aucun).

## 🚀 Démarrage rapide

### Prérequis

- Node.js 18+ installé
- Backend WorldTour en cours d'exécution (port 3011)
- Base de données PostgreSQL avec les données seed

### Installation

```bash
cd apps/frontend-admin
npm install
```

### Lancement en développement

```bash
npm run dev
```

L'application sera accessible sur **http://localhost:3002**

(Le port 3002 est utilisé pour éviter les conflits avec le frontend principal sur le port 3000)

## 🔐 Connexion

Utilisez l'un des comptes admin créés par le seed :

### Compte Admin Louvre
- **Email** : admin.louvre@example.com
- **Mot de passe** : admin123
- **Lieux gérés** : Musée du Louvre

### Compte Admin Tour Eiffel
- **Email** : admin.eiffel@example.com
- **Mot de passe** : admin123
- **Lieux gérés** : Tour Eiffel

### Compte Admin Versailles
- **Email** : admin.versailles@example.com
- **Mot de passe** : admin123
- **Lieux gérés** : Château de Versailles

## 📁 Structure du projet

```
frontend-admin/
├── app.vue                 # Composant racine
├── nuxt.config.ts         # Configuration Nuxt avec thème admin
├── pages/
│   ├── index.vue          # Dashboard : liste des lieux
│   ├── login.vue          # Page de connexion
│   └── places/
│       └── [id].vue       # Édition d'un lieu + gestion POI
├── components/
│   ├── Modal.vue          # Composant modal réutilisable
│   └── PointsOfInterestManager.vue  # Gestion des POI
├── layouts/
│   └── default.vue        # Layout avec navigation admin
├── stores/
│   ├── auth.ts           # Store Pinia pour l'authentification
│   └── places.ts         # Store Pinia pour les lieux et POI
├── locales/              # Traductions (FR, EN, IT, ES, DE, PT)
│   ├── fr.json
│   ├── en.json
│   ├── it.json
│   ├── es.json
│   ├── de.json
│   └── pt.json
└── assets/
    └── css/
        └── main.css      # Styles Tailwind personnalisés
```

## 🎨 Thème

Le panneau admin utilise un thème violet/pourpre pour se différencier du frontend principal :

- **Couleur primaire** : Violet (`#7c3aed`)
- **Navigation** : Blanc avec ombre portée
- **Cartes** : Fond blanc avec bordures arrondies

## 📱 Fonctionnalités

### 1. Dashboard

- **Vue** : `/`
- **Description** : Liste tous les lieux gérés par l'admin connecté
- **Affichage** :
  - Photo principale du lieu
  - Nom et type
  - Note et nombre d'avis
  - Nombre de points d'intérêt
  - Date de dernière mise à jour

### 2. Édition de lieu

- **Vue** : `/places/:id`
- **Description** : Formulaire d'édition complet pour un lieu
- **Champs modifiables** :
  - Nom du lieu
  - Type (musée, monument, parc, etc.)
  - Coordonnées GPS (latitude/longitude)
  - Description complète
  - À voir absolument (liste)
  - Horaires de visite
  - Meilleur moment pour visiter
  - Photos (URLs)

### 3. Gestion des Points d'Intérêt

- **Composant** : `PointsOfInterestManager`
- **Fonctionnalités** :
  - ➕ **Créer** un nouveau POI
  - ✏️ **Modifier** un POI existant
  - 🗑️ **Supprimer** un POI avec confirmation
- **Champs POI** :
  - Nom
  - Description
  - Photos (URLs)
  - Guide audio (URL optionnelle)

### 4. Authentification

- **Sécurité** : JWT stocké dans localStorage
- **Middleware** : Redirection automatique vers `/login` si non authentifié
- **Vérification du rôle** : Seuls les utilisateurs avec `role: 'admin'` peuvent se connecter

## 🔒 Sécurité

### Côté Frontend

- Vérification du rôle admin lors de la connexion
- Token JWT stocké dans localStorage
- Middleware de redirection sur toutes les pages protégées
- Déconnexion automatique si le rôle change

### Côté Backend

- Routes protégées avec middleware `checkAdmin`
- Vérification de propriété du lieu (`checkPlaceOwnership`)
- Validation des permissions avant toute opération

### Routes API utilisées

```
POST   /api/auth/login              # Connexion
GET    /api/admin/my-places         # Liste des lieux gérés
GET    /api/admin/places/:id        # Détails d'un lieu
PUT    /api/admin/places/:id        # Mise à jour d'un lieu
POST   /api/admin/places/:id/poi    # Créer un POI
PUT    /api/admin/places/:id/poi/:poiId   # Modifier un POI
DELETE /api/admin/places/:id/poi/:poiId   # Supprimer un POI
```

## 🌍 Internationalisation

Le panneau admin supporte 6 langues :

- 🇫🇷 Français (par défaut)
- 🇬🇧 English
- 🇮🇹 Italiano
- 🇪🇸 Español
- 🇩🇪 Deutsch
- 🇵🇹 Português

Le sélecteur de langue est disponible dans la barre de navigation.

## 🛠️ Technologies utilisées

- **Framework** : Nuxt 3.15.3
- **UI** : Tailwind CSS avec composants personnalisés
- **État** : Pinia pour la gestion d'état
- **Icons** : nuxt-icon (Material Design Icons)
- **HTTP** : $fetch (built-in Nuxt)
- **i18n** : @nuxtjs/i18n

## 📦 Scripts disponibles

```bash
# Développement
npm run dev          # Démarre le serveur de dev sur http://localhost:3002

# Production
npm run build        # Build l'application pour la production
npm run preview      # Prévisualise le build de production

# Utilitaires
npm run postinstall  # Prépare l'application Nuxt (auto après npm install)
```

## 🔧 Configuration

### Variables d'environnement

Créez un fichier `.env` à la racine de `frontend-admin` :

```env
NUXT_PUBLIC_API_BASE=http://localhost:3011/api
```

### Port personnalisé

Par défaut, l'admin panel utilise le port 3002. Pour changer :

```json
// package.json
{
  "scripts": {
    "dev": "nuxt dev --port 3003"  // Changez ici
  }
}
```

## 🐛 Dépannage

### Erreur de connexion

**Problème** : "Access denied. Admin role required."

**Solution** : Assurez-vous d'utiliser un compte avec `role: 'admin'` dans la base de données.

### Places non affichées

**Problème** : Le dashboard est vide après connexion.

**Causes possibles** :
1. L'admin n'est assigné à aucun lieu
2. Le backend n'est pas démarré
3. Problème de CORS

**Solution** :
```bash
# Vérifiez que le backend tourne
cd apps/backend
npm run dev

# Re-seedez la base de données
npm run db:seed
```

### Erreur 403 lors de l'édition

**Problème** : "You do not have permission to manage this place"

**Cause** : L'admin connecté n'est pas propriétaire du lieu.

**Solution** : Vérifiez dans la base de données que `place.adminId` correspond à l'ID de l'admin connecté.

### Problème de CORS

**Erreur** : "CORS policy: No 'Access-Control-Allow-Origin' header"

**Solution** : Vérifiez que le backend a bien configuré CORS :

```typescript
// apps/backend/src/index.ts
await fastify.register(cors, {
  origin: true,
  credentials: true
})
```

## 📊 Base de données

### Schéma des relations admin

```prisma
model User {
  id            Int      @id @default(autoincrement())
  email         String   @unique
  name          String
  password      String
  role          UserRole @default(user)  // 'user' ou 'admin'
  managedPlaces Place[]  // Liste des lieux gérés
}

model Place {
  id               Int      @id @default(autoincrement())
  name             String
  adminId          Int?
  admin            User?    @relation(fields: [adminId], references: [id])
  pointsOfInterest PointOfInterest[]
}
```

### Requêtes SQL utiles

```sql
-- Voir tous les admins
SELECT id, email, name, role FROM "User" WHERE role = 'admin';

-- Voir les lieux assignés à un admin
SELECT p.id, p.name, u.email as admin_email
FROM "Place" p
LEFT JOIN "User" u ON p."adminId" = u.id
WHERE u.role = 'admin';

-- Assigner un admin à un lieu
UPDATE "Place" SET "adminId" = 1 WHERE id = 1;

-- Retirer un admin d'un lieu
UPDATE "Place" SET "adminId" = NULL WHERE id = 1;
```

## 🚀 Déploiement

### Build de production

```bash
npm run build
```

Cela génère le dossier `.output` qui peut être déployé sur :
- Vercel
- Netlify
- Node.js server
- Docker

### Variables d'environnement en production

```env
NUXT_PUBLIC_API_BASE=https://votre-api.com/api
```

## 📝 Bonnes pratiques

### Pour les admins

1. **Mot de passe fort** : Changez le mot de passe par défaut
2. **Photos** : Utilisez des URLs HTTPS pour les images
3. **Descriptions** : Soyez concis et informatif
4. **POIs** : Créez au moins 2-3 POIs par lieu

### Pour les développeurs

1. **Types** : Les stores Pinia sont typés en TypeScript
2. **Erreurs** : Toutes les erreurs API sont catchées et affichées
3. **Loading states** : Utilisez `loading` des stores pour les spinners
4. **i18n** : Ajoutez toujours les traductions dans les 6 langues

## 🤝 Contribuer

Pour ajouter des fonctionnalités au panneau admin :

1. **Nouvelle page** : Créez un fichier dans `pages/`
2. **Nouveau composant** : Ajoutez dans `components/`
3. **Nouvelle action** : Ajoutez dans les stores Pinia
4. **Traductions** : Mettez à jour tous les fichiers dans `locales/`

## 📄 License

Projet WorldTour - Interface d'administration

---

**Besoin d'aide ?** Consultez la documentation principale dans `/README.md` à la racine du projet.
