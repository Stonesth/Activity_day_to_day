# 🔧 Guide de Dépannage

## Problèmes Courants et Solutions

### ❌ Erreur : "Cannot read properties of null (reading 'value')"

**Symptôme** :
```
app.js:69 Uncaught (in promise) TypeError: Cannot read properties of null (reading 'value')
```

**Cause** : Votre navigateur affiche une ancienne version de l'application (cache).

**Solutions** :

#### Solution 1 : Vidage du Cache (Recommandé)

**Sur macOS (Chrome/Safari/Firefox)** :
```
Cmd + Shift + R
```

**Sur Windows/Linux (Chrome/Firefox)** :
```
Ctrl + Shift + R
```

**Sur Safari (macOS)** :
```
1. Cmd + Option + E (vider le cache)
2. Cmd + R (rafraîchir)
```

#### Solution 2 : Vidage Manuel du Cache

**Chrome** :
1. Ouvrir DevTools (F12 ou Cmd+Option+I)
2. Clic droit sur le bouton de rafraîchissement
3. Sélectionner "Vider le cache et effectuer une actualisation forcée"

**Firefox** :
1. Ouvrir DevTools (F12)
2. Onglet "Réseau"
3. Cocher "Désactiver le cache"
4. Rafraîchir la page

**Safari** :
1. Safari → Préférences → Avancé
2. Cocher "Afficher le menu Développement"
3. Développement → Vider les caches
4. Rafraîchir la page

#### Solution 3 : Mode Navigation Privée

1. Ouvrir une fenêtre de navigation privée/incognito
2. Aller sur https://activity-day-to-day.web.app
3. L'application devrait fonctionner correctement

#### Solution 4 : Supprimer les Données du Site

**Chrome** :
1. F12 pour ouvrir DevTools
2. Onglet "Application"
3. Storage → Clear site data
4. Rafraîchir

**Firefox** :
1. F12 pour ouvrir DevTools
2. Onglet "Stockage"
3. Clic droit → Tout supprimer
4. Rafraîchir

---

### ❌ Erreur : "Missing required fields"

**Symptôme** : Impossible de créer ou modifier des tâches.

**Cause** : Anciennes tâches dans Firestore avec l'ancien format (champ `priority` au lieu de `stars`).

**Solution** :

1. **Supprimer les anciennes tâches** :
   - Aller sur https://activity-day-to-day.web.app
   - Supprimer manuellement les tâches une par une

2. **Ou migrer via Firestore Console** :
   - Aller sur https://console.firebase.google.com/project/activity-day-to-day/firestore
   - Ouvrir chaque document de la collection `tasks`
   - Retirer le champ `priority`
   - Ajouter le champ `stars` avec une valeur entre 1 et 5

---

### ❌ Les tâches ne s'affichent pas

**Causes possibles** :

#### 1. Problème de cache
**Solution** : Vider le cache (voir ci-dessus)

#### 2. Firebase non initialisé
**Vérification** :
1. Ouvrir la console du navigateur (F12)
2. Vérifier s'il y a des erreurs rouges
3. Si erreur "Firebase is not initialized", vérifier la configuration dans `index.html`

#### 3. Règles Firestore non déployées
**Solution** :
```bash
cd Activity_day_to_day
firebase deploy --only firestore:rules
```

---

### ❌ Erreur : "Permission denied"

**Symptôme** : Impossible de lire ou écrire dans Firestore.

**Causes et Solutions** :

#### 1. Règles Firestore trop restrictives
**Solution** :
```bash
firebase deploy --only firestore:rules
```

#### 2. Vérifier les règles dans Firebase Console
1. Aller sur https://console.firebase.google.com/project/activity-day-to-day/firestore/rules
2. Vérifier que les règles permettent la lecture/écriture
3. Publier les règles si nécessaire

---

### ❌ L'application ne se charge pas (page blanche)

**Solutions** :

#### 1. Vérifier la console
1. F12 pour ouvrir DevTools
2. Onglet "Console"
3. Noter les erreurs affichées

#### 2. Erreurs JavaScript courantes

**Si erreur de syntaxe** :
- Vider le cache
- Rafraîchir

**Si erreur "Failed to fetch"** :
- Vérifier votre connexion Internet
- Vérifier que Firebase est accessible

**Si erreur CORS** :
- Normalement géré automatiquement par Firebase Hosting
- Contacter le support si le problème persiste

---

### ❌ Les statistiques ne se mettent pas à jour

**Symptôme** : Le compteur d'étoiles ne change pas.

**Solutions** :

1. **Rafraîchir la page** : Les stats se mettent à jour en temps réel normalement

2. **Vérifier la connexion Firebase** :
   - F12 → Console
   - Rechercher des erreurs Firestore

3. **Forcer le rafraîchissement** :
   - Cmd/Ctrl + Shift + R

---

### ❌ Impossible de déployer sur Firebase

**Erreur** : `Error: HTTP Error: 403, The caller does not have permission`

**Solutions** :

1. **Se reconnecter à Firebase** :
```bash
firebase logout
firebase login
```

2. **Vérifier le projet** :
```bash
firebase projects:list
firebase use activity-day-to-day
```

3. **Vérifier les permissions** :
   - Aller sur https://console.firebase.google.com
   - Vérifier que vous avez les droits sur le projet

---

### ❌ Localhost ne fonctionne pas

**Erreur** : `firebase serve` échoue

**Solutions** :

1. **Installer Firebase CLI** :
```bash
npm install -g firebase-tools
```

2. **Se connecter** :
```bash
firebase login
```

3. **Vérifier le port** :
   - Le port 5000 ou 5002 peut être utilisé
   - Vérifier le message dans la console

4. **Problème de port déjà utilisé** :
```bash
# Trouver le processus
lsof -ti:5000
# Tuer le processus
kill -9 <PID>
```

---

## 🆘 Diagnostic Complet

Si aucune solution ci-dessus ne fonctionne, suivez ces étapes :

### Étape 1 : Collecter les Informations

1. **Ouvrir DevTools** (F12)
2. **Onglet Console** : Copier toutes les erreurs
3. **Onglet Réseau** : Vérifier les requêtes en échec
4. **Onglet Application** : Vérifier le Service Worker

### Étape 2 : Vérifier la Version

**Dans la console du navigateur, taper** :
```javascript
// Vérifier si le champ stars existe
document.getElementById('stars')
```

**Si retourne `null`** → Problème de cache (vider le cache)
**Si retourne un élément** → Problème ailleurs (voir autres solutions)

### Étape 3 : Test en Mode Incognito

1. Ouvrir une fenêtre de navigation privée
2. Aller sur l'URL de l'application
3. Si ça fonctionne → Problème de cache sur votre navigateur principal

### Étape 4 : Vérifier Firebase

```bash
# Vérifier l'état du déploiement
firebase hosting:channel:list

# Vérifier les règles Firestore
firebase firestore:rules
```

---

## 📞 Support

Si le problème persiste :

1. **Vérifier le CHANGELOG.md** pour les notes de migration
2. **Consulter les logs Firebase** : https://console.firebase.google.com/project/activity-day-to-day/overview
3. **Vérifier GitHub Issues** : https://github.com/Stonesth/Activity_day_to_day/issues

---

## ✅ Check-list de Vérification

Avant de chercher de l'aide, vérifiez :

- [ ] J'ai vidé le cache du navigateur (Cmd/Ctrl + Shift + R)
- [ ] J'ai testé en navigation privée
- [ ] J'ai vérifié la console pour les erreurs (F12)
- [ ] J'ai vérifié que Firebase est déployé (`npm run deploy`)
- [ ] J'ai vérifié les règles Firestore (`firebase deploy --only firestore:rules`)
- [ ] Je suis sur la dernière version (https://activity-day-to-day.web.app)
- [ ] J'ai consulté le CHANGELOG.md pour les migrations nécessaires

---

## 🔄 Réinitialisation Complète

En dernier recours, pour repartir de zéro :

### Option 1 : Navigateur
```
1. Vider tout le cache du navigateur
2. Supprimer les cookies pour activity-day-to-day.web.app
3. Fermer et rouvrir le navigateur
4. Aller sur l'URL en navigation privée d'abord
```

### Option 2 : Firestore (⚠️ SUPPRIME TOUTES LES DONNÉES)
```
1. Aller sur Firebase Console
2. Firestore Database
3. Supprimer toutes les tâches
4. Redémarrer l'application
```

### Option 3 : Redéploiement
```bash
cd Activity_day_to_day
firebase deploy --only hosting,firestore:rules
```

---

## 📚 Ressources Utiles

- **Firebase Console** : https://console.firebase.google.com/project/activity-day-to-day
- **Application Live** : https://activity-day-to-day.web.app
- **GitHub** : https://github.com/Stonesth/Activity_day_to_day
- **Documentation Firebase** : https://firebase.google.com/docs
