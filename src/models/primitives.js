// Basic primitive creation functions
export function createBox(width, height, depth, color, x = 0, y = 0, z = 0) {
    const geometry = new THREE.BoxGeometry(width, height, depth);
    const material = new THREE.MeshStandardMaterial({ color });
    const mesh = new THREE.Mesh(geometry, material);
    mesh.position.set(x, y, z);
    return mesh;
}

export function createDragonScimitar(parentMesh) {
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
    
    // Attach the scimitar to the parent mesh
    parentMesh.add(scimitarGroup);
    
    return scimitarGroup;
}

export function addSmileyFace(head) {
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
    
    // Create a group specifically for the smile to handle its rotation
    const smileGroup = new THREE.Group();
    
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
    
    // Add smile to its group and position the group
    smileGroup.add(smile);
    smileGroup.position.set(0, -0.1, 0); // Move pivot point to center of smile
    smile.position.set(0, 0.1, 0); // Offset smile to compensate for group position
    
    // Add all face elements to the face group
    faceGroup.add(leftEye);
    faceGroup.add(rightEye);
    faceGroup.add(smileGroup);
    
    // Add the face group to the head
    head.add(faceGroup);
    
    return faceGroup;
} 