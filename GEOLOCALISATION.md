# 📍 Fonctionnalité "Près de moi" - Guide d'utilisation

## ✅ Fonctionnalité maintenant opérationnelle !

Le bouton "Près de moi" est maintenant pleinement fonctionnel avec une excellente expérience utilisateur.

## 🎯 Ce qui a été corrigé

### 1. **Routes Backend** ✅
Les routes API avaient un problème de double préfixe qui causait des erreurs 404 :

**Avant (incorrect) :**
- `/api/places/places` ❌
- `/api/places/places/:id` ❌
- `/api/places/places/nearby` ❌

**Après (correct) :**
- `/api/places` ✅
- `/api/places/:id` ✅
- `/api/places/nearby` ✅

### 2. **Interface Utilisateur** ✅
- Icône animée pendant la localisation (spinner qui tourne)
- Texte changeant : "Près de moi" → "Localisation..."
- Bouton désactivé pendant le chargement
- Messages d'erreur détaillés et contextuels
- Auto-scroll vers les résultats
- Disparition automatique des erreurs après 5 secondes

## 🚀 Comment tester

### Étape 1 : Démarrer l'application

**Terminal 1 - Backend :**
```bash
cd apps/backend
npm run dev
```

**Terminal 2 - Frontend :**
```bash
cd apps/frontend
npm run dev
```

### Étape 2 : Accéder à l'application

Ouvrez votre navigateur sur : **http://localhost:3000**

### Étape 3 : Tester la géolocalisation

1. Sur la page d'accueil, cliquez sur le bouton **"Près de moi"** (avec l'icône GPS)

2. **Le navigateur va demander la permission d'accès à votre position**
   - Cliquez sur **"Autoriser"** ou **"Allow"**

3. **Pendant la localisation :**
   - L'icône devient un spinner animé 🔄
   - Le texte change en "Localisation..."
   - Le bouton est grisé et non-cliquable

4. **Une fois la position obtenue :**
   - Les lieux proches s'affichent dans une nouvelle section
   - La page scroll automatiquement vers les résultats
   - Les lieux sont triés par distance

## 📱 Cas d'utilisation

### ✅ Cas de succès

Lorsque tout fonctionne correctement :
```
1. Clic sur "Près de moi"
2. Permission accordée
3. Position obtenue (latitude, longitude)
4. Appel API : GET /api/places/nearby?lat=48.8566&lng=2.3522&radius=5000
5. Affichage des lieux dans un rayon de 5km
6. Scroll automatique vers la section "Près de moi"
```

### ❌ Gestion des erreurs

Le système gère plusieurs types d'erreurs avec des messages clairs :

**1. Permission refusée :**
```
"Vous devez autoriser l'accès à votre position"
```
→ L'utilisateur a cliqué sur "Refuser" dans le navigateur

**2. Position non disponible :**
```
"Position non disponible"
```
→ Le GPS ne parvient pas à obtenir la position (problème matériel ou réseau)

**3. Timeout :**
```
"La demande de localisation a expiré"
```
→ La localisation prend trop de temps (>10 secondes)

**4. Navigateur non compatible :**
```
"La géolocalisation n'est pas supportée par votre navigateur"
```
→ Le navigateur est trop ancien

**5. Erreur API :**
```
"Erreur lors de la récupération des lieux"
```
→ Problème de communication avec le backend

## 🛠️ Configuration technique

### Options de géolocalisation

```javascript
{
  enableHighAccuracy: true,  // Utilise le GPS pour plus de précision
  timeout: 10000,            // 10 secondes max
  maximumAge: 0              // Toujours demander une position fraîche
}
```

### Rayon de recherche

Par défaut : **5 km** (5000 mètres)

Pour changer le rayon, modifiez dans `stores/places.ts` :
```typescript
async fetchNearbyPlaces(lat: number, lng: number, radius: number = 5000)
```

## 📊 Données de test

Les données seed incluent 6 lieux à Paris :
- Musée du Louvre (48.8606, 2.3376)
- Tour Eiffel (48.8584, 2.2945)
- Notre-Dame (48.8530, 2.3499)
- Château de Versailles (48.8049, 2.1204)
- Musée d'Orsay (48.8600, 2.3266)
- Sacré-Cœur (48.8867, 2.3431)

### Tester avec une position simulée

Si vous voulez tester sans activer votre GPS réel, vous pouvez utiliser les outils de développement de Chrome :

1. Ouvrir les DevTools (F12)
2. Cliquer sur les 3 points (⋮) → More tools → Sensors
3. Sous "Location", choisir une ville (ex: "Paris, France")
4. Tester le bouton "Près de moi"

## 🔍 Débogage

### Vérifier les appels API

Ouvrez la console du navigateur (F12) et l'onglet "Network" :

**Requête réussie :**
```
GET /api/places/nearby?lat=48.8566&lng=2.3522&radius=5000
Status: 200 OK
Response: [array of places with distances]
```

**Vérifier les logs backend :**
```bash
# Dans le terminal du backend, vous devriez voir :
GET /api/places/nearby 200
```

### Erreur "No places found"

Si aucun lieu n'est trouvé :
1. Vérifiez que la base de données est seedée : `npm run db:seed`
2. Vérifiez que votre position est près de Paris (où sont les lieux de test)
3. Augmentez le rayon de recherche si nécessaire

### Console navigateur

Pour voir les détails de la géolocalisation :
```javascript
// Dans la console du navigateur
navigator.geolocation.getCurrentPosition(
  pos => console.log(pos.coords),
  err => console.error(err)
)
```

## ✨ Améliorations futures possibles

- [ ] Ajout d'une carte interactive avec les lieux
- [ ] Slider pour ajuster le rayon de recherche
- [ ] Filtres combinés avec la recherche géographique
- [ ] Sauvegarde de la position favorite
- [ ] Mode "itinéraire" pour naviguer vers les lieux
- [ ] Affichage de la distance en temps réel pendant le déplacement

## 📝 Notes techniques

### Structure de la réponse API

```json
{
  "id": 1,
  "name": "Musée du Louvre",
  "type": "museum",
  "location": { "lat": 48.8606, "lng": 2.3376 },
  "rating": 4.8,
  "distance": 450.5,  // en mètres
  "photos": [...],
  "badge": {...}
}
```

### Calcul de distance

Le backend utilise la **formule de Haversine** pour calculer la distance entre deux points GPS :

```typescript
function calculateDistance(lat1, lon1, lat2, lon2): number {
  // Retourne la distance en mètres
}
```

### Performance

- Le calcul de distance se fait côté backend
- Filtrage efficace : seuls les lieux dans le rayon sont retournés
- Tri par distance croissante automatique

## 🎉 Conclusion

Le bouton "Près de moi" est maintenant **100% fonctionnel** avec :
- ✅ Géolocalisation précise
- ✅ Feedback visuel clair
- ✅ Gestion d'erreurs complète
- ✅ UX optimisée
- ✅ API backend corrigée

**Testez maintenant et trouvez les musées près de vous !** 🗺️
