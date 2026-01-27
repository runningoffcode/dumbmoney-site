import { useRef, useState, useEffect, useMemo, Component } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js'

/*
  Dumb Money poster — cash stacks forming a fist with thumb
  out left and middle finger extended up.
  Each stack is rotated so the flat face of the bills faces the viewer,
  then they are tiled in a grid matching the movie poster silhouette.
*/

class ErrorBoundary extends Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false }
  }
  static getDerivedStateFromError() {
    return { hasError: true }
  }
  componentDidCatch(err) {
    console.error('CashFinger error:', err)
  }
  render() {
    if (this.state.hasError) return null
    return this.props.children
  }
}

let cachedGltf = null
let loadingStarted = false
const loadCallbacks = []

function loadCashGLB(cb) {
  if (cachedGltf) return cb(cachedGltf)
  loadCallbacks.push(cb)
  if (loadingStarted) return
  loadingStarted = true
  const loader = new GLTFLoader()
  loader.load('/assets/cash100.glb', (gltf) => {
    cachedGltf = gltf
    loadCallbacks.forEach(fn => fn(gltf))
    loadCallbacks.length = 0
  }, undefined, (err) => {
    console.error('Failed to load cash100.glb:', err)
  })
}

function MiddleFingerScene() {
  const groupRef = useRef()
  const [gltf, setGltf] = useState(cachedGltf)

  useEffect(() => {
    if (!gltf) loadCashGLB(setGltf)
  }, [gltf])

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += 0.006
      groupRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.4) * 0.04
    }
  })

  const fingerGroup = useMemo(() => {
    if (!gltf) return null

    const srcScene = gltf.scene

    // Measure the model to find its actual bounding box dimensions
    srcScene.updateMatrixWorld(true)
    const box = new THREE.Box3().setFromObject(srcScene)
    const rawSize = new THREE.Vector3()
    box.getSize(rawSize)

    console.log('GLB raw size (x,y,z):', rawSize.x, rawSize.y, rawSize.z)

    // From screenshots, rotating Z by 90° makes bundles lay flat as wide
    // horizontal strips — correct! But the long side of the bill still faces
    // the camera. We also need to rotate 90° on Y so the SHORT edge faces
    // the camera and the long side goes into depth.
    //
    // Combined rotation: Z=90° then Y=90°
    // After both rotations, the visible face from camera is the short edge.
    // The horizontal span = rawSize.z (stack depth, becomes horizontal width)
    // The vertical stacking = rawSize.x (bill width, becomes row height)
    // The depth into screen = rawSize.y (bill height, goes into Z)

    const colStep = rawSize.z * 1.02  // stack depth → horizontal column width
    const rowStep = rawSize.x * 1.02  // bill width → vertical row stacking

    console.log('colStep:', colStep, 'rowStep:', rowStep,
                'ratio:', (colStep / rowStep).toFixed(1))

    // Each grid cell = one bundle laying flat (wide horizontal strip).
    // One clone per cell. No rowsPerBlock needed — each clone IS a wide strip.
    const rowsPerBlock = 1

    const layout = []

    function addBlock(col, block) {
      for (let r = 0; r < rowsPerBlock; r++) {
        layout.push({ col, row: (block - 1) * rowsPerBlock + r })
      }
    }

    // THUMB — staircase going down-left from the fist
    addBlock(-2, 4)
    addBlock(-3, 3)
    addBlock(-3, 2)
    addBlock(-4, 1)

    // FIST — 5 cols wide × 5 visual blocks tall
    for (let block = 1; block <= 5; block++) {
      for (let col = -1; col <= 3; col++) {
        addBlock(col, block)
      }
    }

    // Right knuckle — extra col for top 3 blocks of fist
    addBlock(4, 3)
    addBlock(4, 4)
    addBlock(4, 5)

    // MIDDLE FINGER — 1 col wide, 8 visual blocks above fist
    for (let block = 6; block <= 13; block++) {
      addBlock(1, block)
    }

    console.log('Total clones:', layout.length)

    // Random seed for slight variation
    const seed = (i) => {
      const x = Math.sin(i * 127.1 + 311.7) * 43758.5453
      return x - Math.floor(x)
    }

    const group = new THREE.Group()

    layout.forEach(({ col, row }, i) => {
      const clone = srcScene.clone(true)

      // Rotate 90° on Z (lay flat) + 90° on Y (short edge faces camera)
      clone.rotation.order = 'ZYX'
      clone.rotation.z = Math.PI / 2
      clone.rotation.y = Math.PI / 2

      // Slight random rotation for organic feel
      clone.rotation.z += (seed(i * 7) - 0.5) * 0.025
      clone.rotation.x = (seed(i * 7 + 1) - 0.5) * 0.015

      // Position on grid
      const px = col * colStep + (seed(i * 3) - 0.5) * colStep * 0.03
      const py = row * rowStep + (seed(i * 3 + 1) - 0.5) * rowStep * 0.02
      const pz = (seed(i * 3 + 2) - 0.5) * rawSize.z * 0.02

      clone.position.set(px, py, pz)
      group.add(clone)
    })

    // Compute bounding box of the whole assembled sculpture
    group.updateMatrixWorld(true)
    const groupBox = new THREE.Box3().setFromObject(group)
    const groupSize = new THREE.Vector3()
    groupBox.getSize(groupSize)

    console.log('Assembled size:', groupSize.x, groupSize.y, groupSize.z)

    // Scale to fit in camera view
    const targetHeight = 7
    const s = targetHeight / groupSize.y
    group.scale.set(s, s, s)

    // Re-center the group at origin
    group.updateMatrixWorld(true)
    const finalBox = new THREE.Box3().setFromObject(group)
    const finalCenter = new THREE.Vector3()
    finalBox.getCenter(finalCenter)
    group.position.sub(finalCenter)

    return group
  }, [gltf])

  if (!fingerGroup) return null

  return (
    <group ref={groupRef}>
      <primitive object={fingerGroup} />
    </group>
  )
}

export default function CashFinger() {
  return (
    <ErrorBoundary>
      <div className="cash-finger-container">
        <Canvas
          camera={{ position: [0, 0, 10], fov: 45 }}
          gl={{ antialias: true, alpha: true }}
          style={{ background: 'transparent' }}
        >
          <ambientLight intensity={1.5} />
          <directionalLight position={[5, 5, 5]} intensity={2} />
          <directionalLight position={[-4, 3, 2]} intensity={1} />
          <pointLight position={[0, -3, 5]} intensity={0.8} />
          <MiddleFingerScene />
        </Canvas>
      </div>
    </ErrorBoundary>
  )
}
