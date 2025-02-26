function createPlayer(scene) {
    const player = {
        group: new THREE.Group(),
        speed: 0.15,
        turnSpeed: 0.03,
        jumpForce: 0.3,
        jumping: false,
        velocity: 0,
        gravity: 0.01,
        health: 100
    };

    // Body
    const bodyGeometry = new THREE.BoxGeometry(1, 1.5, 0.5);
    const bodyMaterial = new THREE.MeshStandardMaterial({ color: 0x3333ff });
    const body = new THREE.Mesh(bodyGeometry, bodyMaterial);
    body.position.y = 0.75;
    player.group.add(body);

    // Head
    const headGeometry = new THREE.BoxGeometry(0.8, 0.8, 0.8);
    const headMaterial = new THREE.MeshStandardMaterial({ color: 0xffdbac });
    const head = new THREE.Mesh(headGeometry, headMaterial);
    head.position.y = 1.8;
    player.group.add(head);

    player.group.position.y = 1;
    scene.add(player.group);

    return player;
}

// Player Movement
const keys = { w: false, a: false, s: false, d: false, left: false, right: false, space: false };

window.addEventListener('keydown', (e) => {
    if (e.key.toLowerCase() in keys) {
        keys[e.key.toLowerCase()] = true;
    }
    if (e.key === "ArrowLeft") keys.left = true;
    if (e.key === "ArrowRight") keys.right = true;
});

window.addEventListener('keyup', (e) => {
    if (e.key.toLowerCase() in keys) {
        keys[e.key.toLowerCase()] = false;
    }
    if (e.key === "ArrowLeft") keys.left = false;
    if (e.key === "ArrowRight") keys.right = false;
});

function updatePlayerMovement(player) {
    if (keys.space && !player.jumping) {
        player.jumping = true;
        player.velocity = player.jumpForce;
    }

    if (player.jumping) {
        player.group.position.y += player.velocity;
        player.velocity -= player.gravity;
        if (player.group.position.y <= 1) {
            player.group.position.y = 1;
            player.jumping = false;
            player.velocity = 0;
        }
    }

    if (keys.left) player.group.rotation.y += player.turnSpeed;
    if (keys.right) player.group.rotation.y -= player.turnSpeed;

    const forward = new THREE.Vector3(0, 0, -1).applyAxisAngle(new THREE.Vector3(0, 1, 0), player.group.rotation.y);
    const right = new THREE.Vector3(1, 0, 0).applyAxisAngle(new THREE.Vector3(0, 1, 0), player.group.rotation.y);
    
    if (keys.w) player.group.position.add(forward.multiplyScalar(player.speed));
    if (keys.s) player.group.position.add(forward.negate().multiplyScalar(player.speed));
    if (keys.a) player.group.position.add(right.negate().multiplyScalar(player.speed));
    if (keys.d) player.group.position.add(right.multiplyScalar(player.speed));
}

// Mouse controls for camera and player rotation
let isDragging = false;
let isRightClick = false;
let previousMousePosition = { x: 0, y: 0 };

window.addEventListener('mousedown', (e) => {
    isDragging = true;
    isRightClick = e.button === 2;
    previousMousePosition.x = e.clientX;
    previousMousePosition.y = e.clientY;
});

window.addEventListener('mouseup', () => {
    isDragging = false;
});

window.addEventListener('mousemove', (e) => {
    if (!isDragging) return;

    const deltaMove = {
        x: e.clientX - previousMousePosition.x,
        y: e.clientY - previousMousePosition.y
    };

    if (isRightClick) {
        // Right-click drag to turn character
        player.group.rotation.y -= deltaMove.x * 0.01;
    } else {
        // Left-click drag to move camera
        camera.position.y = Math.max(2, camera.position.y - deltaMove.y * 0.05);
    }

    previousMousePosition.x = e.clientX;
    previousMousePosition.y = e.clientY;
});

// Prevent context menu on right-click
window.addEventListener('contextmenu', (e) => e.preventDefault());
