'use client';

import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';

interface ThreeCanvasProps {
  modelType?: string; // 'dragon', 'lamp', 'nameplate', 'geometric', etc.
  colorHex?: string;
  wireframe?: boolean;
  showModelSelector?: boolean;
}

export default function ThreeCanvas({
  modelType = 'geometric',
  colorHex = '#a3e635',
  wireframe = false,
  showModelSelector = true,
}: ThreeCanvasProps) {
  const mountRef = useRef<HTMLDivElement>(null);
  const [activeModel, setActiveModel] = useState(modelType);
  const [isRotating, setIsRotating] = useState(true);
  const [selectedColor, setSelectedColor] = useState(colorHex);
  const [isWireframe, setIsWireframe] = useState(wireframe);

  useEffect(() => {
    setActiveModel(modelType);
  }, [modelType]);

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

    // Studio Lighting (Hyper3D High-Tech CAD Aesthetic)
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.75);
    scene.add(ambientLight);

    // Warm Key Light
    const keyLight = new THREE.DirectionalLight(0xfff7ed, 2.4);
    keyLight.position.set(4, 5, 4);
    keyLight.castShadow = true;
    scene.add(keyLight);

    // High-Tech Chromatic Rim Light (Hyper3D Violet/Blue Edge Glow)
    const rimLight = new THREE.DirectionalLight(0x818cf8, 2.2);
    rimLight.position.set(-4, 3, -3);
    scene.add(rimLight);

    // Bottom Ambient Fill Light (VK Studio Lime Accent)
    const fillLight = new THREE.PointLight(0xa3e635, 1.2, 10);
    fillLight.position.set(0, -3, 2.5);
    scene.add(fillLight);

    // Group for object
    const objectGroup = new THREE.Group();
    scene.add(objectGroup);

    // Build procedural 3D sculpture depending on activeModel
    const primaryColor = new THREE.Color(selectedColor);

    const material = new THREE.MeshStandardMaterial({
      color: primaryColor,
      roughness: 0.3,
      metalness: 0.45,
      wireframe: isWireframe,
      flatShading: true,
    });

    if (activeModel === 'lamp') {
      // Voronoi / Torus Knot Lattice
      const geom = new THREE.TorusKnotGeometry(0.85, 0.28, 120, 16, 2, 3);
      const mesh = new THREE.Mesh(geom, material);
      mesh.castShadow = true;
      objectGroup.add(mesh);
    } else if (activeModel === 'nameplate') {
      // Modern Chamfered Slab with floating elements
      const baseGeom = new THREE.BoxGeometry(2.2, 0.45, 0.6);
      const baseMesh = new THREE.Mesh(baseGeom, material);
      objectGroup.add(baseMesh);

      const accentGeom = new THREE.BoxGeometry(1.8, 0.2, 0.1);
      const accentMat = new THREE.MeshStandardMaterial({
        color: 0xa3e635,
        metalness: 0.8,
        roughness: 0.2,
      });
      const accentMesh = new THREE.Mesh(accentGeom, accentMat);
      accentMesh.position.set(0, 0.1, 0.35);
      objectGroup.add(accentMesh);
    } else if (activeModel === 'dragon' || activeModel === 'figure') {
      // Complex multi-faceted polyhedral dragon / kinetic sculpture
      const coreGeom = new THREE.IcosahedronGeometry(0.95, 2);
      const coreMesh = new THREE.Mesh(coreGeom, material);
      objectGroup.add(coreMesh);

      // Kinetic ring orbiting
      const ringGeom = new THREE.TorusGeometry(1.4, 0.05, 16, 100);
      const ringMat = new THREE.MeshStandardMaterial({
        color: 0xa3e635,
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
        color: 0xa3e635,
        wireframe: true,
        transparent: true,
        opacity: 0.3,
      });
      const wireMesh = new THREE.Mesh(wireframeGeom, wireMat);
      objectGroup.add(wireMesh);
    }

    // Gentle floor shadow disk (Pedestal contact shadow)
    const shadowGeom = new THREE.CircleGeometry(1.5, 32);
    const shadowMat = new THREE.MeshBasicMaterial({
      color: 0x000000,
      transparent: true,
      opacity: 0.45,
    });
    const shadowMesh = new THREE.Mesh(shadowGeom, shadowMat);
    shadowMesh.rotation.x = -Math.PI / 2;
    shadowMesh.position.y = -1.25;
    scene.add(shadowMesh);

    // Mouse & Touch Drag Rotation Controls for Desktop and Mobile
    let isDragging = false;
    let previousPosition = { x: 0, y: 0 };

    const onStart = (clientX: number, clientY: number) => {
      isDragging = true;
      previousPosition = { x: clientX, y: clientY };
    };

    const onMove = (clientX: number, clientY: number) => {
      if (!isDragging) return;
      const deltaX = clientX - previousPosition.x;
      const deltaY = clientY - previousPosition.y;

      objectGroup.rotation.y += deltaX * 0.01;
      objectGroup.rotation.x += deltaY * 0.01;

      previousPosition = { x: clientX, y: clientY };
    };

    const onEnd = () => {
      isDragging = false;
    };

    const onMouseDown = (e: MouseEvent) => onStart(e.clientX, e.clientY);
    const onMouseMove = (e: MouseEvent) => onMove(e.clientX, e.clientY);
    const onMouseUp = () => onEnd();

    const onTouchStart = (e: TouchEvent) => {
      if (e.touches.length === 1) {
        onStart(e.touches[0].clientX, e.touches[0].clientY);
      }
    };
    const onTouchMove = (e: TouchEvent) => {
      if (e.touches.length === 1) {
        onMove(e.touches[0].clientX, e.touches[0].clientY);
      }
    };
    const onTouchEnd = () => onEnd();

    const domElement = renderer.domElement;
    domElement.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);

    domElement.addEventListener('touchstart', onTouchStart, { passive: true });
    window.addEventListener('touchmove', onTouchMove, { passive: true });
    window.addEventListener('touchend', onTouchEnd);

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
      domElement.removeEventListener('touchstart', onTouchStart);
      window.removeEventListener('touchmove', onTouchMove);
      window.removeEventListener('touchend', onTouchEnd);
      renderer.dispose();
    };
  }, [activeModel, selectedColor, isWireframe, isRotating]);

  return (
    <div className="relative w-full h-full min-h-[320px] sm:min-h-[380px] rounded-2xl overflow-hidden bg-gradient-to-b from-zinc-100 to-zinc-200/60 dark:from-[#0E1012] dark:to-[#141618] border border-zinc-200 dark:border-white/10 flex flex-col items-center justify-center group touch-none select-none hyper-grid-pattern">
      {/* High-Tech CAD Telemetry Bar (Top) */}
      <div className="absolute top-2.5 sm:top-3 left-2.5 sm:left-3 right-2.5 sm:right-3 flex items-center justify-between pointer-events-none z-10">
        <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-black/70 backdrop-blur-md border border-white/10 text-[10px] font-mono text-lime-400 font-bold shadow-sm">
          <span className="w-1.5 h-1.5 rounded-full bg-lime-400 animate-pulse" />
          <span>REALTIME 3D CAD ENGINE</span>
          <span className="text-zinc-500 hidden sm:inline">• 60 FPS</span>
        </div>

        <div className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-black/70 backdrop-blur-md border border-white/10 text-[10px] font-mono text-zinc-400">
          <span>DRAG TO ROTATE</span>
        </div>
      </div>

      {/* Model Selection Pills (Top Center / Mobile Floating) */}
      {showModelSelector && (
        <div className="absolute top-12 sm:top-3 left-1/2 -translate-x-1/2 z-10 flex items-center gap-1 p-1 rounded-xl bg-white/90 dark:bg-black/75 backdrop-blur-md border border-zinc-200 dark:border-white/10 shadow-sm">
          {[
            { id: 'dragon', label: 'Dragon' },
            { id: 'lamp', label: 'Lattice Lamp' },
            { id: 'nameplate', label: 'Nameplate' },
            { id: 'geometric', label: 'Polyhedron' },
          ].map((m) => (
            <button
              key={m.id}
              type="button"
              onClick={() => setActiveModel(m.id)}
              className={`px-2.5 py-1 rounded-lg text-[10px] font-mono font-bold transition-all ${
                activeModel === m.id
                  ? 'bg-lime-500 text-black shadow-sm'
                  : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-950 dark:hover:text-white'
              }`}
            >
              {m.label}
            </button>
          ))}
        </div>
      )}

      {/* 3D Canvas Mount */}
      <div ref={mountRef} className="w-full h-full cursor-grab active:cursor-grabbing" />

      {/* Interactive Controls Overlay - Bottom Bar */}
      <div className="absolute bottom-2.5 sm:bottom-3 left-2.5 sm:left-3 right-2.5 sm:right-3 flex flex-wrap sm:flex-nowrap items-center justify-between gap-2 p-2 sm:px-3 sm:py-2 bg-white/95 dark:bg-[#121317]/95 backdrop-blur-md border border-zinc-200 dark:border-white/10 rounded-xl text-xs text-zinc-800 dark:text-zinc-300 shadow-md z-10">
        <div className="flex items-center gap-2">
          {/* Color Presets */}
          <span className="text-[10px] font-mono text-zinc-500 hidden sm:inline">FILAMENT:</span>
          <div className="flex items-center gap-1.5">
            {[
              { hex: '#a3e635', title: 'Cyber Lime' },
              { hex: '#C5A880', title: 'Silk Gold' },
              { hex: '#18181B', title: 'Matte Obsidian' },
              { hex: '#059669', title: 'Emerald Silk' },
              { hex: '#F3F4F6', title: 'Ivory White' },
            ].map((c) => (
              <button
                key={c.hex}
                title={c.title}
                onClick={() => setSelectedColor(c.hex)}
                className={`w-4 h-4 rounded-full border transition-transform ${
                  selectedColor === c.hex
                    ? 'scale-125 border-emerald-600 dark:border-lime-400 ring-2 ring-emerald-500/30'
                    : 'border-zinc-300 dark:border-white/20 hover:scale-110'
                }`}
                style={{ backgroundColor: c.hex }}
              />
            ))}
          </div>
        </div>

        <div className="flex items-center gap-1.5">
          {/* Wireframe Toggle */}
          <button
            type="button"
            onClick={() => setIsWireframe(!isWireframe)}
            className={`px-2.5 py-1 rounded-lg font-mono text-[9px] sm:text-[10px] uppercase font-bold transition-colors ${
              isWireframe
                ? 'bg-emerald-500/20 text-emerald-700 dark:text-lime-300 border border-emerald-500/30'
                : 'bg-zinc-100 dark:bg-white/5 text-zinc-600 dark:text-zinc-400 hover:text-zinc-950 dark:hover:text-white border border-zinc-200 dark:border-white/5'
            }`}
          >
            {isWireframe ? 'Wireframe' : 'Solid Mesh'}
          </button>

          {/* Rotate Toggle */}
          <button
            type="button"
            onClick={() => setIsRotating(!isRotating)}
            className="px-2.5 py-1 rounded-lg bg-zinc-100 dark:bg-white/5 hover:bg-zinc-200 dark:hover:bg-white/10 text-zinc-700 dark:text-zinc-300 font-mono text-[9px] sm:text-[10px] font-bold border border-zinc-200 dark:border-white/5"
          >
            {isRotating ? 'Pause' : 'Rotate'}
          </button>
        </div>
      </div>
    </div>
  );
}
