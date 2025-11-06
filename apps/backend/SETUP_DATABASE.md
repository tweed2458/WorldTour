# Configuration de la Base de Données - Guide Pas à Pas

## 🎯 Guide Rapide (Solution Recommandée)

Si vous avez rencontré l'erreur `ERREUR: erreur de syntaxe sur ou près de « WITH »`, suivez ces étapes :

### Étape 1 : Vérifier PostgreSQL

```bash
# Vérifier que PostgreSQL est installé et démarré
psql --version

# Se connecter à PostgreSQL
psql -U postgres
```

Si PostgreSQL n'est pas installé :
- **Windows** : https://www.postgresql.org/download/windows/
- **macOS** : `brew install postgresql@14`
- **Linux** : `sudo apt install postgresql postgresql-contrib`

### Étape 2 : Créer la base de données

```sql
-- Dans psql
CREATE DATABASE worldtour;

-- Vérifier
\l

-- Quitter
\q
```

### Étape 3 : Configurer les variables d'environnement

```bash
cd apps/backend

# Copier le fichier exemple
cp .env.example .env

# Éditer le fichier .env
# Sous Windows : notepad .env
# Sous macOS/Linux : nano .env
```

Modifier le fichier `.env` avec vos identifiants PostgreSQL :

```env
DATABASE_URL="postgresql://postgres:VOTRE_MOT_DE_PASSE@localhost:5432/worldtour?schema=public"
JWT_SECRET="changez-cette-cle-secrete-en-production"
PORT=3011
HOST=0.0.0.0
```

**Important:** Remplacez `VOTRE_MOT_DE_PASSE` par votre mot de passe PostgreSQL.

### Étape 4 : Initialiser la base de données avec db:push

```bash
# Toujours dans apps/backend

# 1. Générer le client Prisma
npm run db:generate

# 2. Synchroniser le schéma avec la base (UTILISEZ CETTE COMMANDE)
npm run db:push

# Vous devriez voir :
# ✔ Your database is now in sync with your Prisma schema.
```

### Étape 5 : Peupler avec des données de test

```bash
npm run db:seed

# Vous devriez voir :
# 🌱 Seeding database...
# ✅ Places created
# ✅ Test user created
# ✅ Sample ratings created
# ✅ Sample tour created
# 🎉 Seeding completed!
```

### Étape 6 : Démarrer le serveur

```bash
npm run dev

# Le serveur devrait démarrer sur http://localhost:3011
```

## ✅ Vérification

Testez l'API :

```bash
# Test simple
curl http://localhost:3011/health

# Devrait retourner :
# {"status":"ok","timestamp":"..."}

# Récupérer les lieux
curl http://localhost:3011/api/places
```

## 🔄 Alternative : Utiliser les migrations (Production)

Si `db:push` ne fonctionne pas ou pour un environnement de production :

```bash
# Supprimer les migrations existantes si elles posent problème
rm -rf prisma/migrations

# Créer une nouvelle migration initiale
npm run db:migrate

# Quand demandé, nommer la migration : "init" ou "initial"
```

## 🆘 Problèmes Courants

### Erreur : "Can't reach database server"

**Solution :**
1. Vérifier que PostgreSQL est démarré
2. Vérifier les identifiants dans `.env`
3. Vérifier que le port 5432 n'est pas bloqué

### Erreur : "Database 'worldtour' does not exist"

**Solution :**
```bash
psql -U postgres -c "CREATE DATABASE worldtour;"
```

### Erreur : "Password authentication failed"

**Solution :**
1. Vérifier le mot de passe dans `.env`
2. Réinitialiser le mot de passe PostgreSQL si nécessaire :

```bash
# Linux
sudo -u postgres psql
ALTER USER postgres PASSWORD 'nouveau_mot_de_passe';

# Windows (psql en tant qu'admin)
ALTER USER postgres PASSWORD 'nouveau_mot_de_passe';
```

### Erreur : Client Prisma non généré

**Solution :**
```bash
rm -rf node_modules/@prisma/client
npm run db:generate
```

## 📊 Visualiser les données

Pour voir et modifier les données facilement :

```bash
npm run db:studio
```

Cela ouvre une interface web sur `http://localhost:5555`

## 🔄 Réinitialiser complètement

Si vous voulez tout recommencer :

```bash
# 1. Supprimer la base
psql -U postgres -c "DROP DATABASE IF EXISTS worldtour;"
psql -U postgres -c "CREATE DATABASE worldtour;"

# 2. Recommencer depuis l'étape 4
npm run db:generate
npm run db:push
npm run db:seed
```

## 📚 Commandes Utiles

```bash
# Développement
npm run db:generate    # Générer le client Prisma
npm run db:push        # Synchroniser le schéma (recommandé)
npm run db:migrate     # Créer des migrations (production)
npm run db:seed        # Peupler avec des données
npm run db:studio      # Interface visuelle
npm run db:reset       # Réinitialiser complètement

# Après modifications du schema.prisma
npm run db:generate    # Toujours en premier
npm run db:push        # Puis synchroniser
```

## 🎓 Comprendre la différence

### `db:push` vs `db:migrate`

**db:push (Développement):**
- ✅ Plus rapide
- ✅ Pas de fichiers de migration
- ✅ Parfait pour itérer rapidement
- ❌ Pas d'historique des changements

**db:migrate (Production):**
- ✅ Historique des changements
- ✅ Rollback possible
- ✅ Meilleur pour le travail en équipe
- ❌ Plus complexe
- ❌ Peut causer des erreurs de syntaxe

**Recommandation :** Utilisez `db:push` en développement, `db:migrate` en production.

## 📝 Données de Test Créées

Après `npm run db:seed`, vous aurez :

**Lieux :**
- Musée du Louvre (Paris)
- Tour Eiffel (Paris)
- Cathédrale Notre-Dame (Paris)
- Château de Versailles (Versailles)
- Musée d'Orsay (Paris)
- Basilique du Sacré-Cœur (Paris)

**Utilisateur de test :**
- Email : `test@example.com`
- Mot de passe : `password123`

**Autres :**
- Badges pour chaque lieu
- Points d'intérêt avec descriptions
- Exemple de parcours touristique

---

✨ **Vous êtes prêt !** Retournez à la racine du projet et lancez `npm run dev`
