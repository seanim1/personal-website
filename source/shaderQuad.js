import * as THREE from 'https://cdnjs.cloudflare.com/ajax/libs/three.js/0.145.0/three.module.js';

// Global variables
const raycaster = new THREE.Raycaster();
const clock = new THREE.Clock();

// Getting started
const scene = new THREE.Scene();
//const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );
const frustumSize = 2;
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
    //console.log(uniformData.resolution)
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
    const normalizedPointer = new THREE.Vector2( (pointerCoord.x / document.documentElement.scrollWidth)*2 - 1,
         -(pointerCoord.y *2.2/ document.documentElement.scrollHeight) + 1 );

    raycaster.setFromCamera( normalizedPointer, camera );
    // intersectObject( what we are hitting )
    // plane wall = scene.children[0]
    const hit = raycaster.intersectObject( scene.children[0], false );
    let rayhit = hit[0].point
    uniformData.mousePos.value = new THREE.Vector2( rayhit.x, rayhit.y ).divideScalar(2);
    console.log(rayhit)
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
    const geometry = new THREE.PlaneGeometry( 2,2 );

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
