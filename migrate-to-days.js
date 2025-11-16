#!/usr/bin/env node

/**
 * Script de migration : Dupliquer les tâches existantes pour chaque jour
 * 
 * Ce script prend toutes les tâches existantes (sans champ dayOfWeek)
 * et crée 7 copies : une pour chaque jour de la semaine (0=Dim, 1=Lun, ..., 6=Sam)
 * 
 * ⚠️ ATTENTION: Cette opération est IRRÉVERSIBLE !
 * ⚠️ Testez d'abord sur l'environnement TEST
 * 
 * Usage:
 *   node migrate-to-days.js --dry-run    # Simulation (pas de modification)
 *   node migrate-to-days.js --execute    # Exécution réelle
 */

const admin = require('firebase-admin');
const readline = require('readline');

// Configuration
const DRY_RUN = process.argv.includes('--dry-run');
const EXECUTE = process.argv.includes('--execute');

console.log('\n========================================');
console.log('🔄 MIGRATION: Système de tâches par jour');
console.log('========================================\n');

if (!DRY_RUN && !EXECUTE) {
    console.error('❌ Erreur: Vous devez spécifier --dry-run ou --execute\n');
    console.log('Usage:');
    console.log('  node migrate-to-days.js --dry-run    # Simulation');
    console.log('  node migrate-to-days.js --execute    # Exécution réelle\n');
    process.exit(1);
}

if (DRY_RUN) {
    console.log('🔍 MODE SIMULATION (--dry-run)');
    console.log('   Aucune modification ne sera faite\n');
} else {
    console.log('⚠️  MODE EXÉCUTION (--execute)');
    console.log('   Les modifications seront PERMANENTES\n');
}

// Initialiser Firebase Admin
try {
    admin.initializeApp();
    console.log('✅ Firebase Admin initialisé\n');
} catch (error) {
    console.error('❌ Erreur lors de l\'initialisation Firebase:', error.message);
    process.exit(1);
}

const db = admin.firestore();

// Fonction principale
async function migrateTasks() {
    try {
        console.log('📊 Étape 1: Récupération des tâches existantes...\n');
        
        // Récupérer toutes les tâches
        const tasksSnapshot = await db.collection('tasks').get();
        
        if (tasksSnapshot.empty) {
            console.log('ℹ️  Aucune tâche trouvée dans la base de données');
            return;
        }
        
        console.log(`📦 ${tasksSnapshot.size} tâche(s) trouvée(s)\n`);
        
        // Filtrer les tâches sans dayOfWeek (anciennes tâches à migrer)
        const tasksToMigrate = [];
        const tasksAlreadyMigrated = [];
        
        tasksSnapshot.forEach(doc => {
            const task = doc.data();
            if (task.dayOfWeek === undefined || task.dayOfWeek === null) {
                tasksToMigrate.push({ id: doc.id, ...task });
            } else {
                tasksAlreadyMigrated.push({ id: doc.id, ...task });
            }
        });
        
        console.log(`✅ Tâches à migrer: ${tasksToMigrate.length}`);
        console.log(`✓  Tâches déjà migrées: ${tasksAlreadyMigrated.length}\n`);
        
        if (tasksToMigrate.length === 0) {
            console.log('✨ Toutes les tâches sont déjà migrées !');
            return;
        }
        
        // Afficher un résumé des tâches à migrer
        console.log('📋 Résumé des tâches à migrer:\n');
        const tasksByPerson = {};
        tasksToMigrate.forEach(task => {
            const person = task.assignedTo || 'inconnu';
            tasksByPerson[person] = (tasksByPerson[person] || 0) + 1;
        });
        
        Object.entries(tasksByPerson).forEach(([person, count]) => {
            console.log(`   ${person}: ${count} tâche(s) → ${count * 7} tâche(s) après migration`);
        });
        
        const totalBefore = tasksToMigrate.length;
        const totalAfter = totalBefore * 7;
        const totalNew = totalAfter - totalBefore;
        
        console.log(`\n📊 Statistiques:`);
        console.log(`   Tâches actuelles: ${totalBefore}`);
        console.log(`   Tâches après migration: ${totalAfter}`);
        console.log(`   Nouvelles tâches créées: ${totalNew}`);
        console.log(`   Tâches à supprimer: ${totalBefore} (anciennes versions)\n`);
        
        // Si mode dry-run, s'arrêter ici
        if (DRY_RUN) {
            console.log('✅ Simulation terminée avec succès');
            console.log('\n💡 Pour exécuter réellement la migration:');
            console.log('   node migrate-to-days.js --execute\n');
            return;
        }
        
        // Mode EXECUTE: Demander confirmation
        console.log('⚠️  ⚠️  ⚠️  ATTENTION ⚠️  ⚠️  ⚠️');
        console.log('Cette opération est IRRÉVERSIBLE !');
        console.log('Les tâches existantes seront supprimées après duplication.\n');
        
        const confirmed = await askConfirmation();
        
        if (!confirmed) {
            console.log('\n❌ Migration annulée par l\'utilisateur');
            return;
        }
        
        console.log('\n🚀 Étape 2: Migration en cours...\n');
        
        let processed = 0;
        let created = 0;
        let deleted = 0;
        
        // Traiter chaque tâche
        for (const task of tasksToMigrate) {
            processed++;
            console.log(`   [${processed}/${tasksToMigrate.length}] Migration: "${task.title}" (${task.assignedTo})`);
            
            // Créer 7 copies (une pour chaque jour)
            const batch = db.batch();
            
            for (let dayOfWeek = 0; dayOfWeek <= 6; dayOfWeek++) {
                const newTaskRef = db.collection('tasks').doc();
                const newTaskData = {
                    ...task,
                    dayOfWeek: dayOfWeek,
                    // Garder la même date de création
                    createdAt: task.createdAt || admin.firestore.FieldValue.serverTimestamp(),
                    updatedAt: admin.firestore.FieldValue.serverTimestamp()
                };
                
                // Supprimer l'ancien ID
                delete newTaskData.id;
                
                batch.set(newTaskRef, newTaskData);
                created++;
            }
            
            // Supprimer l'ancienne tâche
            batch.delete(db.collection('tasks').doc(task.id));
            deleted++;
            
            // Exécuter le batch
            await batch.commit();
        }
        
        console.log('\n✅ Migration terminée avec succès !\n');
        console.log('📊 Résultat:');
        console.log(`   Tâches traitées: ${processed}`);
        console.log(`   Nouvelles tâches créées: ${created}`);
        console.log(`   Anciennes tâches supprimées: ${deleted}\n`);
        
    } catch (error) {
        console.error('\n❌ Erreur lors de la migration:', error);
        throw error;
    }
}

// Fonction pour demander confirmation
function askConfirmation() {
    return new Promise((resolve) => {
        const rl = readline.createInterface({
            input: process.stdin,
            output: process.stdout
        });
        
        rl.question('Voulez-vous continuer ? (tapez "OUI" en majuscules): ', (answer) => {
            rl.close();
            resolve(answer.trim() === 'OUI');
        });
    });
}

// Exécuter le script
migrateTasks()
    .then(() => {
        console.log('✨ Script terminé\n');
        process.exit(0);
    })
    .catch((error) => {
        console.error('\n💥 Erreur fatale:', error);
        process.exit(1);
    });
