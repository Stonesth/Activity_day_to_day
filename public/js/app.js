import { 
    collection, 
    addDoc, 
    updateDoc, 
    deleteDoc, 
    doc, 
    onSnapshot,
    query,
    orderBy,
    serverTimestamp 
} from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js';

// Variables globales
let currentFilter = 'all';
let unsubscribe = null;
let isAdminMode = false;
const ADMIN_PIN = '1571';

// Initialisation au chargement de la page
document.addEventListener('DOMContentLoaded', () => {
    initializeApp();
});

function initializeApp() {
    // Vérifier que Firebase est initialisé
    if (!window.db) {
        console.error('Firebase n\'est pas initialisé');
        return;
    }

    // Initialiser les écouteurs d'événements
    setupEventListeners();
    
    // Charger les tâches
    loadTasks();
}

// Configuration des écouteurs d'événements
function setupEventListeners() {
    // Toggle formulaire
    document.getElementById('toggleFormBtn').addEventListener('click', toggleForm);
    document.getElementById('cancelFormBtn').addEventListener('click', toggleForm);
    
    // Soumission du formulaire
    document.getElementById('taskForm').addEventListener('submit', handleTaskSubmit);
    
    // Filtres
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.addEventListener('click', handleFilterClick);
    });
    
    // Mode Admin
    document.getElementById('adminModeBtn').addEventListener('click', handleAdminModeClick);
    document.getElementById('cancelPinBtn').addEventListener('click', closePinModal);
    document.getElementById('validatePinBtn').addEventListener('click', validatePin);
    document.getElementById('pinInput').addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            validatePin();
        }
    });
}

// Afficher/masquer le formulaire
function toggleForm() {
    const form = document.getElementById('taskForm');
    form.classList.toggle('hidden');
    
    if (!form.classList.contains('hidden')) {
        document.getElementById('taskTitle').focus();
    }
}

// Gestion de la soumission du formulaire
async function handleTaskSubmit(e) {
    e.preventDefault();
    
    // Vérifier que tous les champs nécessaires existent
    const starsElement = document.getElementById('stars');
    if (!starsElement) {
        console.error('Le champ "stars" n\'existe pas dans le formulaire.');
        showNotification('Erreur : Veuillez rafraîchir la page (Ctrl+Shift+R)', 'error');
        return;
    }
    
    const taskData = {
        title: document.getElementById('taskTitle').value.trim(),
        description: document.getElementById('taskDescription').value.trim(),
        assignedTo: document.getElementById('assignedTo').value,
        stars: parseInt(starsElement.value) || 3,
        category: document.getElementById('category').value,
        completed: false,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
    };
    
    try {
        await addDoc(collection(window.db, 'tasks'), taskData);
        
        // Réinitialiser le formulaire
        e.target.reset();
        toggleForm();
        
        showNotification('Tâche ajoutée avec succès !', 'success');
    } catch (error) {
        console.error('Erreur lors de l\'ajout de la tâche:', error);
        showNotification('Erreur lors de l\'ajout de la tâche', 'error');
    }
}

// Charger les tâches en temps réel
function loadTasks() {
    // Se désabonner de l'ancien listener si existant
    if (unsubscribe) {
        unsubscribe();
    }
    
    // Créer une requête pour récupérer toutes les tâches
    const q = query(
        collection(window.db, 'tasks'),
        orderBy('createdAt', 'desc')
    );
    
    // Écouter les changements en temps réel
    unsubscribe = onSnapshot(q, (snapshot) => {
        const tasks = [];
        snapshot.forEach((doc) => {
            tasks.push({
                id: doc.id,
                ...doc.data()
            });
        });
        
        renderTasks(tasks);
    }, (error) => {
        console.error('Erreur lors du chargement des tâches:', error);
        showNotification('Erreur lors du chargement des tâches', 'error');
    });
}

// Afficher les tâches
function renderTasks(tasks) {
    // Grouper les tâches par personne
    const tasksByPerson = {
        papa: [],
        maman: [],
        bastien: [],
        florent: []
    };
    
    tasks.forEach(task => {
        if (tasksByPerson[task.assignedTo]) {
            tasksByPerson[task.assignedTo].push(task);
        }
    });
    
    // Afficher les tâches pour chaque personne
    Object.keys(tasksByPerson).forEach(person => {
        renderPersonTasks(person, tasksByPerson[person]);
    });
    
    // Appliquer le filtre actuel
    applyFilter(currentFilter);
}

// Afficher les tâches d'une personne
function renderPersonTasks(person, tasks) {
    const container = document.getElementById(`tasks-${person}`);
    const section = document.querySelector(`.person-section[data-person="${person}"]`);
    
    if (!container || !section) return;
    
    // Mettre à jour les statistiques
    const totalCount = tasks.length;
    const completedCount = tasks.filter(t => t.completed).length;
    
    // Calculer les étoiles gagnées (tâches complétées)
    const starsEarned = tasks
        .filter(t => t.completed)
        .reduce((sum, t) => sum + (t.stars || 0), 0);
    
    // Calculer le maximum d'étoiles possibles (toutes les tâches)
    const starsMax = tasks
        .reduce((sum, t) => sum + (t.stars || 0), 0);
    
    section.querySelector('.total-count').textContent = totalCount;
    section.querySelector('.completed-count').textContent = completedCount;
    section.querySelector('.stars-count').textContent = starsEarned;
    section.querySelector('.stars-max').textContent = starsMax;
    
    // Calculer et mettre à jour la barre de progression
    updateProgressBar(section, starsEarned, starsMax);
    
    // Vider le conteneur
    container.innerHTML = '';
    
    if (tasks.length === 0) {
        container.innerHTML = '<div class="no-tasks">Aucune tâche pour le moment</div>';
        return;
    }
    
    // Créer les éléments de tâche
    tasks.forEach(task => {
        const taskElement = createTaskElement(task, person);
        container.appendChild(taskElement);
    });
}

// Créer un élément de tâche
function createTaskElement(task, person) {
    const div = document.createElement('div');
    div.className = `task-item ${task.completed ? 'completed' : ''}`;
    div.dataset.taskId = task.id;
    
    const starsDisplay = '⭐'.repeat(task.stars || 1);
    
    div.innerHTML = `
        <div class="task-header">
            <div class="checkbox ${task.completed ? 'checked' : ''}" 
                 onclick="toggleTaskCompletion('${task.id}', ${!task.completed})">
            </div>
            <div class="task-title">${escapeHtml(task.title)}</div>
            <span class="task-stars">
                ${starsDisplay}
            </span>
        </div>
        ${task.description ? `
            <div class="task-description">
                ${escapeHtml(task.description)}
            </div>
        ` : ''}
        <div class="task-meta">
            <span class="task-category">📁 ${task.category}</span>
            <span class="task-date">📅 ${formatDate(task.createdAt)}</span>
        </div>
        <div class="task-actions">
            <button class="btn-delete" onclick="deleteTask('${task.id}')">
                🗑️ Supprimer
            </button>
        </div>
    `;
    
    return div;
}

// Basculer l'état de complétion d'une tâche
window.toggleTaskCompletion = async function(taskId, completed) {
    try {
        const taskRef = doc(window.db, 'tasks', taskId);
        await updateDoc(taskRef, {
            completed: completed,
            updatedAt: serverTimestamp()
        });
    } catch (error) {
        console.error('Erreur lors de la mise à jour de la tâche:', error);
        showNotification('Erreur lors de la mise à jour', 'error');
    }
};

// Supprimer une tâche
window.deleteTask = async function(taskId) {
    if (!confirm('Êtes-vous sûr de vouloir supprimer cette tâche ?')) {
        return;
    }
    
    try {
        await deleteDoc(doc(window.db, 'tasks', taskId));
        showNotification('Tâche supprimée', 'success');
    } catch (error) {
        console.error('Erreur lors de la suppression:', error);
        showNotification('Erreur lors de la suppression', 'error');
    }
};

// Gestion des filtres
function handleFilterClick(e) {
    // Retirer la classe active de tous les boutons
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    
    // Ajouter la classe active au bouton cliqué
    e.target.classList.add('active');
    
    // Appliquer le filtre
    const filter = e.target.dataset.filter;
    currentFilter = filter;
    applyFilter(filter);
}

// Appliquer le filtre
function applyFilter(filter) {
    const sections = document.querySelectorAll('.person-section');
    
    sections.forEach(section => {
        const person = section.dataset.person;
        
        if (filter === 'all' || filter === person) {
            section.classList.remove('hidden');
        } else {
            section.classList.add('hidden');
        }
    });
}

// Afficher une notification
function showNotification(message, type = 'info') {
    // Créer l'élément de notification
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    
    // Déterminer la couleur selon le type
    let bgColor;
    if (type === 'success') bgColor = '#4CAF50';
    else if (type === 'error') bgColor = '#f44336';
    else bgColor = '#2196F3'; // info
    
    // Styles inline pour la notification
    Object.assign(notification.style, {
        position: 'fixed',
        top: '20px',
        right: '20px',
        padding: '15px 25px',
        background: bgColor,
        color: 'white',
        borderRadius: '10px',
        boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
        zIndex: '10000',
        animation: 'slideIn 0.3s ease'
    });
    
    document.body.appendChild(notification);
    
    // Retirer la notification après 3 secondes
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => {
            notification.remove();
        }, 300);
    }, 3000);
}

// Mettre à jour la barre de progression
function updateProgressBar(section, starsEarned, starsMax) {
    const progressFill = section.querySelector('.progress-fill');
    const progressValue = section.querySelector('.progress-value');
    const milestones = section.querySelectorAll('.milestone');
    
    // Calculer le pourcentage (éviter division par zéro)
    const percentage = starsMax > 0 ? Math.round((starsEarned / starsMax) * 100) : 0;
    
    // Mettre à jour la barre de progression
    if (progressFill) {
        progressFill.style.width = `${percentage}%`;
        progressFill.setAttribute('data-progress', percentage);
    }
    
    // Mettre à jour le texte du pourcentage
    if (progressValue) {
        progressValue.textContent = percentage;
    }
    
    // Mettre à jour les paliers (25%, 50%, 75%, 90%)
    milestones.forEach(milestone => {
        const milestoneValue = parseInt(milestone.getAttribute('data-milestone'));
        
        if (percentage >= milestoneValue) {
            milestone.classList.add('unlocked');
        } else {
            milestone.classList.remove('unlocked');
        }
    });
}

// Utilitaires
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

function formatDate(timestamp) {
    if (!timestamp) return 'Aujourd\'hui';
    
    // Gérer les timestamps Firebase
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    const now = new Date();
    const diff = now - date;
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    
    if (days === 0) return 'Aujourd\'hui';
    if (days === 1) return 'Hier';
    if (days < 7) return `Il y a ${days} jours`;
    
    return date.toLocaleDateString('fr-FR');
}

// ===== GESTION DU MODE ADMIN =====

// Gérer le clic sur le bouton Mode Admin
function handleAdminModeClick() {
    if (isAdminMode) {
        // Désactiver le mode admin
        disableAdminMode();
    } else {
        // Ouvrir la modale pour entrer le code
        openPinModal();
    }
}

// Ouvrir la modale de code PIN
function openPinModal() {
    const modal = document.getElementById('pinModal');
    const pinInput = document.getElementById('pinInput');
    const pinError = document.getElementById('pinError');
    
    modal.classList.remove('hidden');
    pinInput.value = '';
    pinError.classList.add('hidden');
    
    // Focus sur l'input après l'animation
    setTimeout(() => {
        pinInput.focus();
    }, 300);
}

// Fermer la modale
function closePinModal() {
    const modal = document.getElementById('pinModal');
    modal.classList.add('hidden');
}

// Valider le code PIN
function validatePin() {
    const pinInput = document.getElementById('pinInput');
    const pinError = document.getElementById('pinError');
    const enteredPin = pinInput.value;
    
    if (enteredPin === ADMIN_PIN) {
        // Code correct
        enableAdminMode();
        closePinModal();
        showNotification('✅ Mode Admin activé', 'success');
    } else {
        // Code incorrect
        pinError.classList.remove('hidden');
        pinInput.value = '';
        pinInput.focus();
        
        // Masquer l'erreur après 3 secondes
        setTimeout(() => {
            pinError.classList.add('hidden');
        }, 3000);
    }
}

// Activer le mode admin
function enableAdminMode() {
    isAdminMode = true;
    const adminBtn = document.getElementById('adminModeBtn');
    const container = document.querySelector('.container');
    
    // Changer l'apparence du bouton
    adminBtn.classList.add('active');
    adminBtn.textContent = '🔓';
    adminBtn.title = 'Mode Admin - Cliquer pour désactiver';
    
    // Ajouter la classe pour montrer les boutons de suppression
    container.classList.add('admin-mode-active');
}

// Désactiver le mode admin
function disableAdminMode() {
    isAdminMode = false;
    const adminBtn = document.getElementById('adminModeBtn');
    const container = document.querySelector('.container');
    
    // Restaurer l'apparence du bouton
    adminBtn.classList.remove('active');
    adminBtn.textContent = '🔒';
    adminBtn.title = 'Mode Admin - Activer pour supprimer';
    
    // Retirer la classe pour cacher les boutons de suppression
    container.classList.remove('admin-mode-active');
    
    showNotification('🔒 Mode Admin désactivé', 'info');
}

// Ajouter les animations CSS
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOut {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }
    
    @keyframes slideInRight {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOutRight {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);
