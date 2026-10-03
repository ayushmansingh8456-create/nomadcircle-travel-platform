import { useRef, useMemo } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';

// ============================================================
// Wireframe Globe — glowing turquoise wireframe sphere
// ============================================================

interface GlobeProps {
  mouse: React.MutableRefObject<{ x: number; y: number }>;
}

export function WireframeGlobe({ mouse }: GlobeProps) {
  const groupRef = useRef<THREE.Group>(null);
  const meshRef = useRef<THREE.Mesh>(null);
  const outerRef = useRef<THREE.Mesh>(null);

  // Wireframe geometry
  const geometry = useMemo(() => new THREE.SphereGeometry(2, 32, 32), []);

  // Wireframe material — turquoise glow
  const wireMaterial = useMemo(() => {
    const mat = new THREE.MeshBasicMaterial({
      color: new THREE.Color('#00D9D0'),
      wireframe: true,
      transparent: true,
      opacity: 0.25,
    });
    return mat;
  }, []);

  // Solid inner sphere — dark with slight transparency
  const innerMaterial = useMemo(() => {
    return new THREE.MeshPhongMaterial({
      color: new THREE.Color('#0B0C10'),
      transparent: true,
      opacity: 0.85,
      shininess: 80,
    });
  }, []);

  // Outer glow shell
  const glowMaterial = useMemo(() => {
    return new THREE.MeshBasicMaterial({
      color: new THREE.Color('#00D9D0'),
      transparent: true,
      opacity: 0.04,
      side: THREE.BackSide,
    });
  }, []);

  const glowGeometry = useMemo(() => new THREE.SphereGeometry(2.35, 32, 32), []);

  useFrame((state, delta) => {
    if (!groupRef.current) return;

    // Smooth mouse-following rotation
    const targetRotY = mouse.current.x * 0.8;
    const targetRotX = -mouse.current.y * 0.4;
    groupRef.current.rotation.y += (targetRotY - groupRef.current.rotation.y) * 0.04;
    groupRef.current.rotation.x += (targetRotX - groupRef.current.rotation.x) * 0.04;

    // Gentle auto-rotation
    if (meshRef.current) {
      meshRef.current.rotation.y += delta * 0.08;
    }

    // Subtle floating bob
    const t = state.clock.elapsedTime;
    groupRef.current.position.y = Math.sin(t * 0.5) * 0.12;
  });

  return (
    <group ref={groupRef}>
      {/* Outer glow */}
      <mesh ref={outerRef} geometry={glowGeometry} material={glowMaterial} />
      {/* Inner solid */}
      <mesh geometry={geometry} material={innerMaterial} />
      {/* Wireframe overlay */}
      <mesh ref={meshRef} geometry={geometry} material={wireMaterial} />

      {/* Orbiting ring */}
      <mesh rotation={[Math.PI / 2.5, 0, 0]}>
        <torusGeometry args={[2.8, 0.012, 8, 64]} />
        <meshBasicMaterial color="#00D9D0" transparent opacity={0.15} />
      </mesh>
      <mesh rotation={[Math.PI / 3, Math.PI / 4, 0]}>
        <torusGeometry args={[3.1, 0.008, 8, 64]} />
        <meshBasicMaterial color="#FF6B4A" transparent opacity={0.08} />
      </mesh>
    </group>
  );
}

// ============================================================
// Particle field — floating turquoise dots
// ============================================================

export function ParticleField() {
  const pointsRef = useRef<THREE.Points>(null);

  const positions = useMemo(() => {
    const count = 200;
    const arr = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const radius = 4 + Math.random() * 6;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      arr[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
      arr[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
      arr[i * 3 + 2] = radius * Math.cos(phi);
    }
    return arr;
  }, []);

  useFrame((_, delta) => {
    if (pointsRef.current) {
      pointsRef.current.rotation.y += delta * 0.02;
    }
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={positions.length / 3}
          array={positions}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.04}
        color="#00D9D0"
        transparent
        opacity={0.5}
        sizeAttenuation
      />
    </points>
  );
}

// ============================================================
// Orbiting Destination Markers — small glowing dots on the globe
// ============================================================

const destinations = [
  { lat: 35.68, lng: 139.65, label: 'Tokyo' },
  { lat: 51.51, lng: -0.13, label: 'London' },
  { lat: 30.04, lng: 31.24, label: 'Cairo' },
  { lat: 48.86, lng: 2.35, label: 'Paris' },
  { lat: -13.16, lng: -72.55, label: 'Machu Picchu' },
  { lat: 39.90, lng: 116.41, label: 'Beijing' },
];

function latLngToVec3(lat: number, lng: number, radius: number): [number, number, number] {
  const phi = (90 - lat) * (Math.PI / 180);
  const theta = (lng + 180) * (Math.PI / 180);
  const x = -radius * Math.sin(phi) * Math.cos(theta);
  const z = radius * Math.sin(phi) * Math.sin(theta);
  const y = radius * Math.cos(phi);
  return [x, y, z];
}

export function DestinationMarkers({ mouse }: GlobeProps) {
  const groupRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (!groupRef.current) return;
    const targetRotY = mouse.current.x * 0.8;
    const targetRotX = -mouse.current.y * 0.4;
    groupRef.current.rotation.y += (targetRotY - groupRef.current.rotation.y) * 0.04;
    groupRef.current.rotation.x += (targetRotX - groupRef.current.rotation.x) * 0.04;
    groupRef.current.position.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.12;
  });

  return (
    <group ref={groupRef}>
      {destinations.map((dest, i) => {
        const pos = latLngToVec3(dest.lat, dest.lng, 2.05);
        return (
          <group key={dest.label} position={pos}>
            <mesh>
              <sphereGeometry args={[0.04, 12, 12]} />
              <meshBasicMaterial color="#00D9D0" />
            </mesh>
            {/* Glow halo */}
            <mesh>
              <sphereGeometry args={[0.08, 12, 12]} />
              <meshBasicMaterial color="#00D9D0" transparent opacity={0.2} />
            </mesh>
            {/* Pulse ring */}
            <mesh rotation={[Math.PI / 2, 0, 0]}>
              <ringGeometry args={[0.1, 0.12, 16]} />
              <meshBasicMaterial color="#00D9D0" transparent opacity={0.3} side={THREE.DoubleSide} />
            </mesh>
          </group>
        );
      })}
    </group>
  );
}
