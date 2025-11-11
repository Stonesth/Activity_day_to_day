/**
 * Script d'initialisation de la configuration du reset automatique
 * À exécuter UNE SEULE FOIS depuis la console du navigateur
 */

import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js';
import { getFirestore, doc, setDoc, getDoc } from 'https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js';

// Configuration Firebase (même que dans index.html)
const firebaseConfig = {
  apiKey: "AIzaSyDTnP6YVWp2kUtNWTUuZX2STk_yp0OlAco",
  authDomain: "activity-day-to-day.firebaseapp.com",
  projectId: "activity-day-to-day",
  storageBucket: "activity-day-to-day.firebasestorage.app",
  messagingSenderId: "44469659985",
  appId: "1:44469659985:web:2a9eedcd03bc6050ae6e38"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function initResetConfig() {
  console.log('🔄 Initialisation de la configuration du reset automatique...');
  
  try {
    // Vérifier si la config existe déjà
    const configRef = doc(db, 'reset_config', 'main_config');
    const configSnap = await getDoc(configRef);
    
    if (configSnap.exists()) {
      console.log('⚠️ Configuration déjà existante:');
      console.log(configSnap.data());
      const confirm = window.confirm('La configuration existe déjà. Voulez-vous la remplacer ?');
      if (!confirm) {
        console.log('❌ Opération annulée');
        return;
      }
    }
    
    // Créer la configuration initiale
    const initialConfig = {
      enabled: true,
      time: '06:00',
      timezone: 'Europe/Paris',
      activeDays: [1, 2, 3, 4, 5, 6, 0], // Lun-Dim (0=Dimanche)
      lastReset: null,
      notifications: {
        email: {
          enabled: true,
          address: 'pierre.thonon@gmail.com',
          onSuccess: true,
          onError: true,
          weeklyStats: false
        }
      },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    await setDoc(configRef, initialConfig);
    
    console.log('✅ Configuration créée avec succès !');
    console.log('📋 Configuration:');
    console.log(initialConfig);
    console.log('');
    console.log('🎉 Le reset automatique est maintenant configuré !');
    console.log('⏰ Premier reset demain matin à 06:00');
    console.log('📧 Email de confirmation sera envoyé à:', initialConfig.notifications.email.address);
    
    alert('✅ Configuration du reset automatique créée avec succès !\n\n⏰ Premier reset demain à 06:00\n📧 Email envoyé à: ' + initialConfig.notifications.email.address);
    
  } catch (error) {
    console.error('❌ Erreur lors de l\'initialisation:', error);
    alert('❌ Erreur: ' + error.message);
  }
}

// Exposer la fonction globalement
window.initResetConfig = initResetConfig;

console.log('📝 Script chargé !');
console.log('👉 Pour initialiser la configuration, tapez dans la console:');
console.log('   initResetConfig()');
