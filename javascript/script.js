
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

const material = new THREE.MeshLambertMaterial({ color: "#ffeded" });
const star = new THREE.Mesh(new THREE.SphereGeometry(1.3, 32, 16), material);

star.position.y = -6;

star.position.x = -2;
scene.add(star);

const color = new THREE.Color("#FDB813");
const geometry = new THREE.IcosahedronGeometry(1, 1);
const starMaterial = new THREE.MeshBasicMaterial({ color: color });
const sphere = new THREE.Mesh(geometry, starMaterial);
sphere.position.set(0, 0, 0);
sphere.layers.set(1);
scene.add(sphere);

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
// renderer.autoClear = false;
// renderer.setClearColor(0x000000, 0.0);

//bloom renderer
// const renderScene = new RenderPass(scene, camera);
// const bloomPass = new UnrealBloomPass(
//   new THREE.Vector2(window.innerWidth, window.innerHeight),
//   1.5,
//   0.4,
//   0.85
// );
// bloomPass.threshold = 0;
// bloomPass.strength = 2; //intensity of glow
// bloomPass.radius = 0;
// const bloomComposer = new EffectComposer(renderer);
// bloomComposer.setSize(window.innerWidth, window.innerHeight);
// bloomComposer.renderToScreen = true;
// bloomComposer.addPass(renderScene);
// bloomComposer.addPass(bloomPass);

/**
 * Animate
 */
const clock = new THREE.Clock();

const tick = () => {
  const elapsedTime = clock.getElapsedTime();
  camera.position.y = (-scrollY / sizes.height) * objectsDistance;

  // Render
  renderer.render(scene, camera);

  // Call tick again on the next frame
  window.requestAnimationFrame(tick);
};

tick();
