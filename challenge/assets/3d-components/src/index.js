import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import GUI from 'dat.gui'

const EARTH_AXIS_OF_ROTATION = 23.5;
const ROTATION_SPEED = 0.0001;
const LINE_COLOUR = 0xffff00;

function initThreeScene() {
    // Scene setup
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);

    // Earth texture and geometry
    const sphereTexture = new THREE.TextureLoader().load('/assets/textures/earth.jpg');
    const sphereGeometry = new THREE.SphereGeometry(1);
    const material = new THREE.MeshBasicMaterial({ map: sphereTexture });
    const earth = new THREE.Mesh(sphereGeometry, material);
    scene.add(earth);

    // Camera and controls
    camera.position.z = 5;
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.update();

    // Earth's rotation axis
    const earthAxis = new THREE.Vector3(0, Math.tan(EARTH_AXIS_OF_ROTATION * Math.PI / 180), 0);

    // Axis visualization
    const arrowHelper = new THREE.ArrowHelper(earthAxis.clone().normalize(), new THREE.Vector3(0, 0, 0), 10, LINE_COLOUR);
    scene.add(arrowHelper);

    // Animation loop
    function animate() {
        requestAnimationFrame(animate);
        
        earth.rotateOnAxis(earthAxis, ROTATION_SPEED);
        renderer.render(scene, camera);
    }
    animate();
}

// Set the scene to initialize when the window loads
window.onload = initThreeScene;