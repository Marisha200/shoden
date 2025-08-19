// --- INTERACTIVE DOJO SCRIPT ---
// This script should be linked in dojo.html

document.addEventListener('DOMContentLoaded', () => {
    // Only run the scripts if we are on the dojo page
    if (document.body.contains(document.getElementById('drag-drop-game'))) {
        initializeDragDropGame();
        initializeQuizGame();
        initializeTechniqueQuiz();
    }
});

// --- UTILITY FUNCTION ---
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

// --- GAME 1: DRAG AND DROP ---
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

    draggables.forEach(draggable => {
        draggable.addEventListener('dragstart', () => draggable.classList.add('dragging'));
        draggable.addEventListener('dragend', () => draggable.classList.remove('dragging'));
    });

    dropZones.forEach(zone => {
        zone.addEventListener('dragover', e => { e.preventDefault(); zone.classList.add('over'); });
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

// --- GAME 3: WHAT'S THE TECHNIQUE? ---
const techniqueScenarios = [
    { scenario: "Para limpiar tu campo energético rápidamente después de un día pesado, ¿qué técnica usas?", correctAnswer: "Kenyoku", options: ["Kenyoku", "Gassho", "Reiji Ho"] },
    { scenario: "Si quieres calmar tu mente y aumentar la sensibilidad en tus manos antes de meditar, ¿qué práctica realizas?", correctAnswer: "Gassho", options: ["Gassho", "Gyoshi Ho", "Kenyoku"] },
    { scenario: "Quieres enviar sanación a un amigo que vive en otra ciudad. ¿Qué habilidad necesitas?", correctAnswer: "Reiki a Distancia", options: ["Reiki a Distancia", "Byosen", "Nentatsu Ho"] },
    { scenario: "Sientes un hormigueo intenso en tus manos sobre el hombro de una persona. ¿Qué estás percibiendo?", correctAnswer: "Byosen", options: ["Byosen", "Koki Ho", "Gassho"] }
];
let currentTechniqueIndex = 0;

function initializeTechniqueQuiz() {
    shuffleArray(techniqueScenarios);
    displayTechniqueScenario();
}

function displayTechniqueScenario() {
    const current = techniqueScenarios[currentTechniqueIndex];
    document.getElementById('technique-scenario').textContent = current.scenario;
    const optionsContainer = document.getElementById('technique-options');
    optionsContainer.innerHTML = '';
    
    const shuffledOptions = [...current.options];
    shuffleArray(shuffledOptions);

    shuffledOptions.forEach(option => {
        const button = document.createElement('button');
        button.className = 'button';
        button.textContent = option;
        button.onclick = () => checkTechniqueAnswer(option);
        optionsContainer.appendChild(button);
    });

    document.getElementById('technique-feedback').style.display = 'none';
}

function checkTechniqueAnswer(chosenOption) {
    const current = techniqueScenarios[currentTechniqueIndex];
    const feedback = document.getElementById('technique-feedback');
    const isCorrect = chosenOption === current.correctAnswer;

    feedback.textContent = isCorrect ? `¡Correcto! ${current.correctAnswer} es la técnica adecuada.` : 'No es esa, pero sigue intentando.';
    feedback.className = `feedback ${isCorrect ? 'correct' : 'incorrect'}`;
    feedback.style.display = 'block';
    
    document.querySelectorAll('#technique-options .button').forEach(button => button.disabled = true);

    setTimeout(() => {
        currentTechniqueIndex = (currentTechniqueIndex + 1) % techniqueScenarios.length;
        displayTechniqueScenario();
    }, 3000);
}
