# 🧪 Test du Mode Admin - Checklist

## ✅ Tests à Effectuer

### 1. État Initial (Mode Sécurisé)

Quand vous ouvrez l'application pour la première fois :

- [ ] Le bouton Mode Admin affiche **🔒**
- [ ] Les boutons **"🗑️ Supprimer"** sont **CACHÉS** sur toutes les tâches
- [ ] Seules les tâches sont visibles (titre, étoiles, catégorie)
- [ ] Aucune classe `admin-mode-active` dans l'inspecteur

**Résultat attendu** : Interface propre, sans boutons de suppression ✅

---

### 2. Activation du Mode Admin

Cliquez sur le bouton **🔒** et entrez le code `1571` :

- [ ] La modale s'ouvre avec le champ de code PIN
- [ ] Après validation, le bouton devient **🔓**
- [ ] Le bouton **pulse** avec une animation rose
- [ ] Notification verte : "✅ Mode Admin activé"
- [ ] Les boutons **"🗑️ Supprimer"** **APPARAISSENT** sur toutes les tâches
- [ ] La classe `admin-mode-active` est ajoutée au container

**Résultat attendu** : Boutons de suppression visibles ✅

---

### 3. Utilisation en Mode Admin

En mode admin activé :

- [ ] Vous pouvez **voir** les boutons de suppression
- [ ] Vous pouvez **cliquer** sur "🗑️ Supprimer"
- [ ] La suppression fonctionne correctement
- [ ] Le bouton reste **🔓** (pulse rose)

**Résultat attendu** : Suppression fonctionnelle ✅

---

### 4. Désactivation du Mode Admin

Cliquez à nouveau sur le bouton **🔓** :

- [ ] Le bouton redevient **🔒**
- [ ] L'animation pulse **s'arrête**
- [ ] Notification bleue : "🔒 Mode Admin désactivé"
- [ ] Les boutons **"🗑️ Supprimer"** **DISPARAISSENT** immédiatement
- [ ] La classe `admin-mode-active` est retirée du container

**Résultat attendu** : Retour à l'interface sécurisée ✅

---

### 5. Rafraîchissement de la Page

Après avoir activé puis rafraîchi la page (F5) :

- [ ] Le mode admin est **DÉSACTIVÉ** automatiquement
- [ ] Le bouton affiche **🔒**
- [ ] Les boutons **"🗑️ Supprimer"** sont **CACHÉS**
- [ ] État initial restauré

**Résultat attendu** : Sécurité par défaut après refresh ✅

---

### 6. Test Mobile (Responsive)

Sur mobile ou en mode responsive :

- [ ] Le bouton **🔒** est visible
- [ ] La modale PIN s'affiche correctement
- [ ] Les boutons restent cachés par défaut
- [ ] L'activation/désactivation fonctionne

**Résultat attendu** : Fonctionnement identique sur mobile ✅

---

### 7. Test de Persistance

Tester plusieurs cycles d'activation/désactivation :

- [ ] Cycle 1 : Activer → Désactiver → Boutons cachés ✅
- [ ] Cycle 2 : Activer → Désactiver → Boutons cachés ✅
- [ ] Cycle 3 : Activer → Rafraîchir → Boutons cachés ✅

**Résultat attendu** : Comportement cohérent ✅

---

## 🔍 Comment Vérifier avec l'Inspecteur

### Vérifier les Classes CSS

1. **Ouvrir l'inspecteur** : `F12` ou `Cmd+Option+I`
2. **Onglet Elements/Éléments**
3. **Trouver** : `<div class="container">`

**Mode Admin DÉSACTIVÉ** :
```html
<div class="container">
  <!-- Pas de classe admin-mode-active -->
</div>
```

**Mode Admin ACTIVÉ** :
```html
<div class="container admin-mode-active">
  <!-- La classe est ajoutée -->
</div>
```

### Vérifier les Boutons

Dans l'inspecteur, trouvez un bouton de suppression :

**Mode Admin DÉSACTIVÉ** :
```html
<button class="btn-delete" style="display: none;">
  🗑️ Supprimer
</button>
```

**Mode Admin ACTIVÉ** :
```html
<button class="btn-delete" style="display: inline-block;">
  🗑️ Supprimer
</button>
```

---

## 🐛 Tests d'Erreur

### Test Code PIN Incorrect

- [ ] Entrer `0000` (mauvais code)
- [ ] Message d'erreur : "❌ Code incorrect"
- [ ] Animation shake sur le message
- [ ] Le mode admin **n'est PAS activé**
- [ ] Les boutons restent **CACHÉS**

**Résultat attendu** : Protection fonctionnelle ✅

### Test Sans Tâches

- [ ] Avec 0 tâche créée
- [ ] Le bouton 🔒 est visible
- [ ] L'activation fonctionne
- [ ] Pas d'erreur JavaScript

**Résultat attendu** : Pas de problème sans tâches ✅

---

## 📊 Résumé des Règles CSS

### Règle Principale

```css
/* Boutons cachés PAR DÉFAUT */
.task-actions .btn-delete {
    display: none;
}

/* Boutons visibles UNIQUEMENT en mode admin */
.admin-mode-active .task-actions .btn-delete {
    display: inline-block;
}
```

### Logique

```
État Initial → .btn-delete { display: none; }
                ↓
           Clic sur 🔒
                ↓
          Code 1571 OK ?
                ↓ OUI
    container.classList.add('admin-mode-active')
                ↓
    .admin-mode-active .btn-delete { display: inline-block; }
                ↓
        Boutons VISIBLES
```

---

## ✅ Check-list Finale

Avant de considérer le test terminé :

- [ ] **Test 1** : État initial ✅
- [ ] **Test 2** : Activation ✅
- [ ] **Test 3** : Utilisation ✅
- [ ] **Test 4** : Désactivation ✅
- [ ] **Test 5** : Rafraîchissement ✅
- [ ] **Test 6** : Mobile ✅
- [ ] **Test 7** : Persistance ✅
- [ ] **Test 8** : Code incorrect ✅
- [ ] **Test 9** : Sans tâches ✅

---

## 🆘 En Cas de Problème

### Les boutons restent visibles

**Vérifier** :
1. Ouvrir l'inspecteur (`F12`)
2. Chercher `.btn-delete`
3. Vérifier le `display` calculé

**Solution** :
- Rafraîchir avec `Cmd+Shift+R` (Mac) ou `Ctrl+Shift+R` (Windows)
- Vider le cache complet
- Vérifier que le CSS est bien déployé

### Les boutons ne s'affichent pas en mode admin

**Vérifier** :
1. Le bouton est bien **🔓** (activé)
2. La classe `admin-mode-active` est sur `.container`
3. Le code CSS est bien chargé

**Solution** :
- Vérifier dans la console s'il y a des erreurs
- Recharger la page
- Vérifier le déploiement Firebase

### Le mode admin ne s'active pas

**Vérifier** :
1. Le code est bien `1571`
2. Pas d'erreur JavaScript dans la console
3. La modale se ferme après validation

**Solution** :
- Vérifier `app.js` ligne 17 : `const ADMIN_PIN = '1571';`
- Consulter la console pour les erreurs

---

## 📝 Notes de Test

**Date** : 20 octobre 2025  
**Version** : 1.1.0  
**Code PIN** : 1571  
**URL Test** : https://activity-day-to-day.web.app

### Tests Manuels

```
✅ Chrome Desktop   : 
✅ Firefox Desktop  : 
✅ Safari Desktop   : 
✅ Chrome Mobile    : 
✅ Safari Mobile    : 
```

### Résultat Global

- [ ] Tous les tests passent
- [ ] Aucun bug détecté
- [ ] Prêt pour production

---

**Dernier déploiement** : https://activity-day-to-day.web.app  
**Documentation complète** : [ADMIN_MODE.md](ADMIN_MODE.md)
