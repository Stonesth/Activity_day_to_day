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

## 📅 Planning d'Implémentation (Suggestion)

### Phase 1 : Tâches Bonus (Plus simple)
1. Ajouter le champ `isBonus` à la base de données
2. Modifier le formulaire d'ajout
3. Adapter le calcul de progression
4. Ajuster l'affichage de la barre
5. Tester et déployer

**Temps estimé** : 2-3 heures

### Phase 2 : Système de Pénalités (Plus complexe)
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

**Dernière mise à jour** : 21 octobre 2025  
**Statut** : 💡 Idées - Pas encore implémenté  
**Priorité** : À définir
