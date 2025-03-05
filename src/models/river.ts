export class RiverModel {
    static create() {
        const riverShape = new THREE.Shape();
        
        // Define simple curve points
        riverShape.moveTo(15, -60);
        riverShape.quadraticCurveTo(25, -20, 20, 0);
        riverShape.quadraticCurveTo(15, 20, 25, 60);
        
        // Add width to the river
        riverShape.lineTo(30, 60);
        riverShape.quadraticCurveTo(20, 20, 25, 0);
        riverShape.quadraticCurveTo(30, -20, 20, -60);
        riverShape.closePath();
        
        const riverGeometry = new THREE.ShapeGeometry(riverShape);
        const riverMaterial = new THREE.MeshBasicMaterial({ 
            color: 0x4169e1,
            transparent: true,
            opacity: 0.8
        });
        
        const river = new THREE.Mesh(riverGeometry, riverMaterial);
        river.rotation.x = -Math.PI / 2;
        river.position.y = 0.001;
        
        return river;
    }
} 