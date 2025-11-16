#!/bin/bash

# Script de backup manuel Firestore
# Exporte toutes les tâches dans un fichier JSON

set -e

# Couleurs
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m'

echo -e "${BLUE}========================================${NC}"
echo -e "${BLUE}💾 Backup Firestore${NC}"
echo -e "${BLUE}========================================${NC}"
echo ""

# Vérifier l'environnement
CURRENT_ENV=$(firebase use | grep "Active" | awk '{print $3}' | sed 's/(//' | sed 's/)//')
echo -e "${YELLOW}📦 Environnement: ${CURRENT_ENV}${NC}"
echo ""

# Créer le dossier de backups s'il n'existe pas
mkdir -p backups

# Nom du fichier avec date
DATE=$(date +"%Y%m%d_%H%M%S")
BACKUP_FILE="backups/firestore_${CURRENT_ENV}_${DATE}.json"

echo -e "${BLUE}🔄 Export en cours...${NC}"
echo ""

# Export via gcloud (nécessite gcloud CLI)
if command -v gcloud &> /dev/null; then
    PROJECT_ID=""
    if [[ "$CURRENT_ENV" == "test" ]]; then
        PROJECT_ID="activity-day-to-day-test"
    else
        PROJECT_ID="activity-day-to-day"
    fi
    
    echo "Utilisation de gcloud firestore export..."
    gcloud firestore export gs://${PROJECT_ID}-backups/$(date +%Y%m%d) --project=${PROJECT_ID}
    
else
    # Alternative: Export via Node.js (plus simple, mais moins performant)
    echo "gcloud non disponible, utilisation de Node.js..."
    
    cat > /tmp/export-firestore.js << 'EOF'
const admin = require('firebase-admin');
const fs = require('fs');

// Initialiser Firebase Admin
admin.initializeApp({
    projectId: process.env.PROJECT_ID
});

const db = admin.firestore();

async function exportData() {
    try {
        console.log('Récupération des tâches...');
        const snapshot = await db.collection('tasks').get();
        
        const tasks = [];
        snapshot.forEach(doc => {
            tasks.push({
                id: doc.id,
                ...doc.data()
            });
        });
        
        const output = {
            timestamp: new Date().toISOString(),
            project: process.env.PROJECT_ID,
            count: tasks.length,
            tasks: tasks
        };
        
        const filename = process.env.BACKUP_FILE;
        fs.writeFileSync(filename, JSON.stringify(output, null, 2));
        
        console.log(`✅ ${tasks.length} tâche(s) exportée(s) dans ${filename}`);
        process.exit(0);
        
    } catch (error) {
        console.error('❌ Erreur:', error.message);
        process.exit(1);
    }
}

exportData();
EOF

    # Exécuter le script d'export
    PROJECT_ID=""
    if [[ "$CURRENT_ENV" == "test" ]]; then
        PROJECT_ID="activity-day-to-day-test"
    else
        PROJECT_ID="activity-day-to-day"
    fi
    
    export PROJECT_ID
    export BACKUP_FILE
    
    node /tmp/export-firestore.js
fi

echo ""
echo -e "${GREEN}========================================${NC}"
echo -e "${GREEN}✅ Backup créé !${NC}"
echo -e "${GREEN}========================================${NC}"
echo ""
echo -e "${BLUE}📁 Fichier: ${BACKUP_FILE}${NC}"
echo ""
echo -e "${YELLOW}💡 Conseil: Copiez ce fichier dans un endroit sûr !${NC}"
echo ""
