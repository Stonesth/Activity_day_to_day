#!/usr/bin/env node

/**
 * Script de migration SIMPLIFIÉ : Dupliquer les tâches existantes pour chaque jour
 * 
 * Version sans Firebase Admin SDK - utilise directement Firestore REST API
 * 
 * ⚠️ ATTENTION: Cette opération est IRRÉVERSIBLE !
 * ⚠️ Testez d'abord sur l'environnement TEST
 * 
 * Usage:
 *   node migrate-to-days-simple.js --dry-run    # Simulation (pas de modification)
 *   node migrate-to-days-simple.js --execute    # Exécution réelle
 */

const https = require('https');
const readline = require('readline');
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Configuration
const DRY_RUN = process.argv.includes('--dry-run');
const EXECUTE = process.argv.includes('--execute');

console.log('\n========================================');
console.log('🔄 MIGRATION: Système de tâches par jour');
console.log('========================================\n');

if (!DRY_RUN && !EXECUTE) {
    console.error('❌ Erreur: Vous devez spécifier --dry-run ou --execute\n');
    console.log('Usage:');
    console.log('  node migrate-to-days-simple.js --dry-run    # Simulation');
    console.log('  node migrate-to-days-simple.js --execute    # Exécution réelle\n');
    process.exit(1);
}

if (DRY_RUN) {
    console.log('🔍 MODE SIMULATION (--dry-run)');
    console.log('   Aucune modification ne sera faite\n');
} else {
    console.log('⚠️  MODE EXÉCUTION (--execute)');
    console.log('   Les modifications seront PERMANENTES\n');
}

// Lire le projet Firebase actif depuis .firebaserc
let projectId;
try {
    const firebaserc = JSON.parse(fs.readFileSync(path.join(__dirname, '.firebaserc'), 'utf8'));
    
    // Trouver le projet actif (celui marqué avec * dans firebase use)
    // En général, c'est le dernier projet utilisé ou celui marqué comme default
    if (firebaserc.projects) {
        // Essayer de lire le fichier de config Firebase CLI pour trouver le projet actif
        try {
            const activeProjectFile = path.join(process.env.HOME || process.env.USERPROFILE, '.config', 'configstore', 'firebase-tools.json');
            const config = JSON.parse(fs.readFileSync(activeProjectFile, 'utf8'));
            const activeCwd = config.activeProjects?.[process.cwd()];
            if (activeCwd && firebaserc.projects[activeCwd]) {
                projectId = firebaserc.projects[activeCwd];
            }
        } catch (e) {
            // Ignorer l'erreur et continuer
        }
        
        // Si pas trouvé, utiliser 'test' ou 'default'
        if (!projectId) {
            projectId = firebaserc.projects.test || firebaserc.projects.default;
        }
    }
    
    if (!projectId) {
        console.error('❌ Erreur: Impossible de trouver le projet Firebase actif');
        console.log('💡 Exécutez "firebase use" pour voir le projet actif\n');
        process.exit(1);
    }
    
    console.log(`📦 Projet Firebase: ${projectId}\n`);
} catch (error) {
    console.error('❌ Erreur lors de la lecture de .firebaserc:', error.message);
    process.exit(1);
}

// Obtenir l'access token Firebase
function getAccessToken() {
    try {
        const token = execSync('firebase login:ci --no-localhost 2>/dev/null', { encoding: 'utf8' }).trim();
        if (token && token.startsWith('1//')) {
            return token;
        }
    } catch (error) {
        // Ignorer
    }
    
    // Alternative: essayer de lire depuis le fichier de config
    try {
        const configPath = path.join(process.env.HOME || process.env.USERPROFILE, '.config', 'configstore', 'firebase-tools.json');
        const config = JSON.parse(fs.readFileSync(configPath, 'utf8'));
        if (config.tokens?.refresh_token) {
            return config.tokens.refresh_token;
        }
    } catch (error) {
        // Ignorer
    }
    
    return null;
}

console.log('🔑 Récupération de l\'access token Firebase...\n');
const accessToken = getAccessToken();

if (!accessToken) {
    console.error('❌ Erreur: Impossible de récupérer l\'access token Firebase');
    console.log('💡 Assurez-vous d\'être connecté avec: firebase login\n');
    process.exit(1);
}

// Fonction pour faire des requêtes REST à Firestore
function firestoreRequest(method, path, body = null) {
    return new Promise((resolve, reject) => {
        const options = {
            hostname: 'firestore.googleapis.com',
            port: 443,
            path: `/v1/projects/${projectId}/databases/(default)/documents${path}`,
            method: method,
            headers: {
                'Authorization': `Bearer ${accessToken}`,
                'Content-Type': 'application/json'
            }
        };
        
        const req = https.request(options, (res) => {
            let data = '';
            
            res.on('data', (chunk) => {
                data += chunk;
            });
            
            res.on('end', () => {
                if (res.statusCode >= 200 && res.statusCode < 300) {
                    try {
                        resolve(JSON.parse(data));
                    } catch (e) {
                        resolve(data);
                    }
                } else {
                    reject(new Error(`HTTP ${res.statusCode}: ${data}`));
                }
            });
        });
        
        req.on('error', (error) => {
            reject(error);
        });
        
        if (body) {
            req.write(JSON.stringify(body));
        }
        
        req.end();
    });
}

// Convertir une valeur Firestore en objet JS
function firestoreValueToJS(value) {
    if (value.stringValue !== undefined) return value.stringValue;
    if (value.integerValue !== undefined) return parseInt(value.integerValue);
    if (value.doubleValue !== undefined) return parseFloat(value.doubleValue);
    if (value.booleanValue !== undefined) return value.booleanValue;
    if (value.timestampValue !== undefined) return value.timestampValue;
    if (value.mapValue) {
        const obj = {};
        for (const [key, val] of Object.entries(value.mapValue.fields || {})) {
            obj[key] = firestoreValueToJS(val);
        }
        return obj;
    }
    return null;
}

// Convertir un objet JS en valeur Firestore
function jsToFirestoreValue(value) {
    if (value === null || value === undefined) return { nullValue: null };
    if (typeof value === 'string') return { stringValue: value };
    if (typeof value === 'number') {
        return Number.isInteger(value) 
            ? { integerValue: value.toString() }
            : { doubleValue: value };
    }
    if (typeof value === 'boolean') return { booleanValue: value };
    if (typeof value === 'object') {
        if (value._seconds && value._nanoseconds) {
            // Timestamp Firebase
            const date = new Date(value._seconds * 1000);
            return { timestampValue: date.toISOString() };
        }
        const fields = {};
        for (const [key, val] of Object.entries(value)) {
            fields[key] = jsToFirestoreValue(val);
        }
        return { mapValue: { fields } };
    }
    return { nullValue: null };
}

// Fonction principale
async function migrateTasks() {
    try {
        console.log('📊 Étape 1: Récupération des tâches existantes...\n');
        
        // Récupérer toutes les tâches
        const response = await firestoreRequest('GET', '/tasks');
        
        if (!response.documents || response.documents.length === 0) {
            console.log('ℹ️  Aucune tâche trouvée dans la base de données');
            return;
        }
        
        console.log(`📦 ${response.documents.length} tâche(s) trouvée(s)\n`);
        
        // Parser les tâches
        const tasks = response.documents.map(doc => {
            const id = doc.name.split('/').pop();
            const data = {};
            for (const [key, value] of Object.entries(doc.fields || {})) {
                data[key] = firestoreValueToJS(value);
            }
            return { id, ...data, _fullPath: doc.name };
        });
        
        // Filtrer les tâches sans dayOfWeek
        const tasksToMigrate = tasks.filter(t => t.dayOfWeek === undefined || t.dayOfWeek === null);
        const tasksAlreadyMigrated = tasks.filter(t => t.dayOfWeek !== undefined && t.dayOfWeek !== null);
        
        console.log(`✅ Tâches à migrer: ${tasksToMigrate.length}`);
        console.log(`✓  Tâches déjà migrées: ${tasksAlreadyMigrated.length}\n`);
        
        if (tasksToMigrate.length === 0) {
            console.log('✨ Toutes les tâches sont déjà migrées !');
            return;
        }
        
        // Afficher un résumé
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
            console.log('   node migrate-to-days-simple.js --execute\n');
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
            for (let dayOfWeek = 0; dayOfWeek <= 6; dayOfWeek++) {
                const newTaskData = {
                    fields: {}
                };
                
                // Copier tous les champs
                for (const [key, value] of Object.entries(task)) {
                    if (key !== 'id' && key !== '_fullPath') {
                        newTaskData.fields[key] = jsToFirestoreValue(value);
                    }
                }
                
                // Ajouter dayOfWeek
                newTaskData.fields.dayOfWeek = { integerValue: dayOfWeek.toString() };
                
                // Mettre à jour updatedAt
                newTaskData.fields.updatedAt = { timestampValue: new Date().toISOString() };
                
                // Créer la nouvelle tâche
                await firestoreRequest('POST', '/tasks', newTaskData);
                created++;
            }
            
            // Supprimer l'ancienne tâche
            await firestoreRequest('DELETE', `/tasks/${task.id}`);
            deleted++;
        }
        
        console.log('\n✅ Migration terminée avec succès !\n');
        console.log('📊 Résultat:');
        console.log(`   Tâches traitées: ${processed}`);
        console.log(`   Nouvelles tâches créées: ${created}`);
        console.log(`   Anciennes tâches supprimées: ${deleted}\n`);
        
    } catch (error) {
        console.error('\n❌ Erreur lors de la migration:', error.message);
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
