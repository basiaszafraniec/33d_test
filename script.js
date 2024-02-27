import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import * as dat from 'dat.gui';

//SCENE
const scene = new THREE.Scene();
scene.add(new THREE.GridHelper());

//CAMERA
const aspect = window.innerWidth / window.innerHeight;
const near = 0.1;
const far = 1000;
const camera = new THREE.PerspectiveCamera(125, aspect, near, far);

camera.position.set(-10, 20, 10);
// const lookAtPoint = new THREE.Vector3(0, 5, 0);
camera.lookAt(0, 10, 0);
// camera.updateProjectionMatrix();

//RENDERER
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.shadowMap.enabled = true;
document.body.appendChild(renderer.domElement);

//RESIZING
window.addEventListener("resize", () => {
    renderer.setSize(window.innerWidth, window.innerHeight);
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
})

//TEXTURE LOADER
const texture_loader = new THREE.TextureLoader();
const checker_texture = texture_loader.load("checker1.png");

//GUI
const gui = new dat.GUI;
const options = {
    sphere_color: 0xffffff,
    sphere_size: 2,
    sphere_x: 0,
    sphere_z: 0,
    wireframe: false,
    speed: 0.01,
    cube_y: 10,
    camera_x: -10,
    camera_y: 20,
    camera_z: 10,
    fov: 125,
};

gui.addColor(options, "sphere_color").onChange((e) => {
    sphere.material.color.set(e)
});
gui.add(options, "wireframe").onChange((e) => {
    sphere.material.wireframe = e;
});
gui.add(options, "speed", 0, 0.1);
gui.add(options, "sphere_size", 0, 3.5).onChange((e) => {
    sphere.scale.set(e, e, e);
    console.log(sphere.scale);
});
gui.add(options, "sphere_x", -20, 20).onChange((e) => {
    sphere.position.x = e;
});
gui.add(options, "sphere_z", -20, 20).onChange((e) => {
    sphere.position.z = e;
});
gui.add(options, "cube_y", -5, 20).onChange((e) => {
    cube.position.y = e;
    edges.position.y = e;
})
gui.add(options, "camera_x", -20, 20).onChange((e) => {
    camera.position.x = e;
})
gui.add(options, "camera_y", -20, 50).onChange((e) => {
    camera.position.y = e;
})
gui.add(options, "camera_z", -20, 20).onChange((e) => {
    camera.position.z = e;
})
gui.add(options, "fov", 1, 180, 5).onChange((e) => {
    camera.fov = e;
    camera.updateProjectionMatrix();
    console.log(camera.fov);

})

//ORBIT
const orbit = new OrbitControls(camera, renderer.domElement);
orbit.update();





//CUBE
const cube_geometry = new THREE.BoxGeometry(2, 2, 2);
const material = new THREE.MeshBasicMaterial({ color: 0xffffff });
const cube = new THREE.Mesh(cube_geometry, material);
cube.position.y = 10;
cube.castShadow = true;
scene.add(cube);

//EDGES
const edges_geometry = new THREE.EdgesGeometry(cube_geometry);
const edges_material = new THREE.LineBasicMaterial({ color: 0xffffff });
const edges = new THREE.LineSegments(edges_geometry, edges_material);
edges.position.y = 10;
scene.add(edges);

//PLANES
const plane1_geometry = new THREE.PlaneGeometry(20, 20);
const plane1_material = new THREE.MeshStandardMaterial({ color: 0xff00000, side: THREE.DoubleSide });
const checker_material = new THREE.MeshStandardMaterial({ map: checker_texture, side: THREE.DoubleSide });
const plane1 = new THREE.Mesh(plane1_geometry, checker_material);
plane1.receiveShadow = true;
plane1.rotateX(-0.5 * Math.PI);
scene.add(plane1);

const plane2_geometry = new THREE.PlaneGeometry(20, 20);
const plane2_material = new THREE.MeshStandardMaterial({ color: 0x00ff00, side: THREE.DoubleSide });
const plane2 = new THREE.Mesh(plane2_geometry, checker_material);
plane2.rotateY(-0.5 * Math.PI);
plane2.position.x = 10;
plane2.position.y = 10;
plane2.receiveShadow = true;
scene.add(plane2);

const plane3_geometry = new THREE.PlaneGeometry(20, 20);
const plane3_material = new THREE.MeshStandardMaterial({ color: 0x0000ff, side: THREE.DoubleSide });
const plane3 = new THREE.Mesh(plane3_geometry, checker_material);
plane3.position.z = -10;
plane3.position.y = 10;
plane3.receiveShadow = true;
scene.add(plane3);


//SPHERE
const sphere_geometry = new THREE.SphereGeometry(2);
const sphere_material = new THREE.MeshStandardMaterial({ color: 0xffffff, wireframe: false })
const sphere = new THREE.Mesh(sphere_geometry, sphere_material);
sphere.position.y = 15;
sphere.castShadow = true;
scene.add(sphere);

//MONKEY
const loader = new GLTFLoader();
loader.load('monkey.glb', function (gltf) {
    const monkey = gltf.scene;
    scene.add(gltf.scene);
    monkey.position.y = 5;
    monkey.traverse(child => {
        if (child.isMesh) {
            child.material = new THREE.MeshStandardMaterial(0xff00ff);
            child.rotateY(-0.25 * Math.PI);
            child.castShadow = true;
        }
    });
}, undefined, function (error) {
    console.error(error);
});

//AMBIENT LIGHT
const ambient_light = new THREE.AmbientLight(0xff00dd);
scene.add(ambient_light);

//DIRECTIONAL LIGHT
const directional_light = new THREE.DirectionalLight(0xffffff, 0.8);
scene.add(directional_light);
directional_light.position.set(-30, 50, 0);
directional_light.castShadow = true;
directional_light.shadow.camera.bottom = -10;
directional_light.shadow.camera.top = 10;
directional_light.shadow.camera.left = -10;
directional_light.shadow.camera.right = 10;

const directional_light_helper = new THREE.DirectionalLightHelper(directional_light, 5);
scene.add(directional_light_helper);

const directional_light_shadow_helper = new THREE.CameraHelper(directional_light.shadow.camera);
scene.add(directional_light_shadow_helper);



//FOR THE BOUNCING ANIMATION
let step = 0;
console.log(camera.fov);

function animate() {
    requestAnimationFrame(animate);
    cube.rotation.x += 0.01;
    cube.rotation.y += 0.01;
    edges.rotation.x -= 0.01;
    edges.rotation.y -= 0.01;
    step += options.speed;
    sphere.position.z = (10 * Math.abs(Math.sin(step)) - 8);
    renderer.render(scene, camera);
}
animate();