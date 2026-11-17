
import * as THREE from "https://cdn.jsdelivr.net/npm/three@0.180.0/build/three.module.js";

// Canvas element from index.html
const canvas = document.querySelector("#cell-canvas");

if (canvas) {
  // Set up the 3D scene, camera and renderer
  const scene = new THREE.Scene();

  const camera = new THREE.PerspectiveCamera(
    45,
    1,
    0.1,
    100
  );

  camera.position.z = 5;

  const renderer = new THREE.WebGLRenderer({
    canvas,
    alpha: true,
    antialias: true
  });

  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

  // Group all cell structures so they rotate together
  const cell = new THREE.Group();
  scene.add(cell);

  // Outer cell membrane
  const membraneGeometry = new THREE.IcosahedronGeometry(1.55, 5);

  const membraneMaterial = new THREE.MeshPhysicalMaterial({
    color: 0x8dd6bc,
    transparent: true,
    opacity: 0.18,
    roughness: 0.25,
    metalness: 0.05,
    side: THREE.DoubleSide,
    depthWrite: false
  });

  const membrane = new THREE.Mesh(
    membraneGeometry,
    membraneMaterial
  );

  cell.add(membrane);

  // Inner nucleus
  const nucleusGeometry = new THREE.IcosahedronGeometry(0.58, 4);

  const nucleusMaterial = new THREE.MeshPhysicalMaterial({
    color: 0x9c82c9,
    roughness: 0.3,
    metalness: 0.1,
    emissive: 0x382454,
    emissiveIntensity: 0.35
  });

  const nucleus = new THREE.Mesh(
    nucleusGeometry,
    nucleusMaterial
  );

  cell.add(nucleus);

  // Small internal structures
  const organelleGeometry = new THREE.SphereGeometry(0.12, 16, 16);

  const organelleMaterial = new THREE.MeshStandardMaterial({
    color: 0xb0ffe0,
    roughness: 0.45
  });

  for (let i = 0; i < 12; i++) {
    const organelle = new THREE.Mesh(
      organelleGeometry,
      organelleMaterial
    );

    const angle = (i / 12) * Math.PI * 2;

    organelle.position.set(
      Math.cos(angle) * 1.05,
      Math.sin(angle) * 0.75,
      Math.sin(angle * 2) * 0.45
    );

    organelle.scale.set(1, 0.65, 0.8);
    cell.add(organelle);
  }

  // Lighting
  const ambientLight = new THREE.AmbientLight(0xffffff, 1.4);
  scene.add(ambientLight);

  const pointLight = new THREE.PointLight(0xa8ffe1, 45);
  pointLight.position.set(3, 3, 4);
  scene.add(pointLight);

  const purpleLight = new THREE.PointLight(0x9970d6, 20);
  purpleLight.position.set(-3, -2, 2);
  scene.add(purpleLight);

  // Track pointer position for subtle interaction
  let pointerX = 0;
  let pointerY = 0;

  canvas.addEventListener("pointermove", (event) => {
    const bounds = canvas.getBoundingClientRect();

    pointerX = ((event.clientX - bounds.left) / bounds.width - 0.5) * 2;
    pointerY = ((event.clientY - bounds.top) / bounds.height - 0.5) * 2;
  });

  canvas.addEventListener("pointerleave", () => {
    pointerX = 0;
    pointerY = 0;
  });

  // Keep the renderer responsive
  function resizeScene() {
    const width = canvas.clientWidth;
    const height = canvas.clientHeight;

    if (!width || !height) return;

    camera.aspect = width / height;
    camera.updateProjectionMatrix();

    renderer.setSize(width, height, false);
  }

  window.addEventListener("resize", resizeScene);
  resizeScene();

  // Animation loop
  const clock = new THREE.Clock();

  function animate() {
    const elapsed = clock.getElapsedTime();

    cell.rotation.y += 0.003;

    // Smoothly follow pointer movement
    cell.rotation.x +=
      ((pointerY * 0.25) - cell.rotation.x) * 0.025;

    cell.rotation.z +=
      ((-pointerX * 0.15) - cell.rotation.z) * 0.025;

    // Gentle floating movement
    cell.position.y = Math.sin(elapsed * 0.8) * 0.08;

    renderer.render(scene, camera);
  }

  renderer.setAnimationLoop(animate);
}

