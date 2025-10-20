# Guide de Configuration Firebase

## Prérequis

- Un compte Google
- Node.js installé (pour Firebase CLI)

## Étape 1 : Créer un projet Firebase

1. Allez sur [Firebase Console](https://console.firebase.google.com/)
2. Cliquez sur "Ajouter un projet"
3. Nommez votre projet : `activity-day-to-day`
4. Acceptez les conditions et créez le projet

## Étape 2 : Activer Firestore

1. Dans le menu de gauche, cliquez sur "Firestore Database"
2. Cliquez sur "Créer une base de données"
3. Choisissez "Commencer en mode test" (pour débuter)
4. Sélectionnez une région proche (ex: `europe-west1`)
5. Cliquez sur "Activer"

## Étape 3 : Configurer l'application Web

1. Dans les paramètres du projet (icône engrenage), allez dans "Paramètres du projet"
2. Faites défiler jusqu'à "Vos applications"
3. Cliquez sur l'icône Web `</>`
4. Donnez un nom à votre application : "Activity Day to Day Web"
5. Cochez "Configurer également Firebase Hosting"
6. Cliquez sur "Enregistrer l'application"

## Étape 4 : Récupérer la configuration Firebase

Vous verrez un objet de configuration qui ressemble à ceci :

```javascript
const firebaseConfig = {
  apiKey: "AIza....",
  authDomain: "activity-day-to-day.firebaseapp.com",
  projectId: "activity-day-to-day",
  storageBucket: "activity-day-to-day.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abc..."
};
```

**IMPORTANT** : Copiez cette configuration !

## Étape 5 : Mettre à jour le fichier index.html

1. Ouvrez le fichier `public/index.html`
2. Trouvez la section avec `firebaseConfig`
3. Remplacez les valeurs `YOUR_...` par vos vraies valeurs de configuration

```javascript
const firebaseConfig = {
    apiKey: "VOTRE_API_KEY",
    authDomain: "VOTRE_PROJECT_ID.firebaseapp.com",
    projectId: "VOTRE_PROJECT_ID",
    storageBucket: "VOTRE_PROJECT_ID.appspot.com",
    messagingSenderId: "VOTRE_MESSAGING_SENDER_ID",
    appId: "VOTRE_APP_ID"
};
```

## Étape 6 : Installer Firebase CLI

```bash
npm install -g firebase-tools
```

## Étape 7 : Se connecter à Firebase

```bash
firebase login
```

Une fenêtre de navigateur s'ouvrira pour vous connecter avec votre compte Google.

## Étape 8 : Initialiser le projet Firebase (déjà fait)

Le projet est déjà configuré avec les fichiers :
- `.firebaserc`
- `firebase.json`
- `firestore.rules`
- `firestore.indexes.json`

Vous devez juste mettre à jour le nom du projet dans `.firebaserc` si nécessaire.

## Étape 9 : Déployer les règles Firestore

```bash
firebase deploy --only firestore:rules
firebase deploy --only firestore:indexes
```

## Étape 10 : Initialiser les données (optionnel)

Vous pouvez créer manuellement les membres de la famille dans Firestore Console :

1. Allez dans Firestore Database
2. Créez une collection `family_members`
3. Ajoutez 4 documents avec les IDs : `papa`, `maman`, `bastien`, `florent`

Exemple pour le document `papa` :
```json
{
  "id": "papa",
  "name": "Papa",
  "color": "#2196F3",
  "tasksCompleted": 0
}
```

## Étape 11 : Tester localement

```bash
firebase serve
```

Ouvrez votre navigateur sur `http://localhost:5000`

## Étape 12 : Déployer sur Firebase Hosting

```bash
firebase deploy
```

Votre application sera disponible sur : `https://activity-day-to-day.web.app`

## Dépannage

### Erreur : "Firebase is not initialized"
- Vérifiez que vous avez bien mis à jour la configuration dans `index.html`
- Vérifiez que les scripts Firebase sont bien chargés

### Erreur : "Permission denied"
- Vérifiez les règles Firestore dans `firestore.rules`
- Déployez les règles avec `firebase deploy --only firestore:rules`

### Les tâches ne s'affichent pas
- Ouvrez la console du navigateur (F12) pour voir les erreurs
- Vérifiez que Firestore est bien activé dans la console Firebase
- Vérifiez que la configuration Firebase est correcte

## Sécurité

⚠️ **Important** : Les règles actuelles permettent à tout le monde de lire/écrire.
Pour une utilisation en production, vous devriez :

1. Activer Firebase Authentication
2. Modifier les règles Firestore pour restreindre l'accès
3. Ajouter une authentification dans l'application

## Support

Pour plus d'informations :
- [Documentation Firebase](https://firebase.google.com/docs)
- [Documentation Firestore](https://firebase.google.com/docs/firestore)
- [Documentation Firebase Hosting](https://firebase.google.com/docs/hosting)
