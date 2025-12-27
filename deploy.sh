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

echo -e "${BLUE}🛠️  Préparation des fichiers...${NC}"

# 1. Sauvegarder la configuration locale actuelle
if [ -f "public/js/firebase-config.js" ]; then
    cp public/js/firebase-config.js public/js/firebase-config.js.bak
fi

# 2. Copier la configuration de l'environnement cible
if [ "$ENV" = "test" ]; then
    if [ -f "public/js/firebase-config.test.js" ]; then
        cp public/js/firebase-config.test.js public/js/firebase-config.js
        echo "✅ Configuration TEST appliquée"
    else
        echo -e "${RED}❌ Erreur: public/js/firebase-config.test.js introuvable${NC}"
        exit 1
    fi
else
    if [ -f "public/js/firebase-config.prod.js" ]; then
        cp public/js/firebase-config.prod.js public/js/firebase-config.js
        echo "✅ Configuration PROD appliquée"
    else
        echo -e "${RED}❌ Erreur: public/js/firebase-config.prod.js introuvable${NC}"
        exit 1
    fi
fi

# 3. Modifications spécifiques pour TEST (Bannières)
if [ "$ENV" = "test" ]; then
    # Sauvegarder les fichiers originaux
    cp public/index.html public/index.html.bak
    cp public/manage-tasks-person.html public/manage-tasks-person.html.bak
    
    # Ajouter le bandeau TEST sur index.html (sans toucher aux clés car externalisées)
    sed -i '' 's/<body>/<body><div style="background:#f44336;color:white;text-align:center;padding:10px;font-weight:bold;animation:pulse 2s infinite;">🔴 ENVIRONNEMENT DE TEST<\/div>/' public/index.html
    echo "✅ index.html marqué pour TEST"
    
    # Ajouter le bandeau TEST sur manage-tasks-person.html
    sed -i '' 's/<body>/<body><div style="background:#f44336;color:white;text-align:center;padding:10px;font-weight:bold;animation:pulse 2s infinite;">🔴 ENVIRONNEMENT DE TEST<\/div>/' public/manage-tasks-person.html
    echo "✅ manage-tasks-person.html marqué pour TEST"
fi

# Basculer sur l'environnement Firebase
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
echo ""
echo -e "${BLUE}BS Restauration des fichiers originaux...${NC}"

# Restaurer HTML si TEST
if [ "$ENV" = "test" ]; then
    if [ -f "public/index.html.bak" ]; then
        mv public/index.html.bak public/index.html
    fi
    if [ -f "public/manage-tasks-person.html.bak" ]; then
        mv public/manage-tasks-person.html.bak public/manage-tasks-person.html
    fi
    echo "✅ Fichiers HTML restaurés"
fi

# Restaurer configuration JS
if [ -f "public/js/firebase-config.js.bak" ]; then
    mv public/js/firebase-config.js.bak public/js/firebase-config.js
    echo "✅ Configuration firebase-config.js restaurée"
else
    # Si pas de backup (nouveau clone?), on supprime le fichier copié pour éviter confusion?
    # Non, on peut laisser la version déployée ou supprimer.
    # Pour un dev local, on veut probablement revenir à la config locale (souvent test ou dev).
    # Si on laisse la version prod, attention.
    # On va supprimer si pas de backup, car gitignore l'ignore, donc ça doit être propre.
    # Mais l'utilisateur local a besoin d'un fichier pour dev.
    # On laisse le fichier en l'état si pas de backup, l'utilisateur devra savoir ce qu'il fait.
    echo "ℹ️ Pas de backup config trouvé, fichier actuel conservé."
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
