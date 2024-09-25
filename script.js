let player1 = {
    x: 650,
    y: 400,
    width: 50,
    height: 50,
    color: '', // Will be updated based on selected character
    controls: {
        up: 'W',
        left: 'A',
        down: 'S',
        right: 'D',
        ultimate: 'Q',
        melee: 'E'
    },
    percentage: 0,
    knockbackTime: 0,
    ultimateCharge: 0,
    ultimateReady: false,
    character: 0, // Will be updated based on selected character
    ultimateName: '', // Will be updated based on selected character
    meleeName: '', // Will be updated based on selected character
    lives: 3,
    onGround: false,
    velocityX: 0,
    velocityY: 0,
    weight: 10,
    comboHits: 0,
    comboCooldown: false,
    isFalling: false,
    iFrames: false,
    visible: true,
    ignoreCollisions: false,
    disableControls: false,
    ignoreGravity: false
};

let player2 = {
    x: 650,
    y: 400,
    width: 50,
    height: 50,
    color: '', // Will be updated based on selected character
    controls: {
        up: 'I',
        left: 'J',
        down: 'K',
        right: 'L',
        ultimate: 'U',
        melee: 'O'
    },
    percentage: 0,
    knockbackTime: 0,
    ultimateCharge: 0,
    ultimateReady: false,
    character: 0, // Will be updated based on selected character
    ultimateName: '', // Will be updated based on selected character
    meleeName: '', // Will be updated based on selected character
    lives: 3,
    onGround: false,
    velocityX: 0,
    velocityY: 0,
    weight: 10,
    comboHits: 0,
    comboCooldown: false,
    isFalling: false,
    iFrames: false,
    visible: true,
    ignoreCollisions: false,
    disableControls: false,
    ignoreGravity: false
};

const camera = {
    x: 0,
    y: 0,
    zoom: 1
};

let gameLoopRunning = false;
const gravity = 0.5;
const friction = 0.9;
const gameCanvas = document.getElementById('game-canvas');
const context = gameCanvas.getContext('2d');
const vfxCanvas = document.getElementById('vfxCanvas');
const vfxContext = vfxCanvas.getContext('2d');

// Ensure canvas scales properly to fit the screen size
gameCanvas.width = window.innerWidth;
gameCanvas.height = window.innerHeight;
vfxCanvas.width = window.innerWidth;
vfxCanvas.height = window.innerHeight;

function updateCanvasSize(canvas) {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight; // Increase the height to allow more falling space
}


// const backgroundLayers = [
//     { image: new Image(), speed: 0.2, x: 0 },
//     { image: new Image(), speed: 0.5, x: 0 },
//     { image: new Image(), speed: 1.0, x: 0 }
// ];

// backgroundLayers[0].image.src = 'path/to/background1.png';
// backgroundLayers[1].image.src = 'path/to/background2.png';
// backgroundLayers[2].image.src = 'path/to/background3.png';

const maps = {
    map1: [
        { x: 0.1, y: 0.8, width: 0.8, height: 0.02, allowDropThrough: false },
        { x: 0.3, y: 0.68, width: 0.4, height: 0.02, allowDropThrough: true },
        { maxDistanceThreshold: 3000, minZoom: 0.5, maxZoom: 1.5 },
        { backgroundImage: 'images/BackgroundImages/vicente-nitti-glacialmountains-pfv.jpg', speed: 0.1}
    ],
    map2: [
        { x: 0.2, y: 0.8, width: 0.6, height: 0.02, allowDropThrough: false },
        { x: 0.1, y: 0.68, width: 0.1, height: 0.02, allowDropThrough: true },
        { x: 0.8, y: 0.68, width: 0.1, height: 0.02, allowDropThrough: true },
        { maxDistanceThreshold: 2500, minZoom: 0.6, maxZoom: 1.4 },
        { backgroundImage: 'images/BackgroundImages/vicente-nitti-glacialmountains-pfv.jpg', speed: 0.1}
    ],
    map3: [
        { x: 0.1, y: 0.8, width: 0.8, height: 0.02, allowDropThrough: false },
        { x: 0.2, y: 0.65, width: 0.6, height: 0.02, allowDropThrough: true },
        { x: 0.3, y: 0.55, width: 0.4, height: 0.02, allowDropThrough: true },
        { maxDistanceThreshold: 100, minZoom: 0.7, maxZoom: 1.3 },
        { backgroundImage: 'images/BackgroundImages/vicente-nitti-glacialmountains-pfv.jpg', speed: 0.1}
    ]
};

const characters = [
    {
        id: 1,
        name: 'Red Guy',
        color: 'rgb(159, 13, 15)',
        ultimateName: 'Red Fury',
        ultimateDescription: 'A furious red attack.',
        abilityName: 'Uppercut',
        abilityDescription: 'A strong upward punch.'
    },
    {
        id: 2,
        name: 'Blue Guy',
        color: 'rgb(1, 55, 250)',
        ultimateName: 'Blue Blast',
        ultimateDescription: 'A powerful blast of blue energy.',
        abilityName: 'Downslam',
        abilityDescription: 'A powerful downward slam.'
    },
    // Add more characters here
];

let showHitboxes = false;
let showImpactFrames = true;
let CameraEnabled = true;

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

document.getElementById('toggle-impactframes').addEventListener('change', (event) => {
    showImpactFrames = event.target.checked;
});

function updatePlayerPreview(player, characterId) {
    const character = characters.find(char => char.id === characterId);
    const previewId = `player${player}-preview`;
    const canvasId = `player${player}-canvas`;
    const nameId = `player${player}-name`;
    const ultimateId = `player${player}-ultimateName`;
    const ultimateDescriptionId = `player${player}-ultimate-description`;
    const abilityId = `player${player}-ability`;
    const abilityDescriptionId = `player${player}-ability-description`;

    // Update player preview
    document.getElementById(previewId).classList.remove('hidden');
    const canvas = document.getElementById(canvasId);
    const context = canvas.getContext('2d');
    context.clearRect(0, 0, canvas.width, canvas.height); // Clear previous drawing
    context.fillStyle = character.color;
    context.fillRect(0, 0, canvas.width, canvas.height);
    document.getElementById(nameId).textContent = character.name;
    document.getElementById(ultimateId).textContent = character.ultimateName;
    document.getElementById(ultimateDescriptionId).textContent = character.ultimateDescription;
    document.getElementById(abilityId).textContent = character.abilityName;
    document.getElementById(abilityDescriptionId).textContent = character.abilityDescription;
}

// Initialize previews for all characters
document.querySelectorAll('.character').forEach(button => {
    const player = button.dataset.player;
    const characterId = parseInt(button.dataset.character);
    updatePlayerPreview(player, characterId);
    
    button.addEventListener('mouseover', (event) => {
        const player = event.target.dataset.player;
        const characterId = parseInt(event.target.dataset.character);
        updatePlayerPreview(player, characterId);
    });

    button.addEventListener('click', (event) => {
        const player = event.target.dataset.player;
        const characterId = parseInt(event.target.dataset.character);
        const character = characters.find(char => char.id === characterId);

        // Update player properties
        if (player === '1') {
            player1.color = character.color;
            player1.character = character.id;
            player1.ultimateName = character.ultimateName;
            player1.meleeName = character.abilityName;
            document.getElementById('player1-selection').classList.add('hidden');
            document.getElementById('player2-selection').classList.remove('hidden');
        } else {
            player2.color = character.color;
            player2.character = character.id;
            player2.ultimateName = character.ultimateName;
            player2.meleeName = character.abilityName;

            // Check if both players have the same character and adjust Player 2's color
            if (player1.character === player2.character) {
                // player2.color = lightenColor(player2.color, 20); // Lighten color by 20%
            }

            document.getElementById('character-selection').classList.add('hidden');
            document.getElementById('map-selection').classList.remove('hidden');
            document.getElementById('map-selection').classList.add('flex');
        }
    });
});

function lightenColor(color, percent) {
    col = parseInt(color, 16);
    return (((col & 0x0000FF) + percent) | ((((col >> 8) & 0x00FF) + percent) << 8) | (((col >> 16) + percent) << 16)).toString(16);
}


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

function updateBackground(currentMap) {
    const mapSettings = maps[currentMap];
    if (!mapSettings) {
        console.error(`Invalid map: ${currentMap}`);
        return;
    }
    const background = mapSettings.find(item => item.backgroundImage !== undefined);
    if (background) {
        background.x -= (player1.velocityX + player2.velocityX) / 2 * background.speed;
        if (background.x <= -gameCanvas.width) {
            background.x = 0;
        }
    }
}

function drawBackground(context, currentMap) {
    const mapSettings = maps[currentMap];
    if (!mapSettings) {
        console.error(`Invalid map: ${currentMap}`);
        return;
    }
    const background = mapSettings.find(item => item.backgroundImage !== undefined);
    if (background) {
        const image = new Image();
        image.src = background.backgroundImage;
        context.drawImage(image, background.x, 0, gameCanvas.width, gameCanvas.height);
        context.drawImage(image, background.x + gameCanvas.width, 0, gameCanvas.width, gameCanvas.height);
    }
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

        startGame(selectedMap); // Pass the string key directly
    });
});


///Camera Work///
function calculateMidpoint(players) {
    let sumX = 0, sumY = 0;
    players.forEach(player => {
        sumX += player.x;
        sumY += player.y;
    });
    return { x: sumX / players.length, y: sumY / players.length };
}

function calculateMaxDistance(players) {
    let maxDistance = 0;
    for (let i = 0; i < players.length; i++) {
        for (let j = i + 1; j < players.length; j++) {
            const distance = Math.sqrt(Math.pow(players[j].x - players[i].x, 2) + Math.pow(players[j].y - players[i].y, 2));
            if (distance > maxDistance) {
                maxDistance = distance;
            }
        }
    }
    return maxDistance;
}

function lerp(start, end, t) {
    return start + (end - start) * t;
}

const cameraFixedPostions = calculateMidpoint([player1, player2]);

function updateCamera(camera, players, canvas, selectedMap) {
    const midpoint = calculateMidpoint(players);
    const maxDistance = calculateMaxDistance(players);

    // Default settings
    let maxDistanceThreshold = 3000;
    let minZoom = 0.5;
    let maxZoom = 1.5;

    // Update camera settings based on the selected map
    const mapSettings = maps[selectedMap];
    if (mapSettings) {
        const settings = mapSettings.find(item => item.maxDistanceThreshold !== undefined);
        if (settings) {
            maxDistanceThreshold = settings.maxDistanceThreshold;
            minZoom = settings.minZoom;
            maxZoom = settings.maxZoom;
        }

        const targetZoom = maxZoom - (maxDistance / maxDistanceThreshold) * (maxZoom - minZoom);

        // Smoothly transition camera position
        if (CameraEnabled) {
            camera.x = lerp(camera.x, midpoint.x, 0.1);
            camera.y = lerp(camera.y, midpoint.y, 0.1);
            camera.zoom = lerp(camera.zoom, Math.max(minZoom, Math.min(maxZoom, targetZoom)), 0.1);
        } else {
            console.log(cameraFixedPostions.y);
            camera.x = cameraFixedPostions.x * 2;
            camera.y = cameraFixedPostions.y * 2;
            camera.zoom = 1;
        }
    }
}


function startGame(selectedMap) {
    // Use the selected map data
    if (typeof selectedMap !== 'string' || !maps[selectedMap].some(item => item.backgroundImage)) {
        console.error(`Invalid map: ${selectedMap}`);
        return;
    }

    const scaledMap = scaleMapData(maps[selectedMap], gameCanvas);
    platforms = scaledMap;


    resetPlayer(player1);
    resetPlayer(player2);
    vfxContext.clearRect(0, 0, vfxCanvas.width, vfxCanvas.height);

    updateBackground(selectedMap);
    function gameLoop() {
        // updateCanvasSize(camera, gameCanvas);
        // updateCanvasSize(camera, vfxCanvas);
        context.clearRect(0, 0, gameCanvas.width, gameCanvas.height);

        // updateBackground(selectedMap);
        drawBackground(context, selectedMap);

        updateCamera(camera, [player1, player2], gameCanvas, selectedMap);
        
        drawPlatforms();
        updatePlayer(player1);
        updatePlayer(player2);
        drawPlayer(context, player1);
        drawPlayer(context, player2);
        drawUI();
        checkGameOver();
        
        requestAnimationFrame(gameLoop);
    }

    function updatePlayer(player) {
        
        // Apply gravity
        if (!player.ignoreGravity) {
            player.velocityY += gravity;
        }
        player.y += player.velocityY;
        player.x += player.velocityX;

        // // Apply friction
        // player.velocityX *= 0.95;
        // player.velocityY *= 0.95;
    
        // Check for platform collision
        if (player.ignoreCollisions = true) {
            checkPlatformCollision(player);
        }   
    
        // Check for ground collision
        if (player.y + player.height >= gameCanvas.height + 600) {
            player.y = gameCanvas.height + 600 - player.height;
            player.velocityY = 0;
            player.velocityX = 0;
            player.onGround = true;
            player.knockbackActive = false; // Deactivate knockback when player hits the ground
        } else if (!player.onGround) {
            player.onGround = false;
        }

        // Check for falling off the platform
        if (player.y + player.height >= gameCanvas.height + 600 || 
            player.x < -player.width - camera.x || 
            player.x > gameCanvas.width + camera.x) {
            if (!player.isFalling) {
                player.isFalling = true; // Mark the player as falling
                player.visible = false; // Hide the player
                player.disableControls = true;
                let otherPlayer = player === player2 ? player1 : player2;;
                showFallVFX(player, 3000); // Show VFX for 1 second
                applyImpactFrames(player, otherPlayer, platforms, context, 100) 
                screenShake(20, 200);
                // player.lives -= 3;
    
                // Delay the resetPlayer call to allow the effect to show
                setTimeout(() => {
                    resetPlayer(player);
                    player.isFalling = false; // Reset the falling flag
                    player.visible = true; // Show the player again
                    player.disableControls = false;
                }, 2000); // Delay for 2 seconds (2000 milliseconds)
            }
        }

        // if (player.knockbackActive) {
        //     // smokeTrailVFX(player, 300, 100, 6);
        // }
    
        // Update player position and ultimate charge
        if (player.ultimateCharge >= 100) {
            player.ultimateReady = true;
        }
        
        // Deactivate knockback when player hits the ground
        if (player.knockbackActive && player.onGround) {
            player.velocityX *= friction;
            if (Math.abs(player.velocityX) < 0.1) { // Threshold to stop the player
                player.velocityX = 0;
                player.knockbackActive = false;
                player.disableControls = false;
            }
        }
    }

    function drawPlayer(context, player) {
        if (player.visible) {
            // Adjust player position based on the camera
            const adjustedX = (player.x - camera.x) * camera.zoom + gameCanvas.width / 2;
            const adjustedY = (player.y - camera.y) * camera.zoom + gameCanvas.height / 2;
            const adjustedWidth = player.width * camera.zoom;
            const adjustedHeight = player.height * camera.zoom;
    
            context.fillStyle = player.color;
            context.fillRect(adjustedX, adjustedY, adjustedWidth, adjustedHeight);
            drawUltimateBar(context, player);
            drawPercentage(context, player);
            if (showHitboxes) {
                drawHitbox(context, player);
            }
        }
    }

    function drawUltimateBar(context, player) {
        // Adjust position based on the camera
        const adjustedX = (player.x - camera.x) * camera.zoom + gameCanvas.width / 2;
        const adjustedY = (player.y - camera.y) * camera.zoom + gameCanvas.height / 2;
        const adjustedWidth = player.width * camera.zoom;

        context.fillStyle = 'gray';
        context.fillRect(adjustedX, adjustedY - 10 * camera.zoom, adjustedWidth, 5 * camera.zoom);
        context.fillStyle = 'yellow';
        context.fillRect(adjustedX, adjustedY - 10 * camera.zoom, adjustedWidth * (player.ultimateCharge / 100), 5 * camera.zoom);
        if (player.ultimateCharge > 100) {
            player.ultimateCharge = 100;
        }
    }

    function drawPercentage(context, player) {
        // Adjust position based on the camera
        const adjustedX = (player.x - camera.x) * camera.zoom + gameCanvas.width / 2;
        const adjustedY = (player.y - camera.y) * camera.zoom + gameCanvas.height / 2;
    
        context.fillStyle = 'white';
        context.font = `${12 * camera.zoom}px Arial`;
        context.fillText(`${player.percentage}%`, adjustedX, adjustedY - 20 * camera.zoom);
    }

    function drawPlatforms() {
        platforms.forEach(platform => {
            // Adjust platform position based on the camera
            const adjustedX = (platform.x - camera.x) * camera.zoom + gameCanvas.width / 2;
            const adjustedY = (platform.y - camera.y) * camera.zoom + gameCanvas.height / 2;
            const adjustedWidth = platform.width * camera.zoom;
            const adjustedHeight = platform.height * camera.zoom;
    
            context.fillStyle = platform.color || 'green';
            context.fillRect(adjustedX, adjustedY, adjustedWidth, adjustedHeight);
        });
    }
    

    function checkPlatformCollision(player) {
        player.onGround = false;
        platforms.forEach(platform => {
            if (player.x < platform.x + platform.width &&
                player.x + player.width > platform.x &&
                player.y + player.height >= platform.y &&
                player.y + player.height <= platform.y + platform.height &&
                player.velocityY >= 0) { // Ensure the player is falling down onto the platform
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
            document.getElementById('winner-message').textContent = `${winner} wins!`;
            document.getElementById('winner-screen').classList.remove('hidden');
            player1.disableControls = true;
            player2.disableControls = true;
        }
    }
    
    document.getElementById('restart-button').addEventListener('click', function() {
        document.getElementById('winner-screen').classList.add('hidden');
        resetGame();
    });

    function resetPlayer(player) {
        const respawnHeight = 1000; // Adjust this value to change the respawn height
    
        console.log("Resetting player:", player);
        if (player === player1) {
            player.x = platforms[0].x + 50; // Spawn Player 1 on the left side of the platform
            console.log("Player 1 position:", player.x, player.y);
        } else if (player === player2) {
            player.x = platforms[0].x + platforms[0].width - 100; // Spawn Player 2 on the right side of the platform
            console.log("Player 2 position:", player.x, player.y);
        }
    
        player.y = respawnHeight;
        player.y = platforms[0].y - player.height;
        player.velocityX = 0;
        player.velocityY = 0;
        player.percentage = 0;
        player.ultimateCharge = 0;
        player.ultimateReady = true;
        player.iFrames = true; // Add invincibility on respawn
        player.disableControls = false;
    
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
        
        // Hide the game screen and character selection screen, show the main menu
        document.getElementById('game').classList.add('hidden');
        document.getElementById('main-menu').classList.remove('hidden');
        document.getElementById('character-selection').classList.add('hidden');
        document.getElementById('map-selection').classList.add('hidden');
        document.getElementById('map-selection').classList.remove('flex');
        
        // Reset character selection visibility
        document.getElementById('player1-selection').classList.remove('hidden');
        document.getElementById('player2-selection').classList.add('hidden');
    }
    
    function useUltimate(player) {
        if (player.ultimateReady) {
            const opponent = player === player1 ? player2 : player1;
    
            switch (player.character) {
                case 1: // Red Fury's Ultimate
                    context.fillStyle = 'maroon';
                    context.fillRect(player.x + 50, player.y, 100, 100); // Larger hitbox for ultimate
                    if (checkHit(player, opponent) && !opponent.iFrames) {
                        playCutscene(player, opponent);
                    }
                    break;
                case 2: // Blue Blast's Ultimate
                    shootLaserBeam(player, opponent);
                    break;
                // Add more cases for additional characters
                default:
                    console.log('Unknown character ultimate');
            }
    
            // player.ultimateCharge = 0;
            // player.ultimateReady = false;
        }
    }
    

    // Update useMelee function to include scaled knockback
    function useMelee(player) {
        if (player.comboCooldown) return;

        const opponent = player === player1 ? player2 : player1;
        const hitboxColor = player.character === 1 ? 'lightblue' : 'pink';
        const hitboxOffset = player.character === 1 ? 50 : -50;

        context.fillStyle = hitboxColor;
        context.fillRect(player.x + hitboxOffset, player.y, 50, 50);

        if (checkHit(player, opponent) && !opponent.iFrames) {
            applyDamage(opponent, 10);
            showHitVFX(opponent);
            screenShake(3, 500);
            player.ultimateCharge += 10;
            // Scale knockback based on percentage
            applyKnockback(player, opponent);
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

    function applyDamage(player, amount) {
        player.percentage += amount;
    }

    function applyKnockback(player, opponent) {
        const knockback = opponent.percentage * 0.01;
        opponent.velocityX = (opponent.x - player.x) * knockback;
        opponent.velocityY = -5 * (opponent.x - player.x) * knockback;
        opponent.knockbackActive = true;
        opponent.disableControls = true;
        opponent.knockbackTime = knockback;
    }
    


    function checkHit(attacker, defender) {
        return attacker.x < defender.x + defender.width &&
               attacker.x + attacker.width > defender.x &&
               attacker.y < defender.y + defender.height &&
               attacker.y + attacker.height > defender.y;
    }

    function drawHitbox(context, player) {
        // Adjust position based on the camera
        const adjustedX = (player.x - camera.x) * camera.zoom + gameCanvas.width / 2;
        const adjustedY = (player.y - camera.y) * camera.zoom + gameCanvas.height / 2;
        const adjustedWidth = player.width * camera.zoom;
        const adjustedHeight = player.height * camera.zoom;
    
        context.strokeStyle = 'red';
        context.strokeRect(adjustedX, adjustedY, adjustedWidth, adjustedHeight);
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
        if (!player.disableControls) {
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

    function applyImpactFrames(player, opponent, platforms, context, duration = 100, switchInterval = 50) {
        if (showImpactFrames) {
            console.log("Applying impact frames");
    
            // Save original styles
            const originalPlayerColor = player.color;
            const originalOpponentColor = opponent.color;
            const originalPlatformColors = platforms.map(platform => platform.color);
            const originalGameCanvasStyle = gameCanvas.style.backgroundColor;
    
            let startTime = Date.now();
    
            function switchColors() {
                const elapsed = Date.now() - startTime;
                if (elapsed < duration) {
                    const isBlack = Math.floor(elapsed / switchInterval) % 2 === 0; // Switch colors based on switchInterval
                    const color = isBlack ? 'black' : 'white';
                    const bgColor = isBlack ? 'white' : 'black';
    
                    player.color = color;
                    opponent.color = color;
                    platforms.forEach(platform => platform.color = color);
                    gameCanvas.style.backgroundColor = bgColor;
    
                    // Draw a black and white overlay
                    context.fillStyle = bgColor;
                    context.fillRect(0, 0, gameCanvas.width, gameCanvas.height);
    
                    requestAnimationFrame(switchColors);
                } else {
                    // Restore original styles after duration
                    player.color = originalPlayerColor;
                    opponent.color = originalOpponentColor;
                    platforms.forEach((platform, index) => platform.color = originalPlatformColors[index]);
                    gameCanvas.style.backgroundColor = originalGameCanvasStyle;
                    console.log("Impact frames ended");
                }
            }
    
            switchColors();
        }
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
            console.log("bottom");
        } else if (playerX + playerWidth > gameCanvas.width) {
            startX = gameCanvas.width;
            startY = playerY + playerHeight / 2;
            console.log("left");
        } else {
            startX = playerX + playerWidth / 2;
            startY = playerY + playerHeight / 2;
            console.log("bottom");
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
    
                const x = (startX + beam.offsetX - camera.x) * camera.zoom + vfxCanvas.width / 2;
                const y = (startY - beam.startHeight - beam.progress * (gameCanvas.height / 2) + beam.offsetY - camera.y) * camera.zoom + vfxCanvas.height / 2;
    
                vfxContext.fillStyle = beam.color;
                vfxContext.globalAlpha = beam.opacity;
                vfxContext.fillRect(x, y, beamWidth * camera.zoom, beam.height * camera.zoom);
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
    

    function shootLaserBeam(player, opponent) {
        // Make the player jump up in the air and hover
        player.velocityY = -20;
        player.ignoreCollisions = true;
        setTimeout(() => {
            player.ignoreCollisions = true;
    
            // Visualize the charge-up phase
            const chargeDuration = 1000; // Duration of the charge-up
            const chargeColor = 'blue';
            const chargeRadius = 20;
            const startX = player.x + player.width / 2;
            const startY = player.y + player.height / 2;
    
            let chargeProgress = 0;
    
            function animateCharge(timestamp) {
                vfxContext.clearRect(0, 0, vfxCanvas.width, vfxCanvas.height);
    
                player.velocityY = -gravity; // Hover in the air
                player.velocityX = 0;

                chargeProgress += 0.02; // Adjust the speed of the charge-up
                const currentRadius = chargeRadius + chargeProgress * 50;
    
                vfxContext.fillStyle = chargeColor;
                vfxContext.globalAlpha = 0.5 + 0.5 * Math.sin(chargeProgress * Math.PI); // Pulsating effect
                vfxContext.beginPath();
                vfxContext.arc(startX, startY, currentRadius, 0, 2 * Math.PI);
                vfxContext.fill();
    
                if (chargeProgress < 1) {
                    requestAnimationFrame(animateCharge);
                } else {
                    // Clear the charge-up effect
                    vfxContext.clearRect(0, 0, vfxCanvas.width, vfxCanvas.height);
    
                    // Shoot the laser beam
                    shootLaser();
                }
            }
    
            function shootLaser() {
                // Shoot a blue laser beam directly at the opponent
                const laserDuration = 1000; // Duration of the laser
                const laserWidth = 50;
                const laserColor = 'blue';
                const endX = opponent.x + opponent.width / 2;
                const endY = opponent.y + opponent.height / 2;
    
                let laserProgress = 0;
                let laserOpacity = 1;

                screenShake(30, 300)
                applyImpactFrames(player, opponent, platforms, 200) 
    
                function animateLaser(timestamp) {
                    vfxContext.clearRect(0, 0, vfxCanvas.width, vfxCanvas.height);

                    player.velocityY = -gravity; // Hover in the air
                    player.velocityX = 0;
    
                    laserProgress += 0.02; // Adjust the speed of the laser
                    const currentX = startX + (endX - startX) * laserProgress;
                    const currentY = startY + (endY - startY) * laserProgress;
    
                    vfxContext.strokeStyle = laserColor;
                    vfxContext.lineWidth = laserWidth;
                    vfxContext.globalAlpha = laserOpacity;
                    vfxContext.beginPath();
                    vfxContext.moveTo(startX, startY);
                    vfxContext.lineTo(currentX, currentY);
                    vfxContext.stroke();
    
                    if (laserProgress < 1) {
                        requestAnimationFrame(animateLaser);
                    } else {
                        // Start fading out the laser
                        const fadeDuration = 500; // Duration of the fade out
                        const fadeStep = 0.02; // Step for each frame
    
                        function fadeLaser() {
                            vfxContext.clearRect(0, 0, vfxCanvas.width, vfxCanvas.height);
                            laserOpacity -= fadeStep;
                            if (laserOpacity > 0) {
                                vfxContext.strokeStyle = laserColor;
                                vfxContext.lineWidth = laserWidth;
                                vfxContext.globalAlpha = laserOpacity;
                                vfxContext.beginPath();
                                vfxContext.moveTo(startX, startY);
                                vfxContext.lineTo(endX, endY);
                                vfxContext.stroke();
                                requestAnimationFrame(fadeLaser);
                            } else {
                                vfxContext.clearRect(0, 0, vfxCanvas.width, vfxCanvas.height);
                                console.log("Clearing laser beam VFX for player:", player);
                            }
                        }
    
                        fadeLaser();
                    }
                }
    
                requestAnimationFrame(animateLaser);
    
                // Check for hit during the laser
                setTimeout(() => {
                    if (checkHit(player, opponent)) {
                        applyDamage(opponent, 30); // Higher damage for ultimate
                        showHitVFX(opponent);
                        screenShake(5, 500);
                        // Scale knockback based on percentage
                        const knockback = opponent.percentage * 0.05;
                        opponent.velocityX = (opponent.x - player.x) * knockback;
                        opponent.velocityY = -10 * knockback;
                        opponent.knockbackActive = true;
                    }
                    player.ignoreCollisions = false; // End hover
                }, laserDuration);
            }
    
            requestAnimationFrame(animateCharge);
        }, 200); // Delay to simulate the jump
    }

    function playCutscene(player, opponent) {
        console.log("Playing cutscene for player:", player);
    
        // Example cutscene logic
        let cutsceneDuration = 3000; // 3 seconds
    
        // Freeze players during cutscene
        player.disableControls = true;
        opponent.disableControls = true;
        console.log(player.character);
        
        if (player.character === 1) {
            cutsceneDuration = 3500;
            opponent.velocityY = -25;
            setTimeout(() => {              
                opponent.velocityY = 0;
                opponent.ignoreGravity = true;
                setTimeout(() => {              
                    vfxContext.fillStyle = 'black';
                    vfxContext.fillRect(0, 0, vfxCanvas.width, vfxCanvas.height);
                    vfxContext.fillStyle = 'white';
                    vfxContext.font = '30px Arial';
                    vfxContext.fillText('Red Fury Ultimate.', vfxCanvas.width / 2 - 100, vfxCanvas.height / 2);
                    setTimeout(() => {              
                        vfxContext.clearRect(0, 0, vfxCanvas.width, vfxCanvas.height);
                        player.velocityY = -24;
                        setTimeout(() => {      
                            player.velocityY = 0;
                            player.ignoreGravity = true;
                            setTimeout(() => {      
                                vfxContext.fillStyle = 'black';
                                vfxContext.fillRect(0, 0, vfxCanvas.width, vfxCanvas.height);
                                vfxContext.fillStyle = 'white';
                                // vfxContext.globalCompositeOperation = 'difference';
                                vfxContext.fillRect(0, 0, vfxCanvas.width, vfxCanvas.height);
                                // vfxContext.globalCompositeOperation = 'source-over';
                                vfxContext.fillStyle = 'red';
                                vfxContext.font = '50px Arial';
                                vfxContext.fillText('Red Fury', vfxCanvas.width / 2 - 100, vfxCanvas.height / 2);
                                setTimeout(() => {
                                    // applyImpactFrames(player, opponent, platforms, 100, 50);
                                    screenShake(30, 200);
                                    fireworkHitVfx(opponent, 100, 500);
                                    opponent.ignoreGravity = false;
                                    opponent.velocityY = -5;
                                    opponent.velocityX = (opponent.x - player.x) / 3
                                    setTimeout(() => {
                                        vfxContext.clearRect(0, 0, vfxCanvas.width, vfxCanvas.height);
                                        player.disableControls = false;
                                        opponent.disableControls = false;
                                        player.ignoreGravity = false;    
                                        opponent.ignoreGravity = false;
                                        opponent.velocityX = 0;
                                        // Reset globalCompositeOperation to default
                                        // vfxContext.globalCompositeOperation = 'source-over';
                                        console.log("Cutscene ended for player:", player);
                                    }, 200);
                                }, 1000);
                            }, 200);
                        }, 300);
                    }, 1000);
                }, 300);
            }, 300);
        }
    
        // Ensure the canvas is cleared and globalCompositeOperation is reset before starting the cutscene
        vfxContext.clearRect(0, 0, vfxCanvas.width, vfxCanvas.height);
        vfxContext.globalCompositeOperation = 'source-over';
    
        setTimeout(() => {
            vfxContext.clearRect(0, 0, vfxCanvas.width, vfxCanvas.height);
            player.disableControls = false;
            opponent.disableControls = false;
            player.ignoreGravity = false;    
            opponent.ignoreGravity = false;
            opponent.velocityX = 0;
            // Reset globalCompositeOperation to default
            vfxContext.globalCompositeOperation = 'source-over';
            console.log("Cutscene ended for player:", player);
        }, cutsceneDuration);
    }
    
    
    
    function fireworkHitVfx(player, effectBeams = 10, effectBeamLength = 50) {
        const effectDuration = 1000; // 1 second
        const effectColors = ['red', 'orange', 'yellow'];
    
        const playerX = player.x;
        const playerY = player.y;
        const playerWidth = player.width;
        const playerHeight = player.height;
    
        const beamsData = [];
        for (let i = 0; i < effectBeams; i++) {
            beamsData.push({
                color: effectColors[i % effectColors.length],
                length: effectBeamLength,
                angle: (Math.PI * 2 / effectBeams) * i,
                progress: 0,
                opacity: 1
            });
        }
    
        function animateEffects(timestamp) {
            vfxContext.clearRect(0, 0, vfxCanvas.width, vfxCanvas.height);
            vfxContext.globalAlpha = 1; // Reset globalAlpha before drawing
    
            beamsData.forEach(beam => {
                beam.progress += 0.05; // Adjust the speed of the effect
                beam.opacity = 1.1 - beam.progress;
    
                const x = playerX + playerWidth / 2 + Math.cos(beam.angle) * beam.progress * effectBeamLength;
                const y = playerY + playerHeight / 2 + Math.sin(beam.angle) * beam.progress * effectBeamLength;
    
                vfxContext.strokeStyle = beam.color;
                vfxContext.globalAlpha = beam.opacity;
                vfxContext.beginPath();
                vfxContext.moveTo(playerX + playerWidth / 2, playerY + playerHeight / 2);
                vfxContext.lineTo(x, y);
                vfxContext.stroke();
            });
    
            if (beamsData.some(beam => beam.progress < 1)) {
                requestAnimationFrame(animateEffects);
            } else {
                vfxContext.clearRect(0, 0, vfxCanvas.width, vfxCanvas.height);
                vfxContext.globalAlpha = 1; // Reset globalAlpha after clearing
                console.log("Clearing player effects for player:", player);
            }
        }
    
        requestAnimationFrame(animateEffects);
    }
    

    if (!gameLoopRunning) {
        gameLoopRunning = true;
        gameLoop();
    }
}

// Screen shake function
function screenShake(intensity, duration) {
    const originalGameCanvasStyle = gameCanvas.style.transform;
    const originalVfxCanvasStyle = vfxCanvas.style.transform;
    let startTime = Date.now();

    function shake() {
        const elapsed = Date.now() - startTime;
        if (elapsed < duration) {
            const x = (Math.random() - 0.5) * intensity;
            const y = (Math.random() - 0.5) * intensity;
            gameCanvas.style.transform = `translate(${x}px, ${y}px)`;
            vfxCanvas.style.transform = `translate(${x}px, ${y}px)`;
            requestAnimationFrame(shake);
        } else {
            gameCanvas.style.transform = originalGameCanvasStyle;
            vfxCanvas.style.transform = originalVfxCanvasStyle;
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