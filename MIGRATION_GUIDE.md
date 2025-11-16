# 🔄 Guide de Migration - Système de Tâches par Jour

## 📋 Vue d'ensemble

Ce script migre les tâches existantes vers le nouveau système de tâches par jour.

**Ce qu'il fait** :
- Prend chaque tâche existante (sans `dayOfWeek`)
- Crée 7 copies : une pour chaque jour de la semaine
- Supprime l'ancienne tâche

**Exemple** :
```
Avant:  1 tâche "Ranger sa chambre" (Bastien)
Après:  7 tâches "Ranger sa chambre" (Bastien) 
        - Une pour Dimanche (dayOfWeek: 0)
        - Une pour Lundi (dayOfWeek: 1)
        - ... jusqu'à Samedi (dayOfWeek: 6)
```

---

## ⚠️ ATTENTION

- ❗ **IRRÉVERSIBLE** : Cette opération ne peut pas être annulée
- ❗ **MULTIPLICATEUR ×7** : Le nombre de tâches sera multiplié par 7
- ❗ **TEST D'ABORD** : Toujours tester sur l'environnement TEST avant PROD

---

## 🚀 Instructions d'Exécution

### Étape 1 : Préparation

```bash
cd /chemin/vers/Activity_day_to_day
```

### Étape 2 : Test sur TEST (Simulation)

```bash
# Basculer sur l'environnement TEST
firebase use test

# Exécuter en mode simulation (aucune modification)
node migrate-to-days.js --dry-run
```

**Résultat attendu** :
```
🔍 MODE SIMULATION (--dry-run)
✅ Firebase Admin initialisé
📊 Étape 1: Récupération des tâches existantes...
📦 X tâche(s) trouvée(s)
...
✅ Simulation terminée avec succès
```

### Étape 3 : Test sur TEST (Exécution réelle)

```bash
# Toujours sur l'environnement TEST
firebase use test

# Exécuter la migration
node migrate-to-days.js --execute
```

Le script va demander confirmation :
```
⚠️  ⚠️  ⚠️  ATTENTION ⚠️  ⚠️  ⚠️
Cette opération est IRRÉVERSIBLE !
Voulez-vous continuer ? (tapez "OUI" en majuscules): 
```

Tapez **`OUI`** (en majuscules) pour confirmer.

### Étape 4 : Vérifier sur TEST

1. Allez sur https://activity-day-to-day-test.web.app
2. Vérifiez que :
   - ✅ La navigation des jours fonctionne
   - ✅ Les tâches apparaissent bien pour chaque jour
   - ✅ Les statistiques sont correctes
   - ✅ Vous pouvez naviguer entre les jours

### Étape 5 : Migration sur PRODUCTION (si tout est OK)

**UNIQUEMENT SI LES TESTS SONT CONCLUANTS** :

```bash
# Basculer sur PRODUCTION
firebase use production

# Simulation d'abord (toujours!)
node migrate-to-days.js --dry-run

# Si tout est OK, exécuter
node migrate-to-days.js --execute
```

---

## 📊 Exemple de sortie

### Mode Simulation (--dry-run)

```
========================================
🔄 MIGRATION: Système de tâches par jour
========================================

🔍 MODE SIMULATION (--dry-run)
   Aucune modification ne sera faite

✅ Firebase Admin initialisé

📊 Étape 1: Récupération des tâches existantes...

📦 50 tâche(s) trouvée(s)

✅ Tâches à migrer: 50
✓  Tâches déjà migrées: 0

📋 Résumé des tâches à migrer:

   bastien: 15 tâche(s) → 105 tâche(s) après migration
   florent: 12 tâche(s) → 84 tâche(s) après migration
   papa: 13 tâche(s) → 91 tâche(s) après migration
   maman: 10 tâche(s) → 70 tâche(s) après migration

📊 Statistiques:
   Tâches actuelles: 50
   Tâches après migration: 350
   Nouvelles tâches créées: 300
   Tâches à supprimer: 50 (anciennes versions)

✅ Simulation terminée avec succès

💡 Pour exécuter réellement la migration:
   node migrate-to-days.js --execute
```

### Mode Exécution (--execute)

```
========================================
🔄 MIGRATION: Système de tâches par jour
========================================

⚠️  MODE EXÉCUTION (--execute)
   Les modifications seront PERMANENTES

✅ Firebase Admin initialisé

📊 Étape 1: Récupération des tâches existantes...

📦 50 tâche(s) trouvée(s)

✅ Tâches à migrer: 50
✓  Tâches déjà migrées: 0

📋 Résumé des tâches à migrer:
   ...

⚠️  ⚠️  ⚠️  ATTENTION ⚠️  ⚠️  ⚠️
Cette opération est IRRÉVERSIBLE !
Les tâches existantes seront supprimées après duplication.

Voulez-vous continuer ? (tapez "OUI" en majuscules): OUI

🚀 Étape 2: Migration en cours...

   [1/50] Migration: "Ranger sa chambre" (bastien)
   [2/50] Migration: "Faire les devoirs" (bastien)
   ...
   [50/50] Migration: "Préparer le café" (papa)

✅ Migration terminée avec succès !

📊 Résultat:
   Tâches traitées: 50
   Nouvelles tâches créées: 350
   Anciennes tâches supprimées: 50

✨ Script terminé
```

---

## 🔍 Vérification Post-Migration

### Console Firebase

Allez dans la console Firebase > Firestore > Collection `tasks`

Vérifiez que :
- ✅ Chaque tâche a un champ `dayOfWeek` (0-6)
- ✅ Les tâches similaires existent pour chaque jour
- ✅ Le nombre total de tâches = ancien nombre × 7

### Application Web

1. Ouvrez l'application
2. Testez la navigation entre les jours
3. Vérifiez que les tâches apparaissent correctement
4. Testez la création d'une nouvelle tâche avec sélection de jours

---

## ❌ Résolution de Problèmes

### Erreur: "Firebase Admin n'est pas initialisé"

**Solution** : Assurez-vous d'avoir les credentials Firebase configurés

```bash
# Vérifier le projet actif
firebase use

# Si nécessaire, se connecter
firebase login
```

### Erreur: "Permission denied"

**Solution** : Vérifiez que vous avez les droits d'accès à Firestore

### Le script ne trouve aucune tâche

**Causes possibles** :
- Base de données vide
- Toutes les tâches ont déjà été migrées (ont déjà un `dayOfWeek`)
- Mauvais projet Firebase sélectionné

**Vérification** :
```bash
firebase use  # Affiche le projet actif
```

### Annuler une migration en cours

Le script traite les tâches une par une. Si vous interrompez (Ctrl+C), seules les tâches déjà traitées seront affectées.

⚠️ **Pas de rollback automatique** : Les tâches migrées restent migrées.

---

## 🔙 Rollback Manuel (Si Problème)

Si la migration s'est mal passée sur TEST et que vous voulez revenir en arrière :

### Option 1 : Restaurer depuis un backup

Si vous avez un backup Firestore, restaurez-le.

### Option 2 : Script de nettoyage

Créez un script pour supprimer toutes les tâches avec `dayOfWeek` et recréer les anciennes.

**⚠️ Complexe et risqué** : Préférez tester minutieusement avant de migrer PROD.

---

## 📞 Support

En cas de problème :
1. Vérifiez les logs du script
2. Consultez la console Firebase (Firestore)
3. Vérifiez que le bon environnement est actif (`firebase use`)

---

## ✅ Checklist de Migration

### Avant la migration :
- [ ] Code déployé sur TEST
- [ ] Application testée manuellement sur TEST
- [ ] Script exécuté en mode `--dry-run` sur TEST
- [ ] Résultats de simulation vérifiés

### Migration TEST :
- [ ] `firebase use test`
- [ ] `node migrate-to-days.js --execute`
- [ ] Vérification manuelle de l'application
- [ ] Tests de création/édition/suppression de tâches

### Migration PRODUCTION :
- [ ] Tests sur TEST concluants
- [ ] Backup de la base PRODUCTION (optionnel)
- [ ] `firebase use production`
- [ ] `node migrate-to-days.js --dry-run`
- [ ] `node migrate-to-days.js --execute`
- [ ] Vérification manuelle immédiate
- [ ] Surveillance pendant 24h

---

**Date de création** : 16 novembre 2025  
**Version** : 1.0  
**Auteur** : Cascade AI
