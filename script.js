// --- INTERACTIVE DOJO SCRIPT ---
document.addEventListener('DOMContentLoaded', () => {
    if (document.body.contains(document.getElementById('drag-drop-game-1'))) {
        initializeAllGames();
    }
});

function initializeAllGames() {
    initializeQuizGame();
    // Initialize both drag & drop games
    initializeDragDropGame(dragDropData1, '#drag-drop-game-1');
    initializeDragDropGame(dragDropData2, '#drag-drop-game-2');
    initializeByosenGame();
}

// --- UTILITY FUNCTION ---
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

// --- GAME 1: QUIZ VERDADERO/FALSO ---
const quizQuestions = [
    { question: "Para que Reiki funcione, es necesario tener una fe ciega en el método.", answer: false },
    { question: "Reiki es una terapia alternativa que reemplaza a la medicina convencional.", answer: false },
    { question: "El auto-tratamiento es una parte fundamental del Nivel I de Reiki.", answer: true },
    { question: "Solo las personas con un 'don especial' pueden canalizar Reiki.", answer: false },
    { question: "La energía que se canaliza en Reiki es la energía personal del practicante.", answer: false },
    { question: "La técnica 'Gyoshi Ho' consiste en enviar Reiki con el aliento.", answer: false },
    { question: "El 'Byosen' es la sensación que se percibe en las manos sobre un bloqueo energético.", answer: true },
    { question: "Mikao Usui alcanzó la iluminación en el Monte Fuji.", answer: false }
];
let currentQuizIndex = 0;
let quizTimerInterval;

function initializeQuizGame() {
    shuffleArray(quizQuestions);
    displayQuizQuestion();
}

function displayQuizQuestion() {
    document.getElementById('quiz-question').innerHTML = `<strong>Pregunta:</strong> ${quizQuestions[currentQuizIndex].question}`;
    document.getElementById('quiz-feedback').style.display = 'none';
}

function checkQuizAnswer(userAnswer) {
    const feedback = document.getElementById('quiz-feedback');
    const feedbackText = document.getElementById('quiz-feedback-text');
    const timerText = document.getElementById('quiz-timer');
    const isCorrect = userAnswer === !quizQuestions[currentQuizIndex].answer;
    
    feedbackText.textContent = isCorrect ? '¡Correcto!' : 'Incorrecto. ¡Sigue aprendiendo!';
    feedback.className = `feedback ${isCorrect ? 'correct' : 'incorrect'}`;
    feedback.style.display = 'block';
    
    document.querySelectorAll('.game-container:first-of-type .button-group .button').forEach(button => button.disabled = true);
    
    let countdown = 3;
    timerText.textContent = ` Siguiente en ${countdown}...`;
    quizTimerInterval = setInterval(() => {
        countdown--;
        timerText.textContent = ` Siguiente en ${countdown}...`;
        if (countdown <= 0) {
            clearInterval(quizTimerInterval);
            currentQuizIndex = (currentQuizIndex + 1) % quizQuestions.length;
            displayQuizQuestion();
            document.querySelectorAll('.game-container:first-of-type .button-group .button').forEach(button => button.disabled = false);
        }
    }, 1000);
}

// --- GAMES 2 & 3: DRAG AND DROP (with Touch Support) ---
const dragDropData1 = [
    { id: 'usui', term: 'Mikao Usui', definition: 'El fundador del método Reiki.' },
    { id: 'gokai', term: 'Gokai', definition: 'Los 5 principios éticos del Reiki.' },
    { id: 'reiki', term: 'Reiki', definition: 'Significa "Energía Vital Universal".' },
    { id: 'shoden', term: 'Shoden', definition: 'El primer nivel, "el comienzo".' },
    { id: 'byosen', term: 'Byosen', definition: 'Sentir un bloqueo energético con las manos.' }
];
const dragDropData2 = [
    { id: 'kenyoku', term: 'Kenyoku', definition: 'Técnica de "baño seco" para purificar.' },
    { id: 'tanden', term: 'Tanden', definition: 'Centro de energía bajo el ombligo.' },
    { id: 'gassho', term: 'Gassho', definition: 'Meditación con manos en oración.' },
    { id: 'solo-hoy', term: 'Solo por hoy', definition: 'La clave para vivir en el presente.' },
    { id: 'mawashi', term: 'Reiki Mawashi', definition: 'Círculo de energía en grupo.' }
];

function initializeDragDropGame(data, containerSelector) {
    const gameContainer = document.querySelector(containerSelector);
    const definitionsContainer = gameContainer.querySelector('.definitions-container');
    const wordBank = gameContainer.querySelector('.word-bank');
    const shuffledTerms = [...data];
    shuffleArray(shuffledTerms);

    data.forEach(item => {
        definitionsContainer.innerHTML += `<div class="definition-item"><div class="drop-zone" data-answer="${item.id}"></div><span>${item.definition}</span></div>`;
    });
    shuffledTerms.forEach(item => {
        wordBank.innerHTML += `<div class="draggable-word" draggable="true" id="${item.id}">${item.term}</div>`;
    });

    addDragDropListeners(containerSelector, data.length);
}

function addDragDropListeners(containerSelector, totalItems) {
    const gameContainer = document.querySelector(containerSelector);
    const draggables = gameContainer.querySelectorAll('.draggable-word');
    const dropZones = gameContainer.querySelectorAll('.drop-zone');
    let correctDrops = 0;
    let touchDraggedElement = null;

    function handleDrop(zone, element) {
        if (zone.dataset.answer === element.id && !zone.hasChildNodes()) {
            zone.appendChild(element);
            if(element.draggable) element.draggable = false;
            zone.classList.add('correct-drop');
            correctDrops++;
            if (correctDrops === totalItems) {
                gameContainer.parentElement.querySelector('.completion-message').style.display = 'block';
            }
        }
    }

    draggables.forEach(draggable => {
        draggable.addEventListener('dragstart', (e) => e.target.classList.add('dragging'));
        draggable.addEventListener('dragend', (e) => e.target.classList.remove('dragging'));
        draggable.addEventListener('touchstart', (e) => {
            touchDraggedElement = e.target;
            touchDraggedElement.classList.add('dragging');
        });
    });

    dropZones.forEach(zone => {
        zone.addEventListener('dragover', e => { e.preventDefault(); zone.classList.add('over'); });
        zone.addEventListener('dragleave', () => zone.classList.remove('over'));
        zone.addEventListener('drop', e => {
            e.preventDefault();
            zone.classList.remove('over');
            const draggingElement = document.querySelector('.dragging');
            if (draggingElement) handleDrop(zone, draggingElement);
        });
    });

    gameContainer.addEventListener('touchmove', (e) => {
        if (!touchDraggedElement) return;
        e.preventDefault();
        const touch = e.targetTouches[0];
        const elementUnder = document.elementFromPoint(touch.clientX, touch.clientY);
        dropZones.forEach(zone => {
            if (zone === elementUnder || zone.contains(elementUnder)) zone.classList.add('over');
            else zone.classList.remove('over');
        });
    }, { passive: false });

    gameContainer.addEventListener('touchend', (e) => {
        if (!touchDraggedElement) return;
        const touch = e.changedTouches[0];
        let dropTarget = document.elementFromPoint(touch.clientX, touch.clientY);
        if (dropTarget && !dropTarget.classList.contains('drop-zone')) {
            dropTarget = dropTarget.closest('.drop-zone');
        }
        if (dropTarget && dropTarget.classList.contains('drop-zone')) {
            handleDrop(dropTarget, touchDraggedElement);
        }
        touchDraggedElement.classList.remove('dragging');
        dropZones.forEach(zone => zone.classList.remove('over'));
        touchDraggedElement = null;
    });
}

// --- GAME 4: BYOSEN LEVELS ---
const byosenLevels = [
    { sensation: "Un calorcito suave y agradable.", level: 1 },
    { sensation: "Un calor fuerte, como si la mano estuviera en un radiador.", level: 2 },
    { sensation: "Cosquilleos u hormigueos constantes.", level: 3 },
    { sensation: "Sensación de frío o palpitaciones rítmicas.", level: 4 },
    { sensation: "Dolor o una molestia aguda en tu propia mano.", level: 5 }
];
let currentByosenIndex = 0;

function initializeByosenGame() {
    const optionsContainer = document.getElementById('byosen-options');
    for (let i = 1; i <= 5; i++) {
        const button = document.createElement('button');
        button.className = 'button byosen-level-btn';
        button.textContent = i;
        button.onclick = () => checkByosenAnswer(i);
        optionsContainer.appendChild(button);
    }
    shuffleArray(byosenLevels);
    displayByosenSensation();
}

function displayByosenSensation() {
    document.getElementById('byosen-sensation-text').textContent = byosenLevels[currentByosenIndex].sensation;
    document.getElementById('byosen-feedback').style.display = 'none';
}

function checkByosenAnswer(chosenLevel) {
    const correctLevel = byosenLevels[currentByosenIndex].level;
    const feedback = document.getElementById('byosen-feedback');
    const isCorrect = chosenLevel === correctLevel;

    feedback.textContent = isCorrect ? `¡Correcto! Esa sensación corresponde al nivel ${correctLevel}.` : `Casi. La respuesta correcta era el nivel ${correctLevel}.`;
    feedback.className = `feedback ${isCorrect ? 'correct' : 'incorrect'}`;
    feedback.style.display = 'block';

    document.querySelectorAll('#byosen-options .button').forEach(button => button.disabled = true);
    setTimeout(() => {
        currentByosenIndex = (currentByosenIndex + 1) % byosenLevels.length;
        displayByosenSensation();
        document.querySelectorAll('#byosen-options .button').forEach(button => button.disabled = false);
    }, 3000);
}
