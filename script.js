// --- MÚSICA DE FONDO ---
// Archivo esperado: multimedia/bella.mp3
const musica = new Audio("multimedia/bella.mp3");
musica.loop = true;
musica.volume = 0.5;
let musicaActiva = true;

function iniciarMusica() {
    if (!musicaActiva) return;
    musica.play().catch(() => {});
}

function crearBotonMusica() {
    const viejo = document.getElementById("music-btn");
    if (viejo) viejo.remove();

    const btn = document.createElement("button");
    btn.id = "music-btn";
    btn.title = "Activar/silenciar música";
    btn.textContent = musica.paused ? "🔇" : "🔊";
    btn.style.cssText = "position: fixed; right: 16px; bottom: 16px; width: 48px; height: 48px; padding: 0; border-radius: 50%; font-size: 20px; background: #2a152e; border: 1px solid rgba(236,72,153,0.3); z-index: 200; display: flex; align-items: center; justify-content: center;";

    btn.addEventListener("click", (e) => {
        e.stopPropagation();
        if (musica.paused) {
            musicaActiva = true;
            musica.play().catch(() => {});
            btn.textContent = "🔊";
        } else {
            musicaActiva = false;
            musica.pause();
            btn.textContent = "🔇";
        }
    });

    document.body.appendChild(btn);
}


document.addEventListener("DOMContentLoaded", () => {
    crearBotonMusica();
    // Los navegadores bloquean el audio hasta que hay una interacción: arranca con el primer toque
    document.addEventListener("click", () => {
        iniciarMusica();
        const b = document.getElementById("music-btn");
        if (b && !musica.paused) b.textContent = "🔊";
    }, { once: true });

    const dots = document.querySelectorAll('.dot');
    const messageBox = document.getElementById('message');
    const lockContainer = document.getElementById('lock-container');
    const numButtons = document.querySelectorAll('.num-key');
    const clearButton = document.getElementById('clear-btn');
    const enterButton = document.getElementById('enter-btn');

    let currentCode = "";
    const maxDigits = 6;

    function updateDots() {
        dots.forEach((dot, index) => {
            if (index < currentCode.length) {
                dot.classList.add('active');
            } else {
                dot.classList.remove('active');
            }
        });
    }

    function showMessage(text, type) {
        messageBox.textContent = text;
        messageBox.className = "message-box " + type;
    }

    numButtons.forEach(button => {
        button.addEventListener("click", () => {
            const value = button.getAttribute("data-value");
            if (currentCode.length < maxDigits) {
                currentCode += value;
                showMessage("", ""); 
                updateDots();
            }
        });
    });

    clearButton.addEventListener("click", () => {
        currentCode = "";
        showMessage("", "");
        lockContainer.classList.remove('unlocked');
        updateDots();
    });

    enterButton.addEventListener("click", () => {
        const formattedCode = currentCode.padStart(maxDigits, "0");
        
        if (currentCode === "") {
            showMessage("Ingresa un código numérico", "error");
            return;
        }

        if (formattedCode === "000001") {
            showMessage("¡Código correcto! Abriendo...", "success");
            lockContainer.classList.add('unlocked');
            
            setTimeout(() => {
                cargarMotorRompecabezas();
            }, 900);
        } else {
            showMessage("Código incorrecto. ¡Inténtalo de nuevo!", "error");
            currentCode = "";
            setTimeout(updateDots, 400);
        }
    });

    updateDots();
});
// --- MOTOR INTERNO INTEGRADO DEL JUEGO DEL ROMPECABEZAS (10 NIVELES) ---
function cargarMotorRompecabezas() {
    const bodyContainer = document.body;
    bodyContainer.innerHTML = `
        <div class="container" style="background: rgba(29, 14, 33, 0.65); padding: 30px; border-radius: 24px; backdrop-filter: blur(12px); -webkit-backdrop-filter: blur(12px); border: 1px solid rgba(236, 72, 153, 0.15); text-align: center; max-width: 460px; width: 100%; box-sizing: border-box; box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.7);">
            <h1 style="margin-top: 0; font-size: 24px; font-weight: 700; letter-spacing: 1px; color: #ffffff; margin-bottom: 5px;">Rompecabezas de Any</h1>
            <div id="level-text" class="level-indicator" style="font-size: 15px; font-weight: 600; color: #ff527b; margin-bottom: 20px; letter-spacing: 0.5px; text-transform: uppercase;">Nivel 1 de 10</div>
            
            <div class="controls" style="margin-bottom: 20px; display: flex; gap: 12px; justify-content: center;">
                <button id="restart-btn">Reiniciar Nivel</button>
                <button id="hint-btn" class="secondary">Ver Guía</button>
            </div>

            <div class="stats" style="display: flex; justify-content: space-around; margin-bottom: 20px; font-weight: 600; font-size: 14px; color: #a78bfa; background: rgba(0, 0, 0, 0.2); padding: 12px; border-radius: 12px; border: 1px solid rgba(255, 255, 255, 0.05);">
                <div>Movimientos: <span id="moves-count">0</span></div>
                <div>Tiempo: <span id="timer">00:00</span></div>
            </div>

            <div id="puzzle-board" style="display: grid; grid-template-columns: repeat(4, 1fr); grid-template-rows: repeat(4, 1fr); gap: 3px; width: 100%; max-width: 400px; aspect-ratio: 1 / 1; margin: 0 auto; background-color: rgba(0, 0, 0, 0.4); border-radius: 16px; overflow: hidden; padding: 4px; box-shadow: inset 0 2px 8px rgba(0,0,0,0.8);"></div>
        </div>

        <div id="victory-modal" class="modal" style="display: none; position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(13, 5, 14, 0.85); align-items: center; justify-content: center; z-index: 100; backdrop-filter: blur(8px);">
            <div id="modal-body" class="modal-content" style="background: #1d0e21; border: 1px solid rgba(236, 72, 153, 0.15); padding: 40px 30px; border-radius: 24px; text-align: center; box-shadow: 0 25px 50px rgba(0,0,0,0.5); max-width: 380px; width: 100%;"></div>
        </div>
    `;

    crearBotonMusica(); // el body se reemplazó, se vuelve a crear el botón

    const board = document.getElementById('puzzle-board');
    const restartBtn = document.getElementById('restart-btn');
    const hintBtn = document.getElementById('hint-btn');
    const movesDisplay = document.getElementById('moves-count');
    const timerDisplay = document.getElementById('timer');
    const victoryModal = document.getElementById('victory-modal');
    const modalBody = document.getElementById('modal-body');
    const levelText = document.getElementById('level-text');

    const size = 4;
    let tiles = [];
    let selectedTile = null;
    let moves = 0;
    let seconds = 0;
    let timerInterval = null;
    let showNumbers = false; 
    let gameStarted = false;

    let currentLevel = 1;
    const maxLevels = 10;

    function initGame() {
        clearInterval(timerInterval);
        seconds = 0;
        moves = 0;
        selectedTile = null;
        gameStarted = false;
        movesDisplay.textContent = moves;
        timerDisplay.textContent = "00:00";
        victoryModal.style.display = 'none';
        
        levelText.textContent = `Nivel ${currentLevel} de ${maxLevels}`;
        
        createTiles();
        do { shuffleTiles(); } while (tiles.every((t, i) => t.correctId === i));
        renderBoard();

        // Ajusta el tablero a la proporción real de la foto (vertical u horizontal)
        const img = new Image();
        img.onload = () => {
            board.style.aspectRatio = `${img.naturalWidth} / ${img.naturalHeight}`;
        };
        img.src = `multimedia/a${currentLevel}.jpg`;
    }

    function createTiles() {
        tiles = [];
        const currentImagePath = `multimedia/a${currentLevel}.jpg`;
        
        for (let i = 0; i < size * size; i++) {
            const row = Math.floor(i / size);
            const col = i % size;
            
            tiles.push({
                id: i,
                correctId: i,
                bgX: col * 33.333,
                bgY: row * 33.333,
                imageUrl: currentImagePath
            });
        }
    }

    function shuffleTiles() {
        for (let i = tiles.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [tiles[i], tiles[j]] = [tiles[j], tiles[i]];
        }
    }

    function startTimer() {
        if (gameStarted) return;
        gameStarted = true;
        timerInterval = setInterval(() => {
            seconds++;
            const mins = Math.floor(seconds / 60).toString().padStart(2, '0');
            const secs = (seconds % 60).toString().padStart(2, '0');
            timerDisplay.textContent = `${mins}:${secs}`;
        }, 1000);
    }

    function renderBoard() {
        board.innerHTML = '';
        tiles.forEach((tile, index) => {
            const tileElement = document.createElement('div');
            tileElement.classList.add('tile');
            
            tileElement.style.backgroundImage = `url(${tile.imageUrl})`;
            tileElement.style.backgroundPosition = `${tile.bgX}% ${tile.bgY}%`;
            tileElement.style.backgroundSize = '400% 400%';
            
            if (showNumbers) {
                const numberLabel = document.createElement('span');
                numberLabel.classList.add('tile-number');
                numberLabel.textContent = tile.correctId + 1;
                tileElement.appendChild(numberLabel);
            }

            tileElement.addEventListener('click', () => handleTileClick(index));
            board.appendChild(tileElement);
        });
    }

    function handleTileClick(index) {
        startTimer();
        const clickedTileElements = board.children;

        if (selectedTile === null) {
            selectedTile = index;
            clickedTileElements[index].classList.add('selected');
        } else {
            if (selectedTile === index) {
                clickedTileElements[index].classList.remove('selected');
                selectedTile = null;
                return;
            }

            [tiles[selectedTile], tiles[index]] = [tiles[index], tiles[selectedTile]];
            moves++;
            movesDisplay.textContent = moves;
            selectedTile = null;
            
            renderBoard();
            checkVictory();
        }
    }

    function checkVictory() {
        const isWin = tiles.every((tile, index) => tile.correctId === index);
        if (isWin) {
            clearInterval(timerInterval);
            setTimeout(() => {
                showVictoryScreen();
            }, 300);
        }
    }

    function showVictoryScreen() {
        if (currentLevel < maxLevels) {
            modalBody.className = "modal-content";
            modalBody.innerHTML = `
                <h2 style="color: #34d399; margin-top: 0; font-size: 24px;">¡Buen trabajo! 🎉</h2>
                <p style="color: #a78bfa;">Completaste el rompecabezas del Nivel ${currentLevel}.</p>
                <p style="font-size: 14px; margin-bottom: 25px; color:#ffffff;">Movimientos: ${moves} | Tiempo: ${timerDisplay.textContent}</p>
                <button id="next-level-btn" style="padding: 10px 20px; border-radius: 12px; font-size: 14px; background: #ff527b; color: white; cursor: pointer; font-weight: 600; border: none;">Jugar Siguiente Imagen</button>
            `;
            victoryModal.style.display = 'flex';
            
            document.getElementById('next-level-btn').addEventListener('click', () => {
                currentLevel++;
                initGame();
            });
        } else {
            modalBody.className = "modal-content final-victory";
            modalBody.innerHTML = `
                <h2 style="color: #ff527b; font-size: 26px; text-shadow: 0 0 15px rgba(255, 82, 123, 0.4); margin-bottom: 15px;">¡Ganaste Any, eres genial! 🎉💖</h2>
                <p style="color: #ffffff; font-size: 16px; line-height: 1.5;">Completaste con éxito los 10 niveles del juego.</p>
                <button id="back-menu-btn" class="btn-menu" style="background: #ff527b; margin-top: 20px; font-size: 15px; padding: 12px 24px; border: none; border-radius: 12px; box-shadow: 0 4px 14px rgba(255, 82, 123, 0.4); color: white; cursor: pointer; font-weight: bold;">¿Quieres volver al menú?</button>
            `;
            victoryModal.style.display = 'flex';
            
            document.getElementById('back-menu-btn').addEventListener('click', () => {
                window.location.reload();
            });
        }
    }

    restartBtn.addEventListener('click', initGame);
    hintBtn.addEventListener('click', () => {
        showNumbers = !showNumbers;
        hintBtn.textContent = showNumbers ? "Ocultar Guía" : "Ver Guía";
        hintBtn.classList.toggle('secondary');
        renderBoard();
    });

    initGame();
}
