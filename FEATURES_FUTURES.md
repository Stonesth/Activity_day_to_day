# 💡 Fonctionnalités Futures - Activity Day to Day

Ce document liste les idées et fonctionnalités à implémenter dans le futur pour améliorer l'application de gestion des tâches familiales.

---

## 🔴 1. Système de Pénalités avec Étoiles Négatives

### 📋 Description
Ajouter un système de pénalités pour gérer les mauvais comportements des enfants, avec impact négatif sur les étoiles.

### 🎯 Objectif
Responsabiliser les enfants sur leur comportement avec un système visible et concret, complétant le système de récompenses existant.

### 🔧 Fonctionnalités à Implémenter

#### 1.1 Types de Pénalités
- ❌ **Crier sur Maman** : -3⭐
- ❌ **Crier sur Papa** : -3⭐
- ❌ **Dire "J'ai la flemme"** : -2⭐
- ❌ **Refus de faire une tâche** : -2⭐
- ❌ **Impolitesse** : -1⭐
- ❌ **Bagarre avec frère/sœur** : -2⭐
- ❌ Autres à définir...

#### 1.2 Design Visuel
```
┌─────────────────────────────────────────┐
│ ❌ Pénalités                            │
├─────────────────────────────────────────┤
│ ⛔ Crier sur Maman        -3⭐  [X]     │ ← Rouge
│ ⛔ Dire "j'ai la flemme"  -2⭐  [X]     │ ← Rouge
└─────────────────────────────────────────┘
```

**Couleurs** :
- Rouge (#f44336) pour les pénalités
- Icônes : ⛔, ❌, ou ⭐ en rouge

#### 1.3 Impact sur la Progression
- **Étoiles totales** = Étoiles gagnées - Étoiles pénalités
- **Barre de progression** peut reculer si pénalité
- **Paliers** peuvent être perdus si on redescend sous le seuil
- **Historique** des pénalités visible pour les parents

#### 1.4 Interface Utilisateur

**Bouton "Ajouter une Pénalité"** :
```
┌─────────────────────────────────────────┐
│ 👦 Bastien [Reset]  ⭐ 14/42  5/18 tâches│
│ [➕ Ajouter une tâche] [⛔ Pénalité]    │ ← Nouveau
└─────────────────────────────────────────┘
```

**Modale de Pénalité** :
```
┌─────────────────────────────────────────┐
│        ⛔ Ajouter une Pénalité          │
├─────────────────────────────────────────┤
│ Personne : [Bastien ▼]                  │
│                                          │
│ Type de pénalité :                       │
│ ○ Crier sur Maman (-3⭐)                │
│ ○ Crier sur Papa (-3⭐)                 │
│ ○ Dire "j'ai la flemme" (-2⭐)          │
│ ○ Refus de tâche (-2⭐)                 │
│ ○ Impolitesse (-1⭐)                    │
│ ○ Autre... [-2⭐]                       │
│                                          │
│ Commentaire (optionnel) :                │
│ [________________________________]       │
│                                          │
│ [Annuler] [Appliquer la Pénalité]       │
└─────────────────────────────────────────┘
```

#### 1.5 Base de Données
Nouvelle collection ou champ dans Firestore :

```javascript
{
  id: "penalty_001",
  assignedTo: "bastien",
  type: "crier_sur_maman",
  stars: -3,
  comment: "A crié très fort à table",
  createdAt: timestamp,
  createdBy: "papa" // ou "maman"
}
```

#### 1.6 Affichage des Statistiques
```
┌─────────────────────────────────────────┐
│ 👦 Bastien                               │
│ ⭐ Total : 14/42                         │
│   - Gagné : 20⭐                         │
│   - Pénalités : -6⭐                     │
│                                          │
│ Historique des pénalités (3) :          │
│ • 21/10 15:30 - Crier sur Maman (-3⭐)  │
│ • 21/10 18:00 - J'ai la flemme (-2⭐)   │
│ • 20/10 20:00 - Impolitesse (-1⭐)      │
└─────────────────────────────────────────┘
```

### ⚠️ Considérations Pédagogiques
- Utiliser avec **modération** pour ne pas décourager
- **Expliquer clairement** pourquoi la pénalité est donnée
- Possibilité de **rachat** via tâches supplémentaires ?
- **Limite** : Ne pas descendre en dessous de 0⭐

---

## 🎁 2. Système de Tâches Bonus (75% + 25%)

### 📋 Description
Diviser la progression en deux niveaux : tâches normales (0-75%) et tâches bonus (75-100%) pour encourager les efforts supplémentaires.

### 🎯 Objectif
Encourager les enfants à aller au-delà du minimum requis avec des tâches valorisantes et optionnelles.

### 🔧 Fonctionnalités à Implémenter

#### 2.1 Deux Types de Tâches

**Tâches Normales** (Obligatoires) :
- Représentent 75% de la progression
- Tâches quotidiennes habituelles
- Débloquent les 3 premiers paliers (25%, 50%, 75%)

**Tâches Bonus** (Optionnelles) :
- Représentent 25% de la progression
- Tâches supplémentaires valorisantes
- Nécessaires pour débloquer le 4ème palier (100%)
- Plus difficiles ou plus longues

#### 2.2 Calcul de la Progression

```
Progression Totale = (Tâches Normales × 0.75) + (Tâches Bonus × 0.25)
```

**Exemple** :
```
Bastien a :
- 10 tâches normales, 8 complétées = 80% de 75% = 60%
- 4 tâches bonus, 2 complétées = 50% de 25% = 12.5%
Total : 60% + 12.5% = 72.5%
```

#### 2.3 Design Visuel

**Badge "BONUS"** :
```
┌─────────────────────────────────────────┐
│ ✅ Ranger sa chambre          ⭐⭐⭐   │ ← Normal
│ ✅ Faire ses devoirs          ⭐⭐⭐⭐ │ ← Normal
│ ⭕ Aider Maman à cuisiner 🎁  ⭐⭐⭐⭐⭐│ ← BONUS
│ ⭕ Ranger le garage      🎁  ⭐⭐⭐⭐⭐│ ← BONUS
└─────────────────────────────────────────┘
```

**Barre de Progression Divisée** :
```
┌─────────────────────────────────────────┐
│ ████████████░░░░ | ░░░░  72.5%          │
│ 0%        75%    | 100%                 │
│ [Normales]       | [Bonus]              │
└─────────────────────────────────────────┘
```

#### 2.4 Exemples de Tâches Bonus

**Pour Bastien & Florent** :
- 🎁 Aider sans qu'on le demande (+5⭐)
- 🎁 Ranger la chambre de son frère (+4⭐)
- 🎁 Faire les devoirs sans rechigner (+3⭐)
- 🎁 Apprendre quelque chose de nouveau (+5⭐)
- 🎁 Lire un livre (+4⭐)
- 🎁 Être particulièrement gentil toute la journée (+5⭐)

**Pour Papa & Maman** :
- 🎁 Projet DIY avec les enfants (+5⭐)
- 🎁 Sortie éducative en famille (+4⭐)
- 🎁 Cuisine ensemble (+3⭐)

#### 2.5 Interface Utilisateur

**Filtre par Type** :
```
┌─────────────────────────────────────────┐
│ 👦 Bastien                               │
│ [Toutes] [Normales] [Bonus]  ← Filtres  │
│                                          │
│ Tâches Normales (8/10) - 60%            │
│ ✅ Ranger sa chambre          ⭐⭐⭐   │
│ ⭕ Faire ses devoirs          ⭐⭐⭐⭐ │
│                                          │
│ Tâches Bonus (2/4) - 12.5%   🎁         │
│ ✅ Aider Maman               ⭐⭐⭐⭐⭐│
│ ⭕ Ranger le garage          ⭐⭐⭐⭐⭐│
└─────────────────────────────────────────┘
```

**Formulaire d'Ajout** :
```
┌─────────────────────────────────────────┐
│        ➕ Ajouter une Tâche             │
├─────────────────────────────────────────┤
│ Nom : [Aider Maman à cuisiner]          │
│ Type : ○ Normale  ● Bonus 🎁            │
│ Étoiles : [5] ⭐                         │
│                                          │
│ ℹ️ Les tâches bonus comptent pour       │
│    les 25% restants (75-100%)           │
└─────────────────────────────────────────┘
```

#### 2.6 Base de Données

Ajouter un champ `isBonus` :

```javascript
{
  id: "task_001",
  title: "Aider Maman à cuisiner",
  assignedTo: "bastien",
  stars: 5,
  isBonus: true,  // ← Nouveau champ
  completed: false,
  createdAt: timestamp
}
```

#### 2.7 Paliers et Récompenses Adaptés

```
25% : 📺 5min  (Tâches normales)
50% : 📺 10min (Tâches normales)
75% : 📺 15min + 🎮 15min (Tâches normales complètes !)
────────────────────────────────────
100%: 📺 20min ou 🎮 20min (Avec tâches bonus ! 🎁)
```

### 💡 Variantes Possibles

**Variante 1 : Déblocage progressif**
- Les tâches bonus n'apparaissent que quand on atteint 75%
- Motivation : "Bravo ! Tu as débloqué les tâches bonus !"

**Variante 2 : Palier "Excellence"**
- 100% = Badge "Excellent" ou "Champion de la semaine"
- Récompense spéciale (sortie, privilège, etc.)

**Variante 3 : Points multiplicateurs**
- Tâches bonus = 1.5× les étoiles normales
- Encourage encore plus les efforts supplémentaires

### ⚠️ Considérations
- Les tâches bonus doivent être **vraiment optionnelles**
- Ne pas mettre la pression : 75% est déjà très bien
- Les récompenses bonus doivent être **significatives** pour motiver

---

## ⏰ 3. Reset Automatique Quotidien des Tâches

### 📋 Description
Implémenter un système de remise à zéro automatique de toutes les tâches cochées à une heure prédéfinie chaque jour.

### 🎯 Objectif
Automatiser la gestion quotidienne des tâches pour éviter la manipulation manuelle et assurer une remise à zéro cohérente pour toute la famille.

### 🔧 Fonctionnalités à Implémenter

#### 3.1 Configuration de l'Heure de Reset

**Interface Admin** :
```
┌─────────────────────────────────────────┐
│        ⚙️ Paramètres Système            │
├─────────────────────────────────────────┤
│ Reset Automatique des Tâches :          │
│                                          │
│ ✅ Activer le reset quotidien            │
│                                          │
│ Heure de reset : [06:00] ⏰             │
│ Fuseau horaire : [Europe/Paris ▼]       │
│                                          │
│ Jours actifs :                           │
│ ☑️ Lundi    ☑️ Mardi   ☑️ Mercredi     │
│ ☑️ Jeudi    ☑️ Vendredi ☑️ Samedi      │
│ ☑️ Dimanche                              │
│                                          │
│ [Sauvegarder] [Test Reset]               │
└─────────────────────────────────────────┘
```

#### 3.2 Mécanisme de Reset

**Fonctionnement** :
1. **Vérification périodique** : Toutes les minutes, vérifier si l'heure de reset est atteinte
2. **Conditions de reset** :
   - Heure actuelle >= heure configurée
   - Jour actuel activé dans la configuration
   - Pas de reset déjà effectué aujourd'hui
3. **Actions de reset** :
   - Marquer toutes les tâches comme `completed: false`
   - Conserver l'historique des tâches (ne pas supprimer)
   - Logger l'opération de reset
   - Notifier les utilisateurs connectés

#### 3.3 Historique et Statistiques

**Sauvegarde avant Reset** :
```javascript
// Collection "daily_stats" dans Firestore
{
  id: "stats_2025_11_11",
  date: "2025-11-11",
  resetTime: "06:00",
  beforeReset: {
    papa: { completed: 8, total: 10, stars: 24 },
    maman: { completed: 9, total: 12, stars: 28 },
    bastien: { completed: 15, total: 18, stars: 45 },
    florent: { completed: 12, total: 15, stars: 36 }
  },
  resetBy: "system_auto",
  createdAt: timestamp
}
```

#### 3.4 Interface de Monitoring

**Dashboard Reset** :
```
┌─────────────────────────────────────────┐
│        📊 Historique des Resets         │
├─────────────────────────────────────────┤
│ Prochain reset : Demain à 06:00 ⏰      │
│ Dernier reset : Aujourd'hui à 06:00 ✅  │
│                                          │
│ Historique (7 derniers jours) :         │
│                                          │
│ 11/11/2025 06:00 ✅ Auto - 44 tâches    │
│ 10/11/2025 06:00 ✅ Auto - 42 tâches    │
│ 09/11/2025 06:00 ✅ Auto - 38 tâches    │
│ 08/11/2025 06:00 ✅ Auto - 41 tâches    │
│ 07/11/2025 06:00 ✅ Auto - 39 tâches    │
│ 06/11/2025 06:00 ✅ Auto - 43 tâches    │
│ 05/11/2025 06:00 ✅ Auto - 37 tâches    │
│                                          │
│ [Voir Détails] [Forcer Reset Maintenant]│
└─────────────────────────────────────────┘
```

#### 3.5 Notifications et Feedback

**Notification lors du Reset** :
```
┌─────────────────────────────────────────┐
│        🔄 Reset Automatique             │
├─────────────────────────────────────────┤
│ ✅ Toutes les tâches ont été remises     │
│    à zéro à 06:00 ce matin              │
│                                          │
│ Statistiques d'hier :                   │
│ • Papa : 8/10 tâches (24⭐)             │
│ • Maman : 9/12 tâches (28⭐)            │
│ • Bastien : 15/18 tâches (45⭐)         │
│ • Florent : 12/15 tâches (36⭐)         │
│                                          │
│ 🎉 Bonne journée et bon courage !       │
│                                          │
│ [OK] [Voir Détails]                     │
└─────────────────────────────────────────┘
```

#### 3.6 Configuration Technique

**Variables d'Environnement** :
```javascript
// Configuration par défaut
const RESET_CONFIG = {
  enabled: true,
  time: "06:00",
  timezone: "Europe/Paris",
  days: [1, 2, 3, 4, 5, 6, 0], // Lun-Dim
  notifications: {
    email: {
      enabled: true,
      address: "pierre.thonon@gmail.com",
      onSuccess: true,
      onError: true,
      weeklyStats: true
    }
  }
};
```

**Implémentation avec Cloud Functions** :
```javascript
// Firebase Cloud Function - Scheduled
exports.dailyTaskReset = functions
  .region('europe-west1')
  .pubsub
  .schedule('0 6 * * *') // Tous les jours à 6h
  .timeZone('Europe/Paris')
  .onRun(async (context) => {
    try {
      // 1. Sauvegarder les statistiques
      const stats = await saveStatistics();
      
      // 2. Effectuer le reset
      await resetAllTasks();
      
      // 3. Envoyer email de confirmation
      await sendSuccessEmail(stats);
      
    } catch (error) {
      // Envoyer email d'erreur
      await sendErrorEmail(error);
      throw error;
    }
  });

// Fonction d'envoi d'email de succès
async function sendSuccessEmail(stats) {
  const config = await getResetConfig();
  if (!config.notifications.email.enabled || !config.notifications.email.onSuccess) {
    return;
  }
  
  const emailContent = generateSuccessEmailContent(stats);
  await sendEmail(config.notifications.email.address, emailContent);
}

// Fonction d'envoi d'email d'erreur  
async function sendErrorEmail(error) {
  const config = await getResetConfig();
  if (!config.notifications.email.enabled || !config.notifications.email.onError) {
    return;
  }
  
  const emailContent = generateErrorEmailContent(error);
  await sendEmail(config.notifications.email.address, emailContent);
}
```

#### 3.7 Notifications Email

**Configuration Email** :
```
┌─────────────────────────────────────────┐
│        📧 Notifications Email           │
├─────────────────────────────────────────┤
│ ✅ Activer les notifications email      │
│                                          │
│ Email de notification :                  │
│ [pierre.thonon@gmail.com]               │
│                                          │
│ Types de notifications :                 │
│ ☑️ Reset quotidien effectué             │
│ ☑️ Erreur lors du reset                 │
│ ☑️ Statistiques hebdomadaires           │
│                                          │
│ [Tester Email] [Sauvegarder]            │
└─────────────────────────────────────────┘
```

**Contenu des Emails** :

*Email de Reset Quotidien* :
```
Objet: ✅ Reset Quotidien Effectué - Activity Day to Day

Bonjour,

Le reset automatique des tâches a été effectué avec succès ce matin à 06:00.

📊 Statistiques d'hier (10/11/2025) :
• Papa : 8/10 tâches (80%) - 24⭐
• Maman : 9/12 tâches (75%) - 28⭐  
• Bastien : 15/18 tâches (83%) - 45⭐
• Florent : 12/15 tâches (80%) - 36⭐

🏆 Performance Familiale : 80% (44/55 tâches)
⭐ Total Étoiles : 133⭐

Bonne journée !
Activity Day to Day
```

*Email d'Erreur* :
```
Objet: ⚠️ Erreur Reset Automatique - Activity Day to Day

Bonjour,

Une erreur s'est produite lors du reset automatique ce matin.

❌ Erreur : Timeout de connexion à Firestore
🕐 Heure : 06:00
🔄 Statut : Échec

Action requise : Vérifier la configuration Firebase ou effectuer un reset manuel.

Cordialement,
Activity Day to Day
```

### ⚠️ Considérations Techniques

#### 3.8 Sécurité et Fiabilité
- **Double vérification** : Vérifier que le reset n'a pas déjà eu lieu
- **Logs détaillés** : Tracer toutes les opérations de reset
- **Rollback** : Possibilité d'annuler un reset en cas d'erreur
- **Monitoring** : Alertes si le reset échoue plusieurs fois

#### 3.9 Performance
- **Batch operations** : Traiter toutes les tâches en une seule transaction
- **Indexation** : Index sur les champs `completed` et `assignedTo`
- **Cache** : Éviter les lectures multiples de configuration

#### 3.10 UX et Communication
- **Prévisibilité** : Afficher clairement quand aura lieu le prochain reset
- **Transparence** : Historique visible de tous les resets
- **Contrôle** : Possibilité de forcer un reset manuel si nécessaire

### 💡 Améliorations Futures du Reset Automatique

**Phase 1 : Reset Simple** ✅ **TERMINÉE** (11/11/2025)
- ✅ Reset à heure fixe pour tous (06:00)
- ✅ Configuration basique (heure + jours)
- ✅ Notifications email avec statistiques
- ✅ Sauvegarde automatique des stats quotidiennes
- ✅ Cloud Function déployée et opérationnelle

**Phase 2 : Interface Admin et Configuration** (À faire)
- 🔧 Interface admin pour modifier :
  - Heure de reset
  - Jours actifs
  - Email de notification
  - Activer/désactiver le système
- 📊 Dashboard de monitoring :
  - Historique des resets (7 derniers jours)
  - Graphiques de progression
  - Statistiques familiales
- ⚙️ Bouton "Test Reset" manuel
- 🔄 Bouton "Forcer Reset Maintenant"

**Phase 3 : Statistiques Avancées** (À faire)
- 📧 Rapports hebdomadaires par email (dimanche soir)
- 📈 Graphiques de progression sur 30 jours
- 🏆 Comparaisons de performance (qui s'améliore ?)
- 📊 Tendances et analyses :
  - Meilleurs jours de la semaine
  - Périodes de baisse/hausse
  - Objectifs atteints vs non atteints
- 💾 Export des données (CSV, Excel)

**Phase 4 : Intelligence et Notifications** (Futur)
- 🤖 Apprentissage des habitudes familiales
- 💡 Suggestions d'optimisation des horaires
- 🔮 Prédictions de performance
- 📱 Notifications push sur mobile
- 🎯 Alertes si performance en baisse
- 🏅 Badges et récompenses automatiques

---

## 📅 Planning d'Implémentation (Suggestion)

### Phase 1 : Reset Automatique ✅ **COMPLÉTÉE** (11/11/2025)
1. ✅ Créer la configuration de reset dans Firestore
2. ✅ Implémenter la Cloud Function de reset quotidien
3. ✅ Créer le système de sauvegarde des statistiques
4. ✅ Implémenter les notifications email
5. ✅ Configurer les secrets email (Gmail App Password)
6. ✅ Déployer et tester

**Temps réel** : 3 heures
**Statut** : ✅ Opérationnel - Premier reset demain 12/11/2025 à 06:00

**Ce qui fonctionne** :
- Reset automatique quotidien à 06:00
- Sauvegarde des stats dans `daily_stats`
- Email quotidien à pierre.thonon@gmail.com
- Collection `reset_config` configurée

**Ce qui reste à faire** :
- Interface admin pour modifier la configuration
- Dashboard de monitoring
- Bouton de test/reset manuel

### Phase 2 : Tâches Bonus (Moyenne priorité)
1. Ajouter le champ `isBonus` à la base de données
2. Modifier le formulaire d'ajout
3. Adapter le calcul de progression
4. Ajuster l'affichage de la barre
5. Tester et déployer

**Temps estimé** : 2-3 heures

### Phase 3 : Système de Pénalités (Plus complexe)
1. Concevoir la structure de données
2. Créer l'interface d'ajout de pénalité
3. Implémenter le calcul des étoiles négatives
4. Ajouter l'historique des pénalités
5. Adapter l'affichage des statistiques
6. Tester en famille et ajuster

**Temps estimé** : 4-6 heures

---

## 🎨 Mockups et Design

*(À ajouter : captures d'écran ou dessins des interfaces)*

---

## 📝 Notes et Discussions

### Questions à Résoudre

**Pénalités** :
- Qui peut ajouter une pénalité ? (Seulement mode Admin ?)
- Peut-on supprimer une pénalité ? (Si erreur ou pardon)
- Limite de pénalités par jour ?

**Tâches Bonus** :
- Les tâches bonus expirent-elles ?
- Peuvent-elles être récurrentes ?
- Limite du nombre de tâches bonus ?

### Feedback Famille
*(À compléter après tests avec la famille)*

---

**Dernière mise à jour** : 11 novembre 2025  
**Statut** :  
- ✅ Reset Automatique (Phase 1) - **IMPLÉMENTÉ ET OPÉRATIONNEL**
- 💡 Tâches Bonus - Pas encore implémenté
- 💡 Pénalités - Pas encore implémenté

**Priorités** :  
1. **Haute** : Interface admin pour Reset Automatique (Phase 2)
2. **Moyenne** : Tâches Bonus
3. **Basse** : Système de Pénalités

---

## 📅 4. Activités Spécifiques par Jour de la Semaine

### 🎯 Objectif Principal
Ajouter de la granularité en permettant d'assigner des tâches/activités différentes selon les jours de la semaine, pour mieux refléter la réalité de l'organisation familiale.

### 📊 Analyse du Besoin

#### 🤔 Questions de Clarification à Résoudre

**1. PORTÉE - Qu'entendez-vous par "activités par jour" ?**

❓ **Option A : Tâches différentes selon les jours**
- Exemple : "Sortir les poubelles" uniquement le lundi
- Exemple : "Cours de piano" uniquement le mercredi
- Exemple : "Sport" le mardi et jeudi
- Les tâches s'affichent UNIQUEMENT les jours où elles sont assignées

❓ **Option B : Planning hebdomadaire complet**
- Vue calendrier avec les 7 jours de la semaine
- Chaque jour a sa propre liste de tâches
- Possibilité de voir la semaine complète d'un coup

❓ **Option C : Récurrence avec jours spécifiques**
- Les tâches actuelles + possibilité de définir "Actif le : [Lun] [Mar] [Mer]..."
- Les tâches inactives n'apparaissent pas ce jour-là
- Permet de gérer les activités régulières (cours, sport, corvées hebdo)

❓ **Option D : Autre chose ?**
- Décrivez votre vision exacte

---

**2. AFFICHAGE - Comment voulez-vous visualiser les activités ?**

❓ **Vue actuelle (par personne) :**
```
👦 Bastien
├── Tâche 1
├── Tâche 2
└── Tâche 3
```

❓ **Vue par jour :**
```
📅 Lundi 16/11
├── 👦 Bastien : Tâche 1, Tâche 2
├── 👧 Florent : Tâche 3
└── 👨 Papa : Tâche 4
```

❓ **Vue calendrier semaine :**
```
       Lun    Mar    Mer    Jeu    Ven    Sam    Dim
Bastien  3      2      4      3      2      1      0
Florent  2      3      2      3      2      1      0
Papa     5      4      6      5      4      3      2
```

❓ **Vue mixte (actuel + filtre jour) :**
- Garder la vue actuelle par personne
- Ajouter un sélecteur "Aujourd'hui | Lundi | Mardi | ..."
- Filtrer les tâches selon le jour sélectionné

---

**3. CRÉATION - Comment créer une tâche avec jours spécifiques ?**

❓ **Dans le formulaire d'ajout actuel, ajouter :**
```
┌─────────────────────────────────────────┐
│ Titre : [Sortir les poubelles]          │
│ Personne : [Bastien ▼]                  │
│ Étoiles : [3] ⭐                         │
│                                          │
│ 📅 Actif les jours suivants :            │
│ ☐ Lundi  ☑ Mardi  ☐ Mercredi           │
│ ☐ Jeudi  ☐ Vendredi ☐ Samedi ☐ Dimanche│
│                                          │
│ OU                                       │
│                                          │
│ ☑ Tous les jours (comme actuellement)   │
└─────────────────────────────────────────┘
```

---

**4. COMPATIBILITÉ - Que faire des tâches existantes ?**

❓ **Migration des tâches actuelles :**
- Option A : Toutes les tâches existantes = actives tous les jours
- Option B : Demander de reconfigurer chaque tâche
- Option C : Garder deux types : "quotidien" vs "spécifique jour"

---

**5. RESET - Impact sur le reset quotidien ?**

❓ **Le reset doit-il :**
- Option A : Réinitialiser TOUTES les tâches chaque jour (comportement actuel)
- Option B : Réinitialiser uniquement les tâches actives pour ce jour
- Option C : Avoir deux modes : "Reset simple" vs "Reset intelligent par jour"

---

**6. STATISTIQUES - Comment compter la progression ?**

❓ **Aujourd'hui on calcule :**
```
Bastien : 8/18 tâches complétées (44%)
```

❓ **Avec les jours, faut-il calculer :**
- Option A : Uniquement les tâches d'aujourd'hui (ex: 3/5 tâches du mercredi)
- Option B : La moyenne de toute la semaine
- Option C : Les deux (stats du jour + stats de la semaine)

---

**7. COMPLEXITÉ - Niveau de détail souhaité ?**

❓ **Niveau 1 : Simple (Rapide à implémenter)**
- Ajouter un champ "Jours actifs" aux tâches
- Filtrer l'affichage selon le jour actuel
- Garder l'interface actuelle

❓ **Niveau 2 : Moyen (Plus de fonctionnalités)**
- Niveau 1 + Vue calendrier hebdomadaire
- Statistiques par jour
- Possibilité de voir les autres jours

❓ **Niveau 3 : Complet (Grosse fonctionnalité)**
- Planning hebdomadaire complet
- Glisser-déposer entre les jours
- Modèles de semaine (semaine normale, vacances, etc.)
- Notifications "Tu as X tâches aujourd'hui"

---

### 💡 Cas d'Usage Réels

**Pourriez-vous me donner des exemples concrets de votre quotidien ?**

Exemple de réponse attendue :
```
- Lundi : Bastien a cours de piano → doit préparer son sac la veille
- Mardi & Jeudi : Jour de sport → douche obligatoire après
- Mercredi : Sortie des poubelles (uniquement mercredi soir)
- Week-end : Tâches ménagères plus importantes
- Etc.
```

---

### 🎨 Proposition d'Implémentation (Niveau 1 - Simple)

#### 📐 Design de l'Interface

**NAVIGATION DES JOURS (en haut de page) :**
```
┌──────────────────────────────────────────────────────────────────┐
│  ← Samedi | 📅 DIMANCHE 16/11/2025 | Lundi →                    │
│                                                                   │
│  [Dim] [Lun] [Mar] [Mer] [Jeu] [Ven] [Sam]  (← Boutons rapides) │
│   ✓                                                               │
└──────────────────────────────────────────────────────────────────┘

👦 Bastien [Reset] ⭐ 14/42  5/18 tâches du dimanche
[➕ Ajouter une tâche]
  
  ✅ Ranger sa chambre              ⭐⭐⭐
  ⭕ Préparer son sac pour lundi    ⭐⭐
  ⭕ Lire 20 minutes                ⭐⭐⭐⭐
  ...
```

**FORMULAIRE D'AJOUT DE TÂCHE (modifié) :**
```
┌──────────────────────────────────────────────────┐
│        ➕ Ajouter une Tâche                      │
├──────────────────────────────────────────────────┤
│ Nom : [Sortir les poubelles]                     │
│ Personne : [Bastien ▼]                           │
│ Étoiles : [3] ⭐                                  │
│                                                   │
│ 📅 Jours actifs :                                 │
│ ☐ Lun  ☐ Mar  ☑ Mer  ☐ Jeu  ☐ Ven  ☐ Sam  ☐ Dim │
│                                                   │
│ ☑ Tous les jours (cocher/décocher tout)          │
│                                                   │
│ [Annuler] [Ajouter]                               │
└──────────────────────────────────────────────────┘
```

---

#### 🔧 Modifications Techniques

**1. Base de Données (Firestore)**
Ajouter un nouveau champ `activeDays` aux tâches :

```javascript
// Structure actuelle
{
  id: "task_001",
  title: "Ranger sa chambre",
  assignedTo: "bastien",
  stars: 3,
  completed: false,
  order: 0,
  createdAt: timestamp
}

// Nouvelle structure
{
  id: "task_001",
  title: "Ranger sa chambre",
  assignedTo: "bastien",
  stars: 3,
  completed: false,
  order: 0,
  activeDays: [0, 1, 2, 3, 4, 5, 6],  // ← NOUVEAU : 0=Dim, 1=Lun, ... 6=Sam
  createdAt: timestamp
}
```

**2. Filtrage des Tâches**
```javascript
// Obtenir le jour actuel (0-6)
const currentDay = new Date().getDay();

// Filtrer les tâches pour n'afficher que celles du jour
tasks.filter(task => {
  // Si activeDays n'existe pas (anciennes tâches) → tous les jours
  if (!task.activeDays || task.activeDays.length === 0) {
    return true;
  }
  // Sinon, vérifier si le jour actuel est dans activeDays
  return task.activeDays.includes(currentDay);
});
```

**3. Navigation entre les Jours**
```javascript
// Variable globale pour le jour sélectionné
let selectedDay = new Date().getDay(); // Par défaut = aujourd'hui

// Fonction pour changer de jour
function changeDay(newDay) {
  selectedDay = newDay;
  renderTasks(); // Re-afficher avec le nouveau filtre
}
```

---

#### 🤔 Questions de Clarification Supplémentaires

**QUESTION 1 : Gestion de l'état "completed"**

Vous dites : "Je ferai une copie des tâches dans les jours où elle devront être."

❓ **Clarification nécessaire** : Comment gérer l'état "coché/décoché" ?

**Scénario** : 
- Lundi : Bastien a la tâche "Ranger sa chambre" (actif Lun, Mar, Mer)
- Lundi matin : Il coche la tâche ✅
- Mardi : La tâche réapparaît (même tâche, actif Lun-Mar-Mer)

**Options** :

**Option A : État partagé** (1 tâche, plusieurs jours)
- La tâche est la même pour Lun-Mar-Mer
- Si cochée lundi, elle reste cochée mardi et mercredi
- Reset quotidien à 6h : tout redémarre
- ✅ Plus simple à implémenter
- ❌ Si coché lundi, déjà coché mardi (pas de motivation pour refaire)

**Option B : État indépendant par jour** (Copie réelle)
- Créer 3 tâches séparées : "Ranger (Lun)", "Ranger (Mar)", "Ranger (Mer)"
- Chaque jour est indépendant
- Si cochée lundi, toujours déchochée mardi (nouvelle journée)
- ✅ Chaque jour est une nouvelle opportunité
- ❌ Plus complexe (beaucoup plus de tâches en base)

**Option C : État quotidien avec historique**
- 1 tâche avec champ `completedDays: [1, 3, 5]` (jours où elle a été cochée)
- Lundi coché → sauvegardé dans completedDays
- Mardi : vérifier si 2 (mardi) est dans completedDays → non → afficher décoché
- Reset quotidien : vider completedDays
- ✅ Bon compromis
- ⚠️ Complexité moyenne

**→ RÉPONSE : Option B - État indépendant par jour** ✅

**Implications importantes** :
- Une tâche "Ranger chambre" active Lun-Mar-Mer = 3 tâches distinctes en base
- Chaque jour a son propre état coché/décoché
- Lundi coché ne veut pas dire mardi coché
- ⚠️ Augmentation du nombre de tâches en base

---

**QUESTION 2 : Navigation - Indicateur visuel**

Quand vous naviguez vers un autre jour (ex: voir lundi alors qu'on est dimanche), comment indiquer qu'on n'est PAS sur aujourd'hui ?

**Proposition** :
```
┌──────────────────────────────────────────────────┐
│  ⚠️ VOUS CONSULTEZ : LUNDI 17/11                 │
│  (Aujourd'hui = Dimanche 16/11)                   │
│  [Retour à Aujourd'hui]                           │
└──────────────────────────────────────────────────┘
```

**→ RÉPONSE : OUI** ✅

---

**QUESTION 3 : Modification d'une tâche existante**

Si vous modifiez une tâche (ex: changer les jours actifs de Lun-Mer-Ven à Lun-Mar-Mer), que se passe-t-il ?

**Option A** : La modification s'applique immédiatement
- La tâche disparaît/apparaît selon les nouveaux jours

**Option B** : Demander confirmation si changement de jours

**→ RÉPONSE : Option A - Modification immédiate** ✅

---

**QUESTION 4 : Affichage du jour dans le titre de la tâche**

Actuellement : 
```
✅ Ranger sa chambre  ⭐⭐⭐
```

Avec les jours, voulez-vous afficher quels jours la tâche est active ?

**Option A** : Ne rien afficher (comme actuellement)
```
✅ Ranger sa chambre  ⭐⭐⭐
```

**Option B** : Afficher les jours sous la tâche
```
✅ Ranger sa chambre  ⭐⭐⭐
   📅 Lun, Mar, Mer, Jeu, Ven
```

**Option C** : Afficher une icône si tâche récurrente
```
✅ Ranger sa chambre  🔁 ⭐⭐⭐  (← icône récurrence)
```

**→ RÉPONSE : Option A - Ne rien afficher** ✅

---

**QUESTION 5 : Migration des tâches existantes**

Vous avez dit "Option A : toutes les tâches existantes = actives tous les jours"

**Confirmation** : Au déploiement, toutes les tâches actuelles seront dupliquées pour créer 7 instances (une par jour) ?

**→ RÉPONSE : OUI** ✅

---

**QUESTION 6 : Statistiques dans le header**

Actuellement :
```
👦 Bastien  ⭐ 14/42  5/18 tâches
```

Avec les jours :
```
👦 Bastien  ⭐ 14/42  5/18 tâches du dimanche
                       ↑ Uniquement les tâches actives aujourd'hui
```

**→ RÉPONSE : OUI** ✅

---

### 🚨 ANALYSE TECHNIQUE - Impact de l'Option B

**ATTENTION** : Vous avez choisi l'**Option B** (État indépendant par jour).

Cela change **significativement** l'approche technique par rapport au "Niveau 1 Simple" initial.

#### 📊 Implications Techniques

**AVANT (Niveau 1 Simple prévu) :**
```javascript
// 1 tâche en base
{
  id: "task_001",
  title: "Ranger sa chambre",
  assignedTo: "bastien",
  activeDays: [1, 2, 3],  // Lun, Mar, Mer
  completed: false
}
```

**MAINTENANT (Option B choisie) :**
```javascript
// 3 tâches distinctes en base
{
  id: "task_001_lun",
  title: "Ranger sa chambre",
  assignedTo: "bastien",
  dayOfWeek: 1,  // Lundi uniquement
  completed: false
}
{
  id: "task_001_mar",
  title: "Ranger sa chambre",
  assignedTo: "bastien",
  dayOfWeek: 2,  // Mardi uniquement
  completed: false
}
{
  id: "task_001_mer",
  title: "Ranger sa chambre",
  assignedTo: "bastien",
  dayOfWeek: 3,  // Mercredi uniquement
  completed: false
}
```

**Conséquences** :
- ⚠️ Multiplication du nombre de tâches en base
- ⚠️ Complexité de modification (modifier 3 tâches au lieu de 1)
- ⚠️ Complexité de suppression (supprimer 3 tâches au lieu de 1)
- ✅ Chaque jour indépendant (ce que vous voulez)

---

#### 🤔 NOUVELLES QUESTIONS CRITIQUES

**QUESTION 7 : Groupement des tâches récurrentes** 🔴

Si "Ranger sa chambre" est actif Lun-Mar-Mer, comment gérer l'édition/suppression ?

**Scénario** : Vous voulez modifier "Ranger sa chambre" pour tous les jours
- Option A : Créer une notion de "tâche parente" (templateId) qui lie les 3 tâches
  ```javascript
  {
    id: "task_001_lun",
    templateId: "template_123",  // ← Lie les tâches entre elles
    title: "Ranger sa chambre",
    dayOfWeek: 1
  }
  ```
  - Modifier le template = modifier les 3 tâches
  - Supprimer le template = supprimer les 3 tâches
  - ✅ Cohérent
  - ⚠️ Plus complexe

- Option B : Tâches complètement indépendantes
  - Pas de lien entre les 3 tâches "Ranger sa chambre"
  - Pour modifier : modifier chaque tâche une par une
  - Pour supprimer : supprimer chaque tâche une par une
  - ❌ Fastidieux
  - ✅ Simple techniquement

**→ RÉPONSE : Option B - Tâches complètement indépendantes** ✅

**Conséquences** :
- ❌ Pas de lien automatique entre les tâches
- ⚠️ Pour modifier le nom sur tous les jours : modifier manuellement chaque jour
- ⚠️ Pour supprimer sur tous les jours : supprimer manuellement chaque jour
- ✅ Maximum de simplicité technique
- ✅ Maximum de flexibilité (chaque jour peut évoluer indépendamment)

---

**QUESTION 8 : Création de tâche - Comment ça marche ?** 🔴

Quand vous créez une tâche avec les jours [Lun][Mar][Mer] cochés :

**Option A** : Créer immédiatement 3 tâches séparées
- 1 clic → 3 tâches créées en base
- Visibles immédiatement chaque jour

**Option B** : Créer un "template" qui génère les tâches au fur et à mesure
- Plus complexe, pas nécessaire pour votre besoin

**→ RÉPONSE : OUI - Création immédiate de multiples tâches** ✅

---

**QUESTION 9 : Migration des tâches existantes** 🔴

Vous avez actuellement (exemple) :
```
- "Ranger sa chambre" (Bastien)
- "Faire les devoirs" (Bastien)
- "Préparer le café" (Papa)
```

Vous avez dit "OUI" à la migration automatique. Cela veut dire :

**Scénario de migration** :
- 1 tâche "Ranger sa chambre" actuelle → 7 tâches (Dim, Lun, Mar, Mer, Jeu, Ven, Sam)
- Si vous avez 50 tâches actuellement → 350 tâches après migration (50 × 7)

**Questions** :
1. **Voulez-vous vraiment dupliquer toutes les tâches existantes × 7 ?**
2. **Ou préférez-vous migrer manuellement / sélectivement ?**

**Proposition alternative** :
- Migration : Garder les tâches actuelles avec `activeDays: [0,1,2,3,4,5,6]` (option ancienne)
- Nouvelles tâches : Système de jours séparés (option B)
- Les anciennes tâches restent "tous les jours" jusqu'à ce que vous les modifiez

**→ RÉPONSE : DUPLIQUER - Migration automatique × 7** ✅

**Implications** :
- ⚠️ Nombre de tâches en base sera multiplié par 7
- ⚠️ À faire uniquement sur l'environnement TEST d'abord
- ⚠️ Irréversible (ou difficile à annuler)

---

**QUESTION 10 : Édition d'une tâche - Interface** 🔴

Actuellement, en mode admin, vous cliquez sur ✏️ pour éditer une tâche.

**Avec l'Option B** : Si "Ranger sa chambre" existe Lun-Mar-Mer, qu'est-ce qui s'affiche ?

**Scénario** : Vous êtes lundi, vous voyez "Ranger sa chambre", vous cliquez ✏️

**Option A** : Éditer uniquement la tâche du lundi
- Modification = seulement lundi changé
- Les tâches Mar et Mer restent inchangées
- ❌ Incohérent si vous voulez changer le nom pour tous les jours

**Option B** : Éditer toutes les tâches liées (via templateId)
- Modal affiche : "Cette tâche est liée à 3 jours (Lun, Mar, Mer)"
- Modification = appliquée aux 3 jours
- ✅ Plus logique
- ⚠️ Nécessite le système de templateId (Question 7)

**→ RÉPONSE : Option A - Éditer uniquement le jour actuel** ✅

**Conséquences** :
- ⚠️ Pour changer le nom sur 3 jours : éditer 3 fois manuellement
- ✅ Simplicité maximale du code
- ✅ Flexibilité : chaque jour peut avoir des variations

---

**QUESTION 11 : Suppression - Interface** 🔴

Même question pour la suppression.

**Scénario** : Lundi, vous supprimez "Ranger sa chambre"

**Option A** : Supprime uniquement lundi
- Mardi et Mercredi : la tâche existe toujours
- ❌ Bizarre

**Option B** : Demander "Supprimer pour tous les jours (Lun, Mar, Mer) ?"
- Bouton [Supprimer uniquement lundi] [Supprimer tous les jours]
- ✅ Plus clair
- ⚠️ Nécessite le système de templateId

**→ RÉPONSE : Option A - Supprimer uniquement le jour actuel** ✅

**Conséquences** :
- ⚠️ Pour supprimer sur tous les jours : naviguer et supprimer chaque jour manuellement
- ✅ Simplicité maximale du code
- ✅ Permet de garder certains jours et supprimer d'autres

---

### ⏱️ Estimation Temps de Développement (FINALE)

**🎯 Avec tous vos choix (tâches totalement indépendantes) :**

| Tâche | Temps estimé |
|-------|--------------|
| 1. Structure base de données (`dayOfWeek` uniquement) | **30 min** |
| 2. Formulaire avec checkboxes + création multiple | **1h** |
| 3. Navigation jours (header + indicateur visuel) | **1h** |
| 4. Filtrage par jour (simple : `dayOfWeek === currentDay`) | **30 min** |
| 5. Migration automatique × 7 | **1h30** |
| 6. Ajuster statistiques (comptage par jour) | **30 min** |
| 7. Édition/Suppression (simple : pas de groupe) | **20 min** |
| 8. Tests sur environnement TEST | **45 min** |
| **TOTAL** | **~5h30-6h** |

**📊 Niveau de complexité final : Niveau 2 (Moyen)**

**Pourquoi moins de temps que prévu ?**
- Pas de système de `templateId` (plus simple)
- Pas d'édition/suppression groupée (plus simple)
- Chaque tâche est totalement indépendante

**Mais attention** :
- ⚠️ Migration × 7 irréversible
- ⚠️ Modifications manuelles répétitives si besoin de changer plusieurs jours

---

### 🎯 ARCHITECTURE FINALE VALIDÉE

**Vos choix conduisent à cette architecture :**

```javascript
// Structure de tâche en Firestore
{
  id: "task_abc123",
  title: "Ranger sa chambre",
  assignedTo: "bastien",
  stars: 3,
  completed: false,
  order: 0,
  dayOfWeek: 1,  // ← NOUVEAU : 0=Dim, 1=Lun, 2=Mar, 3=Mer, 4=Jeu, 5=Ven, 6=Sam
  createdAt: timestamp
}
```

**Caractéristiques** :
- ✅ Chaque tâche est totalement indépendante
- ✅ Pas de lien entre tâches similaires sur différents jours
- ✅ Édition/Suppression par jour uniquement
- ✅ État `completed` indépendant par jour
- ⚠️ Modifications répétitives si besoin sur plusieurs jours

---

### 🤔 DERNIÈRES QUESTIONS PRATIQUES (avant de coder)

**QUESTION 12 : Ordre des tâches** 🟡

Actuellement, vous pouvez réordonner les tâches (drag & drop).

Avec les jours séparés, comment gérer l'ordre ?

**Exemple** :
- Lundi : "Ranger chambre" (ordre 1), "Devoirs" (ordre 2)
- Mardi : "Ranger chambre" (ordre ???), "Devoirs" (ordre ???)

**Option A** : Ordre indépendant par jour
- Lundi ordre 1, Mardi ordre 5 (peuvent être différents)
- ✅ Maximum de flexibilité
- ⚠️ Incohérent visuellement en changeant de jour

**Option B** : Même ordre pour les tâches similaires
- Lors de la création : toutes les instances ont le même ordre initial
- Mais peuvent être modifiées indépendamment après
- ✅ Plus cohérent au départ

**→ RÉPONSE : Option A - Ordre indépendant par jour** ✅

**Conséquences** :
- Lors de la création : toutes les instances ont le même ordre initial
- Après, chaque jour peut être réordonné indépendamment
- ✅ Maximum de flexibilité

---

**QUESTION 13 : Formulaire d'édition - Affichage des jours** 🟡

Quand vous éditez une tâche du lundi, faut-il afficher qu'elle existe aussi d'autres jours ?

**Option A** : Ne rien afficher
```
┌──────────────────────┐
│ Éditer la Tâche       │
├──────────────────────┤
│ Nom : [Ranger...]    │
│ Personne : [Bastien] │
│ Étoiles : [3]        │
└──────────────────────┘
```

**Option B** : Afficher un indicateur info (non modifiable)
```
┌──────────────────────────────────┐
│ Éditer la Tâche (LUNDI)          │
├──────────────────────────────────┤
│ ℹ️ Cette tâche existe aussi :     │
│   Mardi, Mercredi                │
│                                  │
│ Nom : [Ranger...]                │
│ Personne : [Bastien]             │
│ Étoiles : [3]                    │
└──────────────────────────────────┘
```
*Note : Pas de lien technique, juste une info visuelle*

**Option C** : Permettre de modifier les jours actifs
```
┌──────────────────────────────────┐
│ Éditer la Tâche                  │
├──────────────────────────────────┤
│ Nom : [Ranger...]                │
│ Personne : [Bastien]             │
│ Étoiles : [3]                    │
│                                  │
│ 📅 Jours où cette tâche existe : │
│ ☐ Lun ☑ Mar ☑ Mer ☐ Jeu ...     │
│                                  │
│ ⚠️ Cocher/décocher crée/supprime │
│    des tâches                    │
└──────────────────────────────────┘
```

**→ RÉPONSE : Option A - Ne rien afficher** ✅

**Conséquences** :
- Formulaire d'édition simple et épuré
- Pas d'information sur les autres jours
- ✅ Simplicité maximale

---

**QUESTION 14 : Script de migration - Quand l'exécuter ?** 🟠

La migration × 7 est une opération lourde et irréversible.

**Proposition** :
1. Je crée le script de migration
2. Vous le testez d'abord sur TEST (vérifier que ça fonctionne)
3. ENSUITE seulement, vous décidez si vous l'exécutez sur PROD

**OU**

Voulez-vous une option dans l'interface admin pour déclencher la migration manuellement ?
```
[Admin] > [Migration] > [Migrer vers système par jour (⚠️ IRRÉVERSIBLE)]
```

**→ RÉPONSE : Script sur TEST d'abord** ✅

**Workflow de migration** :
1. Je crée le script de migration
2. Vous l'exécutez sur TEST pour vérifier
3. Vous testez la nouvelle fonctionnalité sur TEST
4. Si tout OK, vous l'exécutez sur PROD

---

**QUESTION 15 : Combien de tâches actuellement ?** 🟠

Pour estimer l'impact de la migration × 7 :

**Question directe** : Combien de tâches avez-vous actuellement dans votre base PRODUCTION ?
- Environ : _____ tâches

Cela me permettra de vous dire :
- Nombre de tâches après migration : _____ × 7 = _____ tâches
- Temps de migration estimé
- Risques éventuels

**→ RÉPONSE : Ne sait pas** 

**Solution** :
- Je crée le script pour qu'il fonctionne quel que soit le nombre
- Le script affichera le nombre de tâches avant/après migration
- Vous pourrez vérifier sur la console Firebase si besoin

---

**QUESTION 16 : Nom de la tâche - Besoin d'indication du jour ?** 🟡

Avec les tâches séparées, peut-être voulez-vous différencier visuellement ?

**Exemple** :
- Tâche créée : "Ranger sa chambre"
- Après migration, les 7 tâches ont le même titre : "Ranger sa chambre"

**Question** : Voulez-vous ajouter automatiquement le jour dans le titre ?

**Option A** : Non, garder le même titre
- "Ranger sa chambre" (lundi)
- "Ranger sa chambre" (mardi)
- ✅ Plus propre visuellement

**Option B** : Ajouter le jour dans le titre
- "Ranger sa chambre [Lun]"
- "Ranger sa chambre [Mar]"
- ✅ Plus facile à distinguer en admin

**Option C** : Ne rien faire automatiquement, mais vous permettre de le faire manuellement si besoin

**→ RÉPONSE : Option A - Garder le même titre** ✅

**Conséquences** :
- Les 7 tâches auront le même titre
- Différenciation uniquement par le jour affiché
- ✅ Interface plus propre

---

### 🎉 TOUTES LES QUESTIONS RÉPONDUES !

**✅ RÉSUMÉ COMPLET DES DÉCISIONS (16 Questions)**

#### 📋 Questions 1-6 : Vision Générale
1. **Portée** : Tâches différentes par jour + chaque jour sa liste
2. **Complexité** : Niveau 1 Simple (mais évoluera vers Niveau 2)
3. **Exemples** : *(À compléter avec vos cas réels)*
4. **Vue** : Garder affichage par personne + navigation jours
5. **Tâches existantes** : Migration automatique ×7
6. **Statistiques** : Uniquement tâches du jour actuel

#### 🏗️ Questions 7-11 : Architecture Technique
7. **Groupement** : Tâches totalement indépendantes (Option B)
8. **Création** : Immédiate de multiples tâches
9. **Migration** : Dupliquer ×7 toutes les tâches
10. **Édition** : Uniquement le jour actuel
11. **Suppression** : Uniquement le jour actuel

#### 🎨 Questions 12-16 : Détails Pratiques
12. **Ordre** : Indépendant par jour
13. **Formulaire édition** : Simple, sans info sur autres jours
14. **Migration** : Script à tester sur TEST d'abord
15. **Nombre tâches** : Inconnu (script flexible)
16. **Nom tâche** : Garder titre identique

---

### 🎯 SPÉCIFICATION TECHNIQUE FINALE

#### Structure Base de Données
```javascript
{
  id: "task_abc123",
  title: "Ranger sa chambre",
  assignedTo: "bastien",
  stars: 3,
  completed: false,
  order: 0,
  dayOfWeek: 1,  // ← NOUVEAU : 0=Dim, 1=Lun, ... 6=Sam
  createdAt: timestamp
}
```

#### Fonctionnalités à Implémenter

**1. Navigation des jours** (header)
```
┌─────────────────────────────────────────┐
│  ← Samedi | 📅 DIMANCHE 16/11 | Lundi → │
│  [Dim] [Lun] [Mar] [Mer] [Jeu] [Ven] [Sam]│
└─────────────────────────────────────────┘

⚠️ VOUS CONSULTEZ : LUNDI 17/11
(Aujourd'hui = Dimanche 16/11)
[Retour à Aujourd'hui]
```

**2. Formulaire d'ajout modifié**
```
┌────────────────────────────────┐
│ ➕ Ajouter une Tâche            │
├────────────────────────────────┤
│ Nom : [____________]           │
│ Personne : [Bastien ▼]        │
│ Étoiles : [3]                  │
│                                │
│ 📅 Jours actifs :              │
│ ☐ Lun ☐ Mar ☐ Mer ☐ Jeu ...   │
│ ☑ Tous les jours               │
│                                │
│ [Annuler] [Ajouter]            │
└────────────────────────────────┘
```
→ Créer N tâches selon jours cochés

**3. Filtrage**
```javascript
const currentDay = selectedDay || new Date().getDay();
tasks.filter(task => task.dayOfWeek === currentDay);
```

**4. Statistiques**
```
👦 Bastien  ⭐ 14/42  5/18 tâches du dimanche
                       ↑ Uniquement tâches d'aujourd'hui
```

**5. Migration**
```javascript
// Pour chaque tâche existante
for (let task of existingTasks) {
  for (let day = 0; day <= 6; day++) {
    // Créer 7 copies avec dayOfWeek différent
    createTask({ ...task, dayOfWeek: day });
  }
  // Supprimer l'ancienne tâche
  deleteTask(task.id);
}
```

---

### 📋 PLAN D'IMPLÉMENTATION

**Phase 1 : Structure (1h)**
- [ ] Ajouter champ `dayOfWeek` au modèle de tâche
- [ ] Créer variable globale `selectedDay`
- [ ] Fonction `getCurrentDay()`

**Phase 2 : Navigation (1h)**
- [ ] Header avec navigation jours
- [ ] Boutons rapides [Dim][Lun]...[Sam]
- [ ] Flèches ← →
- [ ] Bandeau "Vous consultez X" si ≠ aujourd'hui
- [ ] Bouton "Retour à Aujourd'hui"

**Phase 3 : Formulaire (1h)**
- [ ] Ajouter checkboxes jours dans modal ajout
- [ ] Checkbox "Tous les jours"
- [ ] Logique création multiple
- [ ] Boucle sur jours sélectionnés

**Phase 4 : Filtrage (30min)**
- [ ] Modifier `renderTasks()` pour filtrer par `dayOfWeek`
- [ ] Appliquer filtre sur `selectedDay`

**Phase 5 : Statistiques (30min)**
- [ ] Modifier calcul pour compter uniquement tâches du jour
- [ ] Ajouter "tâches du [jour]" dans affichage

**Phase 6 : Migration (1h30)**
- [ ] Créer script `migrate-to-days.js`
- [ ] Lire toutes les tâches existantes
- [ ] Dupliquer ×7 avec `dayOfWeek`
- [ ] Logs détaillés
- [ ] Dry-run mode (simulation)
- [ ] Instructions d'exécution

**Phase 7 : Tests (45min)**
- [ ] Déployer sur TEST
- [ ] Tester navigation
- [ ] Tester création avec jours
- [ ] Tester filtrage
- [ ] Exécuter migration sur TEST
- [ ] Vérifier résultats

---

### ⏱️ ESTIMATION FINALE

| Phase | Temps |
|-------|-------|
| 1. Structure | 30 min |
| 2. Navigation | 1h |
| 3. Formulaire | 1h |
| 4. Filtrage | 30 min |
| 5. Statistiques | 30 min |
| 6. Migration | 1h30 |
| 7. Tests | 45 min |
| **TOTAL** | **~5h45** |

---

### 🚀 PRÊT À COMMENCER ?

**Toutes les questions ont été répondues !**

**Workflow** :
1. Je code sur la branche `feature/activites-par-jour`
2. Je teste localement
3. Je déploie sur **TEST** (activity-day-to-day-test)
4. Je crée le script de migration
5. Vous testez sur TEST
6. Si OK → déploiement PROD

**Voulez-vous que je commence l'implémentation maintenant ?**
**Ou avez-vous encore des questions ?**

---

### 📝 Décisions Prises (16 novembre 2025)

**RÉPONSES UTILISATEUR :**

1. **Quelle est votre vision exacte ?**
   - ✅ **Option A** : Tâches différentes selon les jours
   - ✅ **PLUS** : Chaque jour a sa propre liste de tâches
   - ✅ Les tâches seront **copiées** dans les jours où elles doivent être faites
   - ✅ Possibilité de voir la semaine complète, mais **par défaut afficher le jour actuel uniquement**
   - Exemple : Aujourd'hui dimanche, on voit uniquement les tâches du dimanche

2. **Quel niveau de complexité ?**
   - ✅ **Niveau 1 : Simple** (2-3 heures)
   - Ajouter un champ "Jours actifs" aux tâches
   - Filtrer l'affichage selon le jour actuel
   - Garder l'interface actuelle

3. **Donnez 3-5 exemples concrets** d'activités que vous voulez gérer différemment selon les jours :
   - Exemple 1 : *(À compléter)*
   - Exemple 2 : *(À compléter)*
   - Exemple 3 : *(À compléter)*

4. **Vue préférée ?**
   - ✅ **Garder l'affichage actuel** (par personne : Papa, Maman, Bastien, Florent)
   - ✅ **Ajouter une navigation** entre les jours de la semaine
   - ✅ **Par défaut** : Afficher le jour actuel (ex: aujourd'hui = dimanche)
   - Possibilité de naviguer vers les autres jours

5. **Les tâches existantes ?**
   - ✅ **Option A** : Toutes les tâches existantes = actives tous les jours (migration automatique)

6. **Reset quotidien ?**
   - ✅ **Option A** : Réinitialiser TOUTES les tâches chaque jour (comportement actuel conservé)

7. **Statistiques ?**
   - ✅ **Option A** : Uniquement les tâches d'aujourd'hui (ex: 3/5 tâches du dimanche)

8. **Création de tâche ?**
   - ✅ Formulaire avec **checkboxes pour chaque jour** [Lun] [Mar] [Mer] [Jeu] [Ven] [Sam] [Dim]
   - ✅ Option "Tous les jours" pour sélectionner rapidement tous les jours

---

### ⏱️ Estimation Temps de Développement

*Sera complété après clarification du besoin*

- **Niveau 1 (Simple)** : 2-3 heures
- **Niveau 2 (Moyen)** : 5-7 heures  
- **Niveau 3 (Complet)** : 10-15 heures

---

**🚀 PROCHAINE ÉTAPE : Répondez aux questions ci-dessus pour que je puisse concevoir la solution optimale !**

---

**Date de création** : 16 novembre 2025  
**Branche** : `feature/activites-par-jour`  
**Environnement de travail** : TEST (activity-day-to-day-test)  
**Statut** : 🔍 ANALYSE EN COURS
