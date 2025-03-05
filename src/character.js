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
    createDragonScimitar(character);
    
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

function addSmileyFace(head) {
    // Create a group for the face elements
    const faceGroup = new THREE.Group();
    
    // Left eye
    const leftEye = new THREE.Mesh(
        new THREE.CircleGeometry(0.06, 16),
        new THREE.MeshBasicMaterial({ color: 0x000000 })
    );
    leftEye.position.set(-0.2, 0.1, 0.5);
    
    // Right eye
    const rightEye = new THREE.Mesh(
        new THREE.CircleGeometry(0.06, 16),
        new THREE.MeshBasicMaterial({ color: 0x000000 })
    );
    rightEye.position.set(0.2, 0.1, 0.5);
    
    // Smile (curved line)
    const smileGeometry = new THREE.BufferGeometry();
    const smileCurve = new THREE.QuadraticBezierCurve3(
        new THREE.Vector3(-0.2, -0.1, 0.5),
        new THREE.Vector3(0, -0.2, 0.5),
        new THREE.Vector3(0.2, -0.1, 0.5)
    );
    
    const smilePoints = smileCurve.getPoints(20);
    smileGeometry.setFromPoints(smilePoints);
    
    const smile = new THREE.Line(
        smileGeometry,
        new THREE.LineBasicMaterial({ color: 0x000000, linewidth: 3 })
    );
    
    // Add all face elements to the face group
    faceGroup.add(leftEye);
    faceGroup.add(rightEye);
    faceGroup.add(smile);
    
    // No need for additional positioning as we've set the z coordinates directly
    
    // Add the face group to the head
    head.add(faceGroup);
}

function createDragonScimitar(character) {
    // Create a group for the scimitar
    const scimitarGroup = new THREE.Group();
    
    // Create the blade using a custom shape
    const bladeShape = new THREE.Shape();
    bladeShape.moveTo(0, 0);
    bladeShape.lineTo(0.05, 0.6);
    bladeShape.bezierCurveTo(0.1, 0.8, 0.2, 0.9, 0.3, 0.7);
    bladeShape.lineTo(0.4, 0.3);
    bladeShape.lineTo(0.3, 0);
    bladeShape.lineTo(0, 0);
    
    const extrudeSettings = {
        steps: 1,
        depth: 0.02,
        bevelEnabled: true,
        bevelThickness: 0.01,
        bevelSize: 0.01,
        bevelSegments: 1
    };
    
    const bladeGeometry = new THREE.ExtrudeGeometry(bladeShape, extrudeSettings);
    const bladeMaterial = new THREE.MeshStandardMaterial({ 
        color: 0x22cc22,  // Dragon scimitar green color
        metalness: 0.8,
        roughness: 0.2
    });
    
    const blade = new THREE.Mesh(bladeGeometry, bladeMaterial);
    
    // Create the handle
    const handleGeometry = new THREE.CylinderGeometry(0.03, 0.03, 0.2, 8);
    const handleMaterial = new THREE.MeshStandardMaterial({ 
        color: 0x8B4513,  // Brown color for handle
        metalness: 0.3,
        roughness: 0.8
    });
    
    const handle = new THREE.Mesh(handleGeometry, handleMaterial);
    handle.position.set(0, -0.1, 0);
    handle.rotation.x = Math.PI / 2;
    
    // Create the hilt (guard)
    const hiltGeometry = new THREE.BoxGeometry(0.15, 0.03, 0.06);
    const hiltMaterial = new THREE.MeshStandardMaterial({ 
        color: 0xFFD700,  // Gold color
        metalness: 0.8,
        roughness: 0.2
    });
    
    const hilt = new THREE.Mesh(hiltGeometry, hiltMaterial);
    hilt.position.set(0, 0, 0);
    
    // Add all parts to the scimitar group
    scimitarGroup.add(blade);
    scimitarGroup.add(handle);
    scimitarGroup.add(hilt);
    
    // Position and rotate the scimitar
    scimitarGroup.rotation.z = Math.PI / 6;  // Tilt the scimitar
    scimitarGroup.rotation.y = Math.PI / 2;  // Orient it outward
    scimitarGroup.position.set(0.2, 0, 0.1);  // Position relative to hand
    scimitarGroup.scale.set(1.25, 1.25, 1.25);  // Half the previous scale of 2.5
    
    // Attach the scimitar to the right arm
    character.arms.right.add(scimitarGroup);
    
    return scimitarGroup;
}

// Expose globally
window.createCharacter = createCharacter;
window.startWalkingAnimation = startWalkingAnimation;
window.startIdleAnimation = startIdleAnimation;
window.startJumpAnimation = startJumpAnimation;
window.updateCharacterAnimation = updateCharacterAnimation;
window.createDragonScimitar = createDragonScimitar;
