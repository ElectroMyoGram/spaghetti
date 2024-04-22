import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

function initThreeScene(){
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );

    const renderer = new THREE.WebGLRenderer({antialias: true});
    renderer.setSize( window.innerWidth, window.innerHeight );
    document.body.appendChild( renderer.domElement );

    const sphere_texture = new THREE.TextureLoader().load('/assets/textures/earth.jpg');

    const sphere_geometry = new THREE.SphereGeometry(1);
    const material = new THREE.MeshBasicMaterial( { map: sphere_texture } );
    const sphere = new THREE.Mesh(sphere_geometry, material)
    scene.add( sphere );

    camera.position.z = 5;
    const controls = new OrbitControls( camera, renderer.domElement );
    controls.update();
    function animate() {
        requestAnimationFrame( animate );


        renderer.render( scene, camera );
    }
    animate();
}
window.onload = initThreeScene;