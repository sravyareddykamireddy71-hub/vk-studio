'use client';

import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';

interface ThreeCanvasProps {
  modelType?: string; // 'dragon', 'lamp', 'nameplate', 'geometric', etc.
  colorHex?: string;
  wireframe?: boolean;
}

export default function ThreeCanvas({
  modelType = 'geometric',
  colorHex = '#C5A880',
  wireframe = false,
}: ThreeCanvasProps) {
  const mountRef = useRef<HTMLDivElement>(null);
  const [isRotating, setIsRotating] = useState(true);
  const [selectedColor, setSelectedColor] = useState(colorHex);
  const [isWireframe, setIsWireframe] = useState(wireframe);

  useEffect(() => {
    const currentMount = mountRef.current;
    if (!currentMount) return;

    // Scene, Camera, Renderer
    const width = currentMount.clientWidth || 400;
    const height = currentMount.clientHeight || 350;

    const scene = new THREE.Scene();
    scene.background = null; // Transparent

    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    camera.position.set(0, 1.2, 3.8);
    camera.lookAt(0, 0, 0);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    currentMount.replaceChildren(renderer.domElement);

    // Studio Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
    scene.add(ambientLight);

    const keyLight = new THREE.DirectionalLight(0xffedd5, 2.2);
    keyLight.position.set(4, 5, 4);
    keyLight.castShadow = true;
    scene.add(keyLight);

    const rimLight = new THREE.DirectionalLight(0xd97706, 1.5);
    rimLight.position.set(-4, -2, -3);
    scene.add(rimLight);

    const fillLight = new THREE.PointLight(0x60a5fa, 0.9);
    fillLight.position.set(0, -3, 3);
    scene.add(fillLight);

    // Group for object
    const objectGroup = new THREE.Group();
    scene.add(objectGroup);

    // Build procedural 3D sculpture depending on modelType
    const primaryColor = new THREE.Color(selectedColor);

    const material = new THREE.MeshStandardMaterial({
      color: primaryColor,
      roughness: 0.35,
      metalness: 0.45,
      wireframe: isWireframe,
      flatShading: true,
    });

    if (modelType === 'lamp') {
      // Voronoi / Torus Knot Lattice
      const geom = new THREE.TorusKnotGeometry(0.85, 0.28, 120, 16, 2, 3);
      const mesh = new THREE.Mesh(geom, material);
      mesh.castShadow = true;
      objectGroup.add(mesh);
    } else if (modelType === 'nameplate') {
      // Modern Chamfered Slab with floating elements
      const baseGeom = new THREE.BoxGeometry(2.2, 0.45, 0.6);
      const baseMesh = new THREE.Mesh(baseGeom, material);
      objectGroup.add(baseMesh);

      const accentGeom = new THREE.BoxGeometry(1.8, 0.2, 0.1);
      const accentMat = new THREE.MeshStandardMaterial({
        color: 0xd97706,
        metalness: 0.8,
        roughness: 0.2,
      });
      const accentMesh = new THREE.Mesh(accentGeom, accentMat);
      accentMesh.position.set(0, 0.1, 0.35);
      objectGroup.add(accentMesh);
    } else if (modelType === 'dragon' || modelType === 'figure') {
      // Complex multi-faceted polyhedral dragon / kinetic sculpture
      const coreGeom = new THREE.IcosahedronGeometry(0.95, 2);
      const coreMesh = new THREE.Mesh(coreGeom, material);
      objectGroup.add(coreMesh);

      // Kinetic ring orbiting
      const ringGeom = new THREE.TorusGeometry(1.4, 0.05, 16, 100);
      const ringMat = new THREE.MeshStandardMaterial({
        color: 0xd97706,
        metalness: 0.9,
        roughness: 0.1,
      });
      const ringMesh = new THREE.Mesh(ringGeom, ringMat);
      ringMesh.rotation.x = Math.PI / 3;
      objectGroup.add(ringMesh);
    } else {
      // Default Dodecahedron / Precision Engineering Lattice
      const geom = new THREE.DodecahedronGeometry(1.0, 1);
      const mesh = new THREE.Mesh(geom, material);
      mesh.castShadow = true;
      objectGroup.add(mesh);

      // Subtle wireframe cage
      const wireframeGeom = new THREE.IcosahedronGeometry(1.35, 1);
      const wireMat = new THREE.MeshBasicMaterial({
        color: 0xd97706,
        wireframe: true,
        transparent: true,
        opacity: 0.25,
      });
      const wireMesh = new THREE.Mesh(wireframeGeom, wireMat);
      objectGroup.add(wireMesh);
    }

    // Gentle floor shadow disk
    const shadowGeom = new THREE.CircleGeometry(1.4, 32);
    const shadowMat = new THREE.MeshBasicMaterial({
      color: 0x000000,
      transparent: true,
      opacity: 0.35,
    });
    const shadowMesh = new THREE.Mesh(shadowGeom, shadowMat);
    shadowMesh.rotation.x = -Math.PI / 2;
    shadowMesh.position.y = -1.25;
    scene.add(shadowMesh);

    // Mouse drag rotation controls
    let isDragging = false;
    let previousMousePosition = { x: 0, y: 0 };

    const onMouseDown = (e: MouseEvent) => {
      isDragging = true;
      previousMousePosition = { x: e.clientX, y: e.clientY };
    };

    const onMouseMove = (e: MouseEvent) => {
      if (!isDragging) return;
      const deltaX = e.clientX - previousMousePosition.x;
      const deltaY = e.clientY - previousMousePosition.y;

      objectGroup.rotation.y += deltaX * 0.01;
      objectGroup.rotation.x += deltaY * 0.01;

      previousMousePosition = { x: e.clientX, y: e.clientY };
    };

    const onMouseUp = () => {
      isDragging = false;
    };

    const domElement = renderer.domElement;
    domElement.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);

    // Resize handling
    const handleResize = () => {
      if (!currentMount) return;
      const w = currentMount.clientWidth;
      const h = currentMount.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener('resize', handleResize);

    // Animation Loop
    let animationFrameId: number;
    let clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const elapsedTime = clock.getElapsedTime();

      if (isRotating && !isDragging) {
        objectGroup.rotation.y += 0.008;
        objectGroup.position.y = Math.sin(elapsedTime * 1.5) * 0.06;
      }

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
      domElement.removeEventListener('mousedown', onMouseDown);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
      renderer.dispose();
    };
  }, [modelType, selectedColor, isWireframe, isRotating]);

  return (
    <div className="relative w-full h-full min-h-[320px] rounded-2xl overflow-hidden bg-zinc-100/80 dark:bg-[#141618]/60 border border-zinc-200 dark:border-white/5 flex flex-col items-center justify-center group">
      {/* 3D Canvas Mount */}
      <div ref={mountRef} className="w-full h-full cursor-grab active:cursor-grabbing" />

      {/* Interactive Controls Overlay */}
      <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between px-3 py-2 bg-white/80 dark:bg-[#1A1D20]/80 backdrop-blur-md border border-zinc-200 dark:border-white/10 rounded-xl text-xs text-zinc-700 dark:text-zinc-300">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span className="font-mono text-[11px] tracking-wide text-zinc-300">
            3D CAD PREVIEW (DRAG TO ROTATE)
          </span>
        </div>

        <div className="flex items-center gap-2">
          {/* Color Presets */}
          <div className="flex items-center gap-1.5 mr-2">
            {[
              { hex: '#C5A880', title: 'Silk Gold' },
              { hex: '#18181B', title: 'Matte Obsidian' },
              { hex: '#059669', title: 'Emerald Silk' },
              { hex: '#B45309', title: 'Copper' },
              { hex: '#F3F4F6', title: 'Ivory White' },
            ].map((c) => (
              <button
                key={c.hex}
                title={c.title}
                onClick={() => setSelectedColor(c.hex)}
                className={`w-4 h-4 rounded-full border transition-transform ${
                  selectedColor === c.hex ? 'scale-125 border-amber-500 ring-1 ring-amber-400' : 'border-white/20 hover:scale-110'
                }`}
                style={{ backgroundColor: c.hex }}
              />
            ))}
          </div>

          {/* Wireframe Toggle */}
          <button
            onClick={() => setIsWireframe(!isWireframe)}
            className={`px-2 py-0.5 rounded font-mono text-[10px] uppercase transition-colors ${
              isWireframe
                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                : 'bg-white/5 text-zinc-400 hover:text-white'
            }`}
          >
            {isWireframe ? 'Wireframe: ON' : 'Mesh: SOLID'}
          </button>

          {/* Rotate Toggle */}
          <button
            onClick={() => setIsRotating(!isRotating)}
            className="px-2 py-0.5 rounded bg-white/5 text-zinc-400 hover:text-white font-mono text-[10px]"
          >
            {isRotating ? 'Pause' : 'Play'}
          </button>
        </div>
      </div>
    </div>
  );
}
