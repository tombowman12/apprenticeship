'use client'

import { Sand } from '@/components/canvas/Sand'
import Model from '@/components/canvas/Snowman'
import { Environment, Html, OrbitControls, Plane, Sky, Sparkles, Stars } from '@react-three/drei'
import { Canvas } from '@react-three/fiber'
import React, { Suspense, useEffect, useRef, useState } from 'react'
import { Physics, RigidBody } from "@react-three/rapier"
import Fireworks from 'react-canvas-confetti/dist/presets/fireworks'

const Page = () => {
  const [numberOfSandBags, setNumberOfSandBags] = useState(0)
  const [cooldownActive, setCooldownActive] = useState(false)
  const sandRefs = useRef([])
  const [collidedBags, setCollidedBags] = useState([])
  const [throwsLeft, setThrowsLeft] = useState(5)
  const [fireworksActive, setFireworksActive] = useState(false)

  const [totalScore, setTotalScore] = useState(0)

  // Clear the ref array on every render
  sandRefs.current = []

  const addSandRef = (el) => {
    if (el && !sandRefs.current.includes(el)) {
      sandRefs.current.push(el)
    }
  }

  function handleSpaceClick() {

    if (throwsLeft <= 0) {
      return
    }

    setThrowsLeft(throwsLeft - 1)

    // Set cooldown to prevent spamming
    setCooldownActive(true)
    setTimeout(() => {
      setCooldownActive(false)
    }, 1000)

    console.log('Adding sandbag and applying impulse')
    setNumberOfSandBags(prev => prev + 1)

    // Apply impulse to all sandbags when space is pressed
    sandRefs.current.forEach((sandRef) => {
      const impulse = { x: 1000, y: 0, z: 0 } // Adjust impulse as necessary
      if (sandRef) {
        sandRef.applyImpulse(impulse, true)
      }
    })
  }


  const [scored, setScored] = React.useState(false)
  const sensorRef = React.useRef()

  function handleCollision(info) {

    setFireworksActive(true)
    setTimeout(() => {
      setFireworksActive(false)
    }, 1000)

    console.log(info)

    if (!scored) {
      setTotalScore(prev => prev + 1)
      console.log('Scored!')
    }
  }


  return (
    <div className='w-screen h-screen'>
      {fireworksActive && <Fireworks autorun={{ duration: 1 }} />}
      <Canvas flat linear camera={{ fov: 75, position: [-20, 40, 80] }} >
        <Html fullscreen // Wrapping element (default: 'div')
        // The className of the wrapping element (default: undefined)
        >
          <div className='flex items-center'>
            <button onClick={handleSpaceClick} className=' select-none m-4 bg-[#11059f] text-white font-medium rounded-full px-4 '>Throw</button>
            {throwsLeft > 0 && <p className='ml-4 select-none'>{throwsLeft} left!</p>}
            {throwsLeft === 0 && <p className='ml-4 select-none'>No throws left!</p>}
          </div>
        </Html>
        <Environment preset='city' />
        <ambientLight intensity={2} />
        <OrbitControls />
        <Suspense>
          <Physics gravity={[0, -9.81, 0]}  >
            <group>
              {Array.from({ length: numberOfSandBags }).map((_, i) => {
                return (
                  <group key={i}>
                    <Sand totalScore={totalScore} setTotalScore={setTotalScore} ref={addSandRef} /> {/* Pass ref collector */}
                  </group>
                )
              })}
            </group>
            <Model totalScore={totalScore} setTotalScore={setTotalScore} />
            <RigidBody type='fixed' sensor onIntersectionEnter={(info) => handleCollision(info)} ref={sensorRef} position={[0, 0, - 0.503]} rotation={[-5.15, 0, 0]} >
              <mesh>
                <boxGeometry args={[4, 0.1, 8]}>
                </boxGeometry>
                <meshPhongMaterial color='transparent' transparent opacity={0} />
              </mesh>
            </RigidBody>
          </Physics>
        </Suspense>
      </Canvas>
    </div>
  )
}

export default Page
