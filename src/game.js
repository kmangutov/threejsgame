import { createWorld, createRiver } from "./world.js";
import { createCharacter } from "./character_model.js";
import { setupPlayerInput, updatePlayerMovement, cameraAngle, cameraHeight, cameraDistance, cameraFollow } from "./controls.js";

// Ensure scene and camera are only created once
if (typeof window.scene === "undefined") {
    window.scene = new THREE.Scene();
    scene.background = new THREE.Color(0x87ceeb);
}

if (typeof window.camera === "undefined") {
    window.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.set(0, 5, 10);
    camera.lookAt(0, 0, 0);
}

if (typeof window.renderer === "undefined") {
    window.renderer = new THREE.WebGLRenderer({ 
        antialias: true,
        alpha: false,
        powerPreference: "high-performance",
        preserveDrawingBuffer: true
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.shadowMap.enabled = true;
    document.body.appendChild(renderer.domElement);
}

// Lighting
const ambientLight = new THREE.AmbientLight(0x404040);
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
directionalLight.position.set(5, 5, 5);
directionalLight.castShadow = true;
scene.add(directionalLight);

// World
createWorld(scene);
createRiver(scene);

// Player
const player = createCharacter(scene);
setupPlayerInput(player);

// Camera Follow Function
function updateCamera() {
    // Calculate camera position based on orbit angle and height
    const x = Math.sin(cameraAngle) * cameraDistance;
    const z = Math.cos(cameraAngle) * cameraDistance;
    
    // Set camera position relative to player
    camera.position.set(
        player.group.position.x + x,
        player.group.position.y + cameraHeight,
        player.group.position.z + z
    );
    
    // Look at player
    camera.lookAt(
        player.group.position.x,
        player.group.position.y + 1, // Look at upper body/head level
        player.group.position.z
    );
}

// 60 FPS Logic Update
const TARGET_FPS = 60;
const FRAME_TIME = 1000 / TARGET_FPS;
let lastFrameTime = performance.now();
let frameCounter = 0;
let lastFpsUpdate = performance.now();
let fps = 0;

function gameLoop() {
    // Schedule next frame
    requestAnimationFrame(gameLoop);
    
    // Calculate timing
    const now = performance.now();
    const elapsed = now - lastFrameTime;
    
    // Only update if enough time has passed (frame rate capping)
    if (elapsed >= FRAME_TIME) {
        // Calculate actual delta time (capped to prevent large jumps)
        const deltaTime = Math.min(elapsed / FRAME_TIME, 2.0);
        
        // Update last frame time (compensate for any extra time)
        lastFrameTime = now - (elapsed % FRAME_TIME);
        
        // Update game logic with consistent delta time
        updatePlayerMovement(player, 1.0); // Use fixed time step for consistent animations
        updateCamera();
        
        // Update any tweens
        TWEEN.update();
        
        // Render the scene
        renderer.render(scene, camera);
        
        // FPS counter
        frameCounter++;
        if (now - lastFpsUpdate >= 1000) {
            fps = frameCounter;
            frameCounter = 0;
            lastFpsUpdate = now;
            console.log(`FPS: ${fps}`);
        }
    }
}

// Handle window resize
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});

// Start the game loop
gameLoop();
