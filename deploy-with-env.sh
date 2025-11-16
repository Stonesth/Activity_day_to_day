#!/bin/bash

# Script de déploiement intelligent
# Déploie la bonne configuration selon l'environnement

set -e

# Couleurs
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}========================================${NC}"
echo -e "${BLUE}🚀 Déploiement Activity Day to Day${NC}"
echo -e "${BLUE}========================================${NC}"
echo ""

# Vérifier l'environnement actif
CURRENT_ENV=$(firebase use | grep "Active" | awk '{print $3}' | sed 's/(//' | sed 's/)//')

echo -e "${YELLOW}📦 Environnement actif: ${CURRENT_ENV}${NC}"
echo ""

# Backup du fichier index.html original
cp public/index.html public/index.html.backup

# Selon l'environnement, utiliser la bonne config
if [[ "$CURRENT_ENV" == "test" ]]; then
    echo -e "${YELLOW}🔧 Configuration TEST détectée${NC}"
    echo -e "${YELLOW}   → Utilisation de index.test.html${NC}"
    echo ""
    
    # Copier index.test.html vers index.html pour le déploiement
    cp public/index.test.html public/index.html
    
elif [[ "$CURRENT_ENV" == "production" ]] || [[ "$CURRENT_ENV" == "default" ]]; then
    echo -e "${GREEN}🔧 Configuration PRODUCTION détectée${NC}"
    echo -e "${GREEN}   → Utilisation de index.html (original)${NC}"
    echo ""
    
    # Rien à faire, on utilise déjà la version PROD
else
    echo -e "${RED}❌ Environnement inconnu: ${CURRENT_ENV}${NC}"
    echo -e "${RED}   Exécutez: firebase use test OU firebase use production${NC}"
    rm public/index.html.backup
    exit 1
fi

# Demander confirmation
echo -e "${YELLOW}⚠️  Vous allez déployer sur: ${CURRENT_ENV}${NC}"
read -p "Continuer ? (o/N) " -n 1 -r
echo ""

if [[ ! $REPLY =~ ^[Oo]$ ]]; then
    echo -e "${YELLOW}❌ Déploiement annulé${NC}"
    # Restaurer le backup
    mv public/index.html.backup public/index.html
    exit 1
fi

# Déployer
echo ""
echo -e "${BLUE}🚀 Déploiement en cours...${NC}"
echo ""

firebase deploy --only hosting

# Restaurer le fichier original
mv public/index.html.backup public/index.html

echo ""
echo -e "${GREEN}========================================${NC}"
echo -e "${GREEN}✅ Déploiement terminé !${NC}"
echo -e "${GREEN}========================================${NC}"
echo ""

# Afficher l'URL
if [[ "$CURRENT_ENV" == "test" ]]; then
    echo -e "${BLUE}🔗 URL TEST: https://activity-day-to-day-test.web.app${NC}"
    echo -e "${YELLOW}🔴 N'oubliez pas: TEST utilise sa PROPRE base de données${NC}"
else
    echo -e "${BLUE}🔗 URL PROD: https://activity-day-to-day.web.app${NC}"
    echo -e "${RED}⚠️  Vérifiez que tout fonctionne correctement${NC}"
fi

echo ""
