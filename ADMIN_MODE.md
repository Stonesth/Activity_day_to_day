# 🔒 Mode Admin - Guide d'Utilisation

## Vue d'Ensemble

Le **Mode Admin** est une fonctionnalité de sécurité qui protège la suppression des tâches. Par défaut, les boutons de suppression sont **cachés** pour éviter les suppressions accidentelles, surtout par les enfants.

## 🔐 Code PIN

**Code d'accès** : `1571`

⚠️ **Important** : Ce code est actuellement codé en dur dans l'application. Pour le changer, modifiez la variable `ADMIN_PIN` dans `/public/js/app.js`.

## 📋 Comment Utiliser le Mode Admin

### Étape 1 : Activer le Mode Admin

1. **Localiser le bouton** : À gauche du filtre "Tous", vous verrez un bouton **🔒**
2. **Cliquer sur le bouton** : Une modale s'ouvre

   ```
   ┌─────────────────────────────┐
   │      🔒 Mode Admin          │
   │                             │
   │ Entrez le code pour activer │
   │ le mode suppression         │
   │                             │
   │      [    ••••    ]         │
   │                             │
   │  [Annuler]  [Valider]       │
   └─────────────────────────────┘
   ```

3. **Entrer le code** : Tapez `1571`
4. **Valider** : Cliquez sur "Valider" ou appuyez sur Entrée

### Étape 2 : Utiliser le Mode Admin

Une fois activé :

✅ Le bouton change de **🔒** à **🔓**  
✅ Le bouton pulse avec une animation rose  
✅ Notification : "✅ Mode Admin activé"  
✅ **Les boutons de suppression apparaissent** sur toutes les tâches

**Exemple de tâche en mode admin** :
```
┌─────────────────────────────────────────┐
│ ⭕ Ranger sa chambre          ⭐⭐⭐    │
│ [✏️ Modifier] [🗑️ Supprimer]           │
└─────────────────────────────────────────┘
```

### Étape 3 : Désactiver le Mode Admin

1. **Cliquer à nouveau** sur le bouton **🔓**
2. Le mode admin se désactive immédiatement
3. Le bouton redevient **🔒**
4. Les boutons de suppression disparaissent
5. Notification : "🔒 Mode Admin désactivé"

## 🎯 Cas d'Usage

### Usage Normal (Mode Sécurisé)

**Pour les enfants et l'usage quotidien** :
- ✅ Voir les tâches
- ✅ Cocher/décocher les tâches (complétion)
- ✅ Ajouter de nouvelles tâches
- ❌ **Pas de suppression possible**

### Usage Admin (Mode Suppression)

**Pour les parents uniquement** :
- ✅ Toutes les fonctionnalités normales
- ✅ **Modifier les tâches**
- ✅ **Supprimer les tâches**

## 🛡️ Sécurité

### Pourquoi un Code PIN ?

1. **Protection contre les suppressions accidentelles**
   - Les enfants ne peuvent pas supprimer par erreur
   - Les clics accidentels ne suppriment pas les tâches

2. **Contrôle parental**
   - Seuls les parents connaissent le code
   - Gestion centralisée des tâches

3. **Interface épurée**
   - Les boutons de suppression n'encombrent pas l'interface
   - L'expérience utilisateur est simplifiée pour les enfants

### Niveau de Sécurité

⚠️ **Sécurité basique** : 
- Le code est côté client (JavaScript)
- Un utilisateur technique pourrait le trouver dans le code source
- Suffisant pour un usage familial, pas pour des données sensibles

### Pour une Sécurité Renforcée (Futur)

Si vous souhaitez renforcer la sécurité :

1. **Authentification Firebase**
   - Connexion avec email/mot de passe
   - Règles Firestore basées sur l'utilisateur

2. **Code PIN côté serveur**
   - Validation dans Firebase Functions
   - Code non visible dans le client

3. **Rôles utilisateurs**
   - "Parent" : tous les droits
   - "Enfant" : lecture et complétion uniquement

## 🔧 Configuration

### Changer le Code PIN

**Fichier** : `/public/js/app.js`

```javascript
// Variables globales
let currentFilter = 'all';
let unsubscribe = null;
let isAdminMode = false;
const ADMIN_PIN = '1571';  // ← CHANGEZ ICI
```

**Étapes** :
1. Ouvrir `/public/js/app.js`
2. Trouver la ligne `const ADMIN_PIN = '1571';`
3. Remplacer `'1571'` par votre nouveau code (4 chiffres recommandés)
4. Sauvegarder
5. Déployer : `npm run deploy`

**Exemple** :
```javascript
const ADMIN_PIN = '2024';  // Nouveau code
```

### Désactiver Complètement le Mode Admin

Si vous voulez que les boutons de suppression soient **toujours visibles** :

**Fichier** : `/public/css/styles.css`

```css
/* Boutons de suppression cachés par défaut */
.task-actions .btn-danger {
    display: none;  /* ← Changer en: display: inline-block; */
}

.admin-mode-active .task-actions .btn-danger {
    display: inline-block;
}
```

**Ou supprimer ces lignes complètement.**

## 🎨 Personnalisation

### Changer l'Icône du Bouton

**Fichier** : `/public/index.html`

```html
<button id="adminModeBtn" class="admin-mode-btn">
    🔒  <!-- ← Changez l'icône ici -->
</button>
```

**Suggestions** :
- 🔒 / 🔓 (actuel)
- 🛡️ / ✅
- 👤 / 👨‍💼
- 🚫 / ✔️

### Changer les Couleurs

**Fichier** : `/public/css/styles.css`

```css
/* État normal */
.admin-mode-btn {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

/* État actif */
.admin-mode-btn.active {
    background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
}
```

## 📊 Statistiques d'Utilisation

Le mode admin **n'est pas tracé** actuellement. Pour ajouter le suivi :

```javascript
// Dans enableAdminMode()
console.log('Mode admin activé à:', new Date());

// Ou avec Firebase Analytics
logEvent(analytics, 'admin_mode_enabled');
```

## ❓ FAQ

### Q : Que se passe-t-il si j'oublie le code ?

**R** : Le code est stocké en clair dans `/public/js/app.js` :
1. Ouvrir le fichier
2. Chercher `ADMIN_PIN`
3. Lire le code ou le changer

### Q : Le mode admin persiste-t-il après rafraîchissement ?

**R** : **Non**. Le mode admin se réinitialise à chaque :
- Rafraîchissement de la page
- Fermeture de l'onglet
- Changement de page

C'est volontaire pour la sécurité.

### Q : Peut-on avoir plusieurs codes différents ?

**R** : Oui, vous pouvez créer une logique plus complexe :

```javascript
const ADMIN_PINS = {
    'papa': '1571',
    'maman': '2468',
    'grandparents': '1234'
};

function validatePin() {
    const pin = document.getElementById('pinInput').value;
    if (Object.values(ADMIN_PINS).includes(pin)) {
        enableAdminMode();
    } else {
        // Erreur
    }
}
```

### Q : Comment activer le mode admin automatiquement ?

**R** : Dans `/public/js/app.js`, ajoutez après l'initialisation :

```javascript
function initializeApp() {
    // ... code existant ...
    
    // Auto-activer le mode admin (DÉCONSEILLÉ pour production)
    enableAdminMode();
}
```

⚠️ **Non recommandé** : cela désactive toute la protection.

### Q : Puis-je masquer le bouton admin complètement ?

**R** : Oui, dans `/public/css/styles.css` :

```css
.admin-mode-btn {
    display: none;
}
```

Mais vous devrez activer le mode admin via la console :
```javascript
enableAdminMode()
```

## 🔄 Workflow Recommandé

### Usage Quotidien

1. **Les enfants utilisent l'app normalement**
   - Consultent leurs tâches
   - Cochent les tâches complétées
   - Voient leurs étoiles augmenter

2. **Les parents activent le mode admin au besoin**
   - Entrent le code `1571`
   - Modifient ou suppriment des tâches
   - Désactivent le mode admin après usage

### Gestion Hebdomadaire

1. **Dimanche soir** : Les parents activent le mode admin
2. **Suppriment les anciennes tâches**
3. **Créent les nouvelles tâches de la semaine**
4. **Désactivent le mode admin**
5. **Les enfants commencent la semaine avec des tâches fraîches**

## 📚 Ressources

- **Code source** : `/public/js/app.js` (lignes 13-469)
- **Styles** : `/public/css/styles.css` (lignes 463-665)
- **HTML** : `/public/index.html` (lignes 18-153)
- **Documentation complète** : `README.md`

## 🆘 Dépannage

### Problème : Le bouton n'apparaît pas

**Solution** :
1. Vider le cache : `Cmd/Ctrl + Shift + R`
2. Vérifier que `adminModeBtn` existe dans le HTML
3. Vérifier la console pour les erreurs

### Problème : Le code ne fonctionne pas

**Solution** :
1. Vérifier que vous tapez bien `1571`
2. Regarder dans la console si erreur
3. Vérifier `ADMIN_PIN` dans `app.js`

### Problème : Les boutons de suppression ne s'affichent pas

**Solution** :
1. Vérifier que le mode admin est bien activé (bouton 🔓)
2. Vérifier la classe `.admin-mode-active` dans la console
3. Vérifier le CSS pour `.task-actions .btn-danger`

### Problème : Le mode admin reste activé

**Solution** :
- Rafraîchir la page : `F5` ou `Cmd/Ctrl + R`
- Ou cliquer sur le bouton 🔓 pour désactiver

## ✅ Check-list de Test

Avant de déployer en production :

- [ ] Le bouton 🔒 s'affiche correctement
- [ ] La modale s'ouvre au clic
- [ ] Le code `1571` active le mode admin
- [ ] Un mauvais code affiche une erreur
- [ ] Le bouton devient 🔓 quand activé
- [ ] Les boutons de suppression apparaissent
- [ ] La désactivation fonctionne
- [ ] Le rafraîchissement réinitialise le mode
- [ ] Responsive sur mobile
- [ ] Notifications toast s'affichent

---

**Version** : 1.1.0  
**Date** : 20 octobre 2025  
**Code PIN par défaut** : `1571`  
**Application** : https://activity-day-to-day.web.app
