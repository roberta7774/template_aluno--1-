/*
ATIVIDADE: LISTA DE TAREFAS INTERATIVA - JAVASCRIPT

NOME DO ALUNO: ________________________________
TURMA: ________________________________________
DATA: _________________________________________

INSTRUÇÕES GERAIS:
- Implemente todas as funcionalidades marcadas com TODO
- Mantenha o código organizado e comentado
- Use boas práticas de programação JavaScript
- Teste todas as funcionalidades antes de entregar
- Valide todas as entradas do usuário

FUNCIONALIDADES OBRIGATÓRIAS (40 pontos):
1. Adicionar tarefas (8 pontos)
2. Marcar como concluída/pendente (6 pontos)
3. Editar tarefas (8 pontos)
4. Excluir tarefas (6 pontos)
5. Filtrar tarefas (6 pontos)
6. Buscar tarefas (3 pontos)
7. Persistência localStorage (3 pontos)

QUALIDADE DO CÓDIGO (25 pontos):
- Organização e estrutura (10 pontos)
- Comentários e documentação (5 pontos)
- Tratamento de erros (5 pontos)
- Validações (5 pontos)

DICAS:
- Use addEventListener para eventos
- Implemente validações de entrada
- Use localStorage para persistir dados
- Mantenha funções pequenas e específicas
- Teste cada funcionalidade isoladamente
*/

// ===== VARIÁVEIS GLOBAIS =====
// TODO: Declare as variáveis globais necessárias
let tasks = []; // Array para armazenar as tarefas
let currentFilter = 'todas'; // Filtro atual
let searchTerm = ''; // Termo de busca atual
let editingTaskId = null; // ID da tarefa sendo editada

// ===== INICIALIZAÇÃO =====
// TODO: Implemente a função de inicialização
document.addEventListener('DOMContentLoaded', function() {
    // TODO: Carregue as tarefas do localStorage
    loadTasks();
    
    // TODO: Configure todos os event listeners
    setupEventListeners();
    
    // TODO: Renderize a lista inicial
    renderTasks();
    
    // TODO: Adicione tarefas de exemplo se não houver nenhuma
    if (tasks.length === 0) {
        addExampleTasks();
    }
});

// ===== CONFIGURAÇÃO DE EVENT LISTENERS =====
// TODO: Implemente a função para configurar todos os event listeners
function setupEventListeners() {
    // Elementos
    const addBtn = document.getElementById('addTaskBtn');
    const taskInput = document.getElementById('taskInput');
    const filterSelect = document.getElementById('filterSelect');
    const searchInput = document.getElementById('searchInput');
    const clearCompletedBtn = document.getElementById('clearCompletedBtn');
    const clearAllBtn = document.getElementById('clearAllBtn');
    const saveEditBtn = document.getElementById('saveEditBtn');
    const cancelEditBtn = document.getElementById('cancelEditBtn');
    const closeBtn = document.querySelector('.close');
    const modal = document.getElementById('editModal');

    // Adicionar tarefa (botão)
    addBtn.addEventListener('click', function(e) {
        e.preventDefault();
        addTask();
    });

    // Adicionar tarefa com Enter no campo de texto
    taskInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            addTask();
        }
    });

    // Filtros
    filterSelect.addEventListener('change', function(e) {
        currentFilter = e.target.value;
        renderTasks();
    });

    // Busca (input)
    searchInput.addEventListener('input', function(e) {
        searchTerm = e.target.value.trim().toLowerCase();
        renderTasks();
    });

    // Ações em lote
    clearCompletedBtn.addEventListener('click', function(e) {
        e.preventDefault();
        clearCompleted();
    });

    clearAllBtn.addEventListener('click', function(e) {
        e.preventDefault();
        clearAll();
    });

    // Modal: salvar, cancelar, fechar
    saveEditBtn.addEventListener('click', function(e) {
        e.preventDefault();
        saveEdit();
    });

    cancelEditBtn.addEventListener('click', function(e) {
        e.preventDefault();
        closeModal();
    });

    if (closeBtn) {
        closeBtn.addEventListener('click', function() {
            closeModal();
        });
    }

    // Fechar modal clicando fora do conteúdo
    if (modal) {
        modal.addEventListener('click', function(e) {
            if (e.target === modal) closeModal();
        });
    }

    // Tecla ESC para fechar modal
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            // se modal aberto, fecha
            const modalStyle = window.getComputedStyle(modal);
            if (modal && modalStyle.display !== 'none') closeModal();
        }
    });

    // Salvar edição com Enter no campo de edição
    const editTaskInput = document.getElementById('editTaskInput');
    if (editTaskInput) {
        editTaskInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') saveEdit();
        });
    }
}

// ===== FUNÇÕES PRINCIPAIS =====
function addTask() {
    const taskInput = document.getElementById('taskInput');
    const prioritySelect = document.getElementById('prioritySelect');
    const text = taskInput.value.trim();

    // Validações
    if (text === '') {
        alert('Por favor, digite uma tarefa!');
        return;
    }
    if (text.length > 100) {
        alert('A tarefa deve ter no máximo 100 caracteres!');
        return;
    }

    const task = {
        id: Date.now(), // ID único
        text: text,
        completed: false,
        priority: prioritySelect.value || 'media',
        createdAt: new Date().toISOString(),
        completedAt: null
    };

    // Adiciona no início (mais recentes primeiro)
    tasks.unshift(task);

    // Salva e renderiza
    saveTasks();
    renderTasks();

    // Limpa campos e foca novamente
    taskInput.value = '';
    prioritySelect.value = 'media';
    taskInput.focus();

    showNotification('Tarefa adicionada com sucesso!', 'success');
}

function toggleTask(id) {
    // converte id para number caso venha como string
    const numericId = Number(id);
    const task = tasks.find(t => t.id === numericId);

    if (task) {
        task.completed = !task.completed;
        task.completedAt = task.completed ? new Date().toISOString() : null;

        saveTasks();
        renderTasks();

        const message = task.completed ? 'Tarefa concluída!' : 'Tarefa marcada como pendente!';
        showNotification(message, 'success');
    }
}

function deleteTask(id) {
    const numericId = Number(id);
    if (confirm('Tem certeza que deseja excluir esta tarefa?')) {
        tasks = tasks.filter(t => t.id !== numericId);
        saveTasks();
        renderTasks();
        showNotification('Tarefa excluída!', 'success');
    }
}

function editTask(id) {
    const numericId = Number(id);
    const task = tasks.find(t => t.id === numericId);

    if (task) {
        editingTaskId = numericId;
        document.getElementById('editTaskInput').value = task.text;
        document.getElementById('editPrioritySelect').value = task.priority;

        // Mostrar modal
        const modal = document.getElementById('editModal');
        modal.style.display = 'block';
        document.getElementById('editTaskInput').focus();
    }
}

function saveEdit() {
    const newText = document.getElementById('editTaskInput').value.trim();
    const newPriority = document.getElementById('editPrioritySelect').value;

    // Validações
    if (newText === '') {
        alert('Por favor, digite um texto para a tarefa!');
        return;
    }
    if (newText.length > 100) {
        alert('A tarefa deve ter no máximo 100 caracteres!');
        return;
    }

    const task = tasks.find(t => t.id === editingTaskId);
    if (task) {
        task.text = newText;
        task.priority = newPriority;

        saveTasks();
        renderTasks();
        closeModal();
        showNotification('Tarefa editada com sucesso!', 'success');
    }
}

function closeModal() {
    const modal = document.getElementById('editModal');
    if (modal) modal.style.display = 'none';
    editingTaskId = null;
}

function clearCompleted() {
    const completedCount = tasks.filter(t => t.completed).length;

    if (completedCount === 0) {
        alert('Não há tarefas concluídas para remover!');
        return;
    }

    if (confirm(`Excluir ${completedCount} tarefa(s) concluída(s)?`)) {
        tasks = tasks.filter(t => !t.completed);
        saveTasks();
        renderTasks();
        showNotification(`${completedCount} tarefa(s) removida(s)!`, 'success');
    }
}

function clearAll() {
    if (tasks.length === 0) {
        alert('Não há tarefas para remover!');
        return;
    }

    if (confirm(`Excluir todas as ${tasks.length} tarefa(s)?`)) {
        tasks = [];
        saveTasks();
        renderTasks();
        showNotification('Todas as tarefas foram removidas!', 'success');
    }
}

// ===== FUNÇÕES DE RENDERIZAÇÃO =====
function renderTasks() {
    const filteredTasks = getFilteredTasks();

    const taskList = document.getElementById('taskList');
    const emptyState = document.getElementById('emptyState');

    // Limpa
    taskList.innerHTML = '';

    if (filteredTasks.length === 0) {
        emptyState.style.display = 'block';
        taskList.style.display = 'none';
    } else {
        emptyState.style.display = 'none';
        taskList.style.display = 'block';

        filteredTasks.forEach(task => {
            const taskElement = createTaskElement(task);
            taskList.appendChild(taskElement);
        });
    }

    updateStats();
}

function createTaskElement(task) {
    const li = document.createElement('li');
    li.className = `task-item ${task.completed ? 'completed' : ''}`;
    li.setAttribute('data-task-id', task.id);

    const createdDate = new Date(task.createdAt).toLocaleDateString('pt-BR');
    const completedDate = task.completedAt ? new Date(task.completedAt).toLocaleDateString('pt-BR') : '';

    // Construindo o conteúdo com escapeHtml para segurança
    li.innerHTML = `
        <input type="checkbox" class="task-checkbox" ${task.completed ? 'checked' : ''} 
        onchange="toggleTask(${task.id})">
        <span class="task-text">${escapeHtml(task.text)}</span>
        <span class="task-priority priority-${task.priority}">${task.priority}</span>
        <span class="task-date">
            Criada: ${createdDate}
            ${task.completed ? `<br>Concluída: ${completedDate}` : ''}
        </span>
        <div class="task-actions">
            <button class="edit-btn" onclick="editTask(${task.id})" ${task.completed ? 'disabled' : ''}>
                <i class="fas fa-edit"></i> Editar
            </button>
            <button class="delete-btn" onclick="deleteTask(${task.id})">
                <i class="fas fa-trash"></i> Excluir
            </button>
        </div>
    `;

    return li;
}

// ===== FILTROS E BUSCA =====
function getFilteredTasks() {
    let filtered = [...tasks];

    switch (currentFilter) {
        case 'pendentes':
            filtered = filtered.filter(t => !t.completed);
            break;
        case 'concluidas':
            filtered = filtered.filter(t => t.completed);
            break;
        case 'alta':
        case 'media':
        case 'baixa':
            filtered = filtered.filter(t => t.priority === currentFilter);
            break;
        // 'todas' => sem filtro adicional
    }

    if (searchTerm) {
        filtered = filtered.filter(t =>
            t.text.toLowerCase().includes(searchTerm)
        );
    }

    return filtered;
}

function updateStats() {
    const total = tasks.length;
    const completed = tasks.filter(t => t.completed).length;
    const pending = total - completed;

    document.getElementById('totalTasks').textContent = `Total: ${total}`;
    document.getElementById('completedTasks').textContent = `Concluídas: ${completed}`;
    document.getElementById('pendingTasks').textContent = `Pendentes: ${pending}`;
}

// ===== PERSISTÊNCIA =====
function saveTasks() {
    try {
        localStorage.setItem('tasks', JSON.stringify(tasks));
    } catch (error) {
        console.error('Erro ao salvar tarefas:', error);
        alert('Erro ao salvar tarefas!');
    }
}

function loadTasks() {
    try {
        const saved = localStorage.getItem('tasks');
        tasks = saved ? JSON.parse(saved) : [];
    } catch (error) {
        console.error('Erro ao carregar tarefas:', error);
        tasks = [];
    }
}

// ===== UTILITÁRIOS =====
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;

    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 12px 16px;
        border-radius: 8px;
        color: white;
        font-weight: 600;
        z-index: 1001;
        max-width: 320px;
        box-shadow: 0 6px 18px rgba(0,0,0,0.12);
    `;

    const colors = {
        success: '#28a745',
        error: '#dc3545',
        info: '#17a2b8',
        warning: '#ffc107'
    };
    notification.style.backgroundColor = colors[type] || colors.info;

    document.body.appendChild(notification);

    setTimeout(() => {
        if (notification.parentNode) notification.remove();
    }, 3000);
}

function addExampleTasks() {
    const exampleTasks = [
        {
            id: Date.now() - 3000,
            text: 'Estudar JavaScript avançado',
            completed: false,
            priority: 'alta',
            createdAt: new Date().toISOString(),
            completedAt: null
        },
        {
            id: Date.now() - 2000,
            text: 'Fazer exercícios de CSS',
            completed: true,
            priority: 'media',
            createdAt: new Date(Date.now() - 86400000).toISOString(),
            completedAt: new Date().toISOString()
        },
        {
            id: Date.now() - 1000,
            text: 'Revisar conceitos de HTML',
            completed: false,
            priority: 'baixa',
            createdAt: new Date(Date.now() - 172800000).toISOString(),
            completedAt: null
        }
    ];

    tasks = exampleTasks;
    saveTasks();
    renderTasks();
}

// ===== FUNCIONALIDADES EXTRAS (OPCIONAL) =====

// TODO: Implemente funcionalidades extras para pontos adicionais:
// - Drag and drop para reordenar tarefas
// - Categorias/tags para tarefas
// - Data de vencimento
// - Exportar/importar tarefas
// - Modo escuro
// - Atalhos de teclado

/*
CHECKLIST DE ENTREGA:
□ Todas as funcionalidades obrigatórias implementadas
□ Código comentado e organizado
□ Validações de entrada funcionando
□ Persistência no localStorage funcionando
□ Interface responsiva
□ Testado em diferentes navegadores
□ Sem erros no console do navegador
□ Arquivo ZIP com todos os arquivos
*/

