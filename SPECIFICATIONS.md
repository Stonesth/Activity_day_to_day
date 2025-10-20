# Spécifications du Projet Activity Day to Day

## Objectif du Projet

Transformer le tableau statique des tâches familiales en une application web dynamique avec Firebase, permettant à toute la famille de gérer et suivre les tâches quotidiennes en temps réel.

## Fonctionnalités Principales

### 1. Gestion des Tâches
- [ ] Créer, modifier et supprimer des tâches
- [ ] Assigner des tâches à des membres de la famille
- [ ] Marquer les tâches comme complétées
- [ ] Système de check-list pour chaque tâche

### 2. Membres de la Famille
- [ ] Papa (couleur : Bleu #2196F3)
- [ ] Maman (couleur : Rose #E91E63)
- [ ] Bastien (couleur : Vert #4CAF50)
- [ ] Florent (couleur : Orange #FF9800)

### 3. Persistance des Données
- [ ] Base de données Firebase Firestore
- [ ] Synchronisation en temps réel
- [ ] Les tâches restent sauvegardées après refresh
- [ ] Accessible via Internet par toute la famille

### 4. Interface Utilisateur
- [ ] Design responsive (mobile et desktop)
- [ ] Interface similaire au tableau HTML existant
- [ ] Code couleur par personne
- [ ] Animation et feedback visuel lors des interactions

## Architecture Technique

### Stack Technologique
- **Frontend** : HTML5, CSS3, JavaScript (Vanilla ou React)
- **Backend** : Firebase
  - Firebase Hosting : Hébergement de l'application
  - Firebase Firestore : Base de données NoSQL
  - Firebase Authentication : Authentification (optionnelle)
- **Déploiement** : Automatique via Firebase CLI

### Structure de la Base de Données

#### Collection `tasks`
```json
{
  "id": "unique_id",
  "title": "Nom de la tâche",
  "description": "Description détaillée",
  "assignedTo": "papa|maman|bastien|florent",
  "completed": false,
  "stars": 3,
  "createdAt": "timestamp",
  "updatedAt": "timestamp",
  "category": "quotidien|hebdomadaire|mensuel"
}
```

**Système d'étoiles** :
- Chaque tâche a une valeur de 1 à 5 étoiles ⭐
- Les étoiles représentent l'importance ou la difficulté de la tâche
- Les étoiles sont comptabilisées uniquement quand la tâche est complétée
- Le total d'étoiles gagnées est affiché pour chaque personne

#### Collection `family_members`
```json
{
  "id": "papa",
  "name": "Papa",
  "color": "#2196F3",
  "tasksCompleted": 0
}
```

## Phases de Développement

### Phase 1 : Configuration Firebase ✅
- [x] Créer un projet Firebase
- [ ] Initialiser Firebase dans le projet local
- [ ] Configurer Firestore
- [ ] Configurer Firebase Hosting
- [ ] Créer les règles de sécurité Firestore

### Phase 2 : Structure du Projet
- [ ] Créer la structure de fichiers
- [ ] Mettre en place HTML de base
- [ ] Configurer les assets CSS
- [ ] Intégrer le SDK Firebase

### Phase 3 : Développement Frontend
- [ ] Interface d'affichage des tâches
- [ ] Formulaire d'ajout de tâches
- [ ] Système de filtrage par personne
- [ ] Interface de modification/suppression
- [ ] Système de check-list interactif

### Phase 4 : Intégration Firebase
- [ ] CRUD des tâches dans Firestore
- [ ] Synchronisation temps réel
- [ ] Gestion des erreurs
- [ ] Optimisation des requêtes

### Phase 5 : Déploiement
- [ ] Tests de l'application
- [ ] Déploiement sur Firebase Hosting
- [ ] Configuration du domaine (optionnel)
- [ ] Documentation utilisateur

## Fonctionnalités Futures (V2)

- [ ] Authentification des membres de la famille
- [ ] Notifications push pour les tâches
- [ ] Statistiques et graphiques de progression
- [ ] Système de récompenses/points
- [ ] Export des données en PDF
- [ ] Mode sombre
- [ ] Application mobile (PWA)
- [ ] Rappels automatiques par email

## Notes Importantes

- Conserver le fichier `tableau-taches-familiales.html` comme référence
- Privilégier la simplicité d'utilisation
- Interface adaptée pour tous les âges
- Performance optimale sur mobile

## Ressources

- Documentation Firebase : https://firebase.google.com/docs
- Firebase Console : https://console.firebase.google.com/
- Firestore Security Rules : https://firebase.google.com/docs/firestore/security/get-started
