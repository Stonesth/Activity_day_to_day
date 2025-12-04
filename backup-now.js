const admin = require('firebase-admin');
const fs = require('fs');

// Initialiser Firebase Admin
admin.initializeApp({
    projectId: 'activity-day-to-day'
});

const db = admin.firestore();

async function backupNow() {
    try {
        console.log('📦 Récupération des tâches...');
        const snapshot = await db.collection('tasks').get();
        
        const tasks = [];
        snapshot.forEach(doc => {
            tasks.push({
                id: doc.id,
                ...doc.data()
            });
        });
        
        const backup = {
            timestamp: new Date().toISOString(),
            project: 'activity-day-to-day',
            count: tasks.length,
            tasks: tasks
        };
        
        const filename = `backups/prod_backup_pre_deploy_${Date.now()}.json`;
        fs.writeFileSync(filename, JSON.stringify(backup, null, 2));
        
        console.log(`✅ ${tasks.length} tâche(s) sauvegardée(s) dans ${filename}`);
        process.exit(0);
        
    } catch (error) {
        console.error('❌ Erreur:', error.message);
        process.exit(1);
    }
}

backupNow();
