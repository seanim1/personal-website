import * as THREE from '../libs/three.module.js';

// Global variables
const raycaster = new THREE.Raycaster();
const clock = new THREE.Clock();

// Getting started
const scene = new THREE.Scene();
//const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );
const frustumSize = 9;
let aspect = document.documentElement.scrollWidth / document.documentElement.scrollHeight;
let camera = new THREE.OrthographicCamera( frustumSize * aspect / - 2, frustumSize * aspect / 2, frustumSize / 2, frustumSize / - 2, 0.1, 1000 );
const renderer = new THREE.WebGLRenderer();
renderer.setPixelRatio( window.devicePixelRatio );
renderer.setSize( document.documentElement.scrollWidth, document.documentElement.scrollHeight );
document.body.appendChild( renderer.domElement );

window.addEventListener( 'resize', onWindowResize );
function onWindowResize() {
    aspect = document.documentElement.scrollWidth / document.documentElement.scrollHeight;

    camera.left = - frustumSize * aspect / 2;
    camera.right = frustumSize * aspect / 2;
    camera.top = frustumSize / 2;
    camera.bottom = - frustumSize / 2;

    camera.updateProjectionMatrix();
    renderer.setSize( document.documentElement.scrollWidth, document.documentElement.scrollHeight );
    uniformData.mousePos.value = new THREE.Vector2( document.documentElement.scrollWidth, document.documentElement.scrollHeight );
}

// mouse action
const pointerCoord = new THREE.Vector2();
document.addEventListener('pointermove', onMouseMove);
function onMouseMove(e) {
    if ( e.isPrimary === false ) return;
    // set mouse/pointer position
    pointerCoord.set( e.clientX, e.clientY );
    // <Raycaster>
    // - normalize
    const normalizedPointer = new THREE.Vector2( (pointerCoord.x / window.innerWidth)*2 - 1,
         -(pointerCoord.y / window.innerHeight)*2 + 1 );
    raycaster.setFromCamera( normalizedPointer, camera );
    // intersectObject( what we are hitting )
    // plane wall = scene.children[0]
    const hit = raycaster.intersectObject( scene.children[0], false );
    let rayhit = hit[0].point
    uniformData.mousePos.value = new THREE.Vector2( rayhit.x / 9, rayhit.y / 10 );
    //scene.children[1].position.set( rayhit.x, rayhit.y );
}

const uniformData = {
    time: { type: 'f', value: 0.0 },
    mousePos: { value: new THREE.Vector2( 0.0, 0.0 ) },
    resolution: { value: new THREE.Vector2( document.documentElement.scrollWidth, document.documentElement.scrollHeight ) }
}
// initiate
function init() {
    // Mesh: a wall that raycast will hit
    const geometry = new THREE.PlaneGeometry( 9, 9 );

    const material = new THREE.ShaderMaterial( {

        uniforms: uniformData,
    
        vertexShader: document.getElementById("vertexShader").textContent,
        fragmentShader: document.getElementById("fragmentShader").textContent,
    
    } );

    const plane = ( new THREE.Mesh( geometry, material ) );

    // < Init: Transformations >
    plane.position.z = 0;

    // < scene.add >
    scene.add( plane ); // 0

    camera.position.z = 10;
}

// game loop
function animate() {
    requestAnimationFrame( animate );

    // shaders uniform update
    uniformData.time.value = clock.getElapsedTime();
  
    renderer.render( scene, camera );
};
init();
animate();
