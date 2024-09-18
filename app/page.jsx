'use client'

import Model from '@/components/canvas/Snowman'
import { Environment, OrbitControls } from '@react-three/drei'
import { Canvas } from '@react-three/fiber'
import React from 'react'



const Page = () => {
  return (
    <div className='w-screen h-screen'>
      <Canvas flat linear>
        <OrbitControls />
        <Environment preset='sunset' background />
        <ambientLight intensity={2} />
        <Model />
      </Canvas>
    </div>
  )
}
//commit change
export default Page