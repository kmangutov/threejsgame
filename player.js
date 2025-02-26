// Ensure keys is declared only once
if (typeof window.keys === "undefined") {
    window.keys = { w: false, a: false, s: false, d: false, left: false, right: false, space: false };
}

// Track Mouse
let isDragging = false;
let isRightClick = false;
let previousMousePosition = { x: 0, y: 0 };

function setupPlayerInput(player) {
    window.addEventListener("keydown", (e) => {
        const key = e.key.toLowerCase();
        if (keys.hasOwnProperty(key)) keys[key] = true;
        if (e.key === "ArrowLeft") keys.left = true;
        if (e.key === "ArrowRight") keys.right = true;
    });

    window.addEventListener("keyup", (e) => {
        const key = e.key.toLowerCase();
        if (keys.hasOwnProperty(key)) keys[key] = false;
        if (e.key === "ArrowLeft") keys.left = false;
        if (e.key === "ArrowRight") keys.right = false;
    });

    // Mouse Controls
    window.addEventListener("mousedown", (e) => {
        isDragging = true;
        isRightClick = e.button === 2;
        previousMousePosition.x = e.clientX;
        previousMousePosition.y = e.clientY;
    });

    window.addEventListener("mouseup", () => {
        isDragging = false;
    });

    window.addEventListener("mousemove", (e) => {
        if (!isDragging) return;

        const deltaMove = {
            x: e.clientX - previousMousePosition.x,
            y: e.clientY - previousMousePosition.y,
        };

        if (isRightClick) {
            // Rotate Player
            player.group.rotation.y -= deltaMove.x * 0.01;
        } else {
            // Move Camera
            camera.position.x -= deltaMove.x * 0.05;
            camera.position.y = Math.max(2, camera.position.y - deltaMove.y * 0.05);
            camera.lookAt(player.group.position);
        }

        previousMousePosition.x = e.clientX;
        previousMousePosition.y = e.clientY;
    });

    // Prevent right-click menu
    window.addEventListener("contextmenu", (e) => e.preventDefault());
}

// Move and Rotate Player
function updatePlayerMovement(player, deltaTime) {
    const forward = new THREE.Vector3(0, 0, -1).applyAxisAngle(new THREE.Vector3(0, 1, 0), player.group.rotation.y);
    const right = new THREE.Vector3(1, 0, 0).applyAxisAngle(new THREE.Vector3(0, 1, 0), player.group.rotation.y);

    if (keys.w) player.group.position.add(forward.multiplyScalar(player.speed * deltaTime));
    if (keys.s) player.group.position.add(forward.negate().multiplyScalar(player.speed * deltaTime));
    if (keys.a) player.group.position.add(right.negate().multiplyScalar(player.speed * deltaTime));
    if (keys.d) player.group.position.add(right.multiplyScalar(player.speed * deltaTime));

    // Fix: Rotate Player with Arrow Keys
    if (keys.left) player.group.rotation.y += player.turnSpeed * deltaTime;
    if (keys.right) player.group.rotation.y -= player.turnSpeed * deltaTime;
}

// Expose globally
window.setupPlayerInput = setupPlayerInput;
window.updatePlayerMovement = updatePlayerMovement;
