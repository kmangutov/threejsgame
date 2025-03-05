// Animation state management functions
export function startWalkingAnimation(character) {
    // Reset animation state if switching from another state
    if (character.movementState !== "walking") {
        character.armRotation = 0;
        character.movementState = "walking";
    }
}

export function startIdleAnimation(character) {
    // Reset animation state if switching from another state
    if (character.movementState !== "idle") {
        character.armRotation = 0;
        character.movementState = "idle";
    }
}

export function startJumpAnimation(character) {
    // Only jump if not already jumping
    if (!character.jumping) {
        character.jumping = true;
        character.velocity = character.jumpForce;
        character.movementState = "jumping";
    }
}

export function startSlashAnimation(character) {
    if (character.isSlashing) return;
    character.isSlashing = true;

    // Get the smile group (third child of the face group)
    const faceGroup = character.head.children[0];
    const smileGroup = faceGroup.children[2];
    character.originalSmileRotation = smileGroup.rotation.z;

    // Flip smile upside down around its center
    new TWEEN.Tween(smileGroup.rotation)
        .to({ z: Math.PI }, 300)
        .start();

    // Create slash animation for right arm and scimitar
    const slashTween = new TWEEN.Tween(character.arms.right.rotation)
        .to({ 
            x: -Math.PI * 0.5,  // Raise arm up
            y: Math.PI * 0.25   // Rotate slightly outward
        }, 150)
        .easing(TWEEN.Easing.Back.Out)
        .chain(
            new TWEEN.Tween(character.arms.right.rotation)
                .to({ 
                    x: -Math.PI * 0.25,  // Swing down
                    y: -Math.PI * 0.5    // Swing across body
                }, 200)
                .easing(TWEEN.Easing.Cubic.Out)
                .chain(
                    new TWEEN.Tween(character.arms.right.rotation)
                        .to({ 
                            x: 0,  // Return to original position
                            y: 0
                        }, 300)
                        .easing(TWEEN.Easing.Quadratic.InOut)
                        .onComplete(() => {
                            character.isSlashing = false;
                            // Reset smile rotation
                            smileGroup.rotation.z = 0;
                            smileGroup.updateMatrix();
                        })
                )
        )
        .start();

    character.slashTween = slashTween;
}

export function updateCharacterAnimation(character, deltaTime) {
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
            
            // Only animate left arm and legs during walking
            character.arms.left.rotation.x = -armSwing;
            // Only animate right arm if not slashing
            if (!character.isSlashing) {
                character.arms.right.rotation.x = armSwing;
            }
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
            // Only reset right arm if not slashing
            if (!character.isSlashing) {
                character.arms.right.rotation.x = 0;
            }
            character.legs.left.rotation.x = 0;
            character.legs.right.rotation.x = 0;
            break;
            
        case "jumping":
            // Jumping animation - arms up
            character.arms.left.rotation.x = -0.5;
            // Only animate right arm if not slashing
            if (!character.isSlashing) {
                character.arms.right.rotation.x = -0.5;
            }
            break;
    }
} 