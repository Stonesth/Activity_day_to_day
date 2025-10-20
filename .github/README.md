# Configuration GitHub

Ce dossier contient les configurations spécifiques à GitHub.

## secret_scanning.yml

Ce fichier configure GitHub Secret Scanning pour ignorer les faux positifs.

**Important** : Firebase client API keys sont **publiques par design** selon la documentation officielle Firebase :
https://firebase.google.com/docs/projects/api-keys

GitHub détecte automatiquement ces clés, mais ce ne sont pas des secrets à protéger.
La vraie sécurité vient des règles Firestore côté serveur.

## Pour Gérer les Alertes GitHub

Voir le guide complet : [GITHUB_ALERT.md](../GITHUB_ALERT.md)

### Actions Rapides

1. Aller sur : https://github.com/Stonesth/Activity_day_to_day/security
2. Ouvrir l'alerte "Google API Key"
3. Fermer comme "False positive"
4. Raison : "Firebase client API key - public by design per Firebase documentation"

## Références

- [Firebase API Keys Documentation](https://firebase.google.com/docs/projects/api-keys)
- [GitHub Secret Scanning](https://docs.github.com/en/code-security/secret-scanning)
