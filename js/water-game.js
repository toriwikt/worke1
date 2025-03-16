const gameLevels = {
    1: {
        title: "Рівень 1: Лісовий струмок",
        description: "Вода з природного джерела потребує базового очищення",
        requiredFilters: ["carbon"],
        waterQualityGoal: 100,
        hint: "💡 Використовуйте вугільний фільтр для базового очищення",
        tasks: [
            "Видалення хлору та органічних сполук",
            "Покращення смаку та запаху води"
        ],
        unlocked: true
    },
    2: {
        title: "Рівень 2: Вода з колодязя",
        description: "Вода з колодязя містить надлишок мінералів",
        requiredFilters: ["carbon", "mineral"],
        waterQualityGoal: 100,
        hint: "💡 Вугільний фільтр → Мінералізація",
        tasks: [
            "1. Очищення від домішок",
            "2. Збалансування мінерального складу"
        ],
        unlocked: true
    },
    3: {
        title: "Рівень 3: Вода з міського озера",
        description: "Забруднена вода з міського озера",
        requiredFilters: ["carbon", "mineral", "membrane"],
        waterQualityGoal: 100,
        hint: "💡 Вугільний фільтр → Мінералізація → Мембранна фільтрація",
        tasks: [
            "1. Видалення забруднень",
            "2. Збалансування мінерального складу",
            "3. Тонке очищення через мембрану"
        ],
        unlocked: true
    },
    4: {
        title: "Рівень 4: Річкова вода",
        description: "Забруднена річкова вода потребує комплексного очищення",
        requiredFilters: ["carbon", "mineral", "membrane", "uv"],
        waterQualityGoal: 100,
        hint: "💡 Вугільний фільтр → Мінералізація → Мембрана → УФ-очищення",
        tasks: [
            "1. Видалення забруднень",
            "2. Збалансування мінералів",
            "3. Мембранна фільтрація",
            "4. УФ-дезінфекція"
        ],
        unlocked: true
    },
    5: {
        title: "Рівень 5: Промислові відходи",
        description: "Вода забруднена промисловими відходами",
        requiredFilters: ["separation", "carbon", "membrane", "chemical"],
        waterQualityGoal: 100,
        hint: "💡 Сепарація → Вугільний фільтр → Мембрана → Хімічне очищення",
        tasks: [
            "1. Механічна сепарація",
            "2. Вугільна фільтрація",
            "3. Мембранне очищення",
            "4. Хімічна обробка"
        ],
        unlocked: true
    },
    6: {
        title: "Рівень 6: Радіоактивне забруднення",
        description: "Вода містить радіоактивні частинки",
        requiredFilters: ["precipitation", "ion", "membrane", "adsorption"],
        waterQualityGoal: 100,
        hint: "💡 Осадження → Іонний обмін → Мембрана → Адсорбція",
        tasks: [
            "1. Осадження радіоактивних частинок",
            "2. Іонний обмін для видалення радіоактивних іонів",
            "3. Мембранна фільтрація залишкових частинок",
            "4. Адсорбція залишкових радіоактивних речовин"
        ],
        unlocked: true
    }
};

let currentLevel = 1;
let appliedFilters = [];
let completedLevels = new Set();

// DOM Elements
const waterGlass = document.getElementById('water-glass');
const availableFilters = document.getElementById('available-filters');
const statusMessage = document.querySelector('.status-message');
const levelButtons = document.querySelectorAll('.level-button');
const waterQualityMeter = document.querySelector('.meter-fill');
const qualityText = document.querySelector('.quality-text');
const levelTasks = document.getElementById('level-tasks');

// Initialize the game
function initGame(level) {
    currentLevel = level;
    appliedFilters = [];
    updateWaterQuality(0);
    updateLevelInfo(level);
    updateAvailableFilters(level);
    updateTasks(level);
    resetWaterGlass();
    updateLevelButtons();
}

// Update level information
function updateLevelInfo(level) {
    const levelInfo = gameLevels[level];
    document.getElementById('current-level-title').textContent = levelInfo.title;
    document.getElementById('level-description').textContent = levelInfo.description;
    
    // Add hint to level description
    const hintElement = document.createElement('p');
    hintElement.className = 'level-hint';
    hintElement.textContent = `💡 ${levelInfo.hint}`;
    document.getElementById('level-description').appendChild(hintElement);
}

// Update tasks list
function updateTasks(level) {
    const tasks = gameLevels[level].tasks;
    levelTasks.innerHTML = '';
    tasks.forEach(task => {
        const li = document.createElement('li');
        li.textContent = task;
        levelTasks.appendChild(li);
    });
}

// Update available filters based on level
function updateAvailableFilters(level) {
    const filters = document.querySelectorAll('.filter-item');
    
    filters.forEach(filter => {
        // Show only filters that match the current level class
        if (filter.classList.contains(`level-${level}`)) {
            filter.style.display = 'block';
        } else {
            filter.style.display = 'none';
        }
    });
}

// Update water quality meter
function updateWaterQuality(quality) {
    const displayQuality = quality === gameLevels[currentLevel].waterQualityGoal ? 100 : quality;
    waterQualityMeter.style.width = `${displayQuality}%`;
    qualityText.textContent = `Якість води: ${displayQuality}%`;
}

// Reset water glass
function resetWaterGlass() {
    // Remove applied filters container if it exists
    const appliedFiltersContainer = waterGlass.querySelector('.applied-filters');
    if (appliedFiltersContainer) {
        appliedFiltersContainer.innerHTML = '';
    }
    
    appliedFilters = [];
    updateWaterQuality(0);
    statusMessage.textContent = '';
    updateWaterColor(0);
    
    // Reset task completion
    const tasks = document.querySelectorAll('#level-tasks li');
    tasks.forEach(task => task.classList.remove('completed'));
}

// Update water color based on quality
function updateWaterColor(quality) {
    const water = document.querySelector('.water');
    if (quality === 0) {
        water.style.backgroundColor = '#8B4513';
    } else if (quality < 50) {
        water.style.backgroundColor = '#C2B280';
    } else if (quality < 80) {
        water.style.backgroundColor = '#87CEEB';
    } else {
        water.style.backgroundColor = '#00BFFF';
    }
}

// Calculate water quality based on applied filters
function calculateWaterQuality() {
    const level = gameLevels[currentLevel];
    const requiredFilters = level.requiredFilters;
    
    // Check if filters are in correct order
    for (let i = 0; i < appliedFilters.length; i++) {
        if (appliedFilters[i] !== requiredFilters[i]) {
            return 0;
        }
    }
    
    // Calculate progress based on correctly applied filters
    const progressPerFilter = Math.floor(100 / requiredFilters.length);
    const quality = Math.min(100, progressPerFilter * appliedFilters.length);
    
    // If all filters are applied correctly, return 100%
    if (appliedFilters.length === requiredFilters.length && 
        appliedFilters.every((filter, index) => filter === requiredFilters[index])) {
        return 100;
    }
    
    return quality;
}

// Update level buttons state
function updateLevelButtons() {
    levelButtons.forEach(button => {
        const level = parseInt(button.dataset.level);
        if (completedLevels.has(level)) {
            button.classList.add('completed');
            button.style.opacity = '1';
            button.style.cursor = 'pointer';
        } else {
            button.classList.remove('completed');
            button.style.opacity = '1';
            button.style.cursor = 'pointer';
        }
    });
}

// Handle level completion
function handleLevelCompletion() {
    if (currentLevel < 6) {
        // Показуємо повідомлення про успіх
        statusMessage.textContent = 'Вітаємо! Рівень пройдено успішно! Переходьте до наступного рівня!';
        statusMessage.style.color = 'green';
        
        // Додаємо анімацію для кнопки наступного рівня
        const nextLevelButton = document.querySelector(`[data-level="${currentLevel + 1}"]`);
        if (nextLevelButton) {
            nextLevelButton.style.animation = 'pulse 1s ease-in-out 3';
        }
        
        // Оновлюємо стан поточної кнопки
        const currentButton = document.querySelector(`[data-level="${currentLevel}"]`);
        if (currentButton) {
            currentButton.classList.add('completed');
            currentButton.style.backgroundColor = '#4CAF50';
        }
    } else if (currentLevel === 6) {
        // Створюємо елемент для фінального привітання
        const victoryScreen = document.createElement('div');
        victoryScreen.className = 'victory-screen';
        victoryScreen.innerHTML = `
            <div class="victory-content">
                <h2>🎉 Вітаємо! Ви справжній майстер очищення води! 🎉</h2>
                <p>Ви успішно пройшли всі рівні та довели свою майстерність у процесах очищення води.</p>
                <p>Ваші знання допоможуть зберегти чистоту води у нашому світі! 💧✨</p>
                <div class="victory-buttons">
                    <button onclick="location.reload()">Спробувати знову</button>
                    <button onclick="window.location.href='index.html'">На головну</button>
                </div>
            </div>
        `;
        document.body.appendChild(victoryScreen);
        
        // Додаємо конфетті
        const duration = 5 * 1000;
        const animationEnd = Date.now() + duration;
        const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 1001 };

        function randomInRange(min, max) {
            return Math.random() * (max - min) + min;
        }

        const interval = setInterval(function() {
            const timeLeft = animationEnd - Date.now();

            if (timeLeft <= 0) {
                return clearInterval(interval);
            }

            const particleCount = 50 * (timeLeft / duration);
            
            confetti(Object.assign({}, defaults, {
                particleCount,
                origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 }
            }));
            confetti(Object.assign({}, defaults, {
                particleCount,
                origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 }
            }));
        }, 250);
    }
}

// Handle filter drop
function handleFilterDrop(e) {
    e.preventDefault();
    const filterId = e.dataTransfer.getData('text/plain');
    const filterElement = document.querySelector(`[data-filter="${filterId}"]`);
    
    if (!filterElement) return;
    
    // Check if filter can be added
    const level = gameLevels[currentLevel];
    const nextRequiredFilter = level.requiredFilters[appliedFilters.length];
    
    if (filterId !== nextRequiredFilter) {
        statusMessage.textContent = `Спочатку потрібно додати ${getFilterName(nextRequiredFilter)}!`;
        statusMessage.style.color = 'red';
        return;
    }
    
    // Add filter to applied filters
    appliedFilters.push(filterId);
    
    // Create visual representation of applied filter
    const appliedFilter = document.createElement('div');
    appliedFilter.className = 'applied-filter';
    appliedFilter.textContent = filterElement.textContent;
    
    // Ensure filters container exists in water glass
    let appliedFiltersContainer = waterGlass.querySelector('.applied-filters');
    if (!appliedFiltersContainer) {
        appliedFiltersContainer = document.createElement('div');
        appliedFiltersContainer.className = 'applied-filters';
        waterGlass.appendChild(appliedFiltersContainer);
    }
    
    // Add to the end of the list
    appliedFiltersContainer.appendChild(appliedFilter);
    
    // Update water quality and color
    const quality = calculateWaterQuality();
    updateWaterQuality(quality);
    updateWaterColor(quality);
    
    // Check if level is completed
    if (quality === 100) {
        completedLevels.add(currentLevel);
        updateLevelButtons();
        handleLevelCompletion();
        
        // Ensure the current level button is marked as completed
        const currentButton = document.querySelector(`[data-level="${currentLevel}"]`);
        if (currentButton) {
            currentButton.classList.add('completed');
            currentButton.style.backgroundColor = '#4CAF50';
        }
    }
    
    // Update task completion visual feedback
    updateTaskCompletion();
}

// Helper function to get filter name
function getFilterName(filterId) {
    const filterMap = {
        'carbon': 'Вугільний фільтр',
        'mineral': 'Мінералізація',
        'membrane': 'Мембранна фільтрація',
        'uv': 'УФ-очищення',
        'separation': 'Сепарація',
        'chemical': 'Хімічне очищення',
        'precipitation': 'Осадження',
        'ion': 'Іонний обмін',
        'adsorption': 'Адсорбція'
    };
    return filterMap[filterId] || filterId;
}

// Add new function to update task completion visual feedback
function updateTaskCompletion() {
    const tasks = document.querySelectorAll('#level-tasks li');
    appliedFilters.forEach((filter, index) => {
        if (tasks[index]) {
            tasks[index].classList.add('completed');
        }
    });
}

// Event Listeners
document.addEventListener('DOMContentLoaded', () => {
    // Ініціалізуємо перший рівень та розблоковуємо його
    gameLevels[1].unlocked = true;
    
    // Розблоковуємо всі рівні, які були пройдені раніше
    for (let i = 1; i <= 6; i++) {
        if (completedLevels.has(i) && i < 6) {
            gameLevels[i + 1].unlocked = true;
        }
    }
    
    initGame(1);
    
    // Level selection
    levelButtons.forEach(button => {
        button.addEventListener('click', () => {
            const level = parseInt(button.dataset.level);
            initGame(level);
        });
    });
    
    // Reset button
    document.querySelector('.reset-button').addEventListener('click', () => {
        resetWaterGlass();
    });
    
    // Drag and drop functionality
    const filterItems = document.querySelectorAll('.filter-item');
    filterItems.forEach(item => {
        item.addEventListener('dragstart', (e) => {
            e.dataTransfer.setData('text/plain', item.dataset.filter);
        });
    });
    
    waterGlass.addEventListener('dragover', (e) => e.preventDefault());
    waterGlass.addEventListener('drop', handleFilterDrop);
}); 