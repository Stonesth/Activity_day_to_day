# 🌍 Gestion de l'Environnement de Développement

## Différence : JavaScript vs Python

### Python (vos autres projets)

```bash
# Créer un environnement virtuel
python -m venv venv

# Activer l'environnement
source venv/bin/activate  # macOS/Linux
venv\Scripts\activate     # Windows

# Installer les dépendances
pip install -r requirements.txt

# Les packages sont isolés dans venv/
```

**Fichiers Python** :
- `venv/` - Environnement virtuel (à ne pas commiter)
- `requirements.txt` - Liste des dépendances
- `.gitignore` contient `venv/`

### JavaScript/Node.js (ce projet)

```bash
# Installer les dépendances
npm install

# Les packages sont automatiquement isolés dans node_modules/
# Pas besoin de créer ou activer un environnement virtuel !
```

**Fichiers JavaScript** :
- `node_modules/` - Dépendances (équivalent de `venv/`)
- `package.json` - Liste des dépendances (équivalent de `requirements.txt`)
- `package-lock.json` - Versions exactes verrouillées
- `.gitignore` contient `node_modules/`

## 📦 Pourquoi Pas de `venv` en JavaScript ?

### Node.js gère l'isolation différemment

1. **Isolation automatique par projet**
   - Chaque projet a son propre `node_modules/`
   - Les dépendances sont locales au projet
   - Pas de pollution globale par défaut

2. **Gestionnaires de versions Node**
   - `nvm` (Node Version Manager) gère les versions de Node.js
   - Équivalent de `pyenv` pour Python
   - Change de version Node par projet si nécessaire

3. **Pas d'activation nécessaire**
   - Les commandes `npm` utilisent automatiquement `node_modules/` local
   - Pas besoin d'activer/désactiver un environnement

## 🔧 Structure du Projet

### Fichiers de Configuration

```
Activity_day_to_day/
├── package.json          # Dépendances et scripts NPM
├── package-lock.json     # Versions exactes (généré automatiquement)
├── node_modules/         # Dépendances installées (ne pas commiter)
├── .gitignore           # Exclut node_modules/
└── public/              # Code source de l'application
```

### Comparaison

| Aspect | Python | JavaScript |
|--------|--------|-----------|
| **Environnement** | `venv/` | `node_modules/` |
| **Dépendances** | `requirements.txt` | `package.json` |
| **Versions exactes** | `requirements.txt` (avec ==) | `package-lock.json` |
| **Installation** | `pip install -r requirements.txt` | `npm install` |
| **Activation** | `source venv/bin/activate` | Pas nécessaire |
| **Gestionnaire de versions** | `pyenv` | `nvm` |

## 🚀 Workflow de Développement

### Premier Setup (une seule fois)

```bash
# 1. Cloner le projet
git clone https://github.com/Stonesth/Activity_day_to_day.git
cd Activity_day_to_day

# 2. Installer les dépendances
npm install

# 3. Installer Firebase CLI globalement
npm install -g firebase-tools

# 4. Se connecter à Firebase
firebase login
```

### Développement Quotidien

```bash
# Lancer le serveur local
npm run serve

# Ouvrir http://localhost:5000

# Déployer les modifications
npm run deploy
```

### Ajouter une Dépendance

```bash
# Ajouter une nouvelle dépendance
npm install nom-du-package

# Ajouter une dépendance de développement
npm install --save-dev nom-du-package

# Le package.json est mis à jour automatiquement
```

## 🌐 Gestion des Versions Node.js (Optionnel)

Si vous avez besoin de plusieurs versions de Node.js :

### macOS/Linux - Utiliser `nvm`

```bash
# Installer nvm
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash

# Installer une version de Node.js
nvm install 18
nvm use 18

# Définir la version par défaut
nvm alias default 18
```

### Windows - Utiliser `nvm-windows`

```bash
# Télécharger depuis https://github.com/coreybutler/nvm-windows

# Installer une version
nvm install 18.0.0
nvm use 18.0.0
```

### Fichier `.nvmrc` (Optionnel)

Créer un fichier `.nvmrc` à la racine du projet :
```
18.0.0
```

Puis simplement :
```bash
nvm use  # Utilise la version spécifiée dans .nvmrc
```

## 📋 Scripts NPM Disponibles

Dans `package.json`, les scripts suivants sont définis :

```json
{
  "scripts": {
    "serve": "firebase serve",           // Serveur local
    "deploy": "firebase deploy",         // Déployer tout
    "deploy:rules": "firebase deploy --only firestore:rules",
    "deploy:hosting": "firebase deploy --only hosting"
  }
}
```

### Utilisation

```bash
# Équivalent à : firebase serve
npm run serve

# Équivalent à : firebase deploy
npm run deploy

# Déployer seulement les règles Firestore
npm run deploy:rules

# Déployer seulement le site web
npm run deploy:hosting
```

## 🔍 Vérifier votre Setup

### Versions installées

```bash
# Version de Node.js
node --version
# Devrait afficher : v18.x.x ou supérieur

# Version de NPM
npm --version
# Devrait afficher : 9.x.x ou supérieur

# Version de Firebase CLI
firebase --version
# Devrait afficher : 13.x.x ou supérieur
```

### État du projet

```bash
# Vérifier les dépendances installées
npm list --depth=0

# Vérifier les dépendances obsolètes
npm outdated

# Mettre à jour les dépendances
npm update
```

## 🛠️ Troubleshooting

### "command not found: npm"

```bash
# Installer Node.js depuis https://nodejs.org/
# Ou utiliser nvm (recommandé)
```

### "Cannot find module"

```bash
# Réinstaller les dépendances
rm -rf node_modules package-lock.json
npm install
```

### Permissions denied (macOS/Linux)

```bash
# Ne PAS utiliser sudo avec npm !
# Configurer npm pour utiliser un répertoire utilisateur
mkdir ~/.npm-global
npm config set prefix '~/.npm-global'

# Ajouter à ~/.zshrc ou ~/.bashrc
export PATH=~/.npm-global/bin:$PATH
```

## 📚 Ressources

- [Documentation NPM](https://docs.npmjs.com/)
- [Documentation Node.js](https://nodejs.org/docs/)
- [NVM - Node Version Manager](https://github.com/nvm-sh/nvm)
- [Guide NPM vs Yarn](https://www.npmjs.com/package/yarn)

## ✅ Résumé

**Pour ce projet Firebase** :
- ✅ Utiliser `npm install` (pas de venv nécessaire)
- ✅ Les dépendances sont dans `node_modules/` (déjà ignoré par Git)
- ✅ `package.json` gère les dépendances
- ✅ Pas besoin d'activer/désactiver un environnement

**Équivalence avec Python** :
- `node_modules/` ≈ `venv/`
- `package.json` ≈ `requirements.txt`
- `npm install` ≈ `pip install -r requirements.txt`
- Mais **pas d'activation nécessaire** !
