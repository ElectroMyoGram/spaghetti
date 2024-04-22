import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';


const earth_axis_of_rotation = 23.5;
const ROTATION_SPEED = 0.0001;
const LINE_COLOUR = 0xffff00;



function initThreeScene(){
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );

    const renderer = new THREE.WebGLRenderer({antialias: true});
    renderer.setSize( window.innerWidth, window.innerHeight );
    document.body.appendChild( renderer.domElement );

    const sphere_texture = new THREE.TextureLoader().load('/assets/textures/earth.jpg');

    const sphere_geometry = new THREE.SphereGeometry(1);
    const material = new THREE.MeshBasicMaterial( { map: sphere_texture } );
    const earth = new THREE.Mesh(sphere_geometry, material)
    scene.add( earth );

    camera.position.z = 5;
    const controls = new OrbitControls( camera, renderer.domElement );
    controls.update();


    let earth_axis = new THREE.Vector3(1, Math.tan(earth_axis_of_rotation), 0);

    const arrowHelper = new THREE.ArrowHelper(earth_axis.clone().normalize(), new THREE.Vector3(0, 0, 0), 10, LINE_COLOUR);


    scene.add(arrowHelper);
    function animate() {
        requestAnimationFrame( animate );
        
        earth.rotateOnAxis(earth_axis, ROTATION_SPEED);

        renderer.render( scene, camera );
    }
    animate();
}
window.onload = initThreeScene;