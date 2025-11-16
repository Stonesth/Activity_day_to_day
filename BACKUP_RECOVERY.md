# 💾 Guide de Backup et Récupération

## 😔 Situation Actuelle : Données Supprimées

### ❌ Mauvaise Nouvelle

Les tâches supprimées de PRODUCTION **ne peuvent PAS être récupérées** car :
- ❌ Aucun backup automatique configuré
- ❌ Aucun export manuel existant
- ❌ Firestore ne garde pas d'historique des suppressions

### ✅ Ce que vous POUVEZ faire

#### 1. Vérifier ce qui reste sur TEST

Ouvrez : 🔗 **https://activity-day-to-day.web.app/list-tasks.html**

- Cliquez sur **"🔴 TEST"** → Voir les tâches sur TEST
- Cliquez sur **"✅ PRODUCTION"** → Voir les tâches sur PROD
- **Comparez** : Y a-t-il des tâches sur TEST absentes de PROD ?

#### 2. Recréer Manuellement

Si vous vous souvenez des tâches supprimées :

**Liste ce dont vous avez besoin** :
- Nom de la tâche
- Assigné à (personne)
- Nombre d'étoiles
- Est-ce une tâche bonus ?
- Jour(s) de la semaine

**Je peux créer un script** pour les recréer automatiquement.

#### 3. Copier depuis TEST vers PROD

Si certaines tâches existent sur TEST mais pas sur PROD, je peux créer un script de copie.

---

## 🛡️ Solution : Backups Automatiques pour l'Avenir

### Option A : Backups Firebase (Recommandé)

**Avantages** :
- ✅ Automatique
- ✅ Restauration complète possible
- ✅ Point-in-time recovery

**Inconvénient** :
- ❌ Nécessite le plan **Blaze** (payant)
- ❌ Coût de stockage Google Cloud

**Configuration** :

1. Allez sur : https://console.firebase.google.com/project/activity-day-to-day/firestore/databases/-default-/backups

2. Cliquez **"Set up backup"**

3. Configurez :
   - Fréquence : **Quotidienne** (recommandé)
   - Heure : **3h du matin** (peu d'utilisation)
   - Rétention : **7 jours** (minimum)
   - Location : **europe-west1** (Europe)

4. Coût estimé : ~2-5€/mois

---

### Option B : Script de Backup Manuel (Gratuit)

J'ai créé un script : `backup-firestore.sh`

**Utilisation** :

```bash
# Backup PRODUCTION
firebase use production
./backup-firestore.sh

# Backup TEST
firebase use test
./backup-firestore.sh
```

**Résultat** : Fichier JSON dans `backups/firestore_prod_YYYYMMDD_HHMMSS.json`

**Conseil** : Lancez ce script **avant toute opération à risque** :
- Avant migration
- Avant suppression en masse
- Une fois par semaine minimum

---

### Option C : Soft Delete (Recommandé pour le futur)

Au lieu de supprimer vraiment, **marquer comme supprimé**.

**Modification du code** :

```javascript
// Au lieu de :
await db.collection('tasks').doc(taskId).delete();

// Faire :
await db.collection('tasks').doc(taskId).update({
    deleted: true,
    deletedAt: firebase.firestore.FieldValue.serverTimestamp()
});
```

**Avantages** :
- ✅ Récupération immédiate possible
- ✅ Historique des suppressions
- ✅ Nettoyage manuel ultérieur

**Je peux implémenter** cette fonction si vous voulez.

---

## 🔄 Script de Restauration

Si vous avez un fichier backup, voici comment restaurer :

```javascript
// restore-backup.js
const admin = require('firebase-admin');
const fs = require('fs');

admin.initializeApp({ projectId: 'activity-day-to-day' });
const db = admin.firestore();

async function restore(backupFile) {
    const backup = JSON.parse(fs.readFileSync(backupFile, 'utf8'));
    
    console.log(`Restauration de ${backup.count} tâches...`);
    
    const batch = db.batch();
    
    backup.tasks.forEach(task => {
        const ref = db.collection('tasks').doc(task.id);
        batch.set(ref, task);
    });
    
    await batch.commit();
    console.log('✅ Restauration terminée');
}

restore(process.argv[2]);
```

**Utilisation** :
```bash
node restore-backup.js backups/firestore_prod_20250116_150000.json
```

---

## 📋 Checklist de Sécurité

### Avant toute opération risquée :

- [ ] Faire un backup manuel (`./backup-firestore.sh`)
- [ ] Vérifier que le backup est valide (ouvrir le JSON)
- [ ] Tester sur TEST d'abord
- [ ] Avoir le script de restauration prêt

### Après une suppression accidentelle :

- [ ] **NE PAS PANIQUER** (ça n'aide pas 😅)
- [ ] Vérifier s'il existe un backup récent
- [ ] Si oui : Restaurer depuis le backup
- [ ] Si non : Recréer manuellement

---

## 🎯 Recommandations Immédiates

### Pour Aujourd'hui

1. **Listez vos tâches actuelles** :
   - TEST : https://activity-day-to-day.web.app/list-tasks.html
   - PROD : https://activity-day-to-day.web.app/list-tasks.html

2. **Faites un backup maintenant** :
   ```bash
   firebase use production
   ./backup-firestore.sh
   ```

3. **Dites-moi quelles tâches manquent** (si vous vous en souvenez)

### Pour l'Avenir

1. **Activez les backups automatiques** (si budget OK)
   
   OU

2. **Backup manuel hebdomadaire** :
   - Créez un rappel calendrier chaque dimanche
   - Lancez `./backup-firestore.sh`
   - Copiez le fichier dans Dropbox/Google Drive

3. **Implémentez le soft delete** (je peux le faire)

---

## 🆘 Questions Fréquentes

### "Puis-je récupérer mes données maintenant ?"

Malheureusement **non**, sauf si :
- Vous avez un backup local que vous avez oublié
- Les données existent encore sur TEST
- Vous vous souvenez exactement de ce qui était supprimé

### "Comment éviter ça à l'avenir ?"

- ✅ Backups automatiques Firebase
- ✅ Backups manuels réguliers
- ✅ Soft delete au lieu de vraie suppression
- ✅ Tester sur TEST avant PROD

### "C'est possible de récupérer via l'historique Firebase ?"

Non. Firebase ne garde pas d'historique. Une fois supprimé = disparu définitivement.

---

## 📞 Prochaines Étapes

**Dites-moi** :

1. **Quelles tâches manquent** (si vous vous en souvenez) ?
2. **Voulez-vous que j'implémente le soft delete** ?
3. **Voulez-vous activer les backups automatiques** (nécessite upgrade Blaze) ?

---

**Date de création** : 16 novembre 2025  
**Auteur** : Cascade AI
