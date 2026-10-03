import { useRef, useMemo, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import { OrbitControls, ContactShadows, Float, Sparkles as DreiSparkles } from '@react-three/drei';
import * as THREE from 'three';
import {
  bodyProportions, skinToneColors,
  type BodyProportions, type WardrobeGarment, type Environment3D,
} from '@/data/wardrobeData';

interface SceneProps {
  gender: 'male' | 'female';
  skinTone: 'light' | 'dark';
  selectedGarments: WardrobeGarment[];
  environment: Environment3D;
}

// ============================================================
// 3D Avatar Mannequin — built from primitive geometry
// ============================================================

function AvatarMannequin({ gender, skinTone }: { gender: 'male' | 'female'; skinTone: 'light' | 'dark' }) {
  const groupRef = useRef<THREE.Group>(null);
  const proportions: BodyProportions = bodyProportions[gender];
  const skinColor = skinToneColors[skinTone];

  const skinMaterial = useMemo(() => {
    return new THREE.MeshStandardMaterial({
      color: new THREE.Color(skinColor.skin),
      roughness: 0.65,
      metalness: 0.05,
      emissive: new THREE.Color(skinColor.skinEmissive),
      emissiveIntensity: 0.15,
    });
  }, [skinColor]);

  // Gentle idle animation
  useFrame((state) => {
    if (!groupRef.current) return;
    const t = state.clock.elapsedTime;
    groupRef.current.position.y = Math.sin(t * 0.8) * 0.02;
    groupRef.current.rotation.z = Math.sin(t * 0.5) * 0.008;
  });

  const {
    shoulderWidth, shoulderRadius, torsoHeight, torsoRadiusTop, torsoRadiusBottom,
    hipWidth, hipHeight, legLength, legRadius, armLength, armRadius,
    neckHeight, neckRadius, headRadius,
  } = proportions;

  // Build a torso with a cylinder that tapers
  const torsoGeometry = useMemo(() => {
    const geo = new THREE.CylinderGeometry(torsoRadiusTop, torsoRadiusBottom, torsoHeight, 24, 1);
    return geo;
  }, [torsoRadiusTop, torsoRadiusBottom, torsoHeight]);

  // Shoulders — wide capsule
  const shoulderGeometry = useMemo(() => {
    return new THREE.CapsuleGeometry(shoulderRadius, shoulderWidth, 8, 16);
  }, [shoulderRadius, shoulderWidth]);

  // Hip block
  const hipGeometry = useMemo(() => {
    return new THREE.CylinderGeometry(torsoRadiusBottom, torsoRadiusBottom * 0.9, hipHeight, 24);
  }, [torsoRadiusBottom, hipHeight]);

  // Leg
  const legGeometry = useMemo(() => {
    return new THREE.CapsuleGeometry(legRadius, legLength, 8, 16);
  }, [legRadius, legLength]);

  // Arm
  const armGeometry = useMemo(() => {
    return new THREE.CapsuleGeometry(armRadius, armLength, 6, 12);
  }, [armRadius, armLength]);

  // Neck
  const neckGeometry = useMemo(() => {
    return new THREE.CylinderGeometry(neckRadius, neckRadius * 1.1, neckHeight, 12);
  }, [neckRadius, neckHeight]);

  // Head
  const headGeometry = useMemo(() => {
    return new THREE.SphereGeometry(headRadius, 32, 32);
  }, [headRadius]);

  // Y positions
  const hipY = 0;
  const torsoY = hipY + hipHeight / 2 + torsoHeight / 2;
  const shoulderY = torsoY + torsoHeight / 2 + shoulderRadius * 0.5;
  const neckY = shoulderY + shoulderRadius * 0.6 + neckHeight / 2;
  const headY = neckY + neckHeight / 2 + headRadius;
  const legY = hipY - hipHeight / 2 - legLength / 2;
  const armY = shoulderY - armLength * 0.35;
  const armOffset = shoulderWidth / 2 + armRadius * 0.4;

  return (
    <group ref={groupRef} position={[0, 0, 0]}>
      {/* Head */}
      <mesh geometry={headGeometry} material={skinMaterial} position={[0, headY, 0]} castShadow />
      {/* Eyes */}
      <mesh position={[-headRadius * 0.35, headY + 0.02, headRadius * 0.85]}>
        <sphereGeometry args={[0.035, 12, 12]} />
        <meshStandardMaterial color="#1A1A2E" roughness={0.3} />
      </mesh>
      <mesh position={[headRadius * 0.35, headY + 0.02, headRadius * 0.85]}>
        <sphereGeometry args={[0.035, 12, 12]} />
        <meshStandardMaterial color="#1A1A2E" roughness={0.3} />
      </mesh>
      {/* Neck */}
      <mesh geometry={neckGeometry} material={skinMaterial} position={[0, neckY, 0]} castShadow />
      {/* Shoulders */}
      <mesh
        geometry={shoulderGeometry}
        material={skinMaterial}
        position={[0, shoulderY, 0]}
        rotation={[0, 0, Math.PI / 2]}
        castShadow
      />
      {/* Torso */}
      <mesh geometry={torsoGeometry} material={skinMaterial} position={[0, torsoY, 0]} castShadow />
      {/* Hips */}
      <mesh geometry={hipGeometry} material={skinMaterial} position={[0, hipY, 0]} castShadow />
      {/* Left leg */}
      <mesh geometry={legGeometry} material={skinMaterial} position={[-hipWidth * 0.25, legY, 0]} castShadow />
      {/* Right leg */}
      <mesh geometry={legGeometry} material={skinMaterial} position={[hipWidth * 0.25, legY, 0]} castShadow />
      {/* Left arm */}
      <mesh
        geometry={armGeometry}
        material={skinMaterial}
        position={[-armOffset, armY, 0]}
        rotation={[0, 0, Math.PI * 0.04]}
        castShadow
      />
      {/* Right arm */}
      <mesh
        geometry={armGeometry}
        material={skinMaterial}
        position={[armOffset, armY, 0]}
        rotation={[0, 0, -Math.PI * 0.04]}
        castShadow
      />
    </group>
  );
}

// ============================================================
// 3D Garment — anchored to body section, snaps on/off with animation
// ============================================================

function Garment3D({
  garment,
  gender,
}: {
  garment: WardrobeGarment;
  gender: 'male' | 'female';
}) {
  const meshRef = useRef<THREE.Group>(null);
  const proportions = bodyProportions[gender];

  const garmentMaterial = useMemo(() => {
    const color = new THREE.Color(garment.swatchColor);
    return new THREE.MeshStandardMaterial({
      color,
      roughness: 0.7,
      metalness: 0.15,
      emissive: color.clone().multiplyScalar(0.1),
      emissiveIntensity: 0.2,
      transparent: true,
      opacity: 0,
    });
  }, [garment.swatchColor]);

  // Animate snap-on: opacity 0 → 0.92, slight scale
  useEffect(() => {
    if (!meshRef.current) return;
    meshRef.current.scale.setScalar(0.85);
  }, []);

  useFrame(() => {
    if (!meshRef.current) return;
    // Scale up
    const targetScale = 1;
    meshRef.current.scale.lerp(new THREE.Vector3(targetScale, targetScale, targetScale), 0.15);
    // Fade in
    if (garmentMaterial.opacity < 0.92) {
      garmentMaterial.opacity = Math.min(0.92, garmentMaterial.opacity + 0.06);
    }
  });

  // Position garments based on category
  const { torsoHeight, torsoRadiusTop, torsoRadiusBottom, hipWidth, hipHeight, legLength, legRadius, shoulderWidth, shoulderRadius } = proportions;

  const hipY = 0;
  const torsoY = hipY + hipHeight / 2 + torsoHeight / 2;
  const shoulderY = torsoY + torsoHeight / 2 + shoulderRadius * 0.5;
  const legY = hipY - hipHeight / 2 - legLength / 2;

  if (garment.category === 'top') {
    // Top covers torso
    const topRadius = Math.max(torsoRadiusTop, torsoRadiusBottom) * 1.08;
    const topHeight = torsoHeight * 1.05;
    return (
      <group ref={meshRef} position={[0, torsoY, 0]}>
        <mesh castShadow>
          <cylinderGeometry args={[topRadius, topRadius * 0.95, topHeight, 24, 1]} />
          <primitive object={garmentMaterial} attach="material" />
        </mesh>
        {/* Collar accent */}
        <mesh position={[0, topHeight * 0.5, 0]}>
          <torusGeometry args={[topRadius * 0.7, 0.02, 8, 24]} />
          <meshStandardMaterial color={garment.swatchColor} roughness={0.6} transparent opacity={0.5} />
        </mesh>
      </group>
    );
  }

  if (garment.category === 'bottom') {
    // Bottom covers hips + upper legs
    const bottomRadius = torsoRadiusBottom * 1.12;
    const bottomHeight = hipHeight + legLength * 0.55;
    const bottomY = hipY - legLength * 0.1;
    return (
      <group ref={meshRef} position={[0, bottomY, 0]}>
        {/* Hip block */}
        <mesh castShadow>
          <cylinderGeometry args={[bottomRadius, bottomRadius * 0.85, bottomHeight, 24, 1]} />
          <primitive object={garmentMaterial} attach="material" />
        </mesh>
        {/* Left leg tube */}
        <mesh position={[-hipWidth * 0.25, -bottomHeight * 0.3, 0]} castShadow>
          <capsuleGeometry args={[legRadius * 1.15, legLength * 0.4, 6, 12]} />
          <primitive object={garmentMaterial} attach="material" />
        </mesh>
        {/* Right leg tube */}
        <mesh position={[hipWidth * 0.25, -bottomHeight * 0.3, 0]} castShadow>
          <capsuleGeometry args={[legRadius * 1.15, legLength * 0.4, 6, 12]} />
          <primitive object={garmentMaterial} attach="material" />
        </mesh>
      </group>
    );
  }

  // Outerwear — covers shoulders + torso, slightly oversized
  const outerRadius = Math.max(torsoRadiusTop, shoulderWidth * 0.5) * 1.18;
  const outerHeight = torsoHeight * 1.15;
  const outerY = torsoY - torsoHeight * 0.05;
  return (
    <group ref={meshRef} position={[0, outerY, 0]}>
      <mesh castShadow>
        <cylinderGeometry args={[outerRadius, outerRadius * 0.9, outerHeight, 24, 1]} />
        <primitive object={garmentMaterial} attach="material" />
      </mesh>
      {/* Shoulder pads */}
      <mesh position={[-shoulderWidth * 0.45, outerHeight * 0.45, 0]} castShadow>
        <capsuleGeometry args={[shoulderRadius * 1.3, shoulderWidth * 0.35, 6, 12]} />
        <primitive object={garmentMaterial} attach="material" />
      </mesh>
      <mesh position={[shoulderWidth * 0.45, outerHeight * 0.45, 0]} castShadow>
        <capsuleGeometry args={[shoulderRadius * 1.3, shoulderWidth * 0.35, 6, 12]} />
        <primitive object={garmentMaterial} attach="material" />
      </mesh>
      {/* Lapel / center seam accent */}
      <mesh position={[0, outerHeight * 0.3, outerRadius * 0.95]}>
        <boxGeometry args={[0.03, outerHeight * 0.5, 0.02]} />
        <meshStandardMaterial color={garment.swatchColor} roughness={0.5} emissive={garment.swatchColor} emissiveIntensity={0.15} />
      </mesh>
    </group>
  );
}

// ============================================================
// Studio environment — floor, lights, particles
// ============================================================

function StudioEnvironment({ env }: { env: Environment3D }) {
  return (
    <>
      {/* Ambient light */}
      <ambientLight intensity={env.ambientIntensity} color={env.bgColor} />

      {/* Key light — main directional from front-right */}
      <directionalLight
        position={[3, 5, 4]}
        intensity={1.2}
        color="#FFFFFF"
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
        shadow-camera-left={-5}
        shadow-camera-right={5}
        shadow-camera-top={5}
        shadow-camera-bottom={-5}
        shadow-bias={-0.001}
      />

      {/* Rim light — accent color from behind */}
      <spotLight
        position={[-3, 3, -4]}
        angle={0.6}
        penumbra={0.8}
        intensity={2.5}
        color={new THREE.Color(env.accentLight)}
        castShadow={false}
      />

      {/* Fill light — soft from left */}
      <pointLight
        position={[-4, 2, 3]}
        intensity={0.5}
        color={new THREE.Color(env.accentLight)}
        distance={15}
      />

      {/* Sun/moon disc */}
      <mesh position={env.sunPosition}>
        <sphereGeometry args={[0.3, 16, 16]} />
        <meshBasicMaterial color={new THREE.Color(env.sunColor)} />
      </mesh>
      <pointLight position={env.sunPosition} intensity={0.8} color={new THREE.Color(env.sunColor)} distance={20} />

      {/* Floor */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -2.8, 0]} receiveShadow>
        <planeGeometry args={[30, 30]} />
        <meshStandardMaterial
          color={new THREE.Color(env.floorColor)}
          roughness={0.4}
          metalness={0.3}
        />
      </mesh>

      {/* Contact shadows */}
      <ContactShadows
        position={[0, -2.78, 0]}
        opacity={0.5}
        scale={8}
        blur={2.5}
        far={4}
        color="#000000"
      />

      {/* Floating particles */}
      <DreiSparkles
        count={60}
        scale={10}
        size={2}
        speed={0.3}
        color={new THREE.Color(env.accentLight)}
        opacity={0.4}
      />
    </>
  );
}

// ============================================================
// Main scene export
// ============================================================

export default function FittingScene({ gender, skinTone, selectedGarments, environment }: SceneProps) {
  const controlsRef = useRef<any>(null);

  return (
    <>
      {/* Fog */}
      <fog attach="fog" args={[environment.fogColor, environment.fogNear, environment.fogFar]} />
      {/* Background color */}
      <color attach="background" args={[environment.bgColor]} />

      <StudioEnvironment env={environment} />

      {/* Avatar + garments in a float group for subtle motion */}
      <Float speed={1.2} rotationIntensity={0.15} floatIntensity={0.25}>
        <group position={[0, -0.5, 0]}>
          <AvatarMannequin gender={gender} skinTone={skinTone} />
          {selectedGarments.map((g) => (
            <Garment3D key={g.id} garment={g} gender={gender} />
          ))}
        </group>
      </Float>

      {/* Orbit controls */}
      <OrbitControls
        ref={controlsRef}
        enablePan={false}
        minDistance={3}
        maxDistance={9}
        minPolarAngle={Math.PI * 0.15}
        maxPolarAngle={Math.PI * 0.75}
        enableDamping
        dampingFactor={0.08}
        autoRotate
        autoRotateSpeed={0.5}
      />
    </>
  );
}
