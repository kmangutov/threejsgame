import { startSlashAnimation, startJumpAnimation, updateCharacterAnimation } from './character_model.js';

// Ensure keys is declared only once
if (typeof window.keys === "undefined") {
    window.keys = { w: false, a: false, s: false, d: false, left: false, right: false, space: false, q: false };
}

// Track Mouse
let isDragging = false;
let isRightClick = false;
let previousMousePosition = { x: 0, y: 0 };
export let cameraAngle = 0;
export let cameraHeight = 5;
export let cameraDistance = 10;
export let cameraFollow = true; // Single boolean state for camera follow
let deltaMove = { x: 0, y: 0 };

export function setupPlayerInput(player) {
    window.addEventListener("keydown", (e) => {
        const key = e.key.toLowerCase();
        if (keys.hasOwnProperty(key)) keys[key] = true;
        if (e.key === "ArrowLeft") keys.left = true;
        if (e.key === "ArrowRight") keys.right = true;
        if (e.key === " ") keys.space = true;
        
        // Handle Q key press for slash animation
        if (e.key.toLowerCase() === "q" && !player.isSlashing) {
            startSlashAnimation(player);
        }
    });

    window.addEventListener("keyup", (e) => {
        const key = e.key.toLowerCase();
        if (keys.hasOwnProperty(key)) keys[key] = false;
        if (e.key === "ArrowLeft") keys.left = false;
        if (e.key === "ArrowRight") keys.right = false;
        if (e.key === " ") keys.space = false;
    });

    // Mouse Controls
    window.addEventListener("mousedown", (e) => {
        isDragging = true;
        isRightClick = e.button === 2;
        previousMousePosition.x = e.clientX;
        previousMousePosition.y = e.clientY;
        
        // Left-click drag disables camera follow
        if (e.button === 0) {
            cameraFollow = false;
        }
    });

    window.addEventListener("mouseup", (e) => {
        isDragging = false;
        
        // Re-enable camera follow when left mouse is released
        if (e.button === 0) {
            cameraFollow = true;
        }
    });

    window.addEventListener("mousemove", (e) => {
        if (!isDragging) return;

        deltaMove = {
            x: e.clientX - previousMousePosition.x,
            y: e.clientY - previousMousePosition.y,
        };

        if (isRightClick) {
            // Rotate Player (right-click drag)
            player.group.rotation.y -= deltaMove.x * 0.01;
            // Right-click maintains camera follow mode
            cameraFollow = true;
        } else {
            // Orbit camera around player (left-click drag)
            cameraAngle -= deltaMove.x * 0.01;
            cameraHeight = Math.max(2, Math.min(15, cameraHeight + deltaMove.y * 0.05));
            // Left-click disables camera follow
            cameraFollow = false;
        }

        previousMousePosition.x = e.clientX;
        previousMousePosition.y = e.clientY;
    });

    // Prevent right-click menu
    window.addEventListener("contextmenu", (e) => e.preventDefault());
}

// Move and Rotate Player
export function updatePlayerMovement(player, deltaTime) {
    const forward = new THREE.Vector3(0, 0, -1).applyAxisAngle(new THREE.Vector3(0, 1, 0), player.group.rotation.y);
    const right = new THREE.Vector3(1, 0, 0).applyAxisAngle(new THREE.Vector3(0, 1, 0), player.group.rotation.y);

    const isMoving = keys.w || keys.a || keys.s || keys.d;
    
    // Handle movement
    let movement = new THREE.Vector3(0, 0, 0);
    if (keys.w) {
        movement.add(forward.clone().multiplyScalar(player.speed * deltaTime));
    }
    if (keys.s) {
        movement.add(forward.clone().negate().multiplyScalar(player.speed * deltaTime));
    }
    if (keys.a) {
        movement.add(right.clone().negate().multiplyScalar(player.speed * deltaTime));
    }
    if (keys.d) {
        movement.add(right.clone().multiplyScalar(player.speed * deltaTime));
    }
    player.group.position.add(movement);

    if (isMoving) {
        player.movementState = "walking";
    } else if (!player.jumping) {
        // Only set to idle if not jumping and not moving
        player.movementState = "idle";
    }

    // Handle turning with increased speed
    const turnSpeed = player.turnSpeed * 2.0; // Double the turn speed
    if (keys.left) {
        player.group.rotation.y += turnSpeed * deltaTime;
    }
    if (keys.right) {
        player.group.rotation.y -= turnSpeed * deltaTime;
    }
    
    // Handle jumping
    if (keys.space) {
        startJumpAnimation(player);
    }
    
    // Update camera position if following is enabled
    if (cameraFollow && (isMoving || keys.left || keys.right || isRightClick)) {
        resetCameraFollow(player);
    }
    
    // Update character animations
    updateCharacterAnimation(player, deltaTime);
}

function resetCameraFollow(player) {
    // Set camera angle to match player rotation
    cameraAngle = player.group.rotation.y;
    
    // Set default camera height and distance
    cameraHeight = 5;
    cameraDistance = 10;
}
