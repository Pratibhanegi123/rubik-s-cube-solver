import React, { useEffect, useRef } from "react";
import * as THREE from "three";
import { OrbitControls } from "three-stdlib";

function Cube({ selectedColor }) {
  const mountRef = useRef(null);
  const colorRef = useRef(selectedColor);

  // ✅ Keep latest color always updated
  useEffect(() => {
    colorRef.current = selectedColor;
  }, [selectedColor]);

  useEffect(() => {
    const mount = mountRef.current;

    // Scene
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x111111);

    // Camera
    const camera = new THREE.PerspectiveCamera(
      75,
      mount.clientWidth / mount.clientHeight,
      0.1,
      1000
    );
    camera.position.set(5, 5, 5);
    camera.lookAt(0, 0, 0);

    // Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(mount.clientWidth, mount.clientHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    mount.appendChild(renderer.domElement);

    // Controls
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;

    // Lights
    const light = new THREE.DirectionalLight(0xffffff, 1);
    light.position.set(5, 5, 5);
    scene.add(light);

    const ambient = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(ambient);

    // Create cubie
    function createCubie(x, y, z) {
      const geometry = new THREE.BoxGeometry(1, 1, 1);

      const materials = [
        new THREE.MeshStandardMaterial({ color: "red" }),
        new THREE.MeshStandardMaterial({ color: "orange" }),
        new THREE.MeshStandardMaterial({ color: "white" }),
        new THREE.MeshStandardMaterial({ color: "yellow" }),
        new THREE.MeshStandardMaterial({ color: "green" }),
        new THREE.MeshStandardMaterial({ color: "blue" }),
      ];

      const cube = new THREE.Mesh(geometry, materials);
      cube.position.set(x * 1.1, y * 1.1, z * 1.1);
      return cube;
    }

    // Store cubes
    const cubes = [];

    for (let x = -1; x <= 1; x++) {
      for (let y = -1; y <= 1; y++) {
        for (let z = -1; z <= 1; z++) {
          const cubie = createCubie(x, y, z);
          scene.add(cubie);
          cubes.push(cubie);
        }
      }
    }

    // Raycaster
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();

    
 function onMouseClick(event) {
  const rect = renderer.domElement.getBoundingClientRect();

  mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
  mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

  raycaster.setFromCamera(mouse, camera);

  const intersects = raycaster.intersectObjects(cubes);

  if (intersects.length > 0) {
    const intersection = intersects[0];
    const object = intersection.object;

    // 1. Get the index of the face that was actually hit
    // Each material in your 'materials' array corresponds to a side.
    // faceIndex / 2 gives us that specific material index.
    const materialIndex = Math.floor(intersection.faceIndex / 2);

    // 2. ONLY update that specific material
    if (object.material[materialIndex]) {
      // IMPORTANT: .clone() the material so you don't accidentally 
      // change other cubes that might share the same material instance.
      object.material[materialIndex] = object.material[materialIndex].clone();
      object.material[materialIndex].color.set(colorRef.current);
    }
  }
}
    renderer.domElement.addEventListener("click", onMouseClick);

    // Animation
    const animate = () => {
      requestAnimationFrame(animate);
      controls.update();
      renderer.render(scene, camera);
    };
    animate();

    // Resize
    const handleResize = () => {
      camera.aspect = mount.clientWidth / mount.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(mount.clientWidth, mount.clientHeight);
    };

    window.addEventListener("resize", handleResize);

    // Cleanup
    return () => {
      renderer.domElement.removeEventListener("click", onMouseClick);
      window.removeEventListener("resize", handleResize);
      mount.removeChild(renderer.domElement);
    };
  }, []);

  return (
    <div
      ref={mountRef}
      style={{ width: "100%", height: "100vh" }}
    />
  );
}

export default Cube;