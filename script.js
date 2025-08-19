// --- INTERACTIVE DOJO SCRIPT ---
// This script should be linked in dojo.html

document.addEventListener('DOMContentLoaded', () => {
    // Only run the scripts if we are on the dojo page
    if (document.body.contains(document.getElementById('drag-drop-game'))) {
        initializeDragDropGame();
        initializeQuizGame();
    }
});

// Game 1: Drag and Drop
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

function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

function initializeDragDropGame() {
    const definitionsContainer = document.getElementById('definitions-container');
    const wordBank = document.getElementById('word-bank');
    
    const shuffledTerms = [...dragDropData];
    shuffleArray(shuffledTerms);

    dragDropData.forEach(item => {
        definitionsContainer.innerHTML += `
            <div class="definition-item">
                <div class="drop-zone" data-answer="${item.id}"></div>
                <span>${item.definition}</span>
            </div>
        `;
    });
    
    shuffledTerms.forEach(item => {
        wordBank.innerHTML += `
            <div class="draggable-word" draggable="true" id="${item.id}">${item.term}</div>
        `;
    });

    addDragDropListeners();
}

function addDragDropListeners() {
    const draggables = document.querySelectorAll('.draggable-word');
    const dropZones = document.querySelectorAll('.drop-zone');
    let correctDrops = 0;

    draggables.forEach(draggable => {
        draggable.addEventListener('dragstart', () => draggable.classList.add('dragging'));
        draggable.addEventListener('dragend', () => draggable.classList.remove('dragging'));
    });

    dropZones.forEach(zone => {
        zone.addEventListener('dragover', e => {
            e.preventDefault();
            zone.classList.add('over');
        });
        zone.addEventListener('dragleave', () => zone.classList.remove('over'));
        zone.addEventListener('drop', e => {
            e.preventDefault();
            zone.classList.remove('over');
            const draggedId = document.querySelector('.dragging').id;
            const draggedElement = document.getElementById(draggedId);
            
            if (zone.dataset.answer === draggedId && !zone.hasChildNodes()) {
                zone.appendChild(draggedElement);
                draggedElement.draggable = false;
                zone.classList.add('correct-drop');
                correctDrops++;
                if (correctDrops === dragDropData.length) {
                    document.getElementById('completion-message').style.display = 'block';
                }
            }
        });
    });
}

// Game 2: Quiz
const quizQuestions = [
    { question: "Para que Reiki funcione, es necesario tener una fe ciega en el método.", answer: false },
    { question: "Reiki es una terapia alternativa que reemplaza a la medicina convencional.", answer: false },
    { question: "El auto-tratamiento es una parte fundamental del Nivel I de Reiki.", answer: true },
    { question: "Solo las personas con un 'don especial' pueden canalizar Reiki.", answer: false }
];
let currentQuizIndex = 0;

function initializeQuizGame() {
    displayQuizQuestion();
}

function displayQuizQuestion() {
    document.getElementById('quiz-question').innerHTML = `<strong>Pregunta:</strong> ${quizQuestions[currentQuizIndex].question}`;
    document.getElementById('quiz-feedback').style.display = 'none';
}

function checkQuizAnswer(userAnswer) {
    const feedback = document.getElementById('quiz-feedback');
    const isCorrect = userAnswer === !quizQuestions[currentQuizIndex].answer;
    
    if (isCorrect) {
        feedback.textContent = '¡Correcto!';
        feedback.className = 'feedback correct';
    } else {
        feedback.textContent = 'Incorrecto. ¡Inténtalo de nuevo en la próxima ronda!';
        feedback.className = 'feedback incorrect';
    }
    feedback.style.display = 'block';
    
    setTimeout(() => {
        currentQuizIndex = (currentQuizIndex + 1) % quizQuestions.length;
        displayQuizQuestion();
    }, 2500);
}

// Generic function for guided practices
function runGuidedPractice(steps, textElement, buttonElement, stepTracker) {
    window[stepTracker]++;
    let currentStep = window[stepTracker];
    
    if (currentStep < steps.length) {
        textElement.style.opacity = 0;
        setTimeout(() => {
            textElement.textContent = steps[currentStep];
            textElement.style.opacity = 1;
        }, 300);
        buttonElement.textContent = 'Siguiente Paso';
    } else {
        textElement.textContent = `Práctica completada. Haz clic en 'Reiniciar' para practicar de nuevo.`;
        buttonElement.textContent = 'Reiniciar';
        window[stepTracker] = -1;
    }
}

// Practice 3: Gassho
const gasshoSteps = [ "Siéntate cómodamente. Cierra los ojos.", "Junta las palmas frente a tu pecho (Gassho).", "Lleva tu atención al punto donde se tocan tus dedos corazón.", "Inhala, imaginando la energía Reiki entrando por tus manos...", "...y viajando hasta tu Tanden (bajo el ombligo).", "Exhala, visualizando la energía regresar desde el Tanden...", "...y salir por tus manos, irradiando luz.", "Continúa respirando así por unos momentos.", "Siente la paz y el calor. Agradece." ];
let currentGasshoStep = -1;
function doGasshoStep() {
    runGuidedPractice(gasshoSteps, document.getElementById('gassho-step-text'), document.getElementById('gassho-button'), 'currentGasshoStep');
}

// Practice 4: Kenyoku
const kenyokuSteps = [ "Mano DERECHA en hombro IZQUIERDO.", "Desliza en diagonal hasta la cadera DERECHA.", "Mano IZQUIERDA en hombro DERECHO.", "Desliza en diagonal hasta la cadera IZQUIERDA.", "Repite: Mano DERECHA desde hombro IZQUIERDO a cadera DERECHA.", "Ahora, el brazo: Mano DERECHA en hombro IZQUIERDO.", "Desliza por todo el brazo IZQUIERDO hasta los dedos.", "Mano IZQUIERDA en hombro DERECHO.", "Desliza por todo el brazo DERECHO hasta los dedos.", "Repite: Mano DERECHA desde hombro IZQUIERDO hasta los dedos.", "¡Purificación completada!" ];
let currentKenyokuStep = -1;
function doKenyokuStep() {
    runGuidedPractice(kenyokuSteps, document.getElementById('kenyoku-step-text'), document.getElementById('kenyoku-button'), 'currentKenyokuStep');
}
