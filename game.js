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
    window.renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.shadowMap.enabled = true;
    document.body.appendChild(renderer.domElement);
}

// Lighting
const ambientLight = new THREE.AmbientLight(0x404040);
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
directionalLight.position.set(10, 20, 10);
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
    const cameraOffset = new THREE.Vector3(0, 5, 10);
    const rotatedOffset = cameraOffset.clone().applyAxisAngle(new THREE.Vector3(0, 1, 0), player.group.rotation.y);
    camera.position.copy(player.group.position).add(rotatedOffset);
    camera.lookAt(player.group.position);
}

// 60 FPS Logic Update
const TARGET_FPS = 60;
const FRAME_TIME = 1000 / TARGET_FPS;
let lastFrameTime = performance.now();

function gameLoop() {
    requestAnimationFrame(gameLoop);

    const now = performance.now();
    const deltaTime = (now - lastFrameTime) / 16.67; // Normalize to ~60 FPS
    lastFrameTime = now;

    updatePlayerMovement(player, deltaTime);
    updateCamera();

    TWEEN.update()

    renderer.render(scene, camera);
}

gameLoop();
