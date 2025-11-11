# Activity Day to Day

Gestionnaire d'activités quotidiennes pour la famille avec Firebase.

## Description

Application web dynamique permettant à toute la famille de gérer et suivre les tâches quotidiennes en temps réel. Les données sont sauvegardées dans Firebase Firestore et synchronisées automatiquement entre tous les appareils.

## Fonctionnalités

✨ **Principales fonctionnalités** :
- ✅ Gestion complète des tâches (ajout, modification, suppression)
- 👨‍👩‍👦‍👦 Attribution des tâches par membre de la famille
- 🔄 Synchronisation en temps réel avec Firebase Firestore
- 📱 Interface responsive (mobile et desktop)
- 🎨 Design coloré avec code couleur par personne
- ⭐ Système d'étoiles : chaque tâche rapporte de 1 à 5 étoiles
- 📊 Statistiques avec total d'étoiles gagnées par personne
- 🏷️ Catégories des tâches (quotidien, hebdomadaire, mensuel)
- ✓ Système de check-list interactif
- 🔐 Mode Admin avec code PIN pour les fonctions sensibles
- 📈 Barre de progression avec paliers de récompenses
- ⏰ **Reset automatique quotidien** : Remise à zéro des tâches à heure programmée
  - Configuration flexible de l'heure et des jours actifs
  - Sauvegarde automatique des statistiques avant reset
  - Historique des 7 derniers resets
  - Notifications email (succès/erreur)
- 🔄 **Reset manuel** : Possibilité de forcer un reset depuis l'interface admin
  - Mode test (sans reset réel) pour vérifier la configuration
  - Mode force pour un reset immédiat

✨ **Fonctionnalités futures** :
- 🎁 **Tâches bonus** : Système 75% normal + 25% bonus pour encourager les efforts
- ⛔ **Système de pénalités** : Étoiles négatives pour les mauvais comportements

## Membres de la Famille

- 👨 **Papa** - Bleu (#2196F3)
- 👩 **Maman** - Rose (#E91E63)
- 👦 **Bastien** - Vert (#4CAF50)
- 🧒 **Florent** - Orange (#FF9800)

## Structure du Projet

```
Activity_day_to_day/
├── public/                    # Fichiers publics à déployer
│   ├── index.html            # Page principale
│   ├── admin.html            # Interface d'administration
│   ├── init-reset.html       # Initialisation de la configuration reset
│   ├── css/
│   │   └── styles.css        # Styles CSS
│   └── js/
│       ├── app.js            # Logique JavaScript principale
│       ├── reset-admin.js    # Gestion du reset admin
│       ├── reset-admin-standalone.js  # Admin standalone
│       └── init-reset-config.js       # Initialisation config
├── functions/                # Cloud Functions
│   ├── index.js             # Fonctions de reset (auto + manuel)
│   ├── email.js             # Module d'envoi d'emails (Resend)
│   ├── package.json         # Dépendances Node.js
│   └── CONFIG_EMAIL.md      # Configuration email
├── firebase.json             # Configuration Firebase
├── firestore.rules           # Règles de sécurité Firestore
├── firestore.indexes.json    # Index Firestore
├── .firebaserc               # Configuration du projet Firebase
├── tableau-taches-familiales.html  # Version statique (référence)
├── RESET_AUTO.md             # Documentation reset automatique
├── SETUP.md                  # Guide de configuration
├── SPECIFICATIONS.md         # Spécifications détaillées
├── FEATURES_FUTURES.md       # Fonctionnalités futures
└── TODO.md                   # Liste des tâches de développement
```

## Installation et Configuration

### Prérequis

- Un compte Google/Firebase
- Node.js installé sur votre machine

### Étapes d'installation

1. **Installer Firebase CLI**
   ```bash
   npm install -g firebase-tools
   ```

2. **Se connecter à Firebase**
   ```bash
   firebase login
   ```

3. **Configurer votre projet Firebase**
   - Suivez le guide détaillé dans [SETUP.md](SETUP.md)
   - Créez un projet Firebase sur [console.firebase.google.com](https://console.firebase.google.com/)
   - Activez Firestore Database
   - Récupérez votre configuration Firebase

4. **Mettre à jour la configuration**
   - Ouvrez `public/index.html`
   - Remplacez les valeurs `YOUR_...` par votre configuration Firebase

5. **Installer les dépendances**
   ```bash
   npm install
   ```

6. **Tester localement**
   ```bash
   npm run serve
   ```
   Ouvrez votre navigateur sur `http://localhost:5000`

7. **Déployer sur Firebase Hosting**
   ```bash
   npm run deploy
   ```

## Utilisation

### Utilisation Quotidienne
1. **Ajouter une tâche** : Cliquez sur "➕ Ajouter une tâche" et remplissez le formulaire
2. **Compléter une tâche** : Cliquez sur le cercle à côté de la tâche
3. **Filtrer les tâches** : Utilisez les boutons de filtre en haut
4. **Supprimer une tâche** : Cliquez sur "🗑️ Supprimer"

### Interface Admin
1. **Accès** : Allez sur `/admin.html` ou cliquez sur "⚙️ Admin" dans le menu
2. **Code PIN** : Entrez le code PIN configuré (par défaut : 1571)
3. **Configuration du Reset** :
   - Activez/désactivez le reset automatique
   - Choisissez l'heure de reset (format 24h)
   - Sélectionnez les jours actifs
   - Configurez les notifications email
4. **Reset Manuel** :
   - Mode Test : Simule le reset sans modifier les données
   - Mode Force : Effectue un reset immédiat
5. **Historique** : Consultez les 7 derniers resets avec statistiques

## Base de Données

### Collection `tasks`

Chaque tâche contient :
- `title` : Titre de la tâche
- `description` : Description détaillée
- `assignedTo` : Personne assignée (papa, maman, bastien, florent)
- `completed` : État de complétion (boolean)
- `stars` : Nombre d'étoiles gagnées (1 à 5) ⭐
- `category` : Catégorie (quotidien, hebdomadaire, mensuel)
- `createdAt` : Date de création
- `updatedAt` : Date de mise à jour

**Système d'étoiles** : Chaque tâche rapporte de 1 à 5 étoiles. Plus la tâche est importante ou difficile, plus elle vaut d'étoiles ! Les étoiles sont comptabilisées uniquement lorsque la tâche est complétée.

### Collection `reset_config`

Configuration du reset automatique :
- `enabled` : Activation du reset automatique (boolean)
- `resetTime` : Heure du reset (format "HH:MM")
- `timezone` : Fuseau horaire (ex: "Europe/Paris")
- `activeDays` : Jours actifs (object avec lundi, mardi, etc.)
- `lastReset` : Date du dernier reset (format ISO)
- `notifications` : Configuration des notifications email

### Collection `daily_stats`

Statistiques quotidiennes sauvegardées avant chaque reset :
- `date` : Date des statistiques (format ISO)
- `resetTime` : Heure du reset
- `beforeReset` : Données par membre de famille
  - `completed` : Nombre de tâches complétées
  - `total` : Nombre total de tâches
  - `stars` : Étoiles gagnées
  - `completionRate` : Taux de complétion (%)
- `totalTasks` : Total des tâches
- `totalCompleted` : Total des tâches complétées
- `totalStars` : Total des étoiles
- `familyCompletionRate` : Taux de complétion familial
- `resetBy` : Type de reset (system_auto, manual)
- `createdAt` : Timestamp de création

## Technologies Utilisées

### Frontend
- **HTML5** : Structure de l'application
- **CSS3** : Styles et animations
- **JavaScript (ES6+)** : Logique applicative avec modules ES6
- **Firebase SDK v10** : SDK modulaire pour une meilleure performance

### Backend & Cloud
- **Firebase Firestore** : Base de données NoSQL temps réel
- **Firebase Cloud Functions (2nd Gen)** : Fonctions serverless Node.js 20
  - Reset automatique quotidien (scheduler)
  - Reset manuel via interface admin
  - Sauvegarde des statistiques quotidiennes
- **Firebase Cloud Scheduler** : Planification des tâches automatiques
- **Firebase Secret Manager** : Gestion sécurisée des clés API

### Hosting & Déploiement
- **Firebase Hosting** : Hébergement web avec CDN global
- **Firebase CLI** : Outils de déploiement et gestion

### Services Externes
- **Resend** : Service d'envoi d'emails transactionnels
  - Notifications de succès/erreur pour les resets
  - Templates HTML personnalisés
  - API REST simple et fiable

### Développement
- **Node.js 20** : Runtime JavaScript
- **npm** : Gestionnaire de paquets
- **Firebase Admin SDK** : Accès privilégié côté serveur
- **ESLint** : Linter pour la qualité du code (optional)

### Sécurité
- **Firebase Security Rules** : Protection des données Firestore
- **Code PIN** : Authentification pour le mode admin
- **Environment Variables** : Gestion sécurisée des secrets

## Documentation

- 📖 [Guide de configuration](SETUP.md)
- 📋 [Spécifications complètes](SPECIFICATIONS.md)
- ✅ [Liste des tâches de développement](TODO.md)
- 💡 [Fonctionnalités futures](FEATURES_FUTURES.md)
- ⏰ [Configuration du reset automatique](RESET_AUTO.md)
- 📧 [Configuration des emails](functions/CONFIG_EMAIL.md)
- 🔒 [Guide de sécurité Firebase](SECURITY.md)
- 🌍 [Gestion de l'environnement (Node.js vs Python)](ENVIRONMENT.md)
- 🚨 [Gérer l'alerte GitHub "Secret détecté"](GITHUB_ALERT.md)
- 🔐 [Mode Admin - Protection par code PIN](ADMIN_MODE.md)

## Sécurité

✅ **Les clés Firebase dans le code sont sécurisées** - Elles sont publiques par design.

🛡️ **La vraie sécurité vient des règles Firestore** qui ont été renforcées avec :
- Validation des champs obligatoires
- Limitation des valeurs possibles (assignedTo, priority, category)
- Protection contre les données invalides

📖 **Pour en savoir plus** : Consultez [SECURITY.md](SECURITY.md) pour le guide complet de sécurité

## Versions

### Version 2.0 (Actuelle) - Novembre 2025
- Application web dynamique avec Firebase
- CRUD complet des tâches
- Synchronisation temps réel
- Interface responsive
- **Reset automatique quotidien** avec scheduler
- **Interface admin** avec code PIN
- **Historique des statistiques** quotidiennes
- **Notifications email** via Resend
- **Firebase Cloud Functions (2nd Gen)**

### Version 1.0
- Application de base avec gestion des tâches
- Système d'étoiles et paliers de récompenses
- Barre de progression

### Version Statique (Référence)
- `tableau-taches-familiales.html` : Version HTML statique d'origine

## Contribution

Ce projet est destiné à un usage familial. Pour toute suggestion ou amélioration, consultez le fichier [SPECIFICATIONS.md](SPECIFICATIONS.md) pour les fonctionnalités futures prévues.

## Licence

MIT

## Support

Pour toute question ou problème :
- Consultez le [guide de configuration](SETUP.md)
- Vérifiez la console du navigateur (F12) pour les erreurs
- Consultez la [documentation Firebase](https://firebase.google.com/docs)
