import { useRef, useMemo, useEffect } from 'react';
import { useFrame, useLoader } from '@react-three/fiber';
import {
  OrbitControls, ContactShadows, Float, Sparkles as DreiSparkles,
  Environment, SoftShadows,
} from '@react-three/drei';
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
// Realistic skin shader material — subsurface scattering approximation
// ============================================================

function useSkinMaterial(skinTone: 'light' | 'dark') {
  const toneData = skinToneColors[skinTone];
  return useMemo(() => {
    const mat = new THREE.MeshPhysicalMaterial({
      color: new THREE.Color(toneData.skin),
      roughness: 0.55,
      metalness: 0.0,
      sheen: 0.4,
      sheenColor: new THREE.Color(toneData.skin).lerp(new THREE.Color('#FFD9B0'), 0.2),
      sheenRoughness: 0.5,
      clearcoat: 0.08,
      clearcoatRoughness: 0.6,
      emissive: new THREE.Color(toneData.skinEmissive),
      emissiveIntensity: 0.06,
      envMapIntensity: 0.7,
      // Subtle translucency for SSS illusion
      transmission: 0.0,
      ior: 1.4,
      thickness: 0.5,
    });
    return mat;
  }, [toneData]);
}

// ============================================================
// Generate a procedural skin normal map for pore/fine detail
// ============================================================

function useSkinNormalMap(): THREE.Texture {
  return useMemo(() => {
    const size = 256;
    const canvas = document.createElement('canvas');
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext('2d')!;
    // Fill with neutral normal (flat surface facing camera)
    ctx.fillStyle = '#8080FF';
    ctx.fillRect(0, 0, size, size);
    // Add fine random perturbation for pore detail
    const imgData = ctx.getImageData(0, 0, size, size);
    const data = imgData.data;
    for (let i = 0; i < data.length; i += 4) {
      const n = (Math.random() - 0.5) * 12;
      data[i] = Math.max(0, Math.min(255, 128 + n));     // R (X normal)
      data[i + 1] = Math.max(0, Math.min(255, 128 + n * 0.7)); // G (Y normal)
      data[i + 2] = 255;                                   // B (Z normal)
    }
    ctx.putImageData(imgData, 0, 0);
    const tex = new THREE.CanvasTexture(canvas);
    tex.wrapS = THREE.RepeatWrapping;
    tex.wrapT = THREE.RepeatWrapping;
    tex.repeat.set(4, 4);
    return tex;
  }, []);
}

// ============================================================
// Procedural fabric normal map for garment texture detail
// ============================================================

function useFabricNormalMap(): THREE.Texture {
  return useMemo(() => {
    const size = 256;
    const canvas = document.createElement('canvas');
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext('2d')!;
    ctx.fillStyle = '#8080FF';
    ctx.fillRect(0, 0, size, size);
    const imgData = ctx.getImageData(0, 0, size, size);
    const data = imgData.data;
    // Woven fabric pattern — horizontal and vertical threads
    for (let y = 0; y < size; y++) {
      for (let x = 0; x < size; x++) {
        const i = (y * size + x) * 4;
        const weaveX = Math.sin(x * 0.15) * 8;
        const weaveY = Math.sin(y * 0.15) * 8;
        data[i] = Math.max(0, Math.min(255, 128 + weaveX));
        data[i + 1] = Math.max(0, Math.min(255, 128 + weaveY));
        data[i + 2] = 255;
      }
    }
    ctx.putImageData(imgData, 0, 0);
    const tex = new THREE.CanvasTexture(canvas);
    tex.wrapS = THREE.RepeatWrapping;
    tex.wrapT = THREE.RepeatWrapping;
    tex.repeat.set(3, 3);
    return tex;
  }, []);
}

// ============================================================
// High-detail procedural humanoid avatar
// Realistic proportions with anatomical shaping via lathe + custom geometry
// ============================================================

function AvatarMannequin({ gender, skinTone }: { gender: 'male' | 'female'; skinTone: 'light' | 'dark' }) {
  const groupRef = useRef<THREE.Group>(null);
  const proportions: BodyProportions = bodyProportions[gender];
  const skinMaterial = useSkinMaterial(skinTone);
  const skinNormal = useSkinNormalMap();

  // Apply normal map to skin material
  useEffect(() => {
    skinMaterial.normalMap = skinNormal;
    skinMaterial.normalScale = new THREE.Vector2(0.35, 0.35);
    skinMaterial.needsUpdate = true;
  }, [skinMaterial, skinNormal]);

  // Idle breathing animation
  useFrame((state) => {
    if (!groupRef.current) return;
    const t = state.clock.elapsedTime;
    groupRef.current.position.y = Math.sin(t * 0.7) * 0.015;
    groupRef.current.rotation.z = Math.sin(t * 0.4) * 0.005;
    // Subtle chest breathing — scale torso group
    const breath = 1 + Math.sin(t * 0.7 + 0.3) * 0.008;
    if (groupRef.current.userData.torsoGroup) {
      groupRef.current.userData.torsoGroup.scale.set(breath, 1, breath * 0.95);
    }
  });

  const {
    shoulderWidth, shoulderRadius, torsoHeight, torsoRadiusTop, torsoRadiusBottom,
    hipWidth, hipHeight, legLength, legRadius, armLength, armRadius,
    neckHeight, neckRadius, headRadius,
  } = proportions;

  // Torso — lathe geometry for anatomical shaping (tapered with waist)
  const torsoGeometry = useMemo(() => {
    const points: THREE.Vector2[] = [];
    const segments = 28;
    for (let i = 0; i <= segments; i++) {
      const t = i / segments;
      const y = t * torsoHeight;
      // Create waist indentation: narrower at ~40% height
      const waistFactor = 1 - Math.sin(t * Math.PI) * 0.12 * (gender === 'female' ? 1.3 : 0.6);
      const radius = THREE.MathUtils.lerp(torsoRadiusTop, torsoRadiusBottom, t) * waistFactor;
      points.push(new THREE.Vector2(radius, y));
    }
    return new THREE.LatheGeometry(points, 32);
  }, [torsoRadiusTop, torsoRadiusBottom, torsoHeight, gender]);

  // Hip block — lathe for smoother shape
  const hipGeometry = useMemo(() => {
    const points: THREE.Vector2[] = [];
    const segments = 12;
    for (let i = 0; i <= segments; i++) {
      const t = i / segments;
      const y = t * hipHeight;
      const radius = THREE.MathUtils.lerp(torsoRadiusBottom * 1.02, torsoRadiusBottom * 0.88, t);
      points.push(new THREE.Vector2(radius, y));
    }
    return new THREE.LatheGeometry(points, 32);
  }, [torsoRadiusBottom, hipHeight]);

  // Leg — capsule
  const legGeometry = useMemo(() => {
    return new THREE.CapsuleGeometry(legRadius, legLength, 10, 24);
  }, [legRadius, legLength]);

  // Arm — capsule with slight taper
  const armGeometry = useMemo(() => {
    return new THREE.CapsuleGeometry(armRadius, armLength, 8, 20);
  }, [armRadius, armLength]);

  // Shoulder — wide capsule
  const shoulderGeometry = useMemo(() => {
    return new THREE.CapsuleGeometry(shoulderRadius, shoulderWidth, 10, 24);
  }, [shoulderRadius, shoulderWidth]);

  // Neck — cylinder
  const neckGeometry = useMemo(() => {
    return new THREE.CylinderGeometry(neckRadius, neckRadius * 1.08, neckHeight, 16);
  }, [neckRadius, neckHeight]);

  // Head — sphere with slight elongation
  const headGeometry = useMemo(() => {
    const geo = new THREE.SphereGeometry(headRadius, 48, 48);
    // Slightly elongate vertically and flatten back-to-front
    const pos = geo.attributes.position;
    for (let i = 0; i < pos.count; i++) {
      const x = pos.getX(i);
      const y = pos.getY(i);
      pos.setY(i, y * 1.15);
      pos.setZ(i, pos.getZ(i) * 0.92);
    }
    pos.needsUpdate = true;
    geo.computeVertexNormals();
    return geo;
  }, [headRadius]);

  // Hair — simple cap geometry on head
  const hairGeometry = useMemo(() => {
    const geo = new THREE.SphereGeometry(headRadius * 0.95, 32, 32, 0, Math.PI * 2, 0, Math.PI * 0.55);
    return geo;
  }, [headRadius]);

  const hairMaterial = useMemo(() => {
    const hairColor = gender === 'female' ? '#2A1A0F' : '#1A1208';
    return new THREE.MeshPhysicalMaterial({
      color: new THREE.Color(hairColor),
      roughness: 0.35,
      metalness: 0.0,
      sheen: 0.6,
      sheenColor: new THREE.Color(hairColor).lerp(new THREE.Color('#8B6B40'), 0.15),
      sheenRoughness: 0.4,
      envMapIntensity: 0.5,
    });
  }, [gender]);

  // Y positions
  const hipY = 0;
  const torsoY = hipY + hipHeight / 2 + torsoHeight / 2;
  const shoulderY = torsoY + torsoHeight / 2 + shoulderRadius * 0.3;
  const neckY = shoulderY + shoulderRadius * 0.4 + neckHeight / 2;
  const headY = neckY + neckHeight / 2 + headRadius * 1.05;
  const legY = hipY - hipHeight / 2 - legLength / 2;
  const armY = shoulderY - armLength * 0.3;
  const armOffset = shoulderWidth / 2 + armRadius * 0.3;

  return (
    <group ref={groupRef} position={[0, 0, 0]}>
      {/* Head */}
      <mesh geometry={headGeometry} material={skinMaterial} position={[0, headY, 0]} castShadow receiveShadow />
      {/* Hair cap */}
      <mesh geometry={hairGeometry} material={hairMaterial} position={[0, headY + headRadius * 0.15, -headRadius * 0.05]} castShadow />
      {/* Eyes — sclera */}
      <mesh position={[-headRadius * 0.38, headY + 0.03, headRadius * 0.82]}>
        <sphereGeometry args={[0.045, 20, 20]} />
        <meshPhysicalMaterial color="#F5F5F0" roughness={0.2} clearcoat={0.8} clearcoatRoughness={0.1} />
      </mesh>
      <mesh position={[headRadius * 0.38, headY + 0.03, headRadius * 0.82]}>
        <sphereGeometry args={[0.045, 20, 20]} />
        <meshPhysicalMaterial color="#F5F5F0" roughness={0.2} clearcoat={0.8} clearcoatRoughness={0.1} />
      </mesh>
      {/* Irises */}
      <mesh position={[-headRadius * 0.38, headY + 0.02, headRadius * 0.87]}>
        <sphereGeometry args={[0.022, 16, 16]} />
        <meshStandardMaterial color={skinTone === 'light' ? '#5B7A99' : '#4A3520'} roughness={0.3} />
      </mesh>
      <mesh position={[headRadius * 0.38, headY + 0.02, headRadius * 0.87]}>
        <sphereGeometry args={[0.022, 16, 16]} />
        <meshStandardMaterial color={skinTone === 'light' ? '#5B7A99' : '#4A3520'} roughness={0.3} />
      </mesh>
      {/* Nose — small cone */}
      <mesh position={[0, headY - 0.05, headRadius * 0.92]} rotation={[Math.PI * 0.45, 0, 0]}>
        <coneGeometry args={[0.05, 0.14, 8]} />
        <primitive object={skinMaterial} attach="material" />
      </mesh>
      {/* Lips — flattened sphere */}
      <mesh position={[0, headY - 0.14, headRadius * 0.86]} scale={[1.5, 0.4, 0.6]}>
        <sphereGeometry args={[0.06, 16, 16]} />
        <meshPhysicalMaterial color={skinTone === 'light' ? '#C4756B' : '#8B4A40'} roughness={0.5} sheen={0.3} />
      </mesh>
      {/* Ears */}
      <mesh position={[-headRadius * 0.95, headY, 0]} rotation={[0, 0, -0.3]} scale={[0.4, 0.7, 0.2]}>
        <sphereGeometry args={[0.08, 16, 16]} />
        <primitive object={skinMaterial} attach="material" />
      </mesh>
      <mesh position={[headRadius * 0.95, headY, 0]} rotation={[0, 0, 0.3]} scale={[0.4, 0.7, 0.2]}>
        <sphereGeometry args={[0.08, 16, 16]} />
        <primitive object={skinMaterial} attach="material" />
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

      {/* Torso group (for breathing animation) */}
      <group
        position={[0, torsoY, 0]}
        ref={(el) => { if (groupRef.current) groupRef.current.userData.torsoGroup = el; }}
      >
        <mesh geometry={torsoGeometry} material={skinMaterial} castShadow receiveShadow />
      </group>

      {/* Hips */}
      <mesh geometry={hipGeometry} material={skinMaterial} position={[0, hipY, 0]} castShadow receiveShadow />

      {/* Legs */}
      <mesh geometry={legGeometry} material={skinMaterial} position={[-hipWidth * 0.24, legY, 0]} castShadow />
      <mesh geometry={legGeometry} material={skinMaterial} position={[hipWidth * 0.24, legY, 0]} castShadow />

      {/* Arms */}
      <mesh
        geometry={armGeometry}
        material={skinMaterial}
        position={[-armOffset, armY, 0]}
        rotation={[0, 0, Math.PI * 0.035]}
        castShadow
      />
      <mesh
        geometry={armGeometry}
        material={skinMaterial}
        position={[armOffset, armY, 0]}
        rotation={[0, 0, -Math.PI * 0.035]}
        castShadow
      />

      {/* Hands — small spheres at arm ends */}
      <mesh position={[-armOffset, armY - armLength * 0.55, 0]}>
        <sphereGeometry args={[armRadius * 1.15, 16, 16]} />
        <primitive object={skinMaterial} attach="material" />
      </mesh>
      <mesh position={[armOffset, armY - armLength * 0.55, 0]}>
        <sphereGeometry args={[armRadius * 1.15, 16, 16]} />
        <primitive object={skinMaterial} attach="material" />
      </mesh>

      {/* Feet */}
      <mesh position={[-hipWidth * 0.24, legY - legLength * 0.55, legRadius * 0.3]} scale={[0.8, 0.4, 1.4]}>
        <sphereGeometry args={[legRadius * 1.1, 16, 16]} />
        <meshStandardMaterial color="#1A1A1E" roughness={0.4} />
      </mesh>
      <mesh position={[hipWidth * 0.24, legY - legLength * 0.55, legRadius * 0.3]} scale={[0.8, 0.4, 1.4]}>
        <sphereGeometry args={[legRadius * 1.1, 16, 16]} />
        <meshStandardMaterial color="#1A1A1E" roughness={0.4} />
      </mesh>
    </group>
  );
}

// ============================================================
// 3D Garment with product texture — loads garment image as texture
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
  const fabricNormal = useFabricNormalMap();

  // Load garment product image as texture
  const garmentTexture = useLoader(THREE.TextureLoader, garment.image);
  useEffect(() => {
    if (garmentTexture) {
      garmentTexture.wrapS = THREE.RepeatWrapping;
      garmentTexture.wrapT = THREE.RepeatWrapping;
      garmentTexture.colorSpace = THREE.SRGBColorSpace;
    }
  }, [garmentTexture]);

  // Create garment material with product texture
  const garmentMaterial = useMemo(() => {
    const baseColor = new THREE.Color(garment.swatchColor);
    const mat = new THREE.MeshPhysicalMaterial({
      color: baseColor,
      map: garmentTexture ?? null,
      roughness: 0.75,
      metalness: 0.1,
      sheen: 0.3,
      sheenColor: baseColor.clone().lerp(new THREE.Color('#FFFFFF'), 0.1),
      sheenRoughness: 0.6,
      emissive: baseColor.clone().multiplyScalar(0.05),
      emissiveIntensity: 0.15,
      transparent: true,
      opacity: 0,
      envMapIntensity: 0.6,
      normalMap: fabricNormal,
      normalScale: new THREE.Vector2(0.2, 0.2),
    });
    return mat;
  }, [garment.swatchColor, garmentTexture, fabricNormal]);

  // Snap-on animation: fade in + scale up
  useEffect(() => {
    if (!meshRef.current) return;
    meshRef.current.scale.setScalar(0.88);
  }, []);

  useFrame(() => {
    if (!meshRef.current) return;
    meshRef.current.scale.lerp(new THREE.Vector3(1, 1, 1), 0.12);
    if (garmentMaterial.opacity < 0.94) {
      garmentMaterial.opacity = Math.min(0.94, garmentMaterial.opacity + 0.05);
    }
  });

  const {
    torsoHeight, torsoRadiusTop, torsoRadiusBottom, hipWidth, hipHeight,
    legLength, legRadius, shoulderWidth, shoulderRadius,
  } = proportions;

  const hipY = 0;
  const torsoY = hipY + hipHeight / 2 + torsoHeight / 2;
  const legY = hipY - hipHeight / 2 - legLength / 2;

  // Top — covers torso with lathe for fitted look
  if (garment.category === 'top') {
    const topGeometry = useMemo(() => {
      const points: THREE.Vector2[] = [];
      const segments = 24;
      const topR = Math.max(torsoRadiusTop, torsoRadiusBottom) * 1.06;
      for (let i = 0; i <= segments; i++) {
        const t = i / segments;
        const y = t * (torsoHeight * 1.06);
        const waistFactor = 1 - Math.sin(t * Math.PI) * 0.08;
        const radius = THREE.MathUtils.lerp(topR, topR * 0.94, t) * waistFactor;
        points.push(new THREE.Vector2(radius, y));
      }
      return new THREE.LatheGeometry(points, 32);
    }, [torsoRadiusTop, torsoRadiusBottom, torsoHeight]);

    return (
      <group ref={meshRef} position={[0, torsoY - torsoHeight * 0.03, 0]}>
        <mesh geometry={topGeometry} castShadow receiveShadow>
          <primitive object={garmentMaterial} attach="material" />
        </mesh>
        {/* Collar */}
        <mesh position={[0, torsoHeight * 1.06 * 0.52, 0]}>
          <torusGeometry args={[torsoRadiusTop * 0.72, 0.025, 12, 32]} />
          <meshStandardMaterial color={garment.swatchColor} roughness={0.5} transparent opacity={0.6} />
        </mesh>
      </group>
    );
  }

  // Bottom — covers hips + legs
  if (garment.category === 'bottom') {
    const bottomRadius = torsoRadiusBottom * 1.1;
    const bottomHeight = hipHeight + legLength * 0.5;
    const bottomY = hipY - legLength * 0.08;

    const bottomGeometry = useMemo(() => {
      const points: THREE.Vector2[] = [];
      const segments = 16;
      for (let i = 0; i <= segments; i++) {
        const t = i / segments;
        const y = t * bottomHeight;
        const radius = THREE.MathUtils.lerp(bottomRadius, bottomRadius * 0.78, t);
        points.push(new THREE.Vector2(radius, y));
      }
      return new THREE.LatheGeometry(points, 32);
    }, [bottomRadius, bottomHeight]);

    return (
      <group ref={meshRef} position={[0, bottomY, 0]}>
        <mesh geometry={bottomGeometry} castShadow receiveShadow>
          <primitive object={garmentMaterial} attach="material" />
        </mesh>
        {/* Left leg tube */}
        <mesh position={[-hipWidth * 0.24, -bottomHeight * 0.4, 0]} castShadow>
          <capsuleGeometry args={[legRadius * 1.12, legLength * 0.35, 8, 16]} />
          <primitive object={garmentMaterial} attach="material" />
        </mesh>
        {/* Right leg tube */}
        <mesh position={[hipWidth * 0.24, -bottomHeight * 0.4, 0]} castShadow>
          <capsuleGeometry args={[legRadius * 1.12, legLength * 0.35, 8, 16]} />
          <primitive object={garmentMaterial} attach="material" />
        </mesh>
      </group>
    );
  }

  // Outerwear — oversized coat/jacket
  const outerRadius = Math.max(torsoRadiusTop, shoulderWidth * 0.5) * 1.16;
  const outerHeight = torsoHeight * 1.18;

  const outerGeometry = useMemo(() => {
    const points: THREE.Vector2[] = [];
    const segments = 24;
    for (let i = 0; i <= segments; i++) {
      const t = i / segments;
      const y = t * outerHeight;
      const radius = THREE.MathUtils.lerp(outerRadius, outerRadius * 0.88, t);
      points.push(new THREE.Vector2(radius, y));
    }
    return new THREE.LatheGeometry(points, 32);
  }, [outerRadius, outerHeight]);

  return (
    <group ref={meshRef} position={[0, torsoY - torsoHeight * 0.08, 0]}>
      <mesh geometry={outerGeometry} castShadow receiveShadow>
        <primitive object={garmentMaterial} attach="material" />
      </mesh>
      {/* Shoulder pads */}
      <mesh position={[-shoulderWidth * 0.45, outerHeight * 0.46, 0]} castShadow>
        <capsuleGeometry args={[shoulderRadius * 1.25, shoulderWidth * 0.32, 8, 16]} />
        <primitive object={garmentMaterial} attach="material" />
      </mesh>
      <mesh position={[shoulderWidth * 0.45, outerHeight * 0.46, 0]} castShadow>
        <capsuleGeometry args={[shoulderRadius * 1.25, shoulderWidth * 0.32, 8, 16]} />
        <primitive object={garmentMaterial} attach="material" />
      </mesh>
      {/* Lapel seam */}
      <mesh position={[0, outerHeight * 0.25, outerRadius * 0.95]}>
        <boxGeometry args={[0.025, outerHeight * 0.45, 0.015]} />
        <meshStandardMaterial color={garment.swatchColor} roughness={0.4} emissive={garment.swatchColor} emissiveIntensity={0.1} />
      </mesh>
    </group>
  );
}

// ============================================================
// Studio environment — HDRI lighting, soft shadows, floor
// ============================================================

function StudioEnvironment({ env }: { env: Environment3D }) {
  return (
    <>
      {/* Ambient */}
      <ambientLight intensity={env.ambientIntensity * 0.6} color={env.bgColor} />

      {/* Key light — warm white directional from front-right */}
      <directionalLight
        position={[4, 6, 5]}
        intensity={1.4}
        color="#FFF8F0"
        castShadow
        shadow-mapSize-width={4096}
        shadow-mapSize-height={4096}
        shadow-camera-left={-6}
        shadow-camera-right={6}
        shadow-camera-top={6}
        shadow-camera-bottom={-6}
        shadow-camera-near={0.1}
        shadow-camera-far={20}
        shadow-bias={-0.0005}
        shadow-normalBias={0.02}
      />

      {/* Rim light — accent color from behind-left */}
      <spotLight
        position={[-4, 4, -5]}
        angle={0.5}
        penumbra={0.9}
        intensity={3.0}
        color={new THREE.Color(env.accentLight)}
        castShadow={false}
      />

      {/* Fill light — soft from left */}
      <pointLight
        position={[-5, 3, 4]}
        intensity={0.6}
        color={new THREE.Color(env.accentLight)}
        distance={18}
        decay={1.5}
      />

      {/* Bottom bounce light */}
      <pointLight
        position={[0, -2, 3]}
        intensity={0.3}
        color="#FFFAF0"
        distance={10}
      />

      {/* Sun/moon disc */}
      <mesh position={env.sunPosition}>
        <sphereGeometry args={[0.35, 24, 24]} />
        <meshBasicMaterial color={new THREE.Color(env.sunColor)} />
      </mesh>
      <pointLight position={env.sunPosition} intensity={1.0} color={new THREE.Color(env.sunColor)} distance={25} decay={1.2} />

      {/* Reflective floor */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -2.85, 0]} receiveShadow>
        <planeGeometry args={[40, 40]} />
        <meshPhysicalMaterial
          color={new THREE.Color(env.floorColor)}
          roughness={0.25}
          metalness={0.5}
          envMapIntensity={0.8}
          clearcoat={0.3}
          clearcoatRoughness={0.4}
        />
      </mesh>

      {/* Contact shadows for grounding */}
      <ContactShadows
        position={[0, -2.82, 0]}
        opacity={0.6}
        scale={10}
        blur={2}
        far={5}
        resolution={1024}
        color="#000000"
      />

      {/* Floating ambient particles */}
      <DreiSparkles
        count={80}
        scale={12}
        size={3}
        speed={0.2}
        color={new THREE.Color(env.accentLight)}
        opacity={0.35}
      />

      {/* HDRI environment for realistic reflections — preset based on scene */}
      <Environment
        preset={env.id === 'beach-sunset' ? 'sunset' : env.id === 'tokyo-street' ? 'night' : env.id === 'luxury-resort' ? 'apartment' : 'studio'}
        environmentIntensity={0.35}
        environmentRotation={[0, Math.PI / 4, 0]}
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
      {/* Soft shadows for realistic shadow penumbra */}
      <SoftShadows size={25} samples={12} focus={0.8} />

      {/* Fog for depth */}
      <fog attach="fog" args={[environment.fogColor, environment.fogNear, environment.fogFar]} />
      <color attach="background" args={[environment.bgColor]} />

      <StudioEnvironment env={environment} />

      {/* Avatar + garments */}
      <Float speed={1.0} rotationIntensity={0.08} floatIntensity={0.2}>
        <group position={[0, -0.8, 0]}>
          <AvatarMannequin gender={gender} skinTone={skinTone} />
          {selectedGarments.map((g) => (
            <Garment3D key={g.id} garment={g} gender={gender} />
          ))}
        </group>
      </Float>

      {/* Orbit controls — full 360 rotation + zoom */}
      <OrbitControls
        ref={controlsRef}
        enablePan={true}
        panSpeed={0.5}
        minDistance={2.5}
        maxDistance={10}
        minPolarAngle={Math.PI * 0.1}
        maxPolarAngle={Math.PI * 0.82}
        enableDamping
        dampingFactor={0.06}
        autoRotate
        autoRotateSpeed={0.4}
        target={[0, 0, 0]}
      />
    </>
  );
}
