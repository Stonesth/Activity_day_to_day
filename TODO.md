# TODO - Activity Day to Day

## Demandes Actuelles

### 1. Configuration Firebase
- [ ] Créer un compte Firebase si nécessaire
- [ ] Créer un nouveau projet Firebase dans la console
- [ ] Installer Firebase CLI (`npm install -g firebase-tools`)
- [ ] Se connecter à Firebase (`firebase login`)
- [ ] Initialiser Firebase dans le projet (`firebase init`)

### 2. Configuration Firestore
- [ ] Activer Firestore dans la console Firebase
- [ ] Choisir le mode de base de données (production ou test)
- [ ] Configurer les règles de sécurité
- [ ] Créer la structure des collections

### 3. Développement de l'Application
- [ ] Créer la page HTML principale avec Firebase SDK
- [ ] Développer le système d'affichage des tâches
- [ ] Implémenter le formulaire d'ajout de tâches
- [ ] Créer le système de check-list interactif
- [ ] Gérer les états (complété/non complété)
- [ ] Ajouter la synchronisation temps réel

### 4. Design et UX
- [ ] Reprendre le design coloré du fichier HTML existant
- [ ] Rendre l'interface responsive
- [ ] Ajouter des animations et transitions
- [ ] Optimiser pour mobile

### 5. Fonctionnalités Principales
- [ ] CRUD complet des tâches (Create, Read, Update, Delete)
- [ ] Filtrage par personne (Papa, Maman, Bastien, Florent)
- [ ] Persistance des données dans Firestore
- [ ] Accès multi-utilisateurs en temps réel
- [ ] Système de check-list pour chaque tâche

### 6. Tests et Déploiement
- [ ] Tester l'application localement
- [ ] Vérifier la synchronisation temps réel
- [ ] Déployer sur Firebase Hosting
- [ ] Partager l'URL avec la famille

## Prochaines Étapes Immédiates

1. **Installer Firebase CLI**
   ```bash
   npm install -g firebase-tools
   ```

2. **Se connecter à Firebase**
   ```bash
   firebase login
   ```

3. **Initialiser le projet**
   ```bash
   firebase init
   ```
   - Sélectionner Firestore et Hosting
   - Choisir un projet existant ou en créer un nouveau

## Questions à Clarifier

- [ ] Avez-vous déjà un compte Firebase/Google ?
- [ ] Souhaitez-vous une authentification des utilisateurs ?
- [ ] Y a-t-il des tâches récurrentes (quotidiennes, hebdomadaires) ?
- [ ] Voulez-vous un système de notifications ?

## Références

- Fichier de référence : `tableau-taches-familiales.html`
- Spécifications détaillées : `SPECIFICATIONS.md`
