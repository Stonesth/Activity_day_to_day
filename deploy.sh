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
