function createCharacter(scene) {
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
        armRotation: 0
    };

    // Body
    character.body = createBox(1, 1.5, 0.5, 0x3333ff);
    character.body.position.y = 0.75;
    character.group.add(character.body);

    // Head
    character.head = createBox(0.8, 0.8, 0.8, 0xffdbac);
    character.head.position.y = 1.8;
    character.group.add(character.head);

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
    
    return character;
}

function createBox(width, height, depth, color, x = 0, y = 0, z = 0) {
    const geometry = new THREE.BoxGeometry(width, height, depth);
    const material = new THREE.MeshStandardMaterial({ color });
    const mesh = new THREE.Mesh(geometry, material);
    mesh.position.set(x, y, z);
    return mesh;
}

function startWalkingAnimation(character) {
    // Reset animation state if switching from another state
    if (character.movementState !== "walking") {
        character.armRotation = 0;
        character.movementState = "walking";
    }
    
    // Walking animation logic will be handled in updateCharacterAnimation
}

function startIdleAnimation(character) {
    // Reset animation state if switching from another state
    if (character.movementState !== "idle") {
        character.armRotation = 0;
        character.movementState = "idle";
    }
    
    // Idle animation logic will be handled in updateCharacterAnimation
}

function startJumpAnimation(character) {
    // Only jump if not already jumping
    if (!character.jumping) {
        character.jumping = true;
        character.velocity = character.jumpForce;
        character.movementState = "jumping";
    }
}

function updateCharacterAnimation(character, deltaTime) {
    // Handle jumping physics
    if (character.jumping) {
        character.group.position.y += character.velocity;
        character.velocity -= character.gravity;
        
        // Check if landed
        if (character.group.position.y <= 1) {
            character.group.position.y = 1;
            character.jumping = false;
            character.velocity = 0;
            
            // Return to previous state (idle or walking)
            if (character.movementState === "jumping") {
                character.movementState = "idle";
            }
        }
    }
    
    // Handle animations based on movement state
    switch (character.movementState) {
        case "walking":
            // Walking animation - arms swing back and forth
            character.armRotation += character.animationSpeed;
            const armSwing = Math.sin(character.armRotation) * 0.5;
            
            character.arms.left.rotation.x = -armSwing;
            character.arms.right.rotation.x = armSwing;
            character.legs.left.rotation.x = armSwing;
            character.legs.right.rotation.x = -armSwing;
            break;
            
        case "idle":
            // Idle animation - more prominent breathing movement
            const breathe = Math.sin(Date.now() * 0.008) * 0.08;
            character.body.position.y = 0.75 + breathe;
            
            // Slight head movement with breathing
            character.head.position.y = 1.8 + breathe * 0.5;
            
            // Reset arm and leg rotations
            character.arms.left.rotation.x = 0;
            character.arms.right.rotation.x = 0;
            character.legs.left.rotation.x = 0;
            character.legs.right.rotation.x = 0;
            break;
            
        case "jumping":
            // Jumping animation - arms up
            character.arms.left.rotation.x = -0.5;
            character.arms.right.rotation.x = -0.5;
            break;
    }
}

// Expose globally
window.createCharacter = createCharacter;
window.startWalkingAnimation = startWalkingAnimation;
window.startIdleAnimation = startIdleAnimation;
window.startJumpAnimation = startJumpAnimation;
window.updateCharacterAnimation = updateCharacterAnimation;
