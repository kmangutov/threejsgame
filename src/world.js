import { randomPosition } from "./utils.js";
import { TreeModel, Vegetation } from "./models/vegetation";
import { RiverModel } from "./models/river";

// Store references to updateable objects
const updateableObjects = [];

export function createWorld(scene) {
    // Create simple green ground
    const groundGeometry = new THREE.PlaneGeometry(100, 100);
    const groundMaterial = new THREE.MeshStandardMaterial({ 
        color: 0x3a5f0b, // Brighter green color
        roughness: 0.8,
        metalness: 0.1
    });
    const ground = new THREE.Mesh(groundGeometry, groundMaterial);
    ground.rotation.x = -Math.PI / 2;
    ground.receiveShadow = true;
    ground.position.y = 0;
    scene.add(ground);

    // Add simple wheat field patches
    for (let i = 0; i < 8; i++) {
        const fieldGeometry = new THREE.PlaneGeometry(4, 6);
        const fieldMaterial = new THREE.MeshBasicMaterial({
            color: 0xdaa520 // Golden color
        });
        
        const field = new THREE.Mesh(fieldGeometry, fieldMaterial);
        field.rotation.x = -Math.PI / 2;
        field.position.set(
            randomPosition() * 0.7,
            0.001,
            randomPosition() * 0.7
        );
        field.rotation.y = Math.random() * Math.PI;
        scene.add(field);
    }

    // Create trees with varying sizes
    for (let i = 0; i < 20; i++) {
        const x = randomPosition();
        const z = randomPosition();
        const height = 4 + Math.random() * 3;
        
        const tree = new TreeModel({
            height: height,
            trunkRadius: 0.15 + Math.random() * 0.1,
            barkColor: '#3d2817',
            leafColor: Math.random() > 0.5 ? '#2d5a27' : '#1f4f19'
        });
        
        tree.group.position.set(x, 0, z);
        tree.group.rotation.y = Math.random() * Math.PI * 2;
        scene.add(tree.group);
        updateableObjects.push(tree);
    }

    // Add bushes around trees and in random spots
    for (let i = 0; i < 30; i++) {
        const x = randomPosition();
        const z = randomPosition();
        const bush = Vegetation.createBush({
            radius: 0.5 + Math.random() * 0.5,
            height: 0.8 + Math.random() * 0.4,
            color: Math.random() > 0.5 ? '#1a472a' : '#2d5a27'
        });
        bush.position.set(x, 0, z);
        scene.add(bush);
    }
}

export function createRiver(scene) {
    const river = RiverModel.create();
    scene.add(river);
}

// Update function to be called in the game loop
export function updateWorld(deltaTime) {
    // No updates needed since wind animation is removed
}
