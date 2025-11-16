# 🌍 Environnements - Activity Day to Day

## 📋 Vue d'Ensemble

Vous disposez maintenant de **2 environnements complètement séparés** :

| | 🧪 TEST | 🚀 PRODUCTION |
|---|---|---|
| **Projet Firebase** | `activity-day-to-day-test` | `activity-day-to-day` |
| **URL Application** | https://activity-day-to-day-test.web.app | https://activity-day-to-day.web.app |
| **URL Admin** | https://activity-day-to-day-test.web.app/admin.html | https://activity-day-to-day.web.app/admin.html |
| **Base de données** | Firestore TEST (vide) | Firestore PRODUCTION (données réelles) |
| **Cloud Functions** | Séparées | Séparées |
| **Secrets (Resend)** | Clé API TEST | Clé API PRODUCTION |
| **Scheduler Reset** | Indépendant | Indépendant |
| **Usage** | Tests & Développement | Utilisateurs réels |

---

## 🎯 Quand Utiliser Quel Environnement ?

### 🧪 TEST - Pour :
- ✅ Tester de nouvelles fonctionnalités
- ✅ Expérimenter sans risque
- ✅ Vérifier les modifications avant production
- ✅ Debugger sans impact sur les utilisateurs
- ✅ Former de nouveaux utilisateurs

### 🚀 PRODUCTION - Pour :
- ✅ Utilisation quotidienne de la famille
- ✅ Données réelles et importantes
- ⚠️ Ne déployer QUE du code testé

---

## 🚀 Déploiement Rapide

### Avec le script automatique (Recommandé)

```bash
# Déployer sur TEST (tout)
./deploy.sh test

# Déployer sur TEST (functions seulement)
./deploy.sh test functions

# Déployer sur PRODUCTION (avec confirmation)
./deploy.sh production
```

### Manuellement

```bash
# Sur TEST
firebase use test
firebase deploy

# Sur PRODUCTION
firebase use production
firebase deploy
```

---

## 📝 Workflow Recommandé

```
1. Développer → 2. Déployer TEST → 3. Tester → 4. Déployer PROD → 5. Vérifier
    ↓                  ↓                ↓              ↓              ↓
  Code local      firebase use test   URL TEST   firebase use prod  URL PROD
                  firebase deploy                firebase deploy
```

---

## 🔍 Identifier l'Environnement

### Dans le Navigateur

**TEST** : Affiche une **bannière rouge** en haut de page
```
🧪 ENVIRONNEMENT DE TEST - Toutes les modifications sont faites sur la base de données de test
```

**PRODUCTION** : Pas de bannière

### Dans le Terminal

```bash
firebase use
```

Affiche l'environnement actif avec un `*` :
```
Active Project: test (activity-day-to-day-test)
```

---

## 📊 Accès aux Consoles

### Console Firebase TEST
https://console.firebase.google.com/project/activity-day-to-day-test

- Firestore : https://console.firebase.google.com/project/activity-day-to-day-test/firestore
- Functions : https://console.firebase.google.com/project/activity-day-to-day-test/functions
- Hosting : https://console.firebase.google.com/project/activity-day-to-day-test/hosting

### Console Firebase PRODUCTION
https://console.firebase.google.com/project/activity-day-to-day

- Firestore : https://console.firebase.google.com/project/activity-day-to-day/firestore
- Functions : https://console.firebase.google.com/project/activity-day-to-day/functions
- Hosting : https://console.firebase.google.com/project/activity-day-to-day/hosting

---

## 🔑 Secrets & Configuration

### Resend API Keys

**TEST** : Clé dédiée "Activity Test Environment"
```bash
firebase use test
firebase functions:secrets:access RESEND_API_KEY
```

**PRODUCTION** : Clé de production
```bash
firebase use production
firebase functions:secrets:access RESEND_API_KEY
```

### Configuration Reset Automatique

Chaque environnement a sa propre configuration de reset :
- Heure configurable indépendamment
- Jours actifs séparés
- Emails de notification séparés

---

## 🗂️ Structure des Fichiers

```
Activity_day_to_day/
├── .firebaserc                    # Configuration des alias (test/prod)
├── firebase.json                  # Configuration Firebase commune
├── DEPLOY_GUIDE.md               # Guide détaillé de déploiement
├── ENVIRONMENTS.md               # Ce fichier
├── deploy.sh                     # Script de déploiement simplifié
│
├── public/
│   ├── index.html                # Production (déployé)
│   ├── admin.html                # Production (déployé)
│   ├── index.test.html           # Test local uniquement (gitignored)
│   ├── admin.test.html           # Test local uniquement (gitignored)
│   │
│   └── js/
│       ├── app.js                # Code commun
│       ├── firebase-config.test.js   # Config TEST (gitignored)
│       └── firebase-config.prod.js   # Config PROD (gitignored)
│
└── functions/
    └── index.js                  # Cloud Functions (même code pour les 2 env)
```

---

## ⚠️ Règles de Sécurité

### ❌ À NE JAMAIS FAIRE

1. ❌ Tester directement en production
2. ❌ Déployer sans tester sur TEST
3. ❌ Confondre les environnements
4. ❌ Modifier directement Firestore PROD sans backup
5. ❌ Committer les fichiers `*.test.html` ou `firebase-config.*.js`

### ✅ Bonnes Pratiques

1. ✅ Toujours vérifier l'environnement actif : `firebase use`
2. ✅ Tester sur TEST avant PROD
3. ✅ Vérifier les logs après déploiement
4. ✅ Faire des backups Firestore réguliers
5. ✅ Utiliser le script `deploy.sh` pour éviter les erreurs

---

## 🆘 Dépannage

### Problème : "Je ne sais pas sur quel environnement je suis"

```bash
firebase use
```

### Problème : "J'ai déployé sur le mauvais environnement"

**Si c'était sur TEST** : Pas de problème, redéployez sur PROD

**Si c'était sur PROD** : 
1. Restaurez la version précédente via la console Hosting
2. Redéployez la bonne version

### Problème : "Les modifications ne s'affichent pas"

1. Vider le cache du navigateur (Ctrl+Shift+R ou Cmd+Shift+R)
2. Vérifier que vous êtes sur la bonne URL
3. Vérifier les logs : `firebase functions:log`

---

## 📞 Aide Rapide

| Besoin | Commande |
|--------|----------|
| Voir l'environnement actif | `firebase use` |
| Basculer sur TEST | `firebase use test` |
| Basculer sur PROD | `firebase use production` |
| Déployer sur TEST | `./deploy.sh test` |
| Déployer sur PROD | `./deploy.sh production` |
| Voir les logs TEST | `firebase use test && firebase functions:log` |
| Voir les logs PROD | `firebase use production && firebase functions:log` |

---

## 🎓 Ressources

- **Guide complet** : Voir `DEPLOY_GUIDE.md`
- **Configuration Reset** : Voir `RESET_AUTO.md`
- **Sécurité** : Voir `SECURITY.md`

---

## 🎉 Résumé

Vous avez maintenant :
- ✅ Un environnement de TEST pour expérimenter sans risque
- ✅ Un environnement de PRODUCTION pour les utilisateurs réels
- ✅ Des bases de données complètement séparées
- ✅ Des outils pour faciliter le déploiement
- ✅ Des protections pour éviter les erreurs

**Profitez de votre environnement de test pour innover en toute sécurité ! 🚀**
