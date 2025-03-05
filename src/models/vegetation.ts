interface TreeOptions {
    height?: number;
    trunkRadius?: number;
    trunkHeight?: number;
    foliageRadius?: number;
    foliageHeight?: number;
    barkColor?: string;
    leafColor?: string;
    windEffect?: boolean;
}

export class TreeModel {
    group: THREE.Group;
    private leaves: THREE.Mesh[];
    private trunk: THREE.Mesh;
    private initialLeafPositions: THREE.Vector3[];
    private time: number;

    constructor(options: TreeOptions = {}) {
        const {
            height = 5,
            trunkRadius = 0.2,
            trunkHeight = height * 0.6,
            foliageRadius = 2,
            foliageHeight = height * 0.7,
            barkColor = '#3d2817',
            leafColor = '#2d5a27',
            windEffect = true
        } = options;

        this.group = new THREE.Group();
        this.leaves = [];
        this.initialLeafPositions = [];
        this.time = 0;

        // Create trunk with realistic bark texture
        const trunkGeometry = new THREE.CylinderGeometry(trunkRadius, trunkRadius * 1.2, trunkHeight, 8);
        const trunkMaterial = new THREE.MeshStandardMaterial({
            color: barkColor,
            roughness: 0.9,
            metalness: 0.1,
            wireframe: false
        });
        this.trunk = new THREE.Mesh(trunkGeometry, trunkMaterial);
        this.trunk.castShadow = true;
        this.trunk.receiveShadow = true;
        this.trunk.position.y = trunkHeight / 2;
        this.group.add(this.trunk);

        // Create foliage using multiple cone shapes
        const leafGeometry = new THREE.ConeGeometry(foliageRadius * 0.7, foliageHeight, 8);
        const leafMaterial = new THREE.MeshStandardMaterial({
            color: leafColor,
            roughness: 0.8,
            metalness: 0.1,
            side: THREE.DoubleSide
        });

        // Create multiple layers of leaves
        const layers = 3;
        for (let i = 0; i < layers; i++) {
            const leaf = new THREE.Mesh(leafGeometry, leafMaterial);
            leaf.position.y = trunkHeight - (i * foliageHeight * 0.3);
            leaf.scale.setScalar(1 - (i * 0.2));
            leaf.castShadow = true;
            leaf.receiveShadow = true;
            this.leaves.push(leaf);
            this.initialLeafPositions.push(leaf.position.clone());
            this.group.add(leaf);
        }
    }

    update(deltaTime: number) {
        // Wind animation removed
    }
}

export class Vegetation {
    static createBush(options: { radius?: number; height?: number; color?: string } = {}) {
        const {
            radius = 1,
            height = 1.5,
            color = '#1a472a'
        } = options;

        const group = new THREE.Group();
        const segments = 5;

        for (let i = 0; i < segments; i++) {
            const sphereGeometry = new THREE.SphereGeometry(
                radius * (0.7 + Math.random() * 0.3),
                8,
                8
            );
            const material = new THREE.MeshStandardMaterial({
                color: new THREE.Color(color).offsetHSL(0, 0, Math.random() * 0.2 - 0.1),
                roughness: 0.8,
                metalness: 0.1
            });
            const sphere = new THREE.Mesh(sphereGeometry, material);

            // Position spheres to form a bush shape
            const angle = (i / segments) * Math.PI * 2;
            sphere.position.x = Math.cos(angle) * (radius * 0.3);
            sphere.position.z = Math.sin(angle) * (radius * 0.3);
            sphere.position.y = height * (0.5 + Math.random() * 0.3);
            sphere.scale.setScalar(0.8 + Math.random() * 0.4);

            sphere.castShadow = true;
            sphere.receiveShadow = true;
            group.add(sphere);
        }

        return group;
    }

    static createGrass(options: { width?: number; height?: number; color?: string } = {}) {
        const {
            width = 0.1,
            height = 0.3,
            color = '#3a5f0b'
        } = options;

        const group = new THREE.Group();
        const bladeCount = 5;

        for (let i = 0; i < bladeCount; i++) {
            const blade = new THREE.Mesh(
                new THREE.PlaneGeometry(width, height),
                new THREE.MeshStandardMaterial({
                    color: new THREE.Color(color).offsetHSL(0, 0, Math.random() * 0.2 - 0.1),
                    side: THREE.DoubleSide,
                    transparent: true,
                    alphaTest: 0.5
                })
            );

            blade.position.x = (Math.random() - 0.5) * width * 2;
            blade.position.z = (Math.random() - 0.5) * width * 2;
            blade.rotation.y = Math.random() * Math.PI;
            blade.rotation.x = Math.random() * 0.2;

            group.add(blade);
        }

        return group;
    }
} 