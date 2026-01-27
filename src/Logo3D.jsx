import { useRef, useMemo, useState, useEffect } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { FontLoader } from 'three/addons/loaders/FontLoader.js'
import { TextGeometry } from 'three/addons/geometries/TextGeometry.js'
import * as THREE from 'three'

// Shared font cache
let cachedFont = null
let fontLoading = false
const fontCallbacks = []

function loadFont(cb) {
  if (cachedFont) return cb(cachedFont)
  fontCallbacks.push(cb)
  if (fontLoading) return
  fontLoading = true
  const loader = new FontLoader()
  loader.load('/assets/helvetiker_bold.json', (f) => {
    cachedFont = f
    fontCallbacks.forEach(fn => fn(f))
    fontCallbacks.length = 0
  })
}

// Italic shear amount — positive = lean right like the movie poster
const ITALIC_SHEAR = 0.22

function Letter({ char, position, material, cfg }) {
  const geometry = useMemo(() => {
    const geo = new TextGeometry(char, cfg)
    const pos = geo.attributes.position
    for (let i = 0; i < pos.count; i++) {
      const y = pos.getY(i)
      pos.setX(i, pos.getX(i) + y * ITALIC_SHEAR)
    }
    pos.needsUpdate = true
    geo.computeBoundingBox()
    geo.computeVertexNormals()
    return geo
  }, [char, cfg])
  return <mesh position={position} geometry={geometry} material={material} />
}

function SpinningText({ textSize = 1.4, spin = true }) {
  const groupRef = useRef()
  const [font, setFont] = useState(cachedFont)

  useEffect(() => {
    if (!font) loadFont(setFont)
  }, [font])

  useFrame((state) => {
    if (groupRef.current && spin) {
      groupRef.current.rotation.y += 0.012
      groupRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.6) * 0.06
    }
  })

  const redMat = useMemo(() => new THREE.MeshStandardMaterial({
    color: 0xdc1919,
    metalness: 0.6,
    roughness: 0.25,
  }), [])

  const whiteMat = useMemo(() => new THREE.MeshStandardMaterial({
    color: 0xf0f0f0,
    metalness: 0.6,
    roughness: 0.25,
  }), [])

  // ALL hooks must be above any early return
  const cfg = useMemo(() => {
    if (!font) return null
    return {
      font,
      size: textSize,
      depth: textSize * 0.35,
      bevelEnabled: true,
      bevelThickness: 0.03,
      bevelSize: 0.02,
      bevelSegments: 3,
      curveSegments: 8,
    }
  }, [font, textSize])

  // Early return AFTER all hooks
  if (!font || !cfg) return null

  const items = [
    { c: 'D', r: true },
    { c: 'U', r: false },
    { c: 'M', r: false },
    { c: 'B', r: false },
    { c: ' ' },
    { c: 'M', r: true },
    { c: 'O', r: false },
    { c: 'N', r: false },
    { c: 'E', r: false },
    { c: 'Y', r: false },
  ]

  const positioned = []
  let x = 0
  const spacing = 0.85
  for (const item of items) {
    if (item.c === ' ') {
      x += textSize * 0.15
      continue
    }
    positioned.push({ ...item, x })
    const g = font.data.glyphs[item.c]
    const res = font.data.resolution || 1000
    x += (g ? g.ha / res : 0.5) * cfg.size * spacing
  }
  const ox = -x / 2

  return (
    <group ref={groupRef}>
      {positioned.map((l, i) => (
        <Letter
          key={i}
          char={l.c}
          position={[ox + l.x, -textSize * 0.5, 0]}
          material={l.r ? redMat : whiteMat}
          cfg={cfg}
        />
      ))}
    </group>
  )
}

// Hero version — big, spinning
export default function Logo3D() {
  return (
    <div className="logo-3d-container">
      <Canvas
        camera={{ position: [0, 0, 10], fov: 35 }}
        gl={{ antialias: true, alpha: true }}
        style={{ background: 'transparent' }}
      >
        <ambientLight intensity={0.8} />
        <directionalLight position={[5, 5, 5]} intensity={2} />
        <directionalLight position={[-4, 3, 2]} intensity={1} />
        <pointLight position={[0, -3, 5]} intensity={0.6} />
        <SpinningText textSize={1.4} spin={true} />
      </Canvas>
    </div>
  )
}

// Nav version — small, spinning
export function NavLogo3D() {
  return (
    <div className="nav-logo-3d">
      <Canvas
        camera={{ position: [0, 0, 10], fov: 20 }}
        gl={{ antialias: true, alpha: true }}
        style={{ background: 'transparent' }}
      >
        <ambientLight intensity={0.8} />
        <directionalLight position={[5, 5, 5]} intensity={2} />
        <directionalLight position={[-4, 3, 2]} intensity={1} />
        <SpinningText textSize={1.1} spin={true} />
      </Canvas>
    </div>
  )
}
