# 🚀 Guide de Déploiement - Activity Day to Day

Ce guide explique comment gérer les déploiements entre l'environnement de TEST et de PRODUCTION.

---

## 🏗️ Architecture des Environnements

### Production
- **Projet Firebase** : `activity-day-to-day`
- **URL** : https://activity-day-to-day.web.app
- **Alias Firebase** : `production` (ou `default`)
- **Base de données** : Firestore Production
- **Utilisateurs** : Famille réelle

### Test
- **Projet Firebase** : `activity-day-to-day-test`
- **URL** : https://activity-day-to-day-test.web.app
- **Alias Firebase** : `test`
- **Base de données** : Firestore Test (séparée)
- **Utilisateurs** : Tests uniquement

---

## 🔧 Commandes de Déploiement

### 1. Vérifier l'environnement actif

```bash
firebase use
```

### 2. Basculer entre les environnements

**Passer en TEST :**
```bash
firebase use test
```

**Passer en PRODUCTION :**
```bash
firebase use production
```

---

## 📦 Déployer sur TEST

```bash
# 1. Basculer sur test
firebase use test

# 2. Déployer tout
firebase deploy

# OU déployer seulement ce qui est nécessaire :
firebase deploy --only functions          # Uniquement les Cloud Functions
firebase deploy --only hosting            # Uniquement le frontend
firebase deploy --only firestore:rules    # Uniquement les règles Firestore
```

---

## 🚀 Déployer sur PRODUCTION

⚠️ **ATTENTION** : Toujours tester sur TEST avant de déployer en production !

```bash
# 1. Basculer sur production
firebase use production

# 2. Déployer tout
firebase deploy

# OU déployer seulement ce qui est nécessaire :
firebase deploy --only functions
firebase deploy --only hosting
firebase deploy --only firestore:rules
```

---

## 🧪 Workflow Recommandé

### Avant toute modification :

1. **Développer en local**
   - Modifier le code
   - Tester localement si possible

2. **Déployer sur TEST**
   ```bash
   firebase use test
   firebase deploy
   ```

3. **Tester sur TEST**
   - Ouvrir https://activity-day-to-day-test.web.app
   - Vérifier que tout fonctionne
   - Tester toutes les nouvelles fonctionnalités

4. **Déployer sur PRODUCTION**
   ```bash
   firebase use production
   firebase deploy
   ```

5. **Vérifier la production**
   - Tester rapidement que tout fonctionne

---

## 📊 Vérifier les Logs

### Logs de TEST

```bash
firebase use test
firebase functions:log
```

### Logs de PRODUCTION

```bash
firebase use production
firebase functions:log
```

---

## 🗄️ Accès aux Bases de Données

### Firestore TEST
https://console.firebase.google.com/project/activity-day-to-day-test/firestore

### Firestore PRODUCTION
https://console.firebase.google.com/project/activity-day-to-day/firestore

---

## 🔑 Gestion des Secrets

Les secrets sont séparés par environnement.

### Voir les secrets TEST

```bash
firebase use test
firebase functions:secrets:access RESEND_API_KEY
```

### Voir les secrets PRODUCTION

```bash
firebase use production
firebase functions:secrets:access RESEND_API_KEY
```

### Modifier un secret

```bash
firebase use test  # ou production
firebase functions:secrets:set RESEND_API_KEY
```

---

## 📁 Fichiers Locaux pour le Test

Les fichiers suivants ont été créés mais sont **IGNORÉS par Git** :

- `public/index.test.html` - Page principale de test
- `public/admin.test.html` - Page admin de test
- `public/js/firebase-config.test.js` - Configuration Firebase test
- `public/js/firebase-config.prod.js` - Configuration Firebase production

⚠️ **Ces fichiers ne seront pas déployés sur le hosting Firebase** (car dans .gitignore).
Ils sont uniquement pour référence et tests locaux.

---

## 🎯 Bannière de Test

Les pages de test (`*.test.html`) affichent une **bannière rouge** en haut :
```
🧪 ENVIRONNEMENT DE TEST - Toutes les modifications sont faites sur la base de données de test
```

Cela permet de toujours savoir sur quel environnement vous êtes.

---

## ⚠️ Points d'Attention

1. **Toujours vérifier l'environnement actif** avant de déployer
2. **Ne jamais tester directement en production**
3. **Les données TEST et PRODUCTION sont complètement séparées**
4. **Les secrets peuvent être différents entre TEST et PROD**
5. **Le scheduler de reset automatique est indépendant par environnement**

---

## 🆘 En Cas de Problème

### Rollback rapide

Si un déploiement en production pose problème :

1. Allez sur : https://console.firebase.google.com/project/activity-day-to-day/hosting
2. Cliquez sur l'onglet "Versions"
3. Trouvez la version précédente qui fonctionnait
4. Cliquez sur "..." puis "Restaurer"

### Logs en temps réel

```bash
firebase use production  # ou test
firebase functions:log --only dailyTaskReset
```

---

## 📝 Notes

- **Code PIN Admin** : 1571 (identique pour TEST et PROD)
- **Email de test** : Configurez dans l'interface admin de test
- **Heure de reset** : Configurable via l'interface admin

---

## 🎉 Résumé

Vous disposez maintenant de **deux environnements complètement séparés** :
- ✅ TEST pour expérimenter sans risque
- ✅ PRODUCTION pour vos utilisateurs réels

**Bonne pratique** : Toujours déployer sur TEST avant PRODUCTION !
