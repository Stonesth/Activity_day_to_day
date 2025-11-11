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
