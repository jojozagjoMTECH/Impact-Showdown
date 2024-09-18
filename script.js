document.addEventListener('DOMContentLoaded', () => {
    const mainMenu = document.getElementById('main-menu');
    const characterSelection = document.getElementById('character-selection');
    const mapSelection = document.getElementById('map-selection');
    const game = document.getElementById('game');
    const startGameButton = document.getElementById('start-game');
    const confirmCharactersButton = document.getElementById('confirm-characters');
    const startFightButton = document.getElementById('start-fight');
    const characters = document.querySelectorAll('.character');
    const maps = document.querySelectorAll('.map');
    const player1 = document.getElementById('player1');
    const player2 = document.getElementById('player2');
    const platform = document.getElementById('platform');
    const healthBar1 = document.getElementById('health-bar1').querySelector('.health');
    const healthBar2 = document.getElementById('health-bar2').querySelector('.health');

    let player1Pos = { x: 10, y: 10, vy: 0 };
    let player2Pos = { x: 90, y: 10, vy: 0 };
    let player1Health = 100;
    let player2Health = 100;
    let selectedCharacters = { player1: null, player2: null };
    let selectedMap = null;
    let currentPlayer = 1;
    const gravity = 0.5;
    const jumpStrength = 10;
    const groundLevel = 10; // Platform height in percentage

    startGameButton.addEventListener('click', () => {
        mainMenu.classList.add('hidden');
        characterSelection.classList.remove('hidden');
    });

    characters.forEach(character => {
        character.addEventListener('click', () => {
            const characterName = character.getAttribute('data-character');
            if (currentPlayer === 1) {
                selectedCharacters.player1 = characterName;
                character.style.borderColor = 'green';
                currentPlayer = 2;
            } else if (currentPlayer === 2) {
                selectedCharacters.player2 = characterName;
                character.style.borderColor = 'blue';
                confirmCharactersButton.classList.remove('hidden');
            }
        });
    });

    confirmCharactersButton.addEventListener('click', () => {
        characterSelection.classList.add('hidden');
        mapSelection.classList.remove('hidden');
    });

    maps.forEach(map => {
        map.addEventListener('click', () => {
            selectedMap = map.getAttribute('data-map');
            map.style.borderColor = 'green';
            startFightButton.classList.remove('hidden');
        });
    });

    startFightButton.addEventListener('click', () => {
        mapSelection.classList.add('hidden');
        game.classList.remove('hidden');
        player1.style.backgroundColor = selectedCharacters.player1;
        player2.style.backgroundColor = selectedCharacters.player2;
    });

    const movePlayer = (player, pos, dx, dy) => {
        pos.x += dx;
        pos.y += dy;
        player.style.left = `${pos.x}%`;
        player.style.bottom = `${pos.y}%`;
    };

    const updateHealth = (player, health) => {
        player.style.width = `${health}%`;
    };

    const attack = (attacker, defender, defenderHealth) => {
        if (Math.abs(attacker.x - defender.x) < 5 && Math.abs(attacker.y - defender.y) < 5) {
            defenderHealth -= 10;
            createVFX(defender.x, defender.y);
            return defenderHealth;
        }
        return defenderHealth;
    };

    const applyGravity = (player, pos) => {
        if (pos.y > groundLevel) {
            pos.vy -= gravity;
        } else {
            pos.vy = 0;
            pos.y = groundLevel;
        }
        pos.y += pos.vy;
        player.style.bottom = `${pos.y}%`;
    };

    const ultimateCutscene = (player, playerPos, opponentPos) => {
        const cutscene = document.createElement('div');
        cutscene.classList.add('cutscene');
        cutscene.innerText = `${player} used their Ultimate!`;
        document.body.appendChild(cutscene);
        setTimeout(() => cutscene.remove(), 2000);

        // Player jumps up
        playerPos.vy = jumpStrength * 2;
        applyGravity(player === 'Player 1' ? player1 : player2, playerPos);

        // Create laser beam
        setTimeout(() => {
            const laser = document.createElement('div');
            laser.classList.add('laser');
            laser.style.left = `${playerPos.x}%`;
            laser.style.bottom = `${playerPos.y}%`;
            game.appendChild(laser);

            // Laser beam moves towards opponent's last position
            laser.style.transform = `translate(${opponentPos.x - playerPos.x}%, ${opponentPos.y - playerPos.y}%)`;

            // Apply damage to opponent
            setTimeout(() => {
                if (player === 'Player 1') {
                    player2Health -= 30;
                    updateHealth(healthBar2, player2Health);
                    createVFX(opponentPos.x, opponentPos.y);
                } else {
                    player1Health -= 30;
                    updateHealth(healthBar1, player1Health);
                    createVFX(opponentPos.x, opponentPos.y);
                }
                laser.remove();
            }, 1000);
        }, 500);
    };

    const createVFX = (x, y) => {
        const vfx = document.createElement('div');
        vfx.classList.add('vfx');
        vfx.style.left = `${x}%`;
        vfx.style.bottom = `${y}%`;
        game.appendChild(vfx);
        setTimeout(() => vfx.remove(), 1000);
    };

    document.addEventListener('keydown', (e) => {
        switch (e.key) {
            case 'a':
                movePlayer(player1, player1Pos, -1, 0);
                break;
            case 'd':
                movePlayer(player1, player1Pos, 1, 0);
                break;
            case 'w':
                if (player1Pos.y === groundLevel) player1Pos.vy = jumpStrength;
                break;
            case 's':
                movePlayer(player1, player1Pos, 0, -1);
                break;
            case 'ArrowLeft':
                movePlayer(player2, player2Pos, -1, 0);
                break;
            case 'ArrowRight':
                movePlayer(player2, player2Pos, 1, 0);
                break;
            case 'ArrowUp':
                if (player2Pos.y === groundLevel) player2Pos.vy = jumpStrength;
                break;
            case 'ArrowDown':
                movePlayer(player2, player2Pos, 0, -1);
                break;
            case ' ':
                player2Health = attack(player1Pos, player2Pos, player2Health);
                updateHealth(healthBar2, player2Health);
                break;
            case 'Enter':
                player1Health = attack(player2Pos, player1Pos, player1Health);
                updateHealth(healthBar1, player1Health);
                break;
            case 'u':
                ultimateCutscene('Player 1', player1Pos, player2Pos);
                break;
            case 'i':
                ultimateCutscene('Player 2', player2Pos, player1Pos);
                break;
        }
    });

    const gameLoop = () => {
        applyGravity(player1, player1Pos);
        applyGravity(player2, player2Pos);
        requestAnimationFrame(gameLoop);
    };

    gameLoop();
});
