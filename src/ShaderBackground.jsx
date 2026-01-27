import { MeshGradient } from '@paper-design/shaders-react'

export default function ShaderBackground() {
  return (
    <div className="shader-bg">
      <MeshGradient
        colors={['#000000', '#1a1a1a', '#0a0a0a', '#2a2a2a']}
        speed={0.15}
        distortion={0.8}
        swirl={0.15}
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
        }}
      />
    </div>
  )
}
