# 🔒 Guide de Sécurité Firebase

## Configuration Firebase dans le Code

### ✅ Clés API Firebase - Sécurité par Design

**IMPORTANT** : Les clés Firebase côté client (dans `index.html`) **ne sont PAS des secrets**.

#### Pourquoi c'est sécurisé ?

1. **Exposition publique par nature**
   - Ces clés sont visibles dans le navigateur (DevTools)
   - Elles sont conçues pour être publiques
   - Firebase ne les traite pas comme des secrets

2. **La sécurité vient des règles Firestore**
   - Les règles côté serveur (`firestore.rules`) protègent vos données
   - Même avec les clés, personne ne peut contourner vos règles
   - C'est le modèle de sécurité standard de Firebase

### ⚠️ Ce qu'il FAUT protéger

```bash
# ❌ NE JAMAIS commiter sur GitHub
- Clés API serveur (Firebase Admin SDK)
- Service Account JSON
- Secrets d'API tierces
- Tokens d'authentification

# ✅ OK de commiter sur GitHub
- Configuration Firebase client (apiKey, authDomain, etc.)
- Règles Firestore (firestore.rules)
- Configuration publique (firebase.json)
```

## Règles de Sécurité Firestore

### 🛡️ Protection Actuelle

Les règles ont été renforcées pour :

#### 1. Validation des Tâches
```javascript
// Vérification des champs obligatoires
- title (string, 1-200 caractères)
- assignedTo (papa, maman, bastien, florent uniquement)
- completed (boolean)
- priority (basse, moyenne, haute uniquement)
- category (quotidien, hebdomadaire, mensuel uniquement)
```

#### 2. Protection des Membres
```javascript
// family_members collection
- Lecture autorisée
- Modification uniquement de 'tasksCompleted'
- Création/Suppression interdite
```

### 🔐 Niveaux de Sécurité

#### Niveau 1 : Actuel (Famille seulement)
```javascript
// Tout le monde peut lire/écrire avec validation
allow read: if true;
allow create/update: if [validation des données];
```

**Avantages** :
- Simple à utiliser
- Pas besoin d'authentification
- Idéal pour un usage familial privé

**Inconvénients** :
- N'importe qui avec l'URL peut accéder
- Pas de traçabilité des modifications

#### Niveau 2 : Avec Authentification (Recommandé pour production)
```javascript
// Seulement les utilisateurs authentifiés
allow read: if request.auth != null;
allow write: if request.auth != null 
             && request.auth.token.email.matches('.*@famille.com$');
```

**Avantages** :
- Contrôle d'accès par utilisateur
- Traçabilité complète
- Protection contre les accès externes

#### Niveau 3 : Permissions Avancées
```javascript
// Chaque membre ne peut modifier que ses tâches
allow update: if request.auth.uid == resource.data.assignedToUid;
```

## 📋 Actions de Sécurité Recommandées

### 1. Configuration Firebase Console

#### A. Limiter les Domaines Autorisés
```
Console Firebase → Authentication → Settings → Authorized domains
Ajouter seulement : activity-day-to-day.web.app
Retirer : localhost (après les tests)
```

#### B. Activer App Check (Optionnel mais recommandé)
```
Console Firebase → App Check
Active la protection contre les bots et abus
```

#### C. Quotas et Alertes
```
Console Firebase → Usage and billing
Définir des alertes si dépassement
Limite de lectures/écritures par jour
```

### 2. Bonnes Pratiques de Développement

#### Déploiement des Règles
```bash
# Toujours déployer les règles après modification
firebase deploy --only firestore:rules

# Tester les règles avant déploiement
firebase emulators:start
```

#### Monitoring
```bash
# Surveiller les logs
firebase functions:log

# Vérifier l'utilisation
# Console Firebase → Firestore → Usage
```

## 🚨 En Cas de Compromission

### Si les clés Firebase sont exposées (ce qui est normal) :

**Pas de panique** - C'est le fonctionnement normal !

**Actions** :
1. Vérifier les règles Firestore sont bien déployées
2. Vérifier l'utilisation dans la console Firebase
3. Activer App Check si abus détectés
4. Ajouter l'authentification si nécessaire

### Si un Service Account est exposé (grave) :

**Actions immédiates** :
1. Révoquer immédiatement le Service Account
2. Générer de nouvelles clés
3. Mettre à jour `.gitignore`
4. Supprimer du dépôt Git (historique compris)

## 📊 Monitorer l'Utilisation

### Indicateurs à Surveiller

1. **Nombre de lectures/écritures**
   - Quota gratuit : 50K lectures/jour, 20K écritures/jour
   - Vérifier dans Console Firebase → Firestore → Usage

2. **Nombre de documents**
   - Gratuit jusqu'à 1 Go
   - Surveiller la croissance

3. **Accès suspects**
   - Pics d'utilisation inhabituels
   - Créations massives de données

## 🔧 Migration vers l'Authentification (Future)

### Étape 1 : Activer Firebase Authentication
```bash
# Console Firebase → Authentication → Get Started
# Activer "Email/Password" ou "Google Sign-In"
```

### Étape 2 : Modifier les Règles
```javascript
// Restreindre aux utilisateurs authentifiés
match /tasks/{taskId} {
  allow read, write: if request.auth != null;
}
```

### Étape 3 : Ajouter le Login dans l'App
```javascript
// Ajouter Firebase Auth SDK
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
```

## 📚 Ressources

- [Règles de Sécurité Firestore](https://firebase.google.com/docs/firestore/security/get-started)
- [App Check](https://firebase.google.com/docs/app-check)
- [Bonnes Pratiques Firebase](https://firebase.google.com/docs/firestore/best-practices)
- [Quotas et Limites](https://firebase.google.com/docs/firestore/quotas)

## ✅ Check-list de Sécurité

Avant le déploiement en production :

- [ ] Règles Firestore renforcées et déployées
- [ ] Domaines autorisés configurés
- [ ] Quotas et alertes définis
- [ ] App Check activé (optionnel)
- [ ] Tests de sécurité effectués
- [ ] Documentation lue par toute l'équipe
- [ ] Plan de monitoring en place

Pour un usage familial privé, les règles actuelles avec validation sont **suffisantes**.
