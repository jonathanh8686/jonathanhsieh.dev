import * as THREE from "/build/three.module.js";
import { FontLoader } from "/jsm/loaders/FontLoader.js";
import { EffectComposer } from "/jsm/postprocessing/EffectComposer.js";
import { RenderPass } from "/jsm/postprocessing/RenderPass.js";
import { UnrealBloomPass } from "/jsm/postprocessing/UnrealBloomPass.js";

/**
 * Base
 */
// Canvas
const canvas = document.querySelector("canvas.webgl");

// Scene
const scene = new THREE.Scene();

/**
 * Lights
 */

const directionalLight = new THREE.DirectionalLight("#ffffff", 1);
directionalLight.position.set(1, 1, 0);
scene.add(directionalLight);

const light = new THREE.AmbientLight(0x404040); // soft white light
scene.add(light);

/**
 * Objects
 */

const objectsDistance = 4;

// const star1Geometry = new THREE.IcosahedronGeometry(0.5, 3);
// const star1Material = new THREE.MeshBasicMaterial({
//   color: new THREE.Color("#FDB714"),
// });
// const star1Mesh = new THREE.Mesh(star1Geometry, star1Material);
// star1Mesh.position.set(5.2, 1, 0);
// star1Mesh.layers.set(1);
// scene.add(star1Mesh);

// const star2Geometry = new THREE.IcosahedronGeometry(1, 3);
// const star2Material = new THREE.MeshBasicMaterial({
//   color: new THREE.Color("#FF0000"),
// });
// const star2Mesh = new THREE.Mesh(star2Geometry, star2Material);
// star2Mesh.position.set(5, -4, 0);
// star2Mesh.layers.set(1);
// scene.add(star2Mesh);

// const planet1Geometry = new THREE.IcosahedronGeometry(0.2, 3);
// const planet1Material = new THREE.MeshLambertMaterial({
//   color: new THREE.Color("#735a2f"),
// });
// const planet1Mesh = new THREE.Mesh(planet1Geometry, planet1Material);
// planet1Mesh.position.set(-5, -2, 0);
// planet1Mesh.layers.set(0);
// scene.add(planet1Mesh);

// const planet2Geometry = new THREE.IcosahedronGeometry(0.5, 3);
// const planet2Material = new THREE.MeshLambertMaterial({
//   color: new THREE.Color("#6bd629"),
// });
// const planet2Mesh = new THREE.Mesh(planet2Geometry, planet2Material);
// planet2Mesh.position.set(-5, -10, 0);
// planet2Mesh.layers.set(0);
// scene.add(planet2Mesh);

// const planet2RingGeometry = new THREE.TorusGeometry(0.8, 0.01, 16, 100);
// const planet2RingMaterial = new THREE.MeshLambertMaterial({
//   color: new THREE.Color("#00ff4c"),
// });
// const planet2RingMesh = new THREE.Mesh(planet2RingGeometry, planet2RingMaterial);
// planet2RingMesh.position.set(-5, -10, 0);
// planet2RingMesh.rotation.set(-5, -10, 0);
// planet2RingMesh.layers.set(0);
// scene.add(planet2RingMesh);

const loader = new FontLoader();

// loader.load("/fonts/Oxygen Light_Regular.json", function (font) {
//   const textGeo = new TextGeometry("About Me", {
//     font: font,
//     size: 0.25,
//     height: 0.01,
//   });

//   const textMesh1 = new THREE.Mesh(
//     textGeo,
//     new THREE.MeshPhongMaterial({ color: new THREE.Color("#fd8714") })
//   );
//   textMesh1.position.set(-0.7, -6, 0)
//   // textMesh1.rotation.set(new THREE.Vector3( 0, 0, 0));

//   scene.add(textMesh1);
// });

/**
 * Particles
 */

const particlesCount = 1200;
const positions = new Float32Array(particlesCount * 3);
for (let i = 0; i < particlesCount; i++) {
  positions[i * 3 + 0] = (Math.random() - 0.5) * 10;
  positions[i * 3 + 1] = -(Math.random() - 0.5) * 50;
  positions[i * 3 + 2] = (Math.random() - 0.5) * 18;
}
const particlesGeometry = new THREE.BufferGeometry();
particlesGeometry.setAttribute(
  "position",
  new THREE.BufferAttribute(positions, 3)
);
const particlesMaterial = new THREE.PointsMaterial({
  color: "#ffffff",
  sizeAttenuation: true,
  size: 0.03,
});
const particles = new THREE.Points(particlesGeometry, particlesMaterial);
particles.layers.set(1);
scene.add(particles);

/**
 * Sizes
 */
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
};

window.addEventListener("resize", () => {
  // Update sizes
  sizes.width = window.innerWidth;
  sizes.height = window.innerHeight;

  // Update camera
  camera.aspect = sizes.width / sizes.height;
  camera.updateProjectionMatrix();

  // Update renderer
  renderer.setSize(sizes.width, sizes.height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});

/**
 * Camera
 */

let scrollY = window.scrollY;

window.addEventListener("scroll", () => {
  scrollY = window.scrollY;
});
// Base camera
const camera = new THREE.PerspectiveCamera(
  35,
  sizes.width / sizes.height,
  0.1,
  100
);
camera.position.z = 10;
scene.add(camera);

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
  antialias: true,
});
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.autoClear = false;
renderer.setClearColor(0x000000, 0.0);

const renderScene = new RenderPass(scene, camera);
const bloomPass = new UnrealBloomPass(
  new THREE.Vector2(window.innerWidth, window.innerHeight),
  1.5,
  0.4,
  0.85
);
bloomPass.threshold = 0;
bloomPass.strength = 2; //intensity of glow
bloomPass.radius = 0;
const bloomComposer = new EffectComposer(renderer);
bloomComposer.setSize(window.innerWidth, window.innerHeight);
bloomComposer.renderToScreen = true;
bloomComposer.addPass(renderScene);
bloomComposer.addPass(bloomPass);

/**
 * Animate
 */
const clock = new THREE.Clock();

const tick = () => {
  const elapsedTime = clock.getElapsedTime();
  camera.position.y = (-scrollY / sizes.height) * objectsDistance;

  // Call tick again on the next frame
  window.requestAnimationFrame(tick);

  camera.layers.set(1);
  bloomComposer.render();

  renderer.clearDepth();
  camera.layers.set(0);
  renderer.render(scene, camera);
};

tick();

window.addEventListener( 'resize', onWindowResize, false );

function onWindowResize(){

    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    renderer.setSize( window.innerWidth, window.innerHeight );

}
