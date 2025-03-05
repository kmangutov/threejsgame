import { createBox, createDragonScimitar, addSmileyFace } from './models/primitives.js';
import {
    startWalkingAnimation,
    startIdleAnimation,
    startJumpAnimation,
    startSlashAnimation,
    updateCharacterAnimation
} from './animations/character_animations.js';

export function createCharacter(scene) {
    const character = {
        group: new THREE.Group(),
        speed: 0.15,
        turnSpeed: 0.03,
        jumpForce: 0.3,
        jumping: false,
        velocity: 0,
        gravity: 0.01,
        health: 100,
        movementState: "idle",
        animationSpeed: 0.2,
        armRotation: 0,
        isSlashing: false,
        slashTween: null,
        originalFaceRotation: 0
    };

    // Body
    character.body = createBox(1, 1.5, 0.5, 0x3333ff);
    character.body.position.y = 0.75;
    character.group.add(character.body);

    // Head
    character.head = createBox(0.8, 0.8, 0.8, 0xffdbac);
    character.head.position.y = 1.8;
    character.group.add(character.head);
    
    // Face (smiley)
    addSmileyFace(character.head);

    // Arms
    character.arms = {
        left: createBox(0.25, 1, 0.25, 0x3333ff, -0.625, 0.75),
        right: createBox(0.25, 1, 0.25, 0x3333ff, 0.625, 0.75)
    };
    character.group.add(character.arms.left, character.arms.right);

    // Legs
    character.legs = {
        left: createBox(0.25, 1, 0.25, 0x000066, -0.25, -0.25),
        right: createBox(0.25, 1, 0.25, 0x000066, 0.25, -0.25)
    };
    character.group.add(character.legs.left, character.legs.right);

    character.group.position.y = 1;
    scene.add(character.group);
    
    // Start with idle animation by default
    startIdleAnimation(character);
    
    // Create and attach a dragon scimitar to the character's right hand
    createDragonScimitar(character.arms.right);
    
    return character;
}

// Export animation functions for external use
export {
    startWalkingAnimation,
    startIdleAnimation,
    startJumpAnimation,
    startSlashAnimation,
    updateCharacterAnimation
};
