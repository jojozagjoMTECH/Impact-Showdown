let player1 = {
    x: 100,
    y: 400,
    width: 50,
    height: 50,
    color: 'blue',
    controls: { up: 'W', left: 'A', down: 'S', right: 'D', ultimate: 'Q', melee: 'E' },
    percentage: 0,
    ultimateCharge: 0,
    ultimateReady: false,
    character: 1,
    ultimateName: 'Blue Blast',
    meleeName: 'Uppercut',
    lives: 3,
    onGround: false,
    velocityX: 0,
    velocityY: 0,
    comboHits: 0,
    comboCooldown: false,
    isFalling: false,
    iFrames: false,
    visible: true
};

let player2 = {
    x: 650,
    y: 400,
    width: 50,
    height: 50,
    color: 'red',
    controls: { up: 'I', left: 'J', down: 'K', right: 'L', ultimate: 'U', melee: 'O' },
    percentage: 0,
    ultimateCharge: 0,
    ultimateReady: false,
    character: 2,
    ultimateName: 'Red Fury',
    meleeName: 'Downslam',
    lives: 3,
    onGround: false,
    velocityX: 0,
    velocityY: 0,
    comboHits: 0,
    comboCooldown: false,
    isFalling: false,
    iFrames: false,
    visible: true
};

let gameLoopRunning = false;
const gravity = 0.5;
const gameCanvas = document.getElementById('game-canvas');
const context = gameCanvas.getContext('2d');
const vfxCanvas = document.getElementById('vfxCanvas');
const vfxContext = vfxCanvas.getContext('2d');

// Ensure canvas scales properly to fit the screen size
gameCanvas.width = window.innerWidth;
gameCanvas.height = window.innerHeight;
vfxCanvas.width = window.innerWidth;
vfxCanvas.height = window.innerHeight;

const maps = {
    map1: [
        { x: 0.1, y: 0.8, width: 0.8, height: 0.02, allowDropThrough: false },
        { x: 0.3, y: 0.68, width: 0.4, height: 0.02, allowDropThrough: true }
    ],
    map2: [
        { x: 0.2, y: 0.8, width: 0.6, height: 0.02, allowDropThrough: false },
        { x: 0.1, y: 0.68, width: 0.1, height: 0.02, allowDropThrough: true },
        { x: 0.8, y: 0.68, width: 0.1, height: 0.02, allowDropThrough: true }
    ],
    map3: [
        { x: 0.1, y: 0.8, width: 0.8, height: 0.02, allowDropThrough: false },
        { x: 0.2, y: 0.6, width: 0.6, height: 0.02, allowDropThrough: true },
        { x: 0.3, y: 0.4, width: 0.4, height: 0.02, allowDropThrough: true }
    ]
};

let showHitboxes = false;

document.getElementById('play-button').addEventListener('click', () => {
    document.getElementById('main-menu').classList.add('hidden');
    document.getElementById('character-selection').classList.remove('hidden');
});

document.getElementById('settings-button').addEventListener('click', () => {
    document.getElementById('main-menu').classList.add('hidden');
    document.getElementById('settings-menu').classList.remove('hidden');
});

document.getElementById('back-button').addEventListener('click', () => {
    document.getElementById('settings-menu').classList.add('hidden');
    document.getElementById('main-menu').classList.remove('hidden');
});

document.getElementById('toggle-hitboxes').addEventListener('change', (event) => {
    showHitboxes = event.target.checked;
});

document.querySelectorAll('.character').forEach(button => {
    button.addEventListener('click', (event) => {
        const player = event.target.dataset.player;
        if (player === '1') {
            document.getElementById('player1-selection').classList.add('hidden');
            document.getElementById('player2-selection').classList.remove('hidden');
        } else {
            document.getElementById('character-selection').classList.add('hidden');
            document.getElementById('map-selection').classList.remove('hidden');
            document.getElementById('map-selection').classList.add('flex');
        }
    });
});

// Maps loader
function drawMapPreview(map, canvasId) {
    const mapPreviewCanvas = document.getElementById(canvasId);
    const mapPreviewContext = mapPreviewCanvas.getContext('2d');

    mapPreviewContext.clearRect(0, 0, mapPreviewCanvas.width, mapPreviewCanvas.height);

    map.forEach(platform => {
        const x = platform.x * mapPreviewCanvas.width;
        const y = platform.y * mapPreviewCanvas.height;
        const width = platform.width * mapPreviewCanvas.width + 2;
        const height = platform.height * mapPreviewCanvas.height + 2;

        mapPreviewContext.fillStyle = platform.allowDropThrough ? 'rgba(0, 128, 0, 0.5)' : 'rgba(0, 128, 0, 1)';
        mapPreviewContext.fillRect(x, y, width, height);
    });
}


// Draw the map previews
drawMapPreview(maps.map1, 'map1-preview');
drawMapPreview(maps.map2, 'map2-preview');
drawMapPreview(maps.map3, 'map3-preview');

function scaleMapData(map, canvas) {
    return map.map(platform => ({
        x: platform.x * canvas.width,
        y: platform.y * canvas.height,
        width: platform.width * canvas.width,
        height: platform.height * canvas.height,
        allowDropThrough: platform.allowDropThrough
    }));
}

// Handle map selection
document.querySelectorAll('.map').forEach(button => {
    button.addEventListener('click', () => {
        const selectedMap = button.getAttribute('data-map');
        document.getElementById('map-selection').classList.add('hidden');
        document.getElementById('game').classList.remove('hidden');
        document.getElementById('map-selection').classList.remove('flex');

        // Scale the map data for the game canvas
        const scaledMap = scaleMapData(maps[selectedMap], gameCanvas);
        console.log(scaledMap)

        startGame(scaledMap);
    });
});

function startGame(selectedMap) {
    // Use the selected map data
    platforms = selectedMap;

    resetPlayer(player1);
    resetPlayer(player2);
    vfxContext.clearRect(0, 0, vfxCanvas.width, vfxCanvas.height);
    function gameLoop() {
        context.clearRect(0, 0, gameCanvas.width, gameCanvas.height);
        drawPlatforms();
        updatePlayer(player1);
        updatePlayer(player2);
        drawPlayer(context, player1);
        drawPlayer(context, player2);
        drawUI();
        checkGameOver();
        requestAnimationFrame(gameLoop);
    }

    function getOtherPlayer(currentPlayer) {
        return currentPlayer === player1 ? player2 : player1;
    }

    function updatePlayer(player) {

        // Apply gravity
        player.velocityY += gravity;
        player.y += player.velocityY;
        player.x += player.velocityX;
    
        // Check for platform collision
        checkPlatformCollision(player);
    
        // Check for ground collision
        if (player.y + player.height >= gameCanvas.height) {
            player.y = gameCanvas.height - player.height;
            player.velocityY = 0;
            player.onGround = true;
            player.knockbackActive = false; // Deactivate knockback when player hits the ground
        } else if (!player.onGround) {
            player.onGround = false;
        }
        
        // showFallVFX(player, 1000);

        // Check for falling off the plaawtform
        if (player.y > gameCanvas.height - 80 || player.x < -player.width || player.x > gameCanvas.width) {
            if (!player.isFalling) {
                player.isFalling = true; // Mark the player as falling
                player.visible = false; // Hide the player
                let otherPlayer = getOtherPlayer(player);
                showFallVFX(player, 3000); // Show VFX for 1 second
                screenShake(20, 1000);
                // player.lives -= 1;
    
                // Delay the resetPlayer call to allow the effect to show
                setTimeout(() => {
                    resetPlayer(player);
                    player.isFalling = false; // Reset the falling flag
                    player.visible = true; // Show the player again
                }, 2000); // Delay for 2 seconds (2000 milliseconds)
            }
        }
        
    
        // Update player position and ultimate charge
        if (player.ultimateCharge >= 100) {
            player.ultimateReady = true;
        }
    
        // Deactivate knockback when player hits the ground
        if (player.knockbackActive && player.onGround) {
            player.velocityX = 0;
            player.knockbackActive = false;
        }
    }

    function drawPlayer(context, player) {
        if (player.visible) {
            context.fillStyle = player.color;
            context.fillRect(player.x, player.y, player.width, player.height);
            drawUltimateBar(context, player);
            drawPercentage(context, player);
            if (showHitboxes) {
                drawHitbox(context, player);
            }
        }
    }

    function drawUltimateBar(context, player) {
        context.fillStyle = 'gray';
        context.fillRect(player.x, player.y - 10, player.width, 5);
        context.fillStyle = 'yellow';
        context.fillRect(player.x, player.y - 10, player.width * (player.ultimateCharge / 100), 5);
        if (player.ultimateCharge > 100) {
            player.ultimateCharge = 100;
        }
    }

    function drawPercentage(context, player) {
        context.fillStyle = 'white';
        context.font = '12px Arial';
        context.fillText(`${player.percentage}%`, player.x, player.y - 20);
    }

    function drawPlatforms() {
        context.fillStyle = 'green';
        platforms.forEach(platform => {
            context.fillRect(platform.x, platform.y, platform.width, platform.height);
        });
    }

    function checkPlatformCollision(player) {
        player.onGround = false;
        platforms.forEach(platform => {
            if (player.x < platform.x + platform.width &&
                player.x + player.width > platform.x &&
                player.y + player.height >= platform.y &&
                player.y + player.height <= platform.y + platform.height) { // Adjusted margin for error
                player.y = platform.y - player.height;
                player.velocityY = 0;
                player.onGround = true;
            }
        });
    }

    function drawUI() {
        context.fillStyle = 'white';
        context.font = '20px Arial';
        context.fillText(`Player 1 Lives: ${player1.lives}`, 10, 30);
        context.fillText(`Player 2 Lives: ${player2.lives}`, gameCanvas.width - 150, 30);
    }

    function checkGameOver() {
        if (player1.lives <= 0 || player2.lives <= 0) {
            const winner = player1.lives > 0 ? 'Player 1' : 'Player 2';
            alert(`${winner} wins!`);
            resetGame();
        }
    }

    function resetPlayer(player) {
        const respawnHeight = 1000; // Adjust this value to change the respawn height

        console.log("Resetting player:", player);
        if (player.character === 1) {
            player.x = platforms[0].x + 50; // Spawn Player 1 on the left side of the platform
            console.log("Player 1 position:", player.x, player.y);
        } else {
            player.x = platforms[0].x + platforms[0].width - 100; // Spawn Player 2 on the right side of the platform
            console.log("Player 2 position:", player.x, player.y);
        }

        player.y = respawnHeight;
        player.y = platforms[0].y - player.height;
        player.velocityX = 0;
        player.velocityY = 0;
        player.percentage = 0;
        player.ultimateCharge = 0;
        player.ultimateReady = false;
        player.iFrames = true; // Add invincibility on respawn
    
        // Remove invincibility after 1 second
        setTimeout(() => {
            player.iFrames = false;
        }, 1000);
    }

    function resetGame() {
        player1.lives = 3;
        player2.lives = 3;
        resetPlayer(player1);
        resetPlayer(player2);
        document.getElementById('game').classList.add('hidden');
        document.getElementById('main-menu').classList.remove('hidden');
    }

    function useUltimate(player) {
        if (player.ultimateReady) {
            function useMelee(player) {
                if (player.comboCooldown) return;
            
                if (player.character === 1) {
                    context.fillStyle = 'lightblue';
                    context.fillRect(player.x + 50, player.y, 50, 50);
                    if (checkHit(player, player2) && !player2.iFrames) {
                        player2.percentage += 10;
                        showHitVFX(player2);
                        screenShake(10, 500);
                        player.ultimateCharge += 10;
                        // Scale knockback based on percentage
                        const knockback = player2.percentage;
                        player2.velocityX = (player2.x - player.x) + knockback;
                        player2.velocityY = -5 * knockback;
                        player2.knockbackActive = true;
                    }
                } else if (player.character === 2) {
                    context.fillStyle = 'pink';
                    context.fillRect(player.x - 50, player.y, 50, 50);
                    if (checkHit(player, player1) && !player1.iFrames) {
                        player1.percentage += 10;
                        showHitVFX(player1);
                        screenShake(10, 500);
                        player.ultimateCharge += 10;
                        // Scale knockback based on percentage
                        const knockback = player1.percentage;
                        player1.velocityX = (player1.x - player.x) + knockback;
                        player1.velocityY = -5 * knockback;
                        player1.knockbackActive = true;
                    }
                }
            
                player.comboHits += 1;
                if (player.comboHits >= 4) {
                    player.comboCooldown = true;
                    setTimeout(() => {
                        player.comboHits = 0;
                        player.comboCooldown = false;
                    }, 1000);
                }
            }(player);
            player.ultimateCharge = 0;
            player.ultimateReady = false;
        }
    }

    // Update useMelee function to include scaled knockback
    function useMelee(player) {
        if (player.comboCooldown) return;
    
        if (player.character === 1) {
            context.fillStyle = 'lightblue';
            context.fillRect(player.x + 50, player.y, 50, 50);
            if (checkHit(player, player2) && !player2.iFrames) {
                player2.percentage += 10;
                showHitVFX(player2);
                screenShake(3, 500);
                player.ultimateCharge += 10;
                // Scale knockback based on percentage
                const knockback = player2.percentage * 0.01;
                player2.velocityX = (player2.x - player.x) * knockback;
                player2.velocityY = -5 * knockback;
                player2.knockbackActive = true;
            }
        } else if (player.character === 2) {
            context.fillStyle = 'pink';
            context.fillRect(player.x - 50, player.y, 50, 50);
            if (checkHit(player, player1) && !player1.iFrames) {
                player1.percentage += 10;
                showHitVFX(player1);
                screenShake(3, 500);
                player.ultimateCharge += 10;
                // Scale knockback based on percentage
                const knockback = player1.percentage * 0.01;
                player1.velocityX = (player1.x - player.x) * knockback;
                player1.velocityY = -5 * knockback;
                player1.knockbackActive = true;
            }
        }
    
        player.comboHits += 1;
        if (player.comboHits >= 4) {
            player.comboCooldown = true;
            setTimeout(() => {
                player.comboHits = 0;
                player.comboCooldown = false;
            }, 1000);
        }
    }


    function checkHit(attacker, defender) {
        return attacker.x < defender.x + defender.width &&
               attacker.x + attacker.width > defender.x &&
               attacker.y < defender.y + defender.height &&
               attacker.y + attacker.height > defender.y;
    }

    function drawHitbox(context, player) {
        context.strokeStyle = 'red';
        context.strokeRect(player.x, player.y, player.width, player.height);
    }

    document.addEventListener('keydown', (event) => {
        const key = event.key.toUpperCase();
        if (key === player1.controls.ultimate && player1.ultimateReady) {
            useUltimate(player1);
        } else if (key === player2.controls.ultimate && player2.ultimateReady) {
            useUltimate(player2);
        } else if (key === player1.controls.melee) {
            useMelee(player1);
        } else if (key === player2.controls.melee) {
            useMelee(player2);
        }
        handleMovement(key, player1);
        handleMovement(key, player2);
    });

    document.addEventListener('keyup', (event) => {
        const key = event.key.toUpperCase();
        if (key === player1.controls.left || key === player1.controls.right) {
            player1.velocityX = 0;
        } else if (key === player2.controls.left || key === player2.controls.right) {
            player2.velocityX = 0;
        }
    });

    function handleMovement(key, player) {
        switch (key) {
            case player.controls.up:
                if (player.onGround) {
                    player.velocityY = -15;
                    player.onGround = false;
                }
                break;
            case player.controls.left:
                player.velocityX = -5;
                break;
            case player.controls.down:
                // Check if the player is on a platform that allows drop through
                const currentPlatform = platforms.find(platform => 
                    player.x < platform.x + platform.width &&
                    player.x + player.width > platform.x &&
                    player.y + player.height >= platform.y &&
                    player.y + player.height <= platform.y + platform.height
                );
    
                if (currentPlatform && currentPlatform.allowDropThrough) {
                    player.y += 35;
                    // player.onGround = false
                }
                break;
            case player.controls.right:
                player.velocityX = 5;
                break;
        }
    }

    function showUltimateEffect(player) {
    if (player.character === 1) {
        // Character 1 ultimate effect (cutscene)
        context.fillStyle = 'blue';
        context.fillRect(player.x - 50, player.y - 50, 150, 150);
        // Add cutscene logic here
    } else if (player.character === 2) {
        // Character 2 ultimate effect (long-range attack)
        context.fillStyle = 'red';
        context.fillRect(player.x - 50, player.y - 50, 150, 150);
        // Add long-range attack logic here
    }
    setTimeout(() => {
        context.clearRect(player.x - 50, player.y - 50, 150, 150);
        drawPlayer(context, player); // Redraw the player to fix the clearing issue
    }, 500);
}

// VFX for when a player gets hit
function showHitVFX(player) {
    const playerColor = player.color
    player.color = 'white';
    // context.fillRect(player.x, player.y, player.width, player.height);
    setTimeout(() => {
        // context.clearRect(player.x, player.y, player.width, player.height);
        player.color = playerColor;
        drawPlayer(context, player); // Redraw the player to fix the clearing issue
    }, 100);
}

function showFallVFX(player, duration = 1000) {
    console.log("Showing fall VFX for player:", player);

    const colors = ['red', 'blue', 'green', 'yellow', 'purple'];
    const beams = 20;
    const maxBeamHeight = 3000;
    const minBeamHeight = 500;
    const beamWidth = 10;

    const playerX = player.x;
    const playerY = player.y;
    const playerWidth = player.width;
    const playerHeight = player.height;

    let startX, startY;
    if (playerX < 0) {
        startX = 0;
        startY = playerY + playerHeight / 2;
    } else if (playerX + playerWidth > gameCanvas.width) {
        startX = gameCanvas.width;
        startY = playerY + playerHeight / 2;
    } else if (playerY > gameCanvas.height) {
        startX = playerX + playerWidth / 2;
        startY = gameCanvas.height;
    } else {
        startX = playerX + playerWidth / 2;
        startY = playerY + playerHeight / 2;
    }

    const beamsData = [];
    for (let i = 0; i < beams; i++) {
        beamsData.push({
            color: colors[i % colors.length],
            height: Math.random() * (maxBeamHeight - minBeamHeight) + minBeamHeight,
            offsetX: (Math.random() - 0.5) * playerWidth * 2,
            offsetY: (Math.random() - 0.5) * playerHeight,
            startHeight: Math.random() * (gameCanvas.height / 2 - 1000), // Random starting height
            progress: 0,
            opacity: 1
        });
    }

    function animateBeams(timestamp) {
        vfxContext.clearRect(0, 0, vfxCanvas.width, vfxCanvas.height);

        beamsData.forEach(beam => {
            beam.progress += 0.03; // Adjust the speed of the rise
            beam.opacity = 1.1 - beam.progress;

            const x = Math.max(0, Math.min(vfxCanvas.width, startX + beam.offsetX));
            const y = Math.max(0, Math.min(vfxCanvas.height, startY - beam.startHeight - beam.progress * (gameCanvas.height / 2) + beam.offsetY));

            vfxContext.fillStyle = beam.color;
            vfxContext.globalAlpha = beam.opacity;
            vfxContext.fillRect(x, y, beamWidth, beam.height);
        });

        if (beamsData.some(beam => beam.progress < 1)) {
            requestAnimationFrame(animateBeams);
        } else {
            vfxContext.clearRect(0, 0, vfxCanvas.width, vfxCanvas.height);
            console.log("Clearing fall VFX for player:", player);
        }
    }

    requestAnimationFrame(animateBeams);
}


    if (!gameLoopRunning) {
        gameLoopRunning = true;
        gameLoop();
    }
}

// Screen shake function
function screenShake(intensity, duration) {
    const originalStyle = gameCanvas.style.transform;
    let startTime = Date.now();

    function shake() {
        const elapsed = Date.now() - startTime;
        if (elapsed < duration) {
            const x = (Math.random() - 0.5) * intensity;
            const y = (Math.random() - 0.5) * intensity;
            gameCanvas.style.transform = `translate(${x}px, ${y}px)`;
            requestAnimationFrame(shake);
        } else {
            gameCanvas.style.transform = originalStyle;
        }
    }

    shake();
}

document.getElementById('player1-controls').addEventListener('input', (event) => {
    const controls = event.target.value.toUpperCase().split('');
    player1.controls = { up: controls[0], left: controls[1], down: controls[2], right: controls[3], ultimate: player1.controls.ultimate, melee: player1.controls.melee };
    document.getElementById('player1-ultimate-key').textContent = player1.controls.ultimate;
    document.getElementById('player1-melee-key').textContent = player1.controls.melee;
});

document.getElementById('player1-ultimate').addEventListener('input', (event) => {
    player1.controls.ultimate = event.target.value.toUpperCase();
    document.getElementById('player1-ultimate-key').textContent = player1.controls.ultimate;
});

document.getElementById('player1-melee').addEventListener('input', (event) => {
    player1.controls.melee = event.target.value.toUpperCase();
    document.getElementById('player1-melee-key').textContent = player1.controls.melee;
});

document.getElementById('player2-controls').addEventListener('input', (event) => {
    const controls = event.target.value.toUpperCase().split('');
    player2.controls = { up: controls[0], left: controls[1], down: controls[2], right: controls[3], ultimate: player2.controls.ultimate, melee: player2.controls.melee };
    document.getElementById('player2-ultimate-key').textContent = player2.controls.ultimate;
    document.getElementById('player2-melee-key').textContent = player2.controls.melee;
});

document.getElementById('player2-ultimate').addEventListener('input', (event) => {
    player2.controls.ultimate = event.target.value.toUpperCase();
    document.getElementById('player2-ultimate-key').textContent = player2.controls.ultimate;
});

document.getElementById('player2-melee').addEventListener('input', (event) => {
    player2.controls.melee = event.target.value.toUpperCase();
    document.getElementById('player2-melee-key').textContent = player2.controls.melee;
});