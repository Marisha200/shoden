// --- INTERACTIVE DOJO SCRIPT ---
// This script should be linked in dojo.html

document.addEventListener('DOMContentLoaded', () => {
    // Only run the scripts if we are on the dojo page
    if (document.body.contains(document.getElementById('drag-drop-game'))) {
        initializeDragDropGame();
        initializeQuizGame();
    }
});

// --- UTILITY FUNCTION ---
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

// --- GAME 1: DRAG AND DROP (with Touch Support) ---
const dragDropData = [
    { id: 'usui', term: 'Mikao Usui', definition: 'El fundador del método Reiki.' },
    { id: 'gokai', term: 'Gokai', definition: 'Los 5 principios éticos del Reiki.' },
    { id: 'reiki', term: 'Reiki', definition: 'Significa "Energía Vital Universal".' },
    { id: 'shoden', term: 'Shoden', definition: 'El primer nivel, "el comienzo".' },
    { id: 'kenyoku', term: 'Kenyoku', definition: 'Técnica de "baño seco" para purificar.' },
    { id: 'tanden', term: 'Tanden', definition: 'Centro de energía bajo el ombligo.' },
    { id: 'gassho', term: 'Gassho', definition: 'Meditación con manos en oración.' },
    { id: 'solo-hoy', term: 'Solo por hoy', definition: 'La clave para vivir en el presente.' },
    { id: 'mawashi', term: 'Reiki Mawashi', definition: 'Círculo de energía en grupo.' },
    { id: 'byosen', term: 'Byosen', definition: 'Sentir un bloqueo energético con las manos.' }
];

function initializeDragDropGame() {
    const definitionsContainer = document.getElementById('definitions-container');
    const wordBank = document.getElementById('word-bank');
    const shuffledTerms = [...dragDropData];
    shuffleArray(shuffledTerms);

    dragDropData.forEach(item => {
        definitionsContainer.innerHTML += `<div class="definition-item"><div class="drop-zone" data-answer="${item.id}"></div><span>${item.definition}</span></div>`;
    });
    shuffledTerms.forEach(item => {
        wordBank.innerHTML += `<div class="draggable-word" draggable="true" id="${item.id}">${item.term}</div>`;
    });

    addDragDropListeners();
}

function addDragDropListeners() {
    const draggables = document.querySelectorAll('.draggable-word');
    const dropZones = document.querySelectorAll('.drop-zone');
    let correctDrops = 0;
    let touchDraggedElement = null;

    // Common function to handle a successful drop
    function handleDrop(zone, element) {
        if (zone.dataset.answer === element.id && !zone.hasChildNodes()) {
            zone.appendChild(element);
            if(element.draggable) element.draggable = false; // Disable mouse drag after drop
            zone.classList.add('correct-drop');
            correctDrops++;
            if (correctDrops === dragDropData.length) {
                document.getElementById('completion-message').style.display = 'block';
            }
        }
    }

    // MOUSE EVENTS for Desktop
    draggables.forEach(draggable => {
        draggable.addEventListener('dragstart', (e) => {
            e.target.classList.add('dragging');
        });
        draggable.addEventListener('dragend', (e) => {
            e.target.classList.remove('dragging');
        });
    });

    dropZones.forEach(zone => {
        zone.addEventListener('dragover', e => { e.preventDefault(); zone.classList.add('over'); });
        zone.addEventListener('dragleave', () => { zone.classList.remove('over'); });
        zone.addEventListener('drop', e => {
            e.preventDefault();
            zone.classList.remove('over');
            const draggingElement = document.querySelector('.dragging');
            if (draggingElement) {
                handleDrop(zone, draggingElement);
            }
        });
    });

    // TOUCH EVENTS for Mobile
    draggables.forEach(draggable => {
        draggable.addEventListener('touchstart', (e) => {
            touchDraggedElement = e.target;
            touchDraggedElement.classList.add('dragging');
        });
    });

    // Listen for touch movement on the whole container for better experience
    const gameContainer = document.querySelector('#drag-drop-game');
    gameContainer.addEventListener('touchmove', (e) => {
        if (!touchDraggedElement) return;
        e.preventDefault(); // Prevent screen from scrolling while dragging
        
        const touch = e.targetTouches[0];
        const elementUnder = document.elementFromPoint(touch.clientX, touch.clientY);
        
        dropZones.forEach(zone => {
            if (zone === elementUnder || zone.contains(elementUnder)) {
                zone.classList.add('over');
            } else {
                zone.classList.remove('over');
            }
        });
    }, { passive: false });

    gameContainer.addEventListener('touchend', (e) => {
        if (!touchDraggedElement) return;

        const touch = e.changedTouches[0];
        let dropTarget = document.elementFromPoint(touch.clientX, touch.clientY);
        
        // Check if the drop target is a zone or inside a zone
        if (dropTarget && !dropTarget.classList.contains('drop-zone')) {
            dropTarget = dropTarget.closest('.drop-zone');
        }

        if (dropTarget && dropTarget.classList.contains('drop-zone')) {
            handleDrop(dropTarget, touchDraggedElement);
        }

        // Cleanup
        touchDraggedElement.classList.remove('dragging');
        dropZones.forEach(zone => zone.classList.remove('over'));
        touchDraggedElement = null;
    });
}


// --- GAME 2: QUIZ VERDADERO/FALSO ---
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
    const isCorrect = userAnswer === !quizQuestions[currentQuizIndex].answer;
    feedback.textContent = isCorrect ? '¡Correcto!' : 'Incorrecto. ¡Sigue aprendiendo!';
    feedback.className = `feedback ${isCorrect ? 'correct' : 'incorrect'}`;
    feedback.style.display = 'block';
    
    document.querySelectorAll('.button-group .button').forEach(button => button.disabled = true);
    setTimeout(() => {
        currentQuizIndex = (currentQuizIndex + 1) % quizQuestions.length;
        displayQuizQuestion();
        document.querySelectorAll('.button-group .button').forEach(button => button.disabled = false);
    }, 2500);
}
