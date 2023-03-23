import * as THREE from 'three'
import {Mesh} from "three";
import {OrbitControls} from "three/examples/jsm/controls/OrbitControls";

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);


let mesh = new Mesh(
    new THREE.PlaneGeometry(1000, 1000),
    new THREE.MeshStandardMaterial({
            color: 0xffffff,
        }
    ));
//mesh.receiveShadow = true;
mesh.rotation.x = -Math.PI / 2;
scene.add(
    mesh
)

scene.add(new THREE.AmbientLight(0xffffff, 0.1));

const geometry = new THREE.TorusKnotGeometry(1, 0.3, 100, 16);
const material = new THREE.ShaderMaterial({
    vertexShader: `
        varying vec2 vUv;
        void main() {
            vUv = uv;
            gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
        }
    `,
    fragmentShader: `
        uniform float time;
        varying vec2 vUv;
        void main() {
            vec3 rgb = vec3(step(0.5, mod((vUv.x + time) * 42.0, 1.0) ));
                
            gl_FragColor = vec4(mix(vec3(1.0, 0.0, 0.0), vec3(0.0, 1.0, 0.0), rgb),  1.0);
        }
    `,
    uniforms: {
        time: {value: 1.0},
    }
});

const cube = new THREE.Mesh(geometry, material);
cube.castShadow = true;
scene.add(cube);

camera.position.z = 5;
camera.lookAt(cube.position);


new OrbitControls(camera, renderer.domElement);
mesh.position.y = -3;
function animate() {
    requestAnimationFrame(animate);

    material.uniforms.time.value += 0.001;

    cube.rotation.x += 0.001;
    cube.rotation.y += 0.001;

    renderer.render(scene, camera);
}

animate();