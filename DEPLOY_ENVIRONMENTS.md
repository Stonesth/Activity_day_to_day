# 🔄 Gestion des Environnements TEST et PRODUCTION

## ⚠️ Problème Résolu

**Avant** : L'application TEST pointait sur la base de données PRODUCTION  
**Maintenant** : Chaque environnement a sa propre configuration et base de données

---

## 📁 Fichiers par Environnement

### PRODUCTION
- **Fichier** : `public/index.html`
- **Config Firebase** : 
  - `projectId: "activity-day-to-day"`
  - Base de données PRODUCTION
- **URL** : https://activity-day-to-day.web.app

### TEST
- **Fichier** : `public/index.test.html`
- **Config Firebase** : 
  - `projectId: "activity-day-to-day-test"`
  - Base de données TEST (séparée)
- **URL** : https://activity-day-to-day-test.web.app
- **Bandeau rouge** : Indique clairement qu'on est en TEST

---

## 🚀 Comment Déployer

### Sur TEST

```bash
# 1. Sélectionner l'environnement TEST
firebase use test

# 2. Copier la version TEST
cp public/index.test.html public/index.html

# 3. Déployer
firebase deploy --only hosting

# 4. Restaurer l'original
git checkout public/index.html
```

### Sur PRODUCTION

```bash
# 1. Sélectionner l'environnement PROD
firebase use production

# 2. Déployer (index.html est déjà en PROD)
firebase deploy --only hosting
```

---

## 🔐 Sécurité

### ✅ Ce qui est séparé

- ✅ Bases de données Firestore complètement indépendantes
- ✅ Configurations Firebase distinctes
- ✅ Clés API différentes
- ✅ URLs distinctes
- ✅ Bannière visuelle sur TEST

### ⚠️ Fichiers à NE PAS commiter

Les fichiers `*.test.html` sont dans le `.gitignore` car ils contiennent des clés API.

---

## 📝 Workflow Recommandé

### 1. Développement

```bash
# Travailler sur le code
# Modifier public/index.html (PROD)
# Les modifications de fonctionnalités vont dans app.js
```

### 2. Test sur TEST

```bash
# Mettre à jour index.test.html si nécessaire
cp public/index.html public/index.test.html
# Ajuster la config Firebase pour TEST
# Déployer sur TEST
firebase use test
cp public/index.test.html public/index.html
firebase deploy --only hosting
git checkout public/index.html
```

### 3. Vérification TEST

- Ouvrir https://activity-day-to-day-test.web.app
- Vérifier le **bandeau rouge TEST**
- Tester toutes les fonctionnalités
- Vérifier que les données ne vont PAS dans PROD

### 4. Migration si nécessaire

Si vous avez des tâches existantes sur TEST, utilisez :
```
https://activity-day-to-day-test.web.app/migrate-browser.html
```

### 5. Déploiement PROD

**UNIQUEMENT après validation complète sur TEST** :

```bash
firebase use production
firebase deploy --only hosting
```

---

## 🎨 Différences Visuelles

### TEST
- 🔴 **Bandeau rouge en haut** : "ENVIRONNEMENT DE TEST"
- Titre de page : "🔴 TEST - Tableau des Tâches Familiales"
- Couleur rouge pour éviter toute confusion

### PRODUCTION
- Aucun bandeau
- Interface normale
- Titre standard

---

## 🗄️ Bases de Données

### TEST (activity-day-to-day-test)
- Base de test vide ou avec données de test
- Peut être effacée/réinitialisée sans risque
- Pour expérimentations

### PRODUCTION (activity-day-to-day)
- Données réelles de la famille
- ⚠️ **NE JAMAIS effacer ou modifier sans backup**
- Utilisée par les vrais utilisateurs

---

## 🔍 Comment Vérifier la Configuration

### Dans l'application
1. Ouvrir la console navigateur (F12)
2. Taper : `window.db.app.options.projectId`
3. Doit afficher :
   - TEST : `"activity-day-to-day-test"`
   - PROD : `"activity-day-to-day"`

### Dans la console Firebase
1. Ouvrir Firestore
2. Vérifier les collections `tasks`
3. TEST doit avoir des données différentes de PROD

---

## ⚡ Scripts Utiles

### Déploiement Automatique (TODO)
Un script `deploy-with-env.sh` existe mais nécessite des améliorations.

### Migration des Tâches
Utiliser `migrate-browser.html` pour migrer les tâches existantes vers le système par jour.

---

## 📊 Checklist de Sécurité

Avant TOUT déploiement sur PROD :

- [ ] Tests complets sur TEST
- [ ] Vérification du projectId (TEST vs PROD)
- [ ] Vérification visuelle (bandeau TEST présent/absent)
- [ ] Tests de création/modification/suppression
- [ ] Vérification que les données vont dans la bonne BDD
- [ ] Backup de PROD si changements majeurs

---

## 🆘 En Cas de Problème

### "Mes données TEST apparaissent dans PROD !"
→ Vérifier la config Firebase dans index.test.html

### "Le bandeau TEST n'apparaît pas"
→ Vider le cache navigateur (Cmd+Shift+R)

### "Les deux environnements partagent les données"
→ Vérifier `projectId` dans la console navigateur

---

**Date de création** : 16 novembre 2025  
**Dernière mise à jour** : 16 novembre 2025  
**Version** : 1.0
