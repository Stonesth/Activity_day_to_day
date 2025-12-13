#!/bin/bash

# Script de déploiement simplifié pour Activity Day to Day
# Usage: ./deploy.sh [test|production] [all|functions|hosting|firestore]

set -e  # Arrêter si erreur

# Couleurs
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Vérifier les arguments
if [ $# -eq 0 ]; then
    echo -e "${RED}❌ Erreur: Environnement manquant${NC}"
    echo ""
    echo "Usage: ./deploy.sh [test|production] [all|functions|hosting|firestore]"
    echo ""
    echo "Exemples:"
    echo "  ./deploy.sh test                    # Déployer tout sur TEST"
    echo "  ./deploy.sh production functions    # Déployer seulement les functions sur PROD"
    echo "  ./deploy.sh test hosting            # Déployer seulement le hosting sur TEST"
    exit 1
fi

ENV=$1
TARGET=${2:-all}  # Par défaut: all

# Valider l'environnement
if [ "$ENV" != "test" ] && [ "$ENV" != "production" ]; then
    echo -e "${RED}❌ Environnement invalide: $ENV${NC}"
    echo "Utilisez: test ou production"
    exit 1
fi

# Afficher l'environnement
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
if [ "$ENV" = "test" ]; then
    echo -e "${BLUE}🧪 DÉPLOIEMENT sur TEST${NC}"
else
    echo -e "${GREEN}🚀 DÉPLOIEMENT sur PRODUCTION${NC}"
fi
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# Confirmation pour production
if [ "$ENV" = "production" ]; then
    echo -e "${YELLOW}⚠️  ATTENTION: Vous allez déployer sur PRODUCTION !${NC}"
    echo -e "${YELLOW}⚠️  Avez-vous testé sur l'environnement de TEST ?${NC}"
    echo ""
    read -p "Continuer ? (oui/non): " confirm
    if [ "$confirm" != "oui" ]; then
        echo -e "${RED}❌ Déploiement annulé${NC}"
        exit 0
    fi
    echo ""
fi

# Préparation des fichiers pour TEST
if [ "$ENV" = "test" ]; then
    echo -e "${BLUE}🛠️  Préparation des fichiers TEST...${NC}"
    
    # 1. Sauvegarder les originaux
    cp public/index.html public/index.html.bak
    cp public/manage-tasks-person.html public/manage-tasks-person.html.bak
    
    # 2. Générer la version test de index.html depuis index.html (Source de vérité)
    # On remplace la configuration PROD par TEST via sed
    sed -e 's/activity-day-to-day/activity-day-to-day-test/g' \
        -e 's/44469659985/880195046237/g' \
        -e 's/AIzaSyBIggEt3Mv_L5E_1OpsuHIuuvAXCYcKzAw/AIzaSyAcofDWIySvjHcW0TQYmF7gIdE4oY8B6hE/g' \
        -e 's/778b21561999f67a5a8b70/b22ea3bf2c28e4f3d54c42/g' \
        public/index.html.bak > public/index.html

    # Ajouter le bandeau TEST sur index.html
    sed -i '' 's/<body>/<body><div style="background:#f44336;color:white;text-align:center;padding:10px;font-weight:bold;animation:pulse 2s infinite;">🔴 ENVIRONNEMENT DE TEST<\/div>/' public/index.html
    echo "✅ index.html mis à jour pour TEST (depuis Prod + Config Test)"
    
    # 3. Générer la version test de manage-tasks-person.html
    # On remplace la configuration PROD par TEST via sed
    sed -e 's/activity-day-to-day/activity-day-to-day-test/g' \
        -e 's/44469659985/880195046237/g' \
        -e 's/AIzaSyBIggEt3Mv_L5E_1OpsuHIuuvAXCYcKzAw/AIzaSyAcofDWIySvjHcW0TQYmF7gIdE4oY8B6hE/g' \
        -e 's/778b21561999f67a5a8b70/b22ea3bf2c28e4f3d54c42/g' \
        public/manage-tasks-person.html.bak > public/manage-tasks-person.html
        
    # Ajouter un indicateur visuel (Banner)
    # On insère le banner après <body>
    sed -i '' 's/<body>/<body><div style="background:#f44336;color:white;text-align:center;padding:10px;font-weight:bold;animation:pulse 2s infinite;">🔴 ENVIRONNEMENT DE TEST<\/div>/' public/manage-tasks-person.html
    
    echo "✅ manage-tasks-person.html mis à jour pour TEST"
fi

# Basculer sur l'environnement
echo -e "${BLUE}📌 Basculement sur l'environnement: $ENV${NC}"
firebase use $ENV

# Déployer
echo ""
if [ "$TARGET" = "all" ]; then
    echo -e "${BLUE}📦 Déploiement complet...${NC}"
    firebase deploy
else
    echo -e "${BLUE}📦 Déploiement: $TARGET${NC}"
    firebase deploy --only $TARGET
fi

# Restaurer les fichiers originaux
if [ "$ENV" = "test" ]; then
    echo ""
    echo -e "${BLUE}BS Restauration des fichiers originaux...${NC}"
    if [ -f "public/index.html.bak" ]; then
        mv public/index.html.bak public/index.html
    fi
    if [ -f "public/manage-tasks-person.html.bak" ]; then
        mv public/manage-tasks-person.html.bak public/manage-tasks-person.html
    fi
    echo "✅ Fichiers restaurés"
fi

# Succès
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo -e "${GREEN}✅ Déploiement terminé avec succès !${NC}"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# Afficher les URLs
if [ "$ENV" = "test" ]; then
    echo -e "${BLUE}🌐 URL TEST:${NC}"
    echo "   https://activity-day-to-day-test.web.app"
    echo "   https://activity-day-to-day-test.web.app/admin.html"
else
    echo -e "${GREEN}🌐 URL PRODUCTION:${NC}"
    echo "   https://activity-day-to-day.web.app"
    echo "   https://activity-day-to-day.web.app/admin.html"
fi

echo ""
