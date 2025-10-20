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
│   ├── css/
│   │   └── styles.css        # Styles CSS
│   └── js/
│       └── app.js            # Logique JavaScript avec Firebase
├── firebase.json             # Configuration Firebase
├── firestore.rules           # Règles de sécurité Firestore
├── firestore.indexes.json    # Index Firestore
├── .firebaserc               # Configuration du projet Firebase
├── tableau-taches-familiales.html  # Version statique (référence)
├── SETUP.md                  # Guide de configuration
├── SPECIFICATIONS.md         # Spécifications détaillées
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

1. **Ajouter une tâche** : Cliquez sur "➕ Ajouter une tâche" et remplissez le formulaire
2. **Compléter une tâche** : Cliquez sur le cercle à côté de la tâche
3. **Filtrer les tâches** : Utilisez les boutons de filtre en haut
4. **Supprimer une tâche** : Cliquez sur "🗑️ Supprimer"

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

## Technologies Utilisées

- **Frontend** : HTML5, CSS3, JavaScript (ES6 Modules)
- **Backend** : Firebase Firestore
- **Hosting** : Firebase Hosting
- **Real-time** : Firebase Firestore onSnapshot

## Documentation

- 📖 [Guide de configuration](SETUP.md)
- 📋 [Spécifications complètes](SPECIFICATIONS.md)
- ✅ [Liste des tâches de développement](TODO.md)
- 🔒 [Guide de sécurité Firebase](SECURITY.md)
- 🌍 [Gestion de l'environnement (Node.js vs Python)](ENVIRONMENT.md)
- 🚨 [Gérer l'alerte GitHub "Secret détecté"](GITHUB_ALERT.md)

## Sécurité

✅ **Les clés Firebase dans le code sont sécurisées** - Elles sont publiques par design.

🛡️ **La vraie sécurité vient des règles Firestore** qui ont été renforcées avec :
- Validation des champs obligatoires
- Limitation des valeurs possibles (assignedTo, priority, category)
- Protection contre les données invalides

📖 **Pour en savoir plus** : Consultez [SECURITY.md](SECURITY.md) pour le guide complet de sécurité

## Versions

### Version 1.0 (Actuelle)
- Application web dynamique avec Firebase
- CRUD complet des tâches
- Synchronisation temps réel
- Interface responsive

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
