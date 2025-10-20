# Changelog - Activity Day to Day

Toutes les modifications notables de ce projet sont documentées dans ce fichier.

## [1.1.0] - 2025-10-20

### ⭐ Ajout du Système d'Étoiles

**Nouvelle fonctionnalité majeure** : Chaque tâche rapporte maintenant des étoiles !

#### Fonctionnalités Ajoutées

- **Valeur en étoiles** : Chaque tâche peut valoir de 1 à 5 étoiles ⭐
- **Calcul automatique** : Le total d'étoiles gagnées est affiché pour chaque personne
- **Motivation** : Les étoiles sont comptabilisées uniquement pour les tâches complétées
- **Interface intuitive** : Sélection facile du nombre d'étoiles lors de la création

#### Interface Utilisateur

- ✅ Sélecteur d'étoiles dans le formulaire (⭐ à ⭐⭐⭐⭐⭐)
- ✅ Badge doré affichant les étoiles de chaque tâche
- ✅ Grand compteur d'étoiles dans le header de chaque personne
- ✅ Petit compteur de tâches en dessous pour référence

#### Base de Données

- **Nouveau champ** : `stars` (integer, 1-5)
- **Règles Firestore** : Validation automatique (stars entre 1 et 5)
- **Migration** : Les anciennes tâches devront être mises à jour

### 🗑️ Suppression des Priorités

- **Retiré** : Le système de priorité (basse, moyenne, haute)
- **Raison** : Remplacé par un système plus motivant et ludique avec les étoiles
- **Impact** : Les anciennes tâches avec "priority" devront être migrées

#### Changements Techniques

**Firestore Rules** :
```javascript
// Avant
priority in ['basse', 'moyenne', 'haute']

// Maintenant
stars is int && stars >= 1 && stars <= 5
```

**Structure des Tâches** :
```json
// Avant
{
  "priority": "moyenne"
}

// Maintenant
{
  "stars": 3
}
```

### 📊 Statistiques Améliorées

- **Affichage principal** : Total d'étoiles gagnées (en grand)
- **Affichage secondaire** : Nombre de tâches complétées/totales
- **Design** : Badge doré avec effet gradient pour les étoiles

### 🎨 Design

- **Nouveau badge** : Dégradé or (#FFD700 → #FFA500)
- **Icône** : Étoiles répétées selon la valeur (⭐⭐⭐)
- **Texte d'aide** : "Plus la tâche est importante ou difficile, plus elle vaut d'étoiles !"

### 📝 Documentation

- ✅ README.md mis à jour
- ✅ SPECIFICATIONS.md mis à jour
- ✅ Ajout de CHANGELOG.md (ce fichier)

### 🚀 Déploiement

- ✅ Règles Firestore déployées
- ✅ Application déployée sur Firebase Hosting
- ✅ URL live : https://activity-day-to-day.web.app

---

## [1.0.0] - 2025-10-20

### 🎉 Version Initiale

- Application web dynamique avec Firebase
- CRUD complet des tâches
- Synchronisation temps réel
- Interface responsive
- Gestion de 4 membres de la famille
- Système de priorités (retiré en 1.1.0)
- Catégories des tâches
- Règles de sécurité Firestore
- Documentation complète

---

## Migration depuis 1.0.0 → 1.1.0

### ⚠️ Actions Requises

Si vous avez des tâches existantes avec le champ `priority`, vous devez :

#### Option 1 : Supprimer les anciennes tâches
1. Aller sur https://activity-day-to-day.web.app
2. Supprimer manuellement les anciennes tâches
3. Créer de nouvelles tâches avec le système d'étoiles

#### Option 2 : Migrer les données (via Firestore Console)
1. Aller sur [Firebase Console](https://console.firebase.google.com/project/activity-day-to-day/firestore)
2. Ouvrir la collection `tasks`
3. Pour chaque document :
   - Retirer le champ `priority`
   - Ajouter le champ `stars` avec une valeur de 1 à 5
   
**Mapping suggéré** :
- `priority: "basse"` → `stars: 1 ou 2`
- `priority: "moyenne"` → `stars: 3`
- `priority: "haute"` → `stars: 4 ou 5`

#### Option 3 : Script de Migration (Avancé)
Si vous avez beaucoup de tâches, contactez le développeur pour un script de migration automatique.

### 🆘 En Cas de Problème

Si vous rencontrez des erreurs après la mise à jour :

1. **Erreur "Missing required fields"**
   - Cause : Anciennes tâches sans champ `stars`
   - Solution : Supprimer ou migrer les tâches (voir ci-dessus)

2. **Tâches non affichées**
   - Cause : Validation Firestore échoue
   - Solution : Vérifier que toutes les tâches ont un champ `stars` (1-5)

3. **Formulaire ne fonctionne pas**
   - Cause : Cache du navigateur
   - Solution : Rafraîchir avec Ctrl+Shift+R (ou Cmd+Shift+R sur Mac)

---

## Formats des Versions

Ce projet suit le [Semantic Versioning](https://semver.org/) :
- **MAJOR** : Changements incompatibles avec les versions précédentes
- **MINOR** : Ajout de fonctionnalités rétrocompatibles
- **PATCH** : Corrections de bugs rétrocompatibles

---

## Liens Utiles

- 🌐 **Application** : https://activity-day-to-day.web.app
- 📊 **Console Firebase** : https://console.firebase.google.com/project/activity-day-to-day
- 💻 **GitHub** : https://github.com/Stonesth/Activity_day_to_day
- 📖 **Documentation** : Voir README.md
