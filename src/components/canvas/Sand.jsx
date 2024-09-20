'use client'

/*
Auto-generated by: https://github.com/pmndrs/gltfjsx
Command: npx gltfjsx@6.5.0 /Users/tombowman/Documents/apprenticeship/apprenticeship/react-three-next/public/sand.gltf 
*/

import React, { useEffect } from 'react'
import { useGLTF, useTexture } from '@react-three/drei'
import { CuboidCollider, RigidBody } from '@react-three/rapier'
import { useFrame } from '@react-three/fiber'

export function Sand({ toalScore, setTotalScore }) {
  const { nodes, materials } = useGLTF('/sand.gltf')
  const [scored, setScored] = React.useState(false)

  const sensorRef = React.useRef()

  const [impulse, setImpulse] = React.useState(true)
  useEffect(() => {
    setTimeout(() => {
      setImpulse(false)
    }, 200);
  }, [])

  const bagRef = React.useRef()

  useFrame(() => {
    const weighting = Math.random() * 2
    const xIsPositive = Math.random() > 0.5
    if (impulse) {
      bagRef.current?.applyImpulse({ x: xIsPositive ? -0.01 : 0.01, y: 0.02 * weighting, z: -0.03 * weighting }, true)
    }
  })


  const texture = useTexture('/rr-logo.png')

  return (
    <>
      <RigidBody ref={bagRef} friction={0} colliders='cuboid'>
        <group dispose={null} position={[0, 0, 5]}  >
          <mesh geometry={nodes.bagFlat.geometry} material={materials.brownLight} >
            <meshStandardMaterial map={texture} />
          </mesh>
        </group>
      </RigidBody>
    </>

  )
}

useGLTF.preload('/sand.gltf')
