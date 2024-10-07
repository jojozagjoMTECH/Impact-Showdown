let player1 = {
    playerId: 'player1',
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
        melee: 'E',
        ability: 'R',
        ultimate: 'Q'
    },
    percentage: 0,
    knockbackTime: 0,
    knockbackFriction: false,
    ultimateCharge: 0,
    ultimateReady: false,
    character: 0, // Will be updated based on selected character
    ultimateName: '', // Will be updated based on selected character
    abilityName: '', // Will be updated based on selected character
    abilityCooldown: 0,
    lives: 3,
    onGround: false,
    velocityX: 0,
    velocityY: 0,
    weight: 10,
    comboHits: 0,
    lastHitTime: 0,
    MeleeActive: false,
    isFalling: false,
    iFrames: false,
    visible: true,
    ignoreCollisions: false,
    disableControls: false,
    ignoreGravity: false
};

let player2 = {
    playerId: 'player2',
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
        melee: 'U',
        ability: 'Y',
        ultimate: 'P'
    },
    percentage: 0,
    knockbackTime: 0,
    knockbackFriction: false,
    ultimateCharge: 0,
    ultimateReady: false,
    character: 0, // Will be updated based on selected character
    ultimateName: '', // Will be updated based on selected character
    abilityName: '', // Will be updated based on selected character
    abilityCooldown: 0,
    lives: 3,
    onGround: false,
    velocityX: 0,
    velocityY: 0,
    weight: 10,
    comboHits: 0,
    lastHitTime: 0,
    MeleeActive: false,
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

class AudioManager {
    constructor() {
        this.backgroundMusic = {
            MainMenu: new Audio('Sounds/MenuMusic.mp3'),
        };
        this.backgroundMusic.MainMenu.loop = true;
        this.backgroundMusic.MainMenu.volume = 0.5;

        this.BattleMusic = {
            BattleTheme1: new Audio('Sounds/BackgroundMusic/Impact Showdown Fight1.mp3'),
            BattleTheme2: new Audio('Sounds/BackgroundMusic/Impact Showdown Fight2.mp3'),
            BattleTheme3: new Audio('Sounds/BackgroundMusic/Impact Showdown Fight3.mp3'),
            BattleTheme4: new Audio('Sounds/BackgroundMusic/Impact Showdown Fight4.mp3'),
        };

        this.sounds = {
            // bassDrop: new Audio('Sounds/SoundEffects/ES_Deep Low - Epidemic Sound.mp3'),
            CinematicBoom: new Audio('Sounds/SoundEffects/Cinematic Boom2.mp3'),
            FinalHit: new Audio('Sounds/SoundEffects/Final Hit.mp3'),

            FallOff: new Audio('Sounds/SoundEffects/Sci-Fi Explosion.mp3'),
            // jump: new Audio('path/to/your/jump-sound.mp3'),
            // hit: new Audio('path/to/your/hit-sound.mp3'),
            // Add more sounds as needed
        };

        this.hitSounds = [];
        for (let i = 1; i <= 5; i++) {
            this.hitSounds.push(new Audio(`Sounds/HitSounds/${i}.mp3`));
        }

        this.ImpactSounds = [];
        for (let i = 1; i <= 1; i++) {
            this.ImpactSounds.push(new Audio(`Sounds/ImpactSounds/${i}.mp3`));
        }
    }

    playBackgroundMusic(name) {
        if (this.backgroundMusic[name]) {
            console.log(this.backgroundMusic[name])
            this.backgroundMusic[name].currentTime = 0;
            this.backgroundMusic[name].play();
        }
    }

    PauseBackgroundMusic(name) {
        if (this.backgroundMusic[name]) {
            this.backgroundMusic[name].pause();
        }
    }

    ResumeBackgroundMusic(name) {
        if (this.backgroundMusic[name]) {
            this.backgroundMusic[name].play();
        }
    }

    stopBackgroundMusic(name) {
        if (this.backgroundMusic[name]) {
            this.backgroundMusic[name].pause();
            this.backgroundMusic[name].currentTime = 0;
        }
    }

    playSound(name) {
        if (this.sounds[name]) {
            this.sounds[name].currentTime = 0;
            this.sounds[name].play();
        }
    }

    playRandomHitSound() {
        const randomIndex = Math.floor(Math.random() * this.hitSounds.length);
        const randomHitSound = this.hitSounds[randomIndex];
        randomHitSound.currentTime = 0;
        randomHitSound.play();
    }

    playRandomImpactSound() {
        const randomIndex = Math.floor(Math.random() * this.ImpactSounds.length);
        const randomHitSound = this.ImpactSounds[randomIndex];
        randomHitSound.currentTime = 0;
        randomHitSound.play();
    }

    getRandomBackgroundMusic() {
        const backgroundMusicArray = Object.values(this.BattleMusic);
        const randomIndex = Math.floor(Math.random() * backgroundMusicArray.length);
        const randomBackgroundMusic = backgroundMusicArray[randomIndex];
        randomBackgroundMusic.currentTime = 0;
        return randomBackgroundMusic;
    }
}

// // Usage
const audioManager = new AudioManager();

// // Play sound effects
// audioManager.playSound('jump');
// audioManager.playSound('hit');

let gameLoopRunning = false;
const gravity = 0.4;
const friction = 0.9;
const gameCanvas = document.getElementById('game-canvas');
const context = gameCanvas.getContext('2d');
const vfxCanvas = document.getElementById('vfxCanvas');
const vfxContext = vfxCanvas.getContext('2d');
const bgCanvas = document.getElementById('bg-canvas');
const bgContext = bgCanvas.getContext('2d');

// Ensure canvas scales properly to fit the screen size
gameCanvas.width = window.innerWidth;
gameCanvas.height = window.innerHeight;
vfxCanvas.width = window.innerWidth;
vfxCanvas.height = window.innerHeight;
bgCanvas.width = window.innerWidth;
bgCanvas.height = window.innerHeight;

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
        { maxDistanceThreshold: 3000, minZoom: 0.3, maxZoom: 1.2 },
        { backgroundImage: 'images/BackgroundImages/mountainsSnow.jpg', speed: 0.1, x: 0, zoom: 0}
    ],
    map2: [
        { x: 0.2, y: 0.8, width: 0.6, height: 0.02, allowDropThrough: false },
        { x: 0.1, y: 0.68, width: 0.1, height: 0.02, allowDropThrough: true },
        { x: 0.8, y: 0.68, width: 0.1, height: 0.02, allowDropThrough: true },
        { maxDistanceThreshold: 2500, minZoom: 0.6, maxZoom: 1.4 },
        { backgroundImage: 'images/BackgroundImages/mountainSnowTrees.jpg', speed: 0.1,  x: 0, zoom: 0}
    ],
    map3: [
        { x: 0.1, y: 0.8, width: 0.8, height: 0.02, allowDropThrough: false },
        { x: 0.2, y: 0.65, width: 0.6, height: 0.02, allowDropThrough: true },
        { x: 0.3, y: 0.55, width: 0.4, height: 0.02, allowDropThrough: true },
        { maxDistanceThreshold: 100, minZoom: 0.7, maxZoom: 1.3 },
        { backgroundImage: 'images/BackgroundImages/mountainsSunset.webp', speed: 0.1, x: 0, zoom: 0}
    ],
    map4: [
        { x: 0.05, y: 0.95, width: 0.9, height: 0.02, allowDropThrough: false },
        { x: 0.2, y: 0.75, width: 0.3, height: 0.02, allowDropThrough: true },
        { x: 0.5, y: 0.75, width: 0.3, height: 0.02, allowDropThrough: true },
        { x: 0.1, y: 0.55, width: 0.3, height: 0.02, allowDropThrough: true },
        { x: 0.6, y: 0.55, width: 0.3, height: 0.02, allowDropThrough: true },
        { x: 0.2, y: 0.45, width: 0.3, height: 0.02, allowDropThrough: true },
        { x: 0.5, y: 0.45, width: 0.3, height: 0.02, allowDropThrough: true },
        { x: 0.1, y: 0.25, width: 0.3, height: 0.02, allowDropThrough: true },
        { x: 0.6, y: 0.25, width: 0.3, height: 0.02, allowDropThrough: true },
        { x: 0.2, y: 0.15, width: 0.3, height: 0.02, allowDropThrough: true },
        { x: 0.5, y: 0.15, width: 0.3, height: 0.02, allowDropThrough: true },
        { maxDistanceThreshold: 1000, minZoom: 0.7, maxZoom: 1.5 },
        { backgroundImage: 'images/BackgroundImages/mountainsRock.png', speed: 0.05, x: 0, zoom: 0 }
    ]
};

let backgroundImage;

function loadBackgroundImage(currentMap) {
    const mapSettings = maps[currentMap];
    if (!mapSettings) {
        console.error(`Invalid map: ${currentMap}`);
        return;
    }
    const background = mapSettings.find(item => item.backgroundImage !== undefined);
    if (background) {
        backgroundImage = new Image();
        backgroundImage.src = background.backgroundImage;
    }
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
        if (background.x <= -bgCanvas.width * camera.zoom) {
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
    if (background && backgroundImage) {
        // Check if backgroundImage is a valid image element
        if (backgroundImage instanceof HTMLImageElement) {
            if (backgroundImage !== background.backgroundImage) {
                const scaledWidth = bgCanvas.width * camera.zoom;
                const scaledHeight = bgCanvas.height * camera.zoom;
                const xOffset = (scaledWidth - bgCanvas.width);

                context.drawImage(backgroundImage, background.x, 0, bgCanvas.width, bgCanvas.height);
                context.drawImage(backgroundImage, background.x + bgCanvas.width, 0, bgCanvas.width, bgCanvas.height);
                context.drawImage(backgroundImage, background.x - bgCanvas.width, 0, bgCanvas.width, bgCanvas.height);
            }
        } else {
            context.fillStyle = backgroundImage;
            context.fillRect(0, 0, bgCanvas.width, bgCanvas.height);
        }
    } else {
        console.error('background or backgroundImage is undefined');
    }
}

const characters = [
    {
        id: 1,
        name: 'Red Guy',
        color: 'rgb(159, 13, 15)',
        ultimateName: 'Red Fury',
        ultimateDescription: 'A closed ranged move that does a furious red attack.',
        abilityName: 'Repel',
        abilityDescription: 'A strong upward burst that pushes other players away.'
    },
    {
        id: 2,
        name: 'Blue Guy',
        color: 'rgb(1, 55, 250)',
        ultimateName: 'Blue Blast',
        ultimateDescription: 'A powerful blast of blue energy.',
        abilityName: 'Blue Shot',
        abilityDescription: 'A quick shot that shoots in the last dirrection the player was moving.'
    },
    {
        id: 3,
        name: 'Shadow Knight',
        color: 'rgb(90, 18, 90)',
        ultimateName: 'Shadows Drakness',
        ultimateDescription: 'NIL',
        abilityName: 'NIL',
        abilityDescription: 'NIL'
    },
    // Add more characters here
];

let showHitboxes = false;
let showImpactFrames = true;
let FixedCamera = false;
let Destruction = true; // Define voxel size
let VOXEL_SIZE = 10; // Define voxel size

document.getElementById('start-button').addEventListener('click', () => {
    document.getElementById('intro-animation').classList.add('hidden');
    document.getElementById('main-menu').classList.remove('hidden');
    document.getElementById('main-menu').classList.add('flex');
    audioManager.playBackgroundMusic("MainMenu");
});

document.getElementById('play-button').addEventListener('click', () => {
    document.getElementById('main-menu').classList.add('hidden');
    document.getElementById('main-menu').classList.remove('flex');
    document.getElementById('character-selection').classList.remove('hidden');
});

document.getElementById('settings-button').addEventListener('click', () => {
    document.getElementById('main-menu').classList.add('hidden');
    document.getElementById('main-menu').classList.remove('flex');
    document.getElementById('settings-menu').classList.remove('hidden');
});

document.getElementById('credits-button').addEventListener('click', () => {
    document.getElementById('main-menu').classList.add('hidden');
    document.getElementById('main-menu').classList.remove('flex');
    document.getElementById('credits-menu').classList.remove('hidden');
});

document.getElementById('settings-back-button').addEventListener('click', () => {
    document.getElementById('settings-menu').classList.add('hidden');
    document.getElementById('main-menu').classList.remove('hidden');
    document.getElementById('main-menu').classList.add('flex');
});

document.getElementById('credits-back-button').addEventListener('click', () => {
    document.getElementById('credits-menu').classList.add('hidden');
    document.getElementById('main-menu').classList.remove('hidden');
    document.getElementById('main-menu').classList.add('flex');
});

document.getElementById('toggle-hitboxes').addEventListener('change', (event) => {
    showHitboxes = event.target.checked;
});

document.getElementById('toggle-impactframes').addEventListener('change', (event) => {
    showImpactFrames = event.target.checked;
});

document.getElementById('toggle-camera').addEventListener('change', (event) => {
    FixedCamera = event.target.checked;
});

document.getElementById('toggle-destruction').addEventListener('change', (event) => {
    const destructionEnabled = event.target.checked;
    const voxelSizeInput = document.getElementById('voxel-size');
    const voxelSizeLabel = document.getElementById('voxel-size-label');
    
    voxelSizeInput.style.display = destructionEnabled ? 'block' : 'none';
    voxelSizeLabel.style.display = destructionEnabled ? 'block' : 'none';
    
    Destruction = destructionEnabled;
});

document.getElementById('voxel-size').addEventListener('input', (event) => {
    VOXEL_SIZE = parseInt(event.target.value, 10) || 10; // Default to 10 if the value is invalid
});

// Initialize the voxel size input display based on the destruction toggle state
document.addEventListener('DOMContentLoaded', () => {
    const destructionEnabled = document.getElementById('toggle-destruction').checked;
    const voxelSizeInput = document.getElementById('voxel-size');
    const voxelSizeLabel = document.getElementById('voxel-size-label');
    
    voxelSizeInput.style.display = destructionEnabled ? 'block' : 'none';
    voxelSizeLabel.style.display = destructionEnabled ? 'block' : 'none';
});


function updatePlayerPreview(player, characterId) {
    const character = characters.find(char => char.id === characterId);
    const previewId = `player${player}-preview`;
    const canvasId = `player${player}-canvas`;
    const nameId = `player${player}-name`;
    const ultimateId = `player${player}-ultimateName`;
    const ultimateDescriptionId = `player${player}-ultimate-description`;
    const abilityId = `player${player}-abilityName`;
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
            player1.abilityName = character.abilityName;
            document.getElementById('player1-selection').classList.add('hidden');
            document.getElementById('player2-selection').classList.remove('hidden');
        } else {
            player2.color = character.color;
            player2.character = character.id;
            player2.ultimateName = character.ultimateName;
            player2.abilityName = character.abilityName;

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

    // Extract the background image and other settings
    const settings = map.find(item => item.backgroundImage);
    const platforms = map.filter(item => item.x !== undefined && item.y !== undefined);

    // Load the background image
    const backgroundImage = new Image();
    backgroundImage.src = settings.backgroundImage;

    backgroundImage.onload = () => {
        // Clear the canvas
        mapPreviewContext.clearRect(0, 0, mapPreviewCanvas.width, mapPreviewCanvas.height);

        // Draw the background image
        mapPreviewContext.drawImage(backgroundImage, 0, 0, mapPreviewCanvas.width, mapPreviewCanvas.height);

        // Draw the platforms
        platforms.forEach(platform => {
            const x = platform.x * mapPreviewCanvas.width;
            const y = platform.y * mapPreviewCanvas.height;
            const width = platform.width * mapPreviewCanvas.width + 2;
            const height = platform.height * mapPreviewCanvas.height + 2;

            mapPreviewContext.fillStyle = platform.allowDropThrough ? 'rgba(0, 128, 0, 0.5)' : 'rgba(0, 128, 0, 1)';
            mapPreviewContext.fillRect(x, y, width, height);
        });
    };
}

// Draw the map previews
drawMapPreview(maps.map1, 'map1-preview');
drawMapPreview(maps.map2, 'map2-preview');
drawMapPreview(maps.map3, 'map3-preview');
drawMapPreview(maps.map4, 'map4-preview');

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

function focusCameraOn(camera, target, canvas) {
    const targetX = target.x + target.width / 2;
    const targetY = target.y + target.height / 2;

    camera.x = lerp(camera.x, targetX, 0.1);
    camera.y = lerp(camera.y, targetY, 0.1);
}

let focusTarget = null;

function updateCamera(camera, players, canvas, selectedMap, focusTarget = null) {
    if (focusTarget) {
        focusCameraOn(camera, focusTarget, canvas);
    } else {
        const midpoint = calculateMidpoint(players);
        const maxDistance = calculateMaxDistance(players);

        // Default settings
        let maxDistanceThreshold = 3000;
        let minZoom = 0.5;
        let maxZoom = 1.5;
        let maxHeight = 800; // Maximum height the camera can go

        // Update camera settings based on the selected map
        const mapSettings = maps[selectedMap];
        if (mapSettings) {
            const settings = mapSettings.find(item => item.maxDistanceThreshold !== undefined);
            if (settings) {
                maxDistanceThreshold = settings.maxDistanceThreshold;
                minZoom = settings.minZoom;
                maxZoom = settings.maxZoom;
                maxHeight = settings.maxHeight || maxHeight; // Use map-specific max height if available
            }
        }

        const targetZoom = maxZoom - (maxDistance / maxDistanceThreshold) * (maxZoom - minZoom);

        // Smoothly transition camera position
        if (!FixedCamera) {
            camera.x = lerp(camera.x, midpoint.x, 0.1);
            camera.y = lerp(camera.y, Math.min(midpoint.y, maxHeight), 0.1); // Limit camera height
            camera.zoom = lerp(camera.zoom, Math.max(minZoom, Math.min(maxZoom, targetZoom)), 0.1);
        } else {
            camera.x = cameraFixedPostions.x * 2;
            camera.y = cameraFixedPostions.y * 2;
            camera.zoom = 1;
        }
    }
}

function drawArrows(context, camera, players, canvas, maxHeight) {
    players.forEach(player => {
        if (player.y < maxHeight) {
            const arrowX = (player.x - camera.x) * camera.zoom + canvas.width / 2;
            const arrowY = 10; // Position the arrow at the top of the canvas

            // Draw the arrow
            context.fillStyle = 'red';
            context.beginPath();
            context.moveTo(arrowX, arrowY);
            context.lineTo(arrowX - 10, arrowY + 20);
            context.lineTo(arrowX + 10, arrowY + 20);
            context.closePath();
            context.fill();
        }
    });
}

function startGame(selectedMap) {
    // Use the selected map data
    if (typeof selectedMap !== 'string' || !maps[selectedMap].some(item => item.backgroundImage)) {
        console.error(`Invalid map: ${selectedMap}`);
        return;
    }

    const scaledMap = scaleMapData(maps[selectedMap], gameCanvas);
    platforms = scaledMap;

    initializePlatformsAsVoxels()

    audioManager.stopBackgroundMusic('MainMenu');

    const BattleMusic = audioManager.getRandomBackgroundMusic();
    BattleMusic.loop = true;
    BattleMusic.volume = 0.5;

    resetPlayer(player1);
    resetPlayer(player2);
    vfxContext.clearRect(0, 0, vfxCanvas.width, vfxCanvas.height);
    bgContext.clearRect(0, 0, bgCanvas.width, bgCanvas.height);

    loadBackgroundImage(selectedMap);

    function sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    function gameLoop() {
        // updateCanvasSize(camera, gameCanvas);
        // updateCanvasSize(camera, vfxCanvas);
        context.clearRect(0, 0, gameCanvas.width, gameCanvas.height);

        drawBackground(context, selectedMap);
        updateBackground(selectedMap);

        updateCamera(camera, [player1, player2], gameCanvas, selectedMap, focusTarget);
        drawArrows(context, camera, [player1, player2], gameCanvas, -100);
        
        drawPlatforms();
        updatePlayer(player1);
        updatePlayer(player2);
        drawPlayer(context, player1);
        drawPlayer(context, player2);
        drawUI();
        checkGameOver();

        drawComboHits(context, player1, camera, gameCanvas);
        drawComboHits(context, player2, camera, gameCanvas);
        
        requestAnimationFrame(gameLoop);
    }

    startCountdown(player1, player2);

    function drawCountdown(text) {
        vfxContext.clearRect(0, 0, vfxCanvas.width, vfxCanvas.height);
        vfxContext.font = 'bold 200px ethnocentric';
        vfxContext.fillStyle = 'white';
        vfxContext.strokeStyle = 'black';
        vfxContext.lineWidth = 5;
        vfxContext.textAlign = 'center';
        vfxContext.textBaseline = 'middle';
        vfxContext.fillText(text, vfxCanvas.width / 2, vfxCanvas.height / 2);
        vfxContext.strokeText(text, vfxCanvas.width / 2, vfxCanvas.height / 2);
    }
    
    function startCountdown(player1, player2) {
        let countdownNumber = 3;
    
        // Disable player controls
        player1.disableControls = true;
        player2.disableControls = true;
    
        const countdownInterval = setInterval(() => {
            if (countdownNumber > 0) {
                drawCountdown(countdownNumber);
                audioManager.playSound('CinematicBoom');
            } else if (countdownNumber === 0) {
                audioManager.playSound('FinalHit');
                BattleMusic.play()
                drawCountdown('IMPACT!');
            } else {
                clearInterval(countdownInterval);
                vfxContext.clearRect(0, 0, vfxCanvas.width, vfxCanvas.height);
                // Enable player controls
                player1.disableControls = false;
                player2.disableControls = false;
                // Start the game or transition to the next screen here
            }
            countdownNumber--;
        }, 1000);
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
    
        // Check for GameCanvas collision
        if (player.y + player.height >= gameCanvas.height + 600) {
            player.y = gameCanvas.height + 600 - player.height;
            player.velocityY = 0;
            player.velocityX = 0;
            player.onGround = true;
        } else if (!player.onGround) {
            player.onGround = false;
        }

        // Check for falling off the platform
        if (player.y + player.height >= gameCanvas.height + 600) { //player.x < -player.width - camera.x || player.x > gameCanvas.width + camera.x)
            if (!player.isFalling) {
                player.isFalling = true; // Mark the player as falling
                player.visible = false; // Hide the player
                player.disableControls = true;
                let otherPlayer = player === player2 ? player1 : player2;;
                showFallVFX(player, 3000); // Show VFX for 1 second
                applyImpactFrames(player, otherPlayer, platforms, context, 100) 
                screenShake(20, 200);
                player.lives -= 1;
    
                // Delay the resetPlayer call to allow the effect to show
                setTimeout(() => {
                    resetPlayer(player, true);
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
        if (player.knockbackFriction && player.onGround) {
            player.velocityX *= friction;
            if (Math.abs(player.velocityX) < 0.1) { // Threshold to stop the player
                player.velocityX = 0;
                player.knockbackFriction = false
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

    function initializePlatformsAsVoxels() {
        platforms.forEach(platform => {
            platform.voxels = createVoxelsForArea(platform, platform.x, platform.y, platform.width, platform.height);
        });
    }
    
    function drawPlatforms() {
        platforms.forEach(platform => {
            for (let i = platform.voxels.length - 1; i >= 0; i--) {
                const voxel = platform.voxels[i];
                const adjustedX = (voxel.x - camera.x) * camera.zoom + gameCanvas.width / 2;
                const adjustedY = (voxel.y - camera.y) * camera.zoom + gameCanvas.height / 2;
                const adjustedWidth = voxel.width * camera.zoom;
                const adjustedHeight = voxel.height * camera.zoom;
    
                if (!voxel.intact) {
                    // Apply rigid body physics to broken voxels
                    applyRigidBodyPhysics(voxel);
    
                    checkVoxelCollisionWithPlatforms(voxel);
                    checkVoxelCollisionWithOtherVoxels(voxel);
    
                    // Remove voxel if it falls out of the screen
                    if (voxel.y > gameCanvas.height) {
                        platform.voxels.splice(i, 1);
                        continue;
                    }
    
                    // Initialize fadeDelay and opacity if not set
                    if (!voxel.hasOwnProperty('fadeDelay')) {
                        voxel.fadeDelay = 180; // 3 seconds at 60 FPS
                        voxel.opacity = 1.0;
                    }
    
                    // Start fading after delay
                    if (voxel.fadeDelay <= 0) {
                        voxel.opacity -= 0.01; // Adjust the fade speed as needed
                        console.log(`Voxel at (${voxel.x}, ${voxel.y}) fading. Opacity: ${voxel.opacity}`);
                        if (voxel.opacity <= 0) {
                            platform.voxels.splice(i, 1);
                            console.log(`Voxel at (${voxel.x}, ${voxel.y}) removed.`);
                            continue;
                        }
                    } else {
                        voxel.fadeDelay -= 1; // Decrease delay count
                        console.log(`Voxel at (${voxel.x}, ${voxel.y}) delaying fade. FadeDelay: ${voxel.fadeDelay}`);
                    }
    
                    context.save();
                    context.translate(adjustedX + adjustedWidth / 2, adjustedY + adjustedHeight / 2);
                    context.rotate(voxel.rotation);
                    context.globalAlpha = voxel.opacity; // Set opacity
                    context.fillStyle = 'darkgreen'; // Visual distinction for broken voxels
                    context.fillRect(-adjustedWidth / 2, -adjustedHeight / 2, adjustedWidth, adjustedHeight);
                    context.restore();
                } else {
                    context.fillStyle = platform.color || 'green';
                    context.fillRect(adjustedX, adjustedY, adjustedWidth, adjustedHeight);
                }
            }
        });
    }    
    
    function checkPlatformCollision(player) {
        player.onGround = false;
        const baseDampingFactor = 0.8;
        const breakVelocityThreshold = 11;
        const fullBreakVelocityThreshold = 17;
        const breakRadius = 10;
    
        platforms.forEach(platform => {
            platform.voxels.forEach(voxel => {
                if (player.x < voxel.x + voxel.width && player.x + player.width > voxel.x && voxel.intact) {
                    // Check if the player is touching the top of the voxel
                    if (player.y + player.height >= voxel.y && player.y + player.height <= voxel.y + voxel.height) {
                        if (player.knockbackActive) {
                            player.y = voxel.y - player.height - 0.4;
                            player.bounceCount = (player.bounceCount || 0) + 1;
                            const dampingFactor = baseDampingFactor + (player.bounceCount * 0.1);
                            player.velocityY = -Math.abs(player.velocityY) / dampingFactor;
                            createSmokeVfx(player, "bottom", 50);
                            audioManager.playRandomHitSound();
    
                            // Check if the player hit with enough force to break the voxel
                            if (Math.abs(player.velocityY) > breakVelocityThreshold) {
                                voxel.intact = false;
                                breakVoxel(voxel, player, breakRadius); // Breaks everything within the specified radius
                            }                            
                        } else if (player.velocityY >= 0) { // Ensure the player is falling down onto the voxel
                            player.y = voxel.y - player.height;
                            player.velocityY = 0;
                            player.onGround = true;
                            player.bounceCount = 0;
                        }
                    }
                    // Check if the player is touching the bottom of the voxel
                    if (player.knockbackActive && player.y <= voxel.y + voxel.height &&
                        player.y + player.height > voxel.y && player.velocityY < 0) { // Ensure the player is moving upwards
                        player.bounceCount = (player.bounceCount || 0) + 1;
                        const dampingFactor = baseDampingFactor + (player.bounceCount * 0.1);
                        player.velocityY = Math.abs(player.velocityY) / dampingFactor;
                        createSmokeVfx(player, "top", 50);
                        audioManager.playRandomHitSound();
    
                        if (Math.abs(player.velocityY) > fullBreakVelocityThreshold) {
                            voxel.intact = false;
                            breakVoxel(voxel, player, 50); // Breaks everything within a large radius
                        } else if (Math.abs(player.velocityY) > breakVelocityThreshold) {
                            voxel.intact = false;
                            breakVoxel(voxel, player, breakRadius); // Breaks everything within the specified radius
                        }                        
                    }
                }
            });
        });
        // Ensure the player doesn't bounce if not colliding with any platform
        if (!player.onGround && !player.knockbackActive) {
            player.bounceCount = 0;
        }
    }
    
    function createVoxelsForArea(platform, startX, startY, width, height) {
        const voxels = [];
        for (let x = startX; x < startX + width; x += VOXEL_SIZE) {
            for (let y = startY; y < startY + height; y += VOXEL_SIZE) {
                voxels.push({ x, y, width: VOXEL_SIZE + 0.7, height: VOXEL_SIZE + 0.7, intact: true, velocityX: 0, velocityY: 0, gravity: true});
            }
        }
        return voxels;
    }
    
    function breakVoxel(voxel, player, radius) {
        if (Destruction) {
            voxel.intact = false;
            const impactDirectionX = player.velocityX;
            const impactDirectionY = player.velocityY;
        
            // Calculate the explosion force for the broken voxel
            const explosionForceX = impactDirectionX * 1; // Adjust multiplier as needed
            const explosionForceY = impactDirectionY * 1; // Adjust multiplier as needed
        
            applyPhysicsToPiece(voxel, explosionForceX, explosionForceY);
            console.log("Voxel broken at point:", voxel.x, voxel.y, "with forces:", explosionForceX, explosionForceY);
        
            // Break voxels in the specified radius
            breakNeighborVoxels(voxel, player, radius);
        }
        
        function breakNeighborVoxels(centerVoxel, player, radius) {
            platforms.forEach(platform => {
                platform.voxels.forEach(voxel => {
                    const distance = Math.hypot(voxel.x - centerVoxel.x, voxel.y - centerVoxel.y);
                    if (distance <= radius && voxel.intact) {
                        voxel.intact = false;
                        const explosionForceX = (voxel.x - centerVoxel.x) * 0.1;
                        const explosionForceY = (voxel.y - centerVoxel.y) * 0.1;
                        applyPhysicsToPiece(voxel, explosionForceX, explosionForceY);
                        console.log("Neighbor voxel broken at point:", voxel.x, voxel.y, "with forces:", explosionForceX, explosionForceY);
                    }
                });
            });
        }
    }
    
    function applyRigidBodyPhysics(voxel) {
        if (voxel.gravity) {
            voxel.velocityY += gravity;
        }
    
        voxel.velocityX *= friction;
        voxel.velocityY *= friction;
    
        voxel.x += voxel.velocityX;
        voxel.y += voxel.velocityY;
    
        voxel.rotation = (voxel.rotation || 0) + voxel.angularVelocity;
        voxel.angularVelocity *= friction;
    
        // if (Math.abs(voxel.velocityY) < 0.5) {
        //     voxel.velocityY = 0;
        // }
        // if (Math.abs(voxel.velocityX) < 0.5) {
        //     voxel.velocityX = 0;
        // }
    
        // Check collision with the bottom of the canvas
        // if (voxel.y + voxel.height > gameCanvas.height) {
        //     voxel.y = gameCanvas.height - voxel.height;
        //     voxel.velocityY = -gravity;
        //     voxel.angularVelocity = 0;
        // }
    }
    
    function checkVoxelCollisionWithPlatforms(voxel) {
        platforms.forEach(platform => {
            platform.voxels.forEach(platformVoxel => {
                if (voxel !== platformVoxel && areVoxelsColliding(voxel, platformVoxel)) {
                    resolveRigidBodyCollision(voxel, platformVoxel);
                }
            });
        });
    }
    
    function checkVoxelCollisionWithOtherVoxels(voxel) {
        platforms.forEach(platform => {
            platform.voxels.forEach(otherVoxel => {
                if (voxel !== otherVoxel && areVoxelsColliding(voxel, otherVoxel)) {
                    resolveRigidBodyCollision(voxel, otherVoxel);
                }
            });
        });
    }
    
    function areVoxelsColliding(voxel1, voxel2) {
        return voxel1.x < voxel2.x + voxel2.width &&
               voxel1.x + voxel1.width > voxel2.x &&
               voxel1.y < voxel2.y + voxel2.height &&
               voxel1.y + voxel1.height > voxel2.y;
    }
    
    function resolveRigidBodyCollision(voxel1, voxel2) {
        const overlapX = (voxel1.x + voxel1.width / 2) - (voxel2.x + voxel2.width / 2);
        const overlapY = (voxel1.y + voxel1.height / 2) - (voxel2.y + voxel2.height / 2);

        if (Math.abs(overlapX) > Math.abs(overlapY)) {
            if (overlapX > 0) {
                voxel1.x = voxel2.x + voxel2.width;
            } else {
                voxel1.x = voxel2.x - voxel1.width;
            }
            voxel1.velocityX = -gravity;
        } else {
            if (overlapY > 0) {
                voxel1.y = voxel2.y + voxel2.height;
            } else {
                voxel1.y = voxel2.y - voxel1.height;
            }
            voxel1.velocityY = -gravity;
        }
    
        // Exchange momentum
        // const tempVelocityX = voxel1.velocityX;
        // voxel1.velocityX = voxel2.velocityX;
        // voxel2.velocityX = tempVelocityX;
    
        // const tempVelocityY = voxel1.velocityY;
        // voxel1.velocityY = voxel2.velocityY;
        // voxel2.velocityY = tempVelocityY;
    
        // voxel1.rotation += Math.random() * 0.1;
        // voxel2.rotation -= Math.random() * 0.1;
    }
    
    function applyPhysicsToPiece(piece, forceX, forceY) {
        piece.velocityX = forceX;
        piece.velocityY = forceY;
        piece.angularVelocity = (Math.random() - 0.5) * 0.1;
        piece.gravity = true;
        console.log("Applied physics to piece:", piece);
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

    function resetPlayer(player, Middle = false) {
        const respawnHeight = -300; // Adjust this value to change the respawn height
    
        console.log("Resetting player:", player);
        if (player === player1) {
            player.x = platforms[0].x + 50; // Spawn Player 1 on the left side of the platform
            console.log("Player 1 position:", player.x, player.y);
        } else if (player === player2) {
            player.x = platforms[0].x + platforms[0].width - 100; // Spawn Player 2 on the right side of the platform
            console.log("Player 2 position:", player.x, player.y);
        }
        player.y = platforms[0].y - player.height;

        if (Middle == true) {
            player.x = platforms[0].x + (platforms[0].width / 2);
            player.y = respawnHeight;
        }

        player.velocityX = 0;
        player.velocityY = 0;
        player.percentage = 0;
        player.ultimateCharge = 0;
        player.ultimateReady = false;
        player.iFrames = true; // Add invincibility on respawn
        player.disableControls = false;

        player.ignoreGravity = true
    
        // Remove invincibility after 1 second
        setTimeout(() => {
            player.ignoreGravity = false
            player.iFrames = false;
        }, 3000);
    }

    function resetGame() {
        console.log(BattleMusic)
        BattleMusic.pause()
        audioManager.playBackgroundMusic("MainMenu");
        player1.lives = 3;
        player2.lives = 3;
        resetPlayer(player1);
        resetPlayer(player2);
        
        // Hide the game screen and character selection screen, show the main menu
        document.getElementById('game').classList.add('hidden');
        document.getElementById('main-menu').classList.remove('hidden');
        document.getElementById('main-menu').classList.add('flex');
        document.getElementById('character-selection').classList.add('hidden');
        document.getElementById('map-selection').classList.add('hidden');
        document.getElementById('map-selection').classList.remove('flex');
        
        // Reset character selection visibility
        document.getElementById('player1-selection').classList.remove('hidden');
        document.getElementById('player2-selection').classList.add('hidden');

        vfxContext.clearRect(0, 0, vfxCanvas.width, vfxCanvas.height);
        vfxContext.globalCompositeOperation = 'source-over';
    }
    
    function useUltimate(player) {
        if (player.ultimateReady) {
            const opponent = player === player1 ? player2 : player1;

            const hitbox = {
                x: player.x - 10, // Adjust x position to center the hitbox
                y: player.y - 10, // Adjust y position to center the hitbox
                width: player.width + 50, // Increase width by 20 pixels
                height: player.height + 50 // Increase height by 20 pixels
            };
    
            switch (player.character) {
                case 1: // Red Fury's Ultimate
                    context.fillStyle = "red";
                    context.fillRect(hitbox.x, hitbox.y, hitbox.width, hitbox.height);
                    if (checkHit(hitbox, opponent)) {
                        playCutscene(player, opponent);
                    } else {
                        player.ultimateReady = false
                        player.ultimateCharge = 0;
                    }
                    break;
                case 2: // Blue Blast's Ultimate
                    shootLaserBeam(player, opponent);
                    break;
                case 3: // Shadows Ultimate
                    context.fillStyle = "red";
                    context.fillRect(hitbox.x, hitbox.y, hitbox.width, hitbox.height);
                    if (checkHit(hitbox, opponent)) {
                        playCutscene(player, opponent);
                    } else {
                        player.ultimateReady = false
                        player.ultimateCharge = 0;
                    }
                    break;
                // Add more cases for additional characters
                default:
                    console.log('Unknown character ultimate');
            }
    
            player.ultimateCharge = 0;
            player.ultimateReady = false;
        }
    }
    
    function useAbility(player) {
        if (player.abilityCooldown == 0) {
            // Detect the opponent
            const opponent = player === player1 ? player2 : player1;
    
            const screenX = (player.x - camera.x) * camera.zoom + gameCanvas.width / 2;
            const screenY = (player.y - camera.y) * camera.zoom + gameCanvas.height / 2; // Fixed calculation

            // let alpha = 1.0;
            // const fadeOutText = () => {
            //     // Clear a larger area to avoid residual text
            //     // vfxContext.clearRect(screenX - 100, screenY - 50, 200, 50); 
            //     vfxContext.fillStyle = `rgba(${player.color.r}, ${player.color.g}, ${player.color.b}, ${alpha})`;
            //     vfxContext.font = '16px Arial';
            //     vfxContext.textAlign = 'center'; // Center the text
            //     vfxContext.fillText(player.abilityName, screenX, screenY - 30);
            //     alpha -= 0.02;
            //     if (alpha > 0) {
            //         requestAnimationFrame(fadeOutText);
            //     }
            // };
            // fadeOutText();

            switch (player.abilityName) {
                case "Repel":
                    // Create a burst effect that grows and fades
                    const chargeRadius = 60; // Updated chargeRadius
                    const startX = player.x + player.width / 2;
                    const startY = player.y + player.height / 2;
    
                    let chargeProgress = 0;
                    let hasHitOpponent = false; // Flag to track if the opponent has been hit
    
                    function animateCharge(timestamp) {
                        vfxContext.clearRect(0, 0, vfxCanvas.width, vfxCanvas.height);
    
                        player.velocityY = -gravity; // Hover in the air
                        player.velocityX = 0;
    
                        chargeProgress += 0.02; // Adjust the speed of the charge-up
                        const currentRadius = chargeRadius + chargeProgress * 50;
    
                        const x = (startX - camera.x) * camera.zoom + vfxCanvas.width / 2;
                        const y = (startY - camera.y) * camera.zoom + vfxCanvas.height / 2;
    
                        vfxContext.fillStyle = player.color;
                        vfxContext.globalAlpha = 1.0 - chargeProgress; // Fading effect
                        vfxContext.beginPath();
                        vfxContext.arc(x, y, currentRadius * camera.zoom, 0, 2 * Math.PI);
                        vfxContext.fill();
    
                        if (chargeProgress < 1) {
                            requestAnimationFrame(animateCharge);
                        } else {
                            // Clear the charge-up effect
                            vfxContext.clearRect(0, 0, vfxCanvas.width, vfxCanvas.height);
                        }
                    }
                    requestAnimationFrame(animateCharge);
    
                    // Detect if the opponent is touching the burst effect
                    const repelInterval = setInterval(() => {
                        const burstX = (player.x + player.width / 2 - camera.x) * camera.zoom + vfxCanvas.width / 2;
                        const burstY = (player.y + player.height / 2 - camera.y) * camera.zoom + vfxCanvas.height / 2;
    
                        // vfxContext.fillStyle = 'red';
                        // vfxContext.fillRect(burstX - 50 * camera.zoom, burstY - 50 * camera.zoom, 100 * camera.zoom, 100 * camera.zoom); // Centered larger hitbox
    
                        const opponentX = (opponent.x + opponent.width / 2 - camera.x) * camera.zoom + vfxCanvas.width / 2;
                        const opponentY = (opponent.y + opponent.height / 2 - camera.y) * camera.zoom + vfxCanvas.height / 2;
                        const distance = Math.sqrt(Math.pow(opponentX - burstX, 2) + Math.pow(opponentY - burstY, 2));
    
                        if (distance < 90 * camera.zoom + opponent.width / 2 && !opponent.iFrames && !hasHitOpponent) { // 50 is half of the hitbox size
                            applyDamage(opponent, 5);
                            applyKnockback(player, opponent, 1500);
                            hasHitOpponent = true; // Set the flag to true after hitting the opponent
                        }
                    }, 30);
    
                    // Clear the larger hitbox and stop checking for collisions after a short duration
                    setTimeout(() => {
                        vfxContext.clearRect(0, 0, vfxCanvas.width, vfxCanvas.height);
                        clearInterval(repelInterval);
                    }, 500); // Adjust the duration as needed
    
                    player.abilityCooldown = 10; // Set to desired cooldown value
                    break;
                    case "Blue Shot":
                        // Determine the player's last direction
                        let lastDirection = { x: 0, y: 0 };
                        if (player.velocityX > 0) lastDirection.x = 1;
                        else if (player.velocityX < 0) lastDirection.x = -1;
                        if (player.velocityY > 0) lastDirection.y = 1;
                        else if (player.velocityY < 0) lastDirection.y = -1;

                        // Set a default direction if the player isn't moving
                        if (lastDirection.x === 0 && lastDirection.y === 0) {
                            lastDirection = { x: 1, y: 0 }; // Default to moving right
                        }

                        // Shoot a bullet in the direction the player was last moving
                        const bulletSpeed = 10;
                        const bullet = {
                            x: player.x + player.width / 2,
                            y: player.y + player.height / 2,
                            vx: lastDirection.x * bulletSpeed,
                            vy: lastDirection.y * bulletSpeed,
                            radius: 5,
                            color: 'blue'
                        };

                        function animateBullet() {
                            // Update bullet position
                            bullet.x += bullet.vx;
                            bullet.y += bullet.vy;

                            // Convert bullet position to screen coordinates
                            const bulletScreenX = (bullet.x - camera.x) * camera.zoom + vfxCanvas.width / 2;
                            const bulletScreenY = (bullet.y - camera.y) * camera.zoom + vfxCanvas.height / 2;

                            // Clear and redraw the bullet
                            vfxContext.clearRect(0, 0, vfxCanvas.width, vfxCanvas.height);
                            vfxContext.fillStyle = bullet.color;
                            vfxContext.beginPath();
                            vfxContext.arc(bulletScreenX, bulletScreenY, bullet.radius * camera.zoom, 0, 2 * Math.PI);
                            vfxContext.fill();

                            // Check if the bullet is out of bounds
                            if (bullet.x < 0 || bullet.x > gameCanvas.width || bullet.y < 0 || bullet.y > gameCanvas.height) {
                                return; // Stop animation if bullet goes out of bounds
                            }

                            // Check if the bullet hits the opponent
                            const opponentX = (opponent.x + opponent.width / 2 - camera.x) * camera.zoom + vfxCanvas.width / 2;
                            const opponentY = (opponent.y + opponent.height / 2 - camera.y) * camera.zoom + vfxCanvas.height / 2;
                            const distance = Math.sqrt(Math.pow(opponentX - bulletScreenX, 2) + Math.pow(opponentY - bulletScreenY, 2));

                            if (distance < bullet.radius * camera.zoom + opponent.width / 2 && !opponent.iFrames) {
                                applyDamage(opponent, 1);
                                applyKnockback(player, opponent);
                                return; // Stop animation if bullet hits the opponent
                            }

                            requestAnimationFrame(animateBullet);
                        }

                        requestAnimationFrame(animateBullet);

                        player.abilityCooldown = 5; // Set to desired cooldown value
                        break;
                // Add more cases for additional characters
                default:
                    console.log('Unknown character ability');
            }
    
            const cooldownElement = document.getElementById(`${player.playerId}-ability-key`);
            if (cooldownElement) {
                cooldownElement.innerText = `Cooldown: ${player.abilityCooldown}`;
            } else {
                console.error(`Element with ID ${player.playerId}-ability-key not found.`);
            }
    
            // Countdown the cooldown
            const cooldownInterval = setInterval(() => {
                player.abilityCooldown -= 1;
                if (cooldownElement) {
                    if (player.abilityCooldown > 0) {
                        cooldownElement.innerText = `Cooldown: ${player.abilityCooldown}`;
                    } else {
                        cooldownElement.innerText = player.controls.ability;
                        clearInterval(cooldownInterval);
                    }
                }
            }, 1000);
        }
    }
    
    // Update useMelee function to include scaled knockback
    function useMelee(player) {
        // if (player.comboCooldown) return;
    
        const opponent = player === player1 ? player2 : player1;
        const hitboxColor = player.character === 1 ? 'lightblue' : 'pink';
    
        // Define the hitbox with slightly larger dimensions
        const hitbox = {
            x: player.x - 10, // Adjust x position to center the hitbox
            y: player.y - 10, // Adjust y position to center the hitbox
            width: player.width + 20, // Increase width by 20 pixels
            height: player.height + 20 // Increase height by 20 pixels
        };
    
        // Draw the hitbox for debugging purposes
        context.fillStyle = hitboxColor;
        context.fillRect(hitbox.x, hitbox.y, hitbox.width, hitbox.height);
    
        // Check for collision with the opponent
        if (checkHit(hitbox, opponent) && !opponent.iFrames) {
            audioManager.playRandomHitSound();
            applyDamage(opponent, 10);
            showHitVFX(opponent);
            screenShake(3, 500);
            player.ultimateCharge += 5;
            opponent.ultimateCharge += 10;
            // Scale knockback based on percentage
            applyKnockback(player, opponent, 800);//less knockback

            opponent.disableControls = true;
            setTimeout(() => {
                opponent.disableControls = false;
            }, 3000); // Adjust the stun duration as needed
    
            // Update last hit time
            player.lastHitTime = Date.now();
            player.comboHits += 1;
        }
    
        // player.comboHits += 1;
        // if (player.comboHits >= 4) {
        //     player.comboCooldown = true;
        //     setTimeout(() => {
        //         player.comboHits = 0;
        //         player.comboCooldown = false;
        //     }, 1000);
        // }
    }

    function drawComboHits(context, player, camera, canvas) {
        const currentTime = Date.now();
        const timeSinceLastHit = currentTime - player.lastHitTime;
        const fadeDuration = 2000; // Duration in milliseconds before the combo hits fade out
        let rotationAngle = 0;
    
        // Calculate opacity based on time since last hit
        let opacity = 1;
        if (timeSinceLastHit > fadeDuration) {
            opacity = 0;
            player.comboHits = 0; // Reset comboHits when the combo fades all the way
        } else {
            opacity = 1 - (timeSinceLastHit / fadeDuration);
        }
    
        // Calculate screen position relative to the camera
        const screenX = (player.x - camera.x) * camera.zoom + canvas.width / 2;
        const screenY = (player.y - camera.y) * camera.zoom + canvas.height / 2;
    
        // Calculate color based on combo hits
        const ratio = Math.min(timeSinceLastHit / 500, 1000);
        const redValue = 255;
        const greenValue = Math.floor(255 * ratio);
        const blueValue = Math.floor(255 * ratio);
        const color = `rgba(${redValue}, ${greenValue}, ${blueValue}, ${opacity})`;
    
        // Generate a random angle between -45 and 45 degrees
        if (!rotationAngle || timeSinceLastHit > fadeDuration) {
            rotationAngle = (Math.random() * 4 - 2) * (Math.PI / 180);
        }
    
        // Save the current context state
        context.save();
    
        // Apply the rotation
        context.translate(screenX, screenY - 50);
        context.rotate(rotationAngle);
        context.translate(-screenX, -screenY + 50);
    
        // Draw the combo hits with calculated color and opacity
        context.fillStyle = color;
        context.font = '20px Arial';
        context.textAlign = 'center'; // Center align the text
        context.fillText(`Combo: ${player.comboHits}`, screenX + 20, screenY - 50);
    
        // Restore the context to its original state
        context.restore();
    }

    function applyDamage(player, amount) {
        player.percentage += amount;
    }

    function applyKnockback(player, opponent, multiplier = 1000) {
        const knockback = opponent.percentage * 0.001;
        const attackStrength = player.attackStrength || 1; // Default attack strength if not defined
        const opponentWeight = opponent.weight || 1; // Default weight if not defined
    
        const knockbackForce = (knockback * attackStrength / opponentWeight) * multiplier; // Adjust the multiplier as needed
    
        // Calculate the direction vector from player to opponent
        const directionX = opponent.x - player.x;
        const directionY = opponent.y - player.y;
    
        // Normalize the direction vector
        const magnitude = Math.sqrt(directionX * directionX + directionY * directionY);
        const normalizedDirectionX = directionX / magnitude;
        const normalizedDirectionY = directionY / magnitude;
    
        // Apply knockback in the opposite direction
        opponent.velocityX = normalizedDirectionX * knockbackForce;
        opponent.velocityY = (normalizedDirectionY * knockbackForce) - knockbackForce;
        // console.log(normalizedDirectionX * knockbackForce, normalizedDirectionY * knockbackForce)
        opponent.knockbackActive = true;
        opponent.disableControls = true;
    
        // Calculate knockback time based on knockback, attack strength, and opponent weight
        opponent.knockbackTime = knockbackForce * 30; // Convert to milliseconds
    
        // Manage knockback time
        if (opponent.knockbackTime > 0) {
            setTimeout(() => {
                opponent.knockbackFriction = true;
                opponent.knockbackActive = false;
                opponent.disableControls = false;
            }, opponent.knockbackTime);
        }
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
        const adjustedWidth = player.width * camera.zoom + 20;
        const adjustedHeight = player.height * camera.zoom + 20;
    
        context.strokeStyle = 'red';
        context.strokeRect(adjustedX, adjustedY, adjustedWidth, adjustedHeight);
    }

    const keys = {};
    document.addEventListener('keydown', (event) => {
        const key = event.key.toUpperCase();
        keys[key] = true;

        if (keys[player1.controls.ultimate] && player1.ultimateReady && !player1.disableControls) {
            useUltimate(player1);
        } else if (keys[player2.controls.ultimate] && player2.ultimateReady && !player2.disableControls) {
            useUltimate(player2);
        } else if (keys[player1.controls.melee] && !player1.disableControls && !player1.MeleeActive) {
            useMelee(player1);
            player1.MeleeActive = true;
        } else if (keys[player2.controls.melee] && !player2.disableControls && !player2.MeleeActive) {
            useMelee(player2);
            player2.MeleeActive = true;
        } else if (keys[player1.controls.ability] && player1.abilityCooldown == 0 && !player1.disableControls) {
            useAbility(player1);
        } else if (keys[player2.controls.ability] && player2.abilityCooldown == 0 && !player2.disableControls) {
            useAbility(player2);
        }
    });

    document.addEventListener('keyup', (event) => {
        const key = event.key.toUpperCase();
        keys[key] = false;

        if (key === player1.controls.left || key === player1.controls.right) {
            player1.velocityX = 0;
        } else if (key === player2.controls.left || key === player2.controls.right) {
            player2.velocityX = 0;
        } else if (key === player1.controls.melee) {
            player1.MeleeActive = false;
        } else if (key === player2.controls.melee) {
            player2.MeleeActive = false;
        };
    });

    function handleMovement(player) {
        if (!player.disableControls) {
            if (keys[player.controls.up] && player.onGround) {
                player.velocityY = -15;
                player.onGround = false;
            }
            if (keys[player.controls.left]) {
                player.velocityX = -5;
            } else if (keys[player.controls.right]) {
                player.velocityX = 5;
            } else {
                player.velocityX = 0;
            }
    
            // Check for down key to allow drop through platforms
            if (keys[player.controls.down]) {
                const currentPlatform = platforms.find(platform => 
                    player.x < platform.x + platform.width &&
                    player.x + player.width > platform.x &&
                    player.y + player.height >= platform.y &&
                    player.y + player.height <= platform.y + platform.height
                );
        
                console.log("Current platform:", currentPlatform); // Debug log
        
                if (currentPlatform && currentPlatform.allowDropThrough) {
                    player.y += currentPlatform.height + 35;
                    player.ignoreCollisions = true; // Set a flag to ignore collisions temporarily
        
                    setTimeout(() => {
                        player.ignoreCollisions = false; // Reset the flag after a brief period
                    }, 500); // Adjust the delay as needed
                }
            }
        }
    }
    function throttle(fn, wait) {
        let time = Date.now();
        return function() {
            if ((time + wait - Date.now()) < 0) {
                fn();
                time = Date.now();
            }
        };
    }

    function updateMovements() {
        handleMovement(player1);
        handleMovement(player2);
    }
    
    // Call updateMovements every 16ms (60fps)
    setInterval(throttle(updateMovements, 16), 1000 / 60)

    // VFX for when a player gets hit
    function showHitVFX(player) {
        const playerColor = player.color
        player.color = 'white';
        // context.fillRect(player.x, player.y, player.width, player.height);
        setTimeout(() => {
            // context.clearRect(player.x, player.y, player.width, player.height);
            player.color = playerColor;
            drawPlayer(context, player); // Redraw the player to fix the clearing issue
        }, 50);
    }

    function applyImpactFrames(player, opponent, platforms, context, duration = 100, switchInterval = 50) {
        if (showImpactFrames) {
            console.log("Applying impact frames");
    
            // Save original styles
            const originalPlayerColor = player.color;
            const originalOpponentColor = opponent.color;
            const originalPlatformColors = platforms.map(platform => platform.color);
            const originalGameCanvasStyle = backgroundImage;
    
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
                    backgroundImage = bgColor;
    
                    // Draw a black and white overlay on the gameCanvas
                    context.clearRect(0, 0, gameCanvas.width, gameCanvas.height);
                    context.fillStyle = bgColor;
                    context.fillRect(0, 0, gameCanvas.width, gameCanvas.height);
    
                    requestAnimationFrame(switchColors);
                } else {
                    // Restore original styles after duration
                    player.color = originalPlayerColor;
                    opponent.color = originalOpponentColor;
                    platforms.forEach((platform, index) => platform.color = originalPlatformColors[index]);
                    backgroundImage = originalGameCanvasStyle;
                    console.log("Impact frames ended");
                }
            }
    
            switchColors();
        }
    }
    
    function showFallVFX(player, duration = 1000) {
        console.log("Showing fall VFX for player:", player);
        audioManager.playSound('FallOff');
    
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
    
                const x = (startX - camera.x) * camera.zoom + vfxCanvas.width / 2;
                const y = (startY - camera.y) * camera.zoom + vfxCanvas.height / 2;
    
                vfxContext.fillStyle = chargeColor;
                vfxContext.globalAlpha = 0.5 + 0.5 * Math.sin(chargeProgress * Math.PI); // Pulsating effect
                vfxContext.beginPath();
                vfxContext.arc(x, y, currentRadius * camera.zoom, 0, 2 * Math.PI);
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
                let hitDetected = false;
    
                screenShake(30, 300);
                applyImpactFrames(player, opponent, platforms, context, 200);
    
                function animateLaser(timestamp) {
                    vfxContext.clearRect(0, 0, vfxCanvas.width, vfxCanvas.height);
    
                    player.velocityY = -gravity; // Hover in the air
                    player.velocityX = 0;
    
                    laserProgress += 0.02; // Adjust the speed of the laser
                    const currentX = startX + (endX - startX) * laserProgress;
                    const currentY = startY + (endY - startY) * laserProgress;
    
                    const x1 = (startX - camera.x) * camera.zoom + vfxCanvas.width / 2;
                    const y1 = (startY - camera.y) * camera.zoom + vfxCanvas.height / 2;
                    const x2 = (currentX - camera.x) * camera.zoom + vfxCanvas.width / 2;
                    const y2 = (currentY - camera.y) * camera.zoom + vfxCanvas.height / 2;
    
                    vfxContext.strokeStyle = laserColor;
                    vfxContext.lineWidth = laserWidth * camera.zoom;
                    vfxContext.globalAlpha = laserOpacity;
                    vfxContext.beginPath();
                    vfxContext.moveTo(x1, y1);
                    vfxContext.lineTo(x2, y2);
                    vfxContext.stroke();
    
                    // Check for hit during the laser animation
                    if (!hitDetected && checkHitLaser(currentX, currentY, opponent)) {
                        hitDetected = true;
                        applyDamage(opponent, 50); // Higher damage for ultimate
                        showHitVFX(opponent);
                        screenShake(5, 500);
                        player.ignoreCollisions = false;
                        opponent.ignoreCollisions = false;
                        applyKnockback(player, opponent);
                    }
    
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
                                vfxContext.lineWidth = laserWidth * camera.zoom;
                                vfxContext.globalAlpha = laserOpacity;
                                vfxContext.beginPath();
                                vfxContext.moveTo(x1, y1);
                                vfxContext.lineTo(x2, y2);
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
    
                // End hover after the laser duration
                setTimeout(() => {
                    player.ignoreCollisions = false;
                }, laserDuration);
            }
    
            requestAnimationFrame(animateCharge);
        }, 200); // Delay to simulate the jump
    }
    
    function checkHitLaser(laserX, laserY, opponent) {
        return (
            laserX >= opponent.x &&
            laserX <= opponent.x + opponent.width &&
            laserY >= opponent.y &&
            laserY <= opponent.y + opponent.height
        );
    }

    function playCutscene(player, opponent) {
        console.log("Playing cutscene for player:", player);
    
        // Example cutscene logic
        let cutsceneDuration = 3000; // 3 seconds
        
        const settings = maps[selectedMap].find(item => item.maxDistanceThreshold !== undefined);
        const DefaultZoom = settings.minZoom
        
        // Freeze players during cutscene
        player.velocityX = 0
        opponent.velocityX = 0
        player.disableControls = true;
        opponent.disableControls = true;

        vfxContext.clearRect(0, 0, vfxCanvas.width, vfxCanvas.height);
        vfxContext.globalCompositeOperation = 'source-over';

        console.log(player.character);
        
        if (player.character === 1) {
            BattleMusic.pause();
            cutsceneDuration = 0;
            opponent.velocityY = -25;
        
            async function teleportAround(player, opponent) {
                let teleportElapsed = 0;
                const teleportSpeedup = 1.1;
                const teleportTime = 100; // Total time for teleportation in milliseconds
                let teleportDuration = 300;
                const minTeleportDuration = 30;
            
                while (teleportElapsed < teleportTime) {
                    player.x = opponent.x + (Math.random() - 0.5) * 200; // random X around opponent
                    player.y = opponent.y + (Math.random() - 0.5) * 200; // random Y around opponent
        
                    await sleep(teleportDuration);
                    
                    teleportElapsed += 1;
                    teleportDuration = Math.max(teleportDuration / teleportSpeedup, minTeleportDuration);
        
                    player.disableControls = true;
                    opponent.disableControls = true;
        
                    audioManager.playRandomHitSound();
                    applyDamage(opponent, 0.1);
                    opponent.percentage = Math.round(opponent.percentage * 10) / 10;
                }
            }
        
            const cutscene = async () => {
                await new Promise(resolve => setTimeout(resolve, 300));
                opponent.velocityY = 0;
                opponent.ignoreGravity = true;
        
                await new Promise(resolve => setTimeout(resolve, 300));
                vfxContext.fillStyle = 'black';
                vfxContext.fillRect(0, 0, vfxCanvas.width, vfxCanvas.height);
                vfxContext.fillStyle = 'white';
                vfxContext.font = '30px Arial';
                vfxContext.fillText('Red Fury Ultimate.', vfxCanvas.width / 2 - 100, vfxCanvas.height / 2);
                audioManager.playSound('CinematicBoom');
        
                await new Promise(resolve => setTimeout(resolve, 2000));
                vfxContext.clearRect(0, 0, vfxCanvas.width, vfxCanvas.height);
                player.velocityY = -24;
                settings.minZoom = 2;
        
                await new Promise(resolve => setTimeout(resolve, 300));
                player.velocityY = 0;
                player.ignoreGravity = true;
        
                await new Promise(resolve => setTimeout(resolve, 200));
                vfxContext.fillStyle = 'black';
                vfxContext.fillRect(0, 0, vfxCanvas.width, vfxCanvas.height);
                vfxContext.fillStyle = 'red';
                vfxContext.font = '50px Arial';
                vfxContext.fillText('Red Fury', vfxCanvas.width / 2 - 100, vfxCanvas.height / 2);
                audioManager.playSound('FinalHit');
        
                await new Promise(resolve => setTimeout(resolve, 1000));
                vfxContext.clearRect(0, 0, vfxCanvas.width, vfxCanvas.height);
                await teleportAround(player, opponent);
        
                const screenX = (player.x - camera.x) * camera.zoom + gameCanvas.width / 2;
                const screenY = (player.y - camera.y) * camera.zoom + gameCanvas.height / 2;
                vfxContext.fillStyle = "red";
                vfxContext.font = '50px Arial';
                vfxContext.textAlign = 'center'; // Center align the text
                vfxContext.fillText(`Die`, screenX + 20, screenY - 50);
        
                await new Promise(resolve => setTimeout(resolve, 500));
                screenShake(30, 200);
                fireworkHitVfx(opponent, 100, 500);
                applyDamage(opponent, 50); // Higher damage for ultimate
                showHitVFX(opponent);
                opponent.ignoreGravity = false;
                applyKnockback(player, opponent);
                audioManager.playRandomHitSound();
        
                // End cutscene
                setTimeout(() => {
                    vfxContext.clearRect(0, 0, vfxCanvas.width, vfxCanvas.height);
                    settings.minZoom = DefaultZoom;
                    player.disableControls = false;
                    opponent.disableControls = false;
                    player.ignoreGravity = false;    
                    opponent.ignoreGravity = false;
                    opponent.velocityX = 0;
                    vfxContext.globalCompositeOperation = 'source-over';
                    BattleMusic.play();
                }, cutsceneDuration);
            };
        
            cutscene();
        }
        if (player.character === 3) {
            BattleMusic.pause();
            cutsceneDuration = 0; // Lengthen the duration for a more epic feel
        
            async function darkPortalThrow(player, opponent) {
                // Position the portal
                const portalX = player.x + 200;
                const portalY = player.y;
        
                // Show the portal VFX
                darkPortalVfx(portalX, portalY, 20, 100);
        
                // Player grabs the opponent
                opponent.y = player.y - 10;
                // Voice line
                // audioManager.playVoiceLine('Feel the void!');
                await new Promise(resolve => setTimeout(resolve, 1000));
        
                opponent.velocityX = -15;
        
                await new Promise(resolve => setTimeout(resolve, 500));
                opponent.velocityX = 0;
                opponent.ignoreGravity = true;
        
                // Throw opponent into the portal
                await new Promise(resolve => setTimeout(resolve, 1000));
                opponent.x = portalX;
                opponent.y = portalY;
                opponent.visible = false;
        
                await new Promise(resolve => setTimeout(resolve, 500));
                opponent.x = gameCanvas.width / 2 - 10000;
                opponent.y = gameCanvas.height / 2;
                opponent.visible = true;
            }
        
            const cutscene = async () => {
                await new Promise(resolve => setTimeout(resolve, 300));
                opponent.velocityX = 0;
                opponent.ignoreGravity = true;
        
                await darkPortalThrow(player, opponent);
        
                // Camera cuts to the player sitting in the middle of the void
                vfxContext.clearRect(0, 0, vfxCanvas.width, vfxCanvas.height);
                vfxContext.fillStyle = 'black';
                vfxContext.fillRect(0, 0, vfxCanvas.width, vfxCanvas.height); // Ensure black background stays
                
                const originalGameCanvasStyle = backgroundImage;
                backgroundImage = "black";
                focusTarget = opponent;
        
                // Player sitting in the middle of nothing for a second
                await new Promise(resolve => setTimeout(resolve, 1000));
        
                await new Promise(resolve => setTimeout(resolve, 1000));
                vfxContext.clearRect(0, 0, vfxCanvas.width, vfxCanvas.height);
        
                for (let frame = 0; frame < 60; frame++) {
        
                    // Words appear, shake, and disappear as hands get closer
                    const words = ['Despair', 'Oblivion', 'Darkness', 'Eclipse', 'Shadow', 'Void', 'Nightmare'];
        
                    words.forEach((word) => {
                        const xPos = Math.random() * vfxCanvas.width;
                        const yPos = Math.random() * vfxCanvas.height;
        
                        for (let shake = 0; shake < 10; shake++) {
                            const shakeX = xPos + (Math.random() - 0.5) * 1;
                            const shakeY = yPos + (Math.random() - 0.5) * 1;
        
                            vfxContext.save();
                            vfxContext.fillStyle = 'white';
                            vfxContext.font = '50px Arial';
                            vfxContext.textAlign = 'center';
                            vfxContext.fillText(word, shakeX, shakeY);
                            vfxContext.restore();
                        }
                    });
                    await new Promise(resolve => setTimeout(resolve, 1000 / 30)); // 30 FPS
                }        
        
                await new Promise(resolve => setTimeout(resolve, 1000));
                vfxContext.clearRect(0, 0, vfxCanvas.width, vfxCanvas.height);
                vfxContext.fillStyle = 'black';
                vfxContext.fillRect(0, 0, vfxCanvas.width, vfxCanvas.height); // Ensure black background stays
        
                opponent.x = gameCanvas.width / 2;
                opponent.y = gameCanvas.height / 2 - 1000;
                backgroundImage = originalGameCanvasStyle;
        
                await new Promise(resolve => setTimeout(resolve, 500));
                vfxContext.clearRect(0, 0, vfxCanvas.width, vfxCanvas.height);

                // Giant hand grabs the player and throws them out of the portal
                // darkPortalVfx(player, 20, 100); // More rings for exit portal
                await new Promise(resolve => setTimeout(resolve, 300));
                focusTarget = null;
                applyDamage(opponent, 50);
        
                // End cutscene
                setTimeout(() => {
                    vfxContext.clearRect(0, 0, vfxCanvas.width, vfxCanvas.height);
                    settings.minZoom = DefaultZoom;
                    player.disableControls = false;
                    opponent.disableControls = false;
                    player.ignoreGravity = false;
                    opponent.ignoreGravity = false;
                    opponent.velocityX = 0;
                    vfxContext.globalCompositeOperation = 'source-over';
                    BattleMusic.play();
                }, cutsceneDuration);
            };
            cutscene();
        }
    }        

    function darkPortalVfx(x, y, effectRings = 10, effectRingRadius = 50) {
        const effectColors = ['black', 'purple', 'darkblue'];
        const ringsData = [];
    
        for (let i = 0; i < effectRings; i++) {
            ringsData.push({
                color: effectColors[i % effectColors.length],
                radius: effectRingRadius,
                progress: 0,
                opacity: 1
            });
        }
    
        function animateEffects() {
            vfxContext.clearRect(0, 0, vfxCanvas.width, vfxCanvas.height);
            vfxContext.globalAlpha = 1; // Reset globalAlpha before drawing
    
            ringsData.forEach(ring => {
                ring.progress += 0.03; // Adjust the speed of the effect
                ring.opacity = 1.1 - ring.progress;
    
                const xPos = (x - camera.x) * camera.zoom + vfxCanvas.width / 2;
                const yPos = (y - camera.y) * camera.zoom + vfxCanvas.height / 2;
    
                vfxContext.strokeStyle = ring.color;
                vfxContext.globalAlpha = ring.opacity;
                vfxContext.beginPath();
                vfxContext.arc(xPos, yPos, ring.radius * ring.progress * camera.zoom, 0, 2 * Math.PI);
                vfxContext.stroke();
            });
    
            if (ringsData.some(ring => ring.progress < 1)) {
                requestAnimationFrame(animateEffects);
            } else {
                vfxContext.clearRect(0, 0, vfxCanvas.width, vfxCanvas.height);
                vfxContext.globalAlpha = 1; // Reset globalAlpha after clearing
            }
        }
    
        requestAnimationFrame(animateEffects);
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
    
                const x = (playerX + playerWidth / 2 + Math.cos(beam.angle) * beam.progress * effectBeamLength - camera.x) * camera.zoom + vfxCanvas.width / 2;
                const y = (playerY + playerHeight / 2 + Math.sin(beam.angle) * beam.progress * effectBeamLength - camera.y) * camera.zoom + vfxCanvas.height / 2;
    
                vfxContext.strokeStyle = beam.color;
                vfxContext.globalAlpha = beam.opacity;
                vfxContext.beginPath();
                vfxContext.moveTo((playerX + playerWidth / 2 - camera.x) * camera.zoom + vfxCanvas.width / 2, (playerY + playerHeight / 2 - camera.y) * camera.zoom + vfxCanvas.height / 2);
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

    function createSmokeVfx(player, position = 'top', duration = 1000) {
        const particleCount = 20; // Number of smoke particles
        const particles = [];
    
        // Create smoke particles
        for (let i = 0; i < particleCount; i++) {
            let x, y, velocityX, velocityY;
            switch (position) {
                case 'top':
                    x = player.x + Math.random() * player.width;
                    y = player.y;
                    velocityX = Math.random() * 2 - 1;
                    velocityY = -Math.abs(Math.random() * 2); // Move upwards
                    break;
                case 'bottom':
                    x = player.x + Math.random() * player.width;
                    y = player.y + player.height;
                    velocityX = Math.random() * 2 - 1;
                    velocityY = Math.abs(Math.random() * 2); // Move upwards
                    break;
                case 'left':
                    x = player.x;
                    y = player.y + Math.random() * player.height;
                    velocityX = -Math.abs(Math.random() * 2); // Move right
                    velocityY = Math.random() * 2 - 1;
                    break;
                case 'right':
                    x = player.x + player.width;
                    y = player.y + Math.random() * player.height;
                    velocityX = Math.abs(Math.random() * 2); // Move left
                    velocityY = Math.random() * 2 - 1;
                    break;
                default:
                    x = player.x + Math.random() * player.width;
                    y = player.y + Math.random() * player.height;
                    velocityX = Math.random() * 2 - 1;
                    velocityY = Math.random() * 2 - 1;
            }
    
            particles.push({
                x: x,
                y: y,
                velocityX: velocityX,
                velocityY: velocityY,
                alpha: 1, // Initial opacity
                size: Math.random() * 5 + 5 // Randomize particle size
            });
        }
    
        function animateSmoke(timestamp) {
            vfxContext.clearRect(0, 0, vfxCanvas.width, vfxCanvas.height);
    
            particles.forEach(particle => {
                particle.x += particle.velocityX;
                particle.y += particle.velocityY;
                particle.alpha -= 0.01; // Fade out particles
    
                const screenX = (particle.x - camera.x) * camera.zoom + vfxCanvas.width / 2;
                const screenY = (particle.y - camera.y) * camera.zoom + vfxCanvas.height / 2;
    
                if (particle.alpha > 0) {
                    vfxContext.globalAlpha = particle.alpha;
                    vfxContext.fillStyle = 'rgba(225, 225, 225, ' + particle.alpha + ')';
                    vfxContext.beginPath();
                    vfxContext.arc(screenX, screenY, particle.size * camera.zoom, 0, Math.PI * 2);
                    vfxContext.fill();
                }
            });
    
            if (particles.some(particle => particle.alpha > 0)) {
                requestAnimationFrame(animateSmoke);
            } else {
                vfxContext.clearRect(0, 0, vfxCanvas.width, vfxCanvas.height);
                vfxContext.globalAlpha = 1; // Reset globalAlpha after clearing
            }
        }
    
        requestAnimationFrame(animateSmoke);
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
    player1.controls = { up: controls[0], left: controls[1], down: controls[2], right: controls[3], melee: player1.controls.melee, ability: player1.controls.ability, ultimate: player1.controls.ultimate };
    document.getElementById('player1-ultimate-key').textContent = player1.controls.ultimate;
    document.getElementById('player1-melee-key').textContent = player1.controls.melee;
    document.getElementById('player1-ability-key').textContent = player1.controls.ability;
});

document.getElementById('player1-melee').addEventListener('input', (event) => {
    player1.controls.melee = event.target.value.toUpperCase();
    document.getElementById('player1-melee-key').textContent = player1.controls.melee;
});

document.getElementById('player1-ability').addEventListener('input', (event) => {
    player1.controls.ability = event.target.value.toUpperCase();
    document.getElementById('player1-ability-key').textContent = player1.controls.ability;
});

document.getElementById('player1-ultimate').addEventListener('input', (event) => {
    player1.controls.ultimate = event.target.value.toUpperCase();
    document.getElementById('player1-ultimate-key').textContent = player1.controls.ultimate;
});

document.getElementById('player2-controls').addEventListener('input', (event) => {
    const controls = event.target.value.toUpperCase().split('');
    player2.controls = { up: controls[0], left: controls[1], down: controls[2], right: controls[3], melee: player2.controls.melee, ability: player2.controls.ability, ultimate: player2.controls.ultimate };
    document.getElementById('player2-ultimate-key').textContent = player2.controls.ultimate;
    document.getElementById('player2-melee-key').textContent = player2.controls.melee;
    document.getElementById('player2-ability-key').textContent = player2.controls.ability;
});

document.getElementById('player2-melee').addEventListener('input', (event) => {
    player2.controls.melee = event.target.value.toUpperCase();
    document.getElementById('player2-melee-key').textContent = player2.controls.melee;
});

document.getElementById('player2-ability').addEventListener('input', (event) => {
    player2.controls.melee = ability.target.value.toUpperCase();
    document.getElementById('player2-ability-key').textContent = player2.controls.ability;
});

document.getElementById('player2-ultimate').addEventListener('input', (event) => {
    player2.controls.ultimate = event.target.value.toUpperCase();
    document.getElementById('player2-ultimate-key').textContent = player2.controls.ultimate;
});