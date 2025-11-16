import { 
    collection, 
    addDoc, 
    updateDoc, 
    deleteDoc, 
    doc, 
    getDoc,
    getDocs,
    onSnapshot,
    query,
    where,
    orderBy,
    serverTimestamp 
} from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js';

// Variables globales
let currentFilter = 'all';
let unsubscribe = null;
let isAdminMode = false;
const ADMIN_PIN = '1571';

// ===== NOUVELLES VARIABLES POUR LES JOURS =====
let selectedDay = null; // null = aujourd'hui, sinon 0-6 (Dim-Sam)
const dayNames = ['Dimanche', 'Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi'];
const dayNamesShort = ['Dim', 'Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam'];

// Fonctions utilitaires pour les jours
function getCurrentDay() {
    return selectedDay !== null ? selectedDay : new Date().getDay();
}

function getTodayDay() {
    return new Date().getDay();
}

function isToday() {
    return selectedDay === null || selectedDay === getTodayDay();
}

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
    
    // Initialiser la navigation des jours
    initializeDayNavigation();
    
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
    
    // Édition de tâche
    document.getElementById('cancelEditBtn').addEventListener('click', closeEditTaskModal);
    document.getElementById('editTaskForm').addEventListener('submit', handleEditTaskSubmit);
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
    
    // Obtenir le nombre actuel de tâches pour calculer l'ordre
    const assignedTo = document.getElementById('assignedTo').value;
    const existingTasksSnapshot = await getDocs(
        query(collection(window.db, 'tasks'), 
              where('assignedTo', '==', assignedTo))
    );
    const nextOrder = existingTasksSnapshot.size;
    
    // ===== NOUVEAU : Récupérer les jours sélectionnés =====
    const selectedDays = [];
    for (let i = 0; i <= 6; i++) {
        const dayCheckbox = document.getElementById(`day${i}`);
        if (dayCheckbox && dayCheckbox.checked) {
            selectedDays.push(i);
        }
    }
    
    // Si aucun jour sélectionné, erreur
    if (selectedDays.length === 0) {
        showNotification('Veuillez sélectionner au moins un jour', 'error');
        return;
    }
    
    const baseTaskData = {
        title: document.getElementById('taskTitle').value.trim(),
        description: document.getElementById('taskDescription').value.trim(),
        assignedTo: assignedTo,
        stars: parseInt(starsElement.value) || 3,
        category: document.getElementById('category').value,
        isBonus: document.getElementById('isBonus').checked,
        isPenalty: document.getElementById('isPenalty').checked,
        completed: false,
        order: nextOrder,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
    };
    
    try {
        // Créer une tâche pour chaque jour sélectionné
        const promises = selectedDays.map((day) => {
            return addDoc(collection(window.db, 'tasks'), {
                ...baseTaskData,
                dayOfWeek: day
            });
        });
        
        await Promise.all(promises);
        
        // Réinitialiser le formulaire
        e.target.reset();
        toggleForm();
        
        const dayText = selectedDays.length === 7 ? 'tous les jours' : `${selectedDays.length} jour(s)`;
        showNotification(`Tâche ajoutée pour ${dayText} !`, 'success');
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
    
    // Créer une requête pour récupérer toutes les tâches triées par ordre personnalisé
    const q = query(
        collection(window.db, 'tasks'),
        orderBy('assignedTo'),
        orderBy('order')
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
    // ===== NOUVEAU : Filtrer par jour sélectionné =====
    const currentDayValue = getCurrentDay();
    const tasksForDay = tasks.filter(task => {
        // Si la tâche n'a pas de dayOfWeek (anciennes tâches), la garder
        if (task.dayOfWeek === undefined || task.dayOfWeek === null) {
            return true;
        }
        // Sinon, vérifier si c'est le bon jour
        return task.dayOfWeek === currentDayValue;
    });
    
    // Grouper les tâches par personne
    const tasksByPerson = {
        papa: [],
        maman: [],
        bastien: [],
        florent: []
    };
    
    tasksForDay.forEach(task => {
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
    const completedCount = tasks.filter(t => t.completed && !t.isPenalty).length;
    
    // Séparer les tâches normales, bonus et pénalités
    const normalTasks = tasks.filter(t => !t.isBonus && !t.isPenalty);
    const bonusTasks = tasks.filter(t => t.isBonus && !t.isPenalty);
    const penaltyTasks = tasks.filter(t => t.isPenalty);
    
    // Calculer les étoiles pour les tâches normales
    const normalStarsEarned = normalTasks
        .filter(t => t.completed)
        .reduce((sum, t) => sum + (t.stars || 0), 0);
    const normalStarsMax = normalTasks
        .reduce((sum, t) => sum + (t.stars || 0), 0);
    
    // Calculer les étoiles pour les tâches bonus
    const bonusStarsEarned = bonusTasks
        .filter(t => t.completed)
        .reduce((sum, t) => sum + (t.stars || 0), 0);
    const bonusStarsMax = bonusTasks
        .reduce((sum, t) => sum + (t.stars || 0), 0);
    
    // Calculer les pénalités (étoiles négatives cochées)
    const penaltyStars = penaltyTasks
        .filter(t => t.completed)
        .reduce((sum, t) => sum + (t.stars || 0), 0);
    
    // Total des étoiles (pour affichage) : positives - pénalités
    const starsEarned = Math.max(0, normalStarsEarned + bonusStarsEarned - penaltyStars);
    
    // Max manuel : récupérer depuis localStorage ou utiliser le calculé comme défaut
    const manualMax = getPersonMaxStars(person);
    const calculatedMax = normalStarsMax + bonusStarsMax;
    const starsMax = manualMax !== null ? manualMax : calculatedMax;
    
    // Afficher le nom du jour dans les statistiques
    const currentDayName = dayNames[getCurrentDay()];
    section.querySelector('.total-count').textContent = `${totalCount} tâches du ${currentDayName.toLowerCase()}`;
    section.querySelector('.completed-count').textContent = completedCount;
    section.querySelector('.stars-count').textContent = starsEarned;
    
    // Mettre à jour le champ input avec le max (manuel ou calculé)
    const maxInput = section.querySelector('.stars-max-input');
    if (maxInput) {
        maxInput.value = starsMax;
    }
    
    // Mettre à jour aussi le span d'affichage
    const maxDisplay = section.querySelector('.stars-max-display');
    if (maxDisplay) {
        maxDisplay.textContent = starsMax;
    }
    
    // Calculer et mettre à jour la barre de progression avec système manuel simple
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
    div.dataset.assignedTo = task.assignedTo;
    div.draggable = true;
    
    const starsDisplay = task.isPenalty 
        ? `-${task.stars || 1}⭐` 
        : '⭐'.repeat(task.stars || 1);
    
    // Ajouter une classe spéciale pour les pénalités
    if (task.isPenalty) {
        div.classList.add('penalty-item');
    }
    
    div.innerHTML = `
        <div class="task-header">
            <div class="drag-handle" title="Glisser pour réorganiser">⋮⋮</div>
            <div class="checkbox ${task.completed ? 'checked' : ''}" 
                 onclick="toggleTaskCompletion('${task.id}', ${!task.completed})">
            </div>
            <div class="task-content">
                <div class="task-title">
                    ${escapeHtml(task.title)}
                    ${task.isBonus ? '<span class="bonus-badge">🎁 BONUS</span>' : ''}
                    ${task.isPenalty ? '<span class="penalty-badge">⛔ PÉNALITÉ</span>' : ''}
                </div>
                <span class="task-stars ${task.isPenalty ? 'penalty-stars' : ''}">
                    ${starsDisplay}
                </span>
            </div>
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
            <button class="btn-edit" onclick="editTask('${task.id}')">
                ✏️ Modifier
            </button>
            <button class="btn-delete" onclick="deleteTask('${task.id}')">
                🗑️ Supprimer
            </button>
        </div>
    `;
    
    // Ajouter les événements de drag & drop
    div.addEventListener('dragstart', handleDragStart);
    div.addEventListener('dragover', handleDragOver);
    div.addEventListener('drop', handleDrop);
    div.addEventListener('dragend', handleDragEnd);
    div.addEventListener('dragenter', handleDragEnter);
    div.addEventListener('dragleave', handleDragLeave);
    
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

// ===== RESET DES TÂCHES =====

// Réinitialiser toutes les tâches d'une personne
window.resetPersonTasks = async function(person) {
    // Mapper le nom de la personne pour l'affichage
    const personNames = {
        papa: 'Papa',
        maman: 'Maman',
        bastien: 'Bastien',
        florent: 'Florent'
    };
    
    const personName = personNames[person] || person;
    
    // Demander confirmation
    if (!confirm(`Voulez-vous vraiment réinitialiser toutes les tâches de ${personName} ?\n\nToutes les tâches cochées seront décochées.`)) {
        return;
    }
    
    try {
        // Récupérer toutes les tâches cochées de cette personne
        const tasksSnapshot = await getDocs(
            query(
                collection(window.db, 'tasks'),
                where('assignedTo', '==', person),
                where('completed', '==', true)
            )
        );
        
        // Décocher toutes les tâches en batch
        const batch = [];
        tasksSnapshot.forEach((taskDoc) => {
            batch.push(
                updateDoc(doc(window.db, 'tasks', taskDoc.id), {
                    completed: false,
                    updatedAt: serverTimestamp()
                })
            );
        });
        
        if (batch.length === 0) {
            showNotification(`${personName} n'a aucune tâche cochée`, 'info');
            return;
        }
        
        await Promise.all(batch);
        
        showNotification(`✅ ${batch.length} tâche(s) de ${personName} réinitialisée(s)`, 'success');
    } catch (error) {
        console.error('Erreur lors de la réinitialisation:', error);
        showNotification('Erreur lors de la réinitialisation', 'error');
    }
};

// ===== ÉDITION DE TÂCHE =====

// Ouvrir la modale d'édition et charger les données de la tâche
window.editTask = async function(taskId) {
    try {
        const taskDoc = await getDoc(doc(window.db, 'tasks', taskId));
        
        if (!taskDoc.exists()) {
            showNotification('Tâche introuvable', 'error');
            return;
        }
        
        const task = taskDoc.data();
        
        // Remplir le formulaire avec les données de la tâche
        document.getElementById('editTaskId').value = taskId;
        document.getElementById('editTaskTitle').value = task.title;
        document.getElementById('editTaskDescription').value = task.description || '';
        document.getElementById('editAssignedTo').value = task.assignedTo;
        document.getElementById('editStars').value = task.stars;
        document.getElementById('editCategory').value = task.category;
        
        // Ouvrir la modale
        document.getElementById('editTaskModal').classList.remove('hidden');
        
        // Focus sur le titre après l'animation
        setTimeout(() => {
            document.getElementById('editTaskTitle').focus();
        }, 300);
        
    } catch (error) {
        console.error('Erreur lors du chargement de la tâche:', error);
        showNotification('Erreur lors du chargement', 'error');
    }
};

// Fermer la modale d'édition
function closeEditTaskModal() {
    document.getElementById('editTaskModal').classList.add('hidden');
    document.getElementById('editTaskForm').reset();
}

// Gérer la soumission du formulaire d'édition
async function handleEditTaskSubmit(e) {
    e.preventDefault();
    
    const taskId = document.getElementById('editTaskId').value;
    const taskData = {
        title: document.getElementById('editTaskTitle').value.trim(),
        description: document.getElementById('editTaskDescription').value.trim(),
        assignedTo: document.getElementById('editAssignedTo').value,
        stars: parseInt(document.getElementById('editStars').value),
        category: document.getElementById('editCategory').value,
        updatedAt: serverTimestamp()
    };
    
    try {
        await updateDoc(doc(window.db, 'tasks', taskId), taskData);
        
        showNotification('✅ Tâche modifiée avec succès !', 'success');
        closeEditTaskModal();
        
    } catch (error) {
        console.error('Erreur lors de la modification:', error);
        showNotification('Erreur lors de la modification', 'error');
    }
}

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
        const header = section.querySelector('.person-header');
        const progressSection = section.querySelector('.progress-section');
        
        if (filter === 'all' || filter === person) {
            section.classList.remove('hidden');
            
            // Si on filtre par une personne spécifique (pas "all"), rendre le header sticky
            if (filter !== 'all' && filter === person) {
                header.classList.add('sticky-header');
                if (progressSection) {
                    progressSection.classList.add('sticky-progress');
                }
            } else {
                header.classList.remove('sticky-header');
                if (progressSection) {
                    progressSection.classList.remove('sticky-progress');
                }
            }
        } else {
            section.classList.add('hidden');
            header.classList.remove('sticky-header');
            if (progressSection) {
                progressSection.classList.remove('sticky-progress');
            }
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
    
    // Système MANUEL SIMPLE :
    // - Max défini manuellement (ou calculé automatiquement par défaut)
    // - Toutes les étoiles (normales + bonus) comptent pareil
    // - Pénalités déjà soustraites dans starsEarned
    // - Calcul : (étoiles gagnées / max) × 100%
    
    const percentage = starsMax > 0 
        ? Math.round((starsEarned / starsMax) * 100)
        : 0;
    
    // Mettre à jour la barre de progression
    if (progressFill) {
        progressFill.style.width = `${percentage}%`;
        progressFill.setAttribute('data-progress', percentage);
    }
    
    // Mettre à jour le texte du pourcentage
    if (progressValue) {
        progressValue.textContent = percentage;
    }
    
    // Définir les récompenses pour chaque palier
    const rewards = {
        0: '',
        25: '📺 5min',
        50: '📺 10min',
        75: '📺 15min ou 🎮 15min',
        100: '📺 20min ou 🎮 20min'
    };
    
    // Trouver le palier actuel atteint
    let currentMilestone = 0;
    if (percentage >= 100) currentMilestone = 100;
    else if (percentage >= 75) currentMilestone = 75;
    else if (percentage >= 50) currentMilestone = 50;
    else if (percentage >= 25) currentMilestone = 25;
    
    // Afficher la récompense du palier actuel
    const rewardSpan = section.querySelector('.current-reward');
    if (rewardSpan) {
        rewardSpan.textContent = rewards[currentMilestone];
    }
    
    // Mettre à jour les paliers (25%, 50%, 75%, 100%)
    // Masquer les paliers dépassés (ceux qui sont complètement atteints)
    milestones.forEach(milestone => {
        const milestoneValue = parseInt(milestone.getAttribute('data-milestone'));
        
        if (percentage >= milestoneValue) {
            milestone.classList.add('unlocked');
            // Cacher les paliers dépassés (sauf le 100%)
            if (percentage > milestoneValue && milestoneValue < 100) {
                milestone.classList.add('passed');
            } else {
                milestone.classList.remove('passed');
            }
        } else {
            milestone.classList.remove('unlocked');
            milestone.classList.remove('passed');
        }
    });
}

// ===== DRAG & DROP =====

let draggedElement = null;

function handleDragStart(e) {
    draggedElement = e.currentTarget;
    e.currentTarget.classList.add('dragging');
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/html', e.currentTarget.innerHTML);
}

function handleDragOver(e) {
    if (e.preventDefault) {
        e.preventDefault();
    }
    e.dataTransfer.dropEffect = 'move';
    return false;
}

function handleDragEnter(e) {
    const target = e.currentTarget;
    if (draggedElement && target !== draggedElement && 
        target.classList.contains('task-item') &&
        target.dataset.assignedTo === draggedElement.dataset.assignedTo) {
        target.classList.add('drag-over');
    }
}

function handleDragLeave(e) {
    e.currentTarget.classList.remove('drag-over');
}

async function handleDrop(e) {
    if (e.stopPropagation) {
        e.stopPropagation();
    }
    e.preventDefault();
    
    const target = e.currentTarget;
    target.classList.remove('drag-over');
    
    if (draggedElement && target !== draggedElement && 
        target.classList.contains('task-item') &&
        target.dataset.assignedTo === draggedElement.dataset.assignedTo) {
        
        // Réorganiser visuellement
        const container = target.parentNode;
        const allTasks = Array.from(container.querySelectorAll('.task-item'));
        const draggedIndex = allTasks.indexOf(draggedElement);
        const targetIndex = allTasks.indexOf(target);
        
        if (draggedIndex < targetIndex) {
            target.parentNode.insertBefore(draggedElement, target.nextSibling);
        } else {
            target.parentNode.insertBefore(draggedElement, target);
        }
        
        // Mettre à jour l'ordre dans Firestore
        await updateTasksOrder(container);
    }
    
    return false;
}

function handleDragEnd(e) {
    e.currentTarget.classList.remove('dragging');
    
    // Retirer les classes drag-over de tous les éléments
    document.querySelectorAll('.task-item').forEach(item => {
        item.classList.remove('drag-over');
    });
    
    draggedElement = null;
}

// Mettre à jour l'ordre des tâches dans Firestore
async function updateTasksOrder(container) {
    const tasks = Array.from(container.querySelectorAll('.task-item'));
    const batch = [];
    
    tasks.forEach((taskElement, index) => {
        const taskId = taskElement.dataset.taskId;
        batch.push(
            updateDoc(doc(window.db, 'tasks', taskId), {
                order: index,
                updatedAt: serverTimestamp()
            })
        );
    });
    
    try {
        await Promise.all(batch);
    } catch (error) {
        console.error('Erreur lors de la mise à jour de l\'ordre:', error);
        showNotification('Erreur lors du réarrangement', 'error');
    }
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
    
    // Ajouter la classe pour montrer les boutons de suppression et les inputs
    container.classList.add('admin-mode-active');
    
    // Afficher le lien Admin Reset
    const resetAdminLink = document.querySelector('.reset-admin-btn');
    if (resetAdminLink) {
        resetAdminLink.style.display = 'inline-block';
    }
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
    
    // Retirer la classe pour cacher les boutons de suppression et les inputs
    container.classList.remove('admin-mode-active');
    
    // Masquer le lien Admin Reset
    const resetAdminLink = document.querySelector('.reset-admin-btn');
    if (resetAdminLink) {
        resetAdminLink.style.display = 'none';
    }
    
    showNotification('🔒 Mode Admin désactivé', 'info');
}

// ===== NAVIGATION DES JOURS =====

// Changer de jour
window.changeDay = function(dayNumber) {
    selectedDay = dayNumber;
    updateDayDisplay();
    loadTasks(); // Recharger les tâches pour le nouveau jour
};

// Aller au jour précédent
window.previousDay = function() {
    const currentDayValue = getCurrentDay();
    const newDay = (currentDayValue - 1 + 7) % 7;
    changeDay(newDay);
};

// Aller au jour suivant
window.nextDay = function() {
    const currentDayValue = getCurrentDay();
    const newDay = (currentDayValue + 1) % 7;
    changeDay(newDay);
};

// Retour à aujourd'hui
window.goToToday = function() {
    selectedDay = null;
    updateDayDisplay();
    loadTasks();
};

// Mettre à jour l'affichage de la navigation des jours
function updateDayDisplay() {
    const currentDayValue = getCurrentDay();
    const todayValue = getTodayDay();
    
    // Mettre à jour le titre principal
    const dayTitle = document.getElementById('dayNavigationTitle');
    if (dayTitle) {
        const currentDate = new Date();
        const dateStr = currentDate.toLocaleDateString('fr-FR', { day: 'numeric', month: 'numeric', year: 'numeric' });
        dayTitle.innerHTML = `📅 ${dayNames[currentDayValue].toUpperCase()} ${dateStr}`;
    }
    
    // Mettre à jour les boutons de navigation (prev/next)
    const prevDayName = document.getElementById('prevDayName');
    const nextDayName = document.getElementById('nextDayName');
    if (prevDayName) {
        const prevDay = (currentDayValue - 1 + 7) % 7;
        prevDayName.textContent = dayNames[prevDay];
    }
    if (nextDayName) {
        const nextDay = (currentDayValue + 1) % 7;
        nextDayName.textContent = dayNames[nextDay];
    }
    
    // Mettre à jour les boutons rapides (actif/inactif)
    for (let i = 0; i <= 6; i++) {
        const btn = document.getElementById(`dayBtn${i}`);
        if (btn) {
            if (i === currentDayValue) {
                btn.classList.add('active');
            } else {
                btn.classList.remove('active');
            }
        }
    }
    
    // Afficher/masquer le bandeau "Vous consultez"
    const warningBanner = document.getElementById('dayWarningBanner');
    if (warningBanner) {
        if (!isToday()) {
            warningBanner.classList.remove('hidden');
            const warningDayName = document.getElementById('warningDayName');
            const warningTodayName = document.getElementById('warningTodayName');
            if (warningDayName) {
                const currentDate = new Date();
                const dateStr = currentDate.toLocaleDateString('fr-FR', { day: 'numeric', month: 'numeric' });
                warningDayName.textContent = `${dayNames[currentDayValue]} ${dateStr}`;
            }
            if (warningTodayName) {
                warningTodayName.textContent = dayNames[todayValue];
            }
        } else {
            warningBanner.classList.add('hidden');
        }
    }
}

// Initialiser la navigation des jours
function initializeDayNavigation() {
    // Mettre à jour l'affichage initial
    updateDayDisplay();
}

// Fonction pour cocher/décocher tous les jours dans le formulaire
window.toggleAllDays = function(checkbox) {
    const dayCheckboxes = document.querySelectorAll('.day-checkbox');
    dayCheckboxes.forEach(cb => {
        cb.checked = checkbox.checked;
    });
};

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

// Fonction pour sauvegarder le max manuel d'étoiles d'une personne
window.updatePersonMaxStars = function(person, maxValue) {
    const max = parseInt(maxValue) || 0;
    localStorage.setItem(`maxStars_${person}`, max);
    
    // Recharger les tâches pour mettre à jour l'affichage
    loadTasks();
    
    showNotification(`✅ Max d'étoiles pour ${person} : ${max}⭐`);
};

// Fonction pour récupérer le max manuel d'étoiles d'une personne
function getPersonMaxStars(person) {
    const saved = localStorage.getItem(`maxStars_${person}`);
    return saved !== null ? parseInt(saved) : null;
};

// Fonction pour cocher/décocher toutes les tâches d'une personne
window.checkAllTasks = async function(person, checked) {
    try {
        // Récupérer toutes les tâches de cette personne
        const tasksQuery = query(
            collection(window.db, 'tasks'),
            where('assignedTo', '==', person)
        );
        
        const snapshot = await getDocs(tasksQuery);
        
        if (snapshot.empty) {
            showNotification(`Aucune tâche pour ${person}`, 'info');
            return;
        }
        
        // Mettre à jour toutes les tâches (normales, bonus ET pénalités)
        const updatePromises = [];
        snapshot.forEach(docSnap => {
            const taskRef = doc(window.db, 'tasks', docSnap.id);
            updatePromises.push(
                updateDoc(taskRef, {
                    completed: checked,
                    updatedAt: serverTimestamp()
                })
            );
        });
        
        await Promise.all(updatePromises);
        
        const action = checked ? 'cochées' : 'décochées';
        showNotification(`✅ Toutes les tâches de ${person} ont été ${action}`, 'success');
        
    } catch (error) {
        console.error('Erreur lors du cochage des tâches:', error);
        showNotification('❌ Erreur lors de la mise à jour', 'error');
    }
};
