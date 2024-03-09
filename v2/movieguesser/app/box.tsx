"use client";
import { createRoot } from 'react-dom/client'
import React, { useEffect, useRef, useState } from 'react'
import { Canvas, useFrame, useLoader } from '@react-three/fiber'
import { useSpring, animated } from '@react-spring/three'
import { TextureLoader } from 'three'
import { Image, Text } from '@react-three/drei';

const Box = (props: any) => {
  const texture = useLoader(TextureLoader, 'http://localhost:3000/dun2.jpg')
  // Rotate in y when clicked
  // This reference will give us direct access to the mesh
  const meshRef = useRef()
  // Set up state for the hovered and active state
  const [hovered, setHover] = useState(false)
  const [active, setActive] = useState(false)

  //const { scale } = useSpring({ scale: active ? 1.5 : 1 })
  const { rotation } = useSpring({ rotation: active ? [0, Math.PI, 0] : [0, 0, 0] })

  useEffect(() => {
    // Set pointer cursor when hovered
    if (hovered) document.body.style.cursor = 'pointer'
    else document.body.style.cursor = 'auto'
  }, [hovered])




  const flip = () => {
    setActive(!active)
    //if (!meshRef.current) return
    ////@ts-ignore
    //meshRef.current.rotation.y += Math.PI / 2
  }
  //@ts-ignore
  //useFrame((state, delta) => (meshRef.current.rotation.y += delta))
  // Subscribe this component to the render-loop, rotate the mesh every frame
  // Return view, these are regular three.js elements expressed in JSX
  return (
    <animated.mesh
  // @ts-ignore
      ref={meshRef}
      scale={0.5}
  // @ts-ignore
      rotation={rotation}
      onClick={(event) => flip()}
      onPointerOver={(event) => setHover(true)}
      onPointerOut={(event) => setHover(false)}>
      <meshBasicMaterial color={"#40663c"} />

      <mesh
        scale={[-1, 1, 1]}
        position={[0, 0, -0.51]}>

        <meshBasicMaterial color={"#475569"} />
        <boxGeometry args={[8, 12, 0.5]} />

        <mesh
        position={[0, 0, -0.52]}>
          <Text color={"white"} fontSize={1} position={[0, 5.5, 0]}>
            Poster
          </Text>
          <Text color={"white"} fontSize={3} visible={hovered} position={[0, 0, 0]}>
            -25
          </Text>
        </mesh>
      </mesh>

      <mesh
        position={[0, 0, 0.51]}>
        <meshBasicMaterial color={"#40663c"} />
        <boxGeometry args={[8, 12, 1]} />
        <mesh
        position={[0, 0, 0.52]}>
          <Text color={"white"} fontSize={1} position={[0, 5.5, 0]}>
            Poster
          </Text>
          <Image
            position={[0, -0.5, 0]}
            // @ts-ignore
            scale={[8, 11, 0.5]}
            url={'/dun2.jpg'}
          />
        </mesh>
      </mesh>
    </animated.mesh>
  )
}

const Container = (props: any) => {
  const canvasRef = useRef()
  return <div className="h-[32rem]">
    <Canvas>
      <Box position={[0, 0, 0]} />
    </Canvas>
  </div>
}

export default Container