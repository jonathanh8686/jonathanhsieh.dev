import * as THREE from "/build/three.module.js";
import { FontLoader } from "/jsm/loaders/FontLoader.js";
import { TextGeometry } from "/jsm/geometries/TextGeometry.js";
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

const geometry = new THREE.IcosahedronGeometry(1, 3);
const starMaterial = new THREE.MeshBasicMaterial({
  color: new THREE.Color("#FDB714"),
});
const starMesh = new THREE.Mesh(geometry, starMaterial);
starMesh.position.set(0, -10, 0);
starMesh.layers.set(1);
scene.add(starMesh);

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
