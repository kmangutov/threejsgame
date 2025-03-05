import { randomPosition } from "./utils.js";

export function createWorld(scene) {
    const groundGeometry = new THREE.PlaneGeometry(100, 100);
    const groundMaterial = new THREE.MeshStandardMaterial({ color: 0x355e3b });
    const ground = new THREE.Mesh(groundGeometry, groundMaterial);
    ground.rotation.x = -Math.PI / 2;
    scene.add(ground);

    for (let i = 0; i < 30; i++) {
        createGrassPatch(scene, randomPosition(), randomPosition(), Math.random() * 3 + 2);
    }

    for (let i = 0; i < 15; i++) {
        createTree(scene, randomPosition(), randomPosition());
    }
}

function createGrassPatch(scene, x, z, size) {
    const grassGeometry = new THREE.PlaneGeometry(size, size);
    const grassMaterial = new THREE.MeshStandardMaterial({ color: 0x7cfc00 });
    const grass = new THREE.Mesh(grassGeometry, grassMaterial);
    grass.rotation.x = -Math.PI / 2;
    grass.position.set(x, 0.01, z);
    scene.add(grass);
}

function createTree(scene, x, z) {
    const trunk = new THREE.Mesh(new THREE.BoxGeometry(0.5, 2, 0.5), new THREE.MeshStandardMaterial({ color: 0x8b4513 }));
    trunk.position.set(x, 1, z);
    scene.add(trunk);

    const leaves = new THREE.Mesh(new THREE.BoxGeometry(2, 2, 2), new THREE.MeshStandardMaterial({ color: 0x228b22 }));
    leaves.position.set(x, 3, z);
    scene.add(leaves);
}

export function createRiver(scene) {
    const river = new THREE.Mesh(new THREE.PlaneGeometry(10, 120), new THREE.MeshStandardMaterial({ color: 0x4169e1 }));
    river.rotation.x = -Math.PI / 2;
    river.position.set(20, 0.05, 0);
    scene.add(river);
}
