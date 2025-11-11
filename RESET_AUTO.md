# ⏰ Reset Automatique Quotidien - Guide Technique

## 📋 Vue d'Ensemble

Le système de reset automatique quotidien permet de remettre à zéro toutes les tâches cochées à une heure prédéfinie chaque jour, automatisant ainsi la gestion quotidienne des tâches familiales.

## 🎯 Objectifs

- **Automatisation** : Éliminer la manipulation manuelle quotidienne
- **Cohérence** : Assurer un reset uniforme pour toute la famille
- **Historique** : Conserver les statistiques de performance quotidiennes
- **Flexibilité** : Permettre la configuration selon les besoins familiaux

## 🔧 Architecture Technique

### Structure des Données

#### Collection `reset_config`
```javascript
{
  id: "main_config",
  enabled: true,
  time: "06:00",
  timezone: "Europe/Paris",
  activeDays: [1, 2, 3, 4, 5, 6, 0], // Lun-Dim (0=Dimanche)
  lastReset: "2025-11-11",
  notifications: {
    email: {
      enabled: true,
      address: "pierre.thonon@gmail.com",
      onSuccess: true,
      onError: true,
      weeklyStats: true
    }
  }
}
```

#### Collection `daily_stats`
```javascript
{
  id: "stats_2025_11_11",
  date: "2025-11-11",
  resetTime: "06:00:00",
  beforeReset: {
    papa: {
      completed: 8,
      total: 10,
      stars: 24,
      completionRate: 80
    },
    maman: {
      completed: 9,
      total: 12,
      stars: 28,
      completionRate: 75
    },
    bastien: {
      completed: 15,
      total: 18,
      stars: 45,
      completionRate: 83
    },
    florent: {
      completed: 12,
      total: 15,
      stars: 36,
      completionRate: 80
    }
  },
  totalTasks: 55,
  totalCompleted: 44,
  totalStars: 133,
  familyCompletionRate: 80,
  resetBy: "system_auto",
  createdAt: timestamp
}
```

### Cloud Function

#### Fonction Principale
```javascript
// functions/index.js
const functions = require('firebase-functions');
const admin = require('firebase-admin');

admin.initializeApp();
const db = admin.firestore();

exports.dailyTaskReset = functions
  .region('europe-west1')
  .pubsub
  .schedule('0 6 * * *') // Tous les jours à 6h
  .timeZone('Europe/Paris')
  .onRun(async (context) => {
    console.log('🔄 Début du reset automatique quotidien');
    
    try {
      // 1. Vérifier la configuration
      const config = await getResetConfig();
      if (!config.enabled) {
        console.log('⏸️ Reset désactivé');
        return null;
      }
      
      // 2. Vérifier si reset déjà effectué aujourd'hui
      const today = new Date().toISOString().split('T')[0];
      if (config.lastReset === today) {
        console.log('✅ Reset déjà effectué aujourd'hui');
        return null;
      }
      
      // 3. Sauvegarder les statistiques
      const stats = await saveCurrentStats(today);
      
      // 4. Effectuer le reset
      await resetAllTasks();
      
      // 5. Mettre à jour la configuration
      await updateLastReset(today);
      
      // 6. Envoyer les notifications email
      await sendSuccessEmail(stats);
      
      console.log('✅ Reset automatique terminé avec succès');
      return null;
      
    } catch (error) {
      console.error('❌ Erreur lors du reset automatique:', error);
      await logError(error);
      throw error;
    }
  });

// Fonctions utilitaires
async function getResetConfig() {
  const doc = await db.collection('reset_config').doc('main_config').get();
  return doc.exists ? doc.data() : getDefaultConfig();
}

async function saveCurrentStats(date) {
  const tasks = await db.collection('tasks').get();
  const stats = calculateStats(tasks.docs);
  
  await db.collection('daily_stats').doc(`stats_${date.replace(/-/g, '_')}`).set({
    date,
    resetTime: new Date().toTimeString().split(' ')[0],
    beforeReset: stats,
    totalTasks: stats.totalTasks,
    totalCompleted: stats.totalCompleted,
    totalStars: stats.totalStars,
    familyCompletionRate: Math.round((stats.totalCompleted / stats.totalTasks) * 100),
    resetBy: 'system_auto',
    createdAt: admin.firestore.FieldValue.serverTimestamp()
  });
}

async function resetAllTasks() {
  const batch = db.batch();
  const tasks = await db.collection('tasks').where('completed', '==', true).get();
  
  tasks.docs.forEach(doc => {
    batch.update(doc.ref, {
      completed: false,
      updatedAt: admin.firestore.FieldValue.serverTimestamp()
    });
  });
  
  await batch.commit();
  console.log(`🔄 ${tasks.size} tâches remises à zéro`);
}

async function sendSuccessEmail(stats) {
  const config = await getResetConfig();
  if (!config.notifications.email.enabled || !config.notifications.email.onSuccess) {
    return;
  }
  
  const emailContent = {
    to: config.notifications.email.address,
    subject: '✅ Reset Quotidien Effectué - Activity Day to Day',
    html: generateSuccessEmailHTML(stats)
  };
  
  await sendEmail(emailContent);
}

async function sendErrorEmail(error) {
  const config = await getResetConfig();
  if (!config.notifications.email.enabled || !config.notifications.email.onError) {
    return;
  }
  
  const emailContent = {
    to: config.notifications.email.address,
    subject: '⚠️ Erreur Reset Automatique - Activity Day to Day',
    html: generateErrorEmailHTML(error)
  };
  
  await sendEmail(emailContent);
}

function generateSuccessEmailHTML(stats) {
  return `
    <h2>✅ Reset Quotidien Effectué</h2>
    <p>Le reset automatique des tâches a été effectué avec succès ce matin à 06:00.</p>
    
    <h3>📊 Statistiques d'hier :</h3>
    <ul>
      <li>👨 Papa : ${stats.papa.completed}/${stats.papa.total} tâches (${stats.papa.completionRate}%) - ${stats.papa.stars}⭐</li>
      <li>👩 Maman : ${stats.maman.completed}/${stats.maman.total} tâches (${stats.maman.completionRate}%) - ${stats.maman.stars}⭐</li>
      <li>👦 Bastien : ${stats.bastien.completed}/${stats.bastien.total} tâches (${stats.bastien.completionRate}%) - ${stats.bastien.stars}⭐</li>
      <li>🧒 Florent : ${stats.florent.completed}/${stats.florent.total} tâches (${stats.florent.completionRate}%) - ${stats.florent.stars}⭐</li>
    </ul>
    
    <p><strong>🏆 Performance Familiale : ${stats.familyCompletionRate}% (${stats.totalCompleted}/${stats.totalTasks} tâches)</strong></p>
    <p><strong>⭐ Total Étoiles : ${stats.totalStars}⭐</strong></p>
    
    <p>Bonne journée !<br>Activity Day to Day</p>
  `;
}
```

### Interface de Configuration

#### HTML
```html
<!-- Ajout dans index.html -->
<div id="resetConfigModal" class="modal hidden">
  <div class="modal-content">
    <h3>⏰ Configuration Reset Automatique</h3>
    
    <div class="config-section">
      <label>
        <input type="checkbox" id="resetEnabled" checked>
        Activer le reset automatique quotidien
      </label>
    </div>
    
    <div class="config-section">
      <label>Heure de reset :</label>
      <input type="time" id="resetTime" value="06:00">
    </div>
    
    <div class="config-section">
      <label>Fuseau horaire :</label>
      <select id="resetTimezone">
        <option value="Europe/Paris">Europe/Paris</option>
        <option value="Europe/London">Europe/London</option>
        <option value="America/New_York">America/New_York</option>
      </select>
    </div>
    
    <div class="config-section">
      <label>Jours actifs :</label>
      <div class="days-selector">
        <label><input type="checkbox" value="1" checked> Lundi</label>
        <label><input type="checkbox" value="2" checked> Mardi</label>
        <label><input type="checkbox" value="3" checked> Mercredi</label>
        <label><input type="checkbox" value="4" checked> Jeudi</label>
        <label><input type="checkbox" value="5" checked> Vendredi</label>
        <label><input type="checkbox" value="6" checked> Samedi</label>
        <label><input type="checkbox" value="0" checked> Dimanche</label>
      </div>
    </div>
    
    <div class="config-section">
      <h4>📧 Notifications Email</h4>
      <label>
        <input type="checkbox" id="emailEnabled" checked>
        Activer les notifications email
      </label>
      <div class="email-config">
        <label>Email : <input type="email" id="emailAddress" value="pierre.thonon@gmail.com"></label>
        <div class="email-types">
          <label><input type="checkbox" id="emailOnSuccess" checked> Reset effectué</label>
          <label><input type="checkbox" id="emailOnError" checked> Erreurs</label>
          <label><input type="checkbox" id="emailWeeklyStats" checked> Stats hebdomadaires</label>
        </div>
      </div>
    </div>
    
    <div class="modal-actions">
      <button onclick="saveResetConfig()">💾 Sauvegarder</button>
      <button onclick="testReset()">🧪 Test Reset</button>
      <button onclick="closeResetConfigModal()">❌ Annuler</button>
    </div>
  </div>
</div>
```

#### JavaScript
```javascript
// Ajout dans app.js

// Configuration du reset automatique
async function loadResetConfig() {
  try {
    const doc = await getDoc(doc(window.db, 'reset_config', 'main_config'));
    if (doc.exists()) {
      const config = doc.data();
      populateResetConfigForm(config);
    }
  } catch (error) {
    console.error('Erreur lors du chargement de la config:', error);
  }
}

async function saveResetConfig() {
  const config = {
    enabled: document.getElementById('resetEnabled').checked,
    time: document.getElementById('resetTime').value,
    timezone: document.getElementById('resetTimezone').value,
    activeDays: getSelectedDays(),
    notifications: {
      email: {
        enabled: document.getElementById('emailEnabled').checked,
        address: document.getElementById('emailAddress').value,
        onSuccess: document.getElementById('emailOnSuccess').checked,
        onError: document.getElementById('emailOnError').checked,
        weeklyStats: document.getElementById('emailWeeklyStats').checked
      }
    },
    updatedAt: serverTimestamp()
  };
  
  try {
    await setDoc(doc(window.db, 'reset_config', 'main_config'), config);
    showNotification('✅ Configuration sauvegardée', 'success');
    closeResetConfigModal();
  } catch (error) {
    console.error('Erreur lors de la sauvegarde:', error);
    showNotification('❌ Erreur lors de la sauvegarde', 'error');
  }
}

async function testReset() {
  if (confirm('⚠️ Êtes-vous sûr de vouloir effectuer un reset test ? Toutes les tâches cochées seront décochées.')) {
    try {
      await manualReset();
      showNotification('✅ Reset test effectué avec succès', 'success');
    } catch (error) {
      console.error('Erreur lors du reset test:', error);
      showNotification('❌ Erreur lors du reset test', 'error');
    }
  }
}

async function manualReset() {
  const tasksQuery = query(
    collection(window.db, 'tasks'),
    where('completed', '==', true)
  );
  
  const snapshot = await getDocs(tasksQuery);
  const batch = writeBatch(window.db);
  
  snapshot.docs.forEach(taskDoc => {
    batch.update(taskDoc.ref, {
      completed: false,
      updatedAt: serverTimestamp()
    });
  });
  
  await batch.commit();
  console.log(`🔄 ${snapshot.size} tâches remises à zéro manuellement`);
}
```

### Dashboard de Monitoring

#### Interface
```html
<div id="resetDashboard" class="dashboard-section">
  <h3>📊 Historique des Resets</h3>
  
  <div class="reset-status">
    <div class="status-card">
      <h4>Prochain Reset</h4>
      <div id="nextReset">Demain à 06:00 ⏰</div>
    </div>
    
    <div class="status-card">
      <h4>Dernier Reset</h4>
      <div id="lastReset">Aujourd'hui à 06:00 ✅</div>
    </div>
  </div>
  
  <div class="reset-history">
    <h4>Historique (7 derniers jours)</h4>
    <div id="resetHistoryList">
      <!-- Généré dynamiquement -->
    </div>
  </div>
  
  <div class="dashboard-actions">
    <button onclick="showResetConfigModal()">⚙️ Configuration</button>
    <button onclick="forceReset()">🔄 Forcer Reset</button>
    <button onclick="exportStats()">📊 Exporter Stats</button>
  </div>
</div>
```

## 🚀 Déploiement

### 1. Configuration Firebase Functions

```bash
# Installer Firebase Functions
npm install -g firebase-tools
firebase init functions

# Installer les dépendances
cd functions
npm install firebase-admin firebase-functions nodemailer

# Déployer les fonctions
firebase deploy --only functions
```

### 2. Configuration Email (Nodemailer)

```javascript
// functions/email.js
const nodemailer = require('nodemailer');

// Configuration SMTP (exemple avec Gmail)
const transporter = nodemailer.createTransporter({
  service: 'gmail',
  auth: {
    user: functions.config().email.user, // Configuré via Firebase CLI
    pass: functions.config().email.password // App Password Gmail
  }
});

async function sendEmail(emailContent) {
  try {
    const info = await transporter.sendMail({
      from: '"Activity Day to Day" <noreply@activitydaytoday.com>',
      to: emailContent.to,
      subject: emailContent.subject,
      html: emailContent.html
    });
    
    console.log('📧 Email envoyé:', info.messageId);
    return info;
  } catch (error) {
    console.error('❌ Erreur envoi email:', error);
    throw error;
  }
}

// Configuration des variables d'environnement
// firebase functions:config:set email.user="your-email@gmail.com"
// firebase functions:config:set email.password="your-app-password"
```

### 3. Configuration des Règles Firestore

```javascript
// firestore.rules
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Règles pour reset_config
    match /reset_config/{document} {
      allow read, write: if request.auth != null; // Ou logique admin
    }
    
    // Règles pour daily_stats
    match /daily_stats/{document} {
      allow read: if true; // Lecture publique des stats
      allow write: if false; // Écriture par Cloud Functions uniquement
    }
  }
}
```

### 4. Variables d'Environnement

```bash
# Configuration des variables d'environnement
firebase functions:config:set reset.timezone="Europe/Paris"
firebase functions:config:set reset.default_time="06:00"

# Configuration email
firebase functions:config:set email.user="your-email@gmail.com"
firebase functions:config:set email.password="your-gmail-app-password"
```

**Note** : Pour Gmail, créez un "App Password" dans les paramètres de sécurité Google.

## 🧪 Tests

### Tests Unitaires
```javascript
// tests/reset.test.js
const { dailyTaskReset } = require('../functions/index');

describe('Reset Automatique', () => {
  test('devrait sauvegarder les stats avant reset', async () => {
    // Test de sauvegarde des statistiques
  });
  
  test('devrait remettre à zéro toutes les tâches cochées', async () => {
    // Test du reset des tâches
  });
  
  test('ne devrait pas effectuer de reset si déjà fait', async () => {
    // Test de la protection contre les doublons
  });
});
```

### Tests d'Intégration
```bash
# Tester la Cloud Function localement
firebase functions:shell

# Dans le shell Firebase
dailyTaskReset()
```

## 📈 Monitoring et Alertes

### Logs Firebase
```javascript
// Monitoring des erreurs
functions.logger.info('Reset automatique démarré');
functions.logger.error('Erreur lors du reset:', error);
```

### Alertes
- Configuration d'alertes par email si le reset échoue
- Monitoring du temps d'exécution de la fonction
- Suivi du nombre de tâches resetées quotidiennement

## 🔒 Sécurité

### Permissions
- Seuls les admins peuvent modifier la configuration
- Les Cloud Functions ont les permissions nécessaires
- Les statistiques sont en lecture seule pour les utilisateurs

### Validation
- Validation des heures (00:00 à 23:59)
- Validation des jours (0-6)
- Validation des dates d'exception

## 📚 Documentation Utilisateur

### Guide d'Utilisation
1. Accéder au mode Admin (code PIN)
2. Cliquer sur "⚙️ Configuration Reset"
3. Configurer l'heure et les jours
4. Sauvegarder la configuration
5. Le reset s'effectuera automatiquement

### FAQ
**Q: Que se passe-t-il si je rate le reset automatique ?**
R: Vous pouvez effectuer un reset manuel via le dashboard.

**Q: Les statistiques sont-elles conservées ?**
R: Oui, toutes les statistiques quotidiennes sont sauvegardées avant le reset.

**Q: Puis-je désactiver le reset temporairement ?**
R: Oui, via le mode vacances ou en décochant l'activation.

---

**Dernière mise à jour** : 11 novembre 2025  
**Version** : 1.0  
**Statut** : 📝 Spécification technique - Prêt pour implémentation
