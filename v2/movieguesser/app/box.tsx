"use client";
import { createRoot } from 'react-dom/client'
import React, { useEffect, useRef, useState } from 'react'
import { Canvas, useFrame, useLoader, extend } from '@react-three/fiber'
import { useSpring, animated } from '@react-spring/three'
import { TextureLoader } from 'three'
import { Image, Text } from '@react-three/drei';
import { easing, geometry } from 'maath'
import { RoundedBoxGeometry } from 'three/examples/jsm/Addons.js';
extend({ RoundedPlaneGeometry: geometry.RoundedPlaneGeometry })

const h = 0.01
const CARD_THICKNESS=0.2

const BoxFace = (props: any) => {
    let [xs, ys, zs] = props.scale;
    let [x, y, z] = props.position;
    console.log(Math.round(y/2));
    let positive_z = z > 0 ? 1 : -1;
    let h_ = h * positive_z;

    return <mesh
        scale={[props.flipped && !props.horizontalRot ? -1 : 1, props.flipped && props.horizontalRot ? -1 : 1, 1]}
        position={props.position}>

        <meshBasicMaterial color={props.color} />
        {/* @ts-ignore*/}
        <boxGeometry args={props.scale} />

        <mesh
          position={[0, 0, z]}
          scale={[1, 1, 0.01]}
          >

          <Text color={"white"} fontSize={0.5} position={[0, (ys - 0.5) / 2, h_]}>
            {props.name}
          </Text>
          <Text color={"black"} fontSize={1} position={[0, -(ys/3), 2*h_]}>
            {props.flipped ? "Back" : "Front"}
          </Text>

          {/*<Text color={"white"} fontSize={1} visible={props.hovered} position={[0, 0, 0]}>
            -25
          </Text>*/}
          {props.image && <Image
            toneMapped={false}
            position={[0, -0.25, h_]}
            // @ts-ignore
            scale={[xs, ys-0.5, h]}
            url={props.image}
          >
          {props.text && <Text position={[0, 0, h * positive_z]}>{props.text}</Text>}

          </Image>}
        </mesh>
      </mesh>
}

const rotationFreezeTime = 500

const Box = (props: any) => {
  let [x, y, z] = props.scale;
  let positive_z = z > 0 ? 1 : -1;
  // Rotate in y when clicked
  // This reference will give us direct access to the mesh
  const meshRef = useRef()
  const [hovered, setHover] = useState(false)
  const [canFlip, setCanFlip] = useState(true)
  const [currRotation, setCurrRotation] = useState(0.8)


  //const { rotation } = useSpring({ rotation: active ? [0, currRotation + Math.PI, 0] : [0, currRotation, 0] })
  const { rotation } = useSpring({ rotation: [props.horizontalRot ? currRotation: 0, props.horizontalRot ? 0 : currRotation, 0]})

  const [currFaceI, setCurrFaceI] = useState(0);

  const faces = [
    (front: boolean) => <BoxFace scale={props.scale} horizontalRot={props.horizontalRot} position={[0, 0, front ? z/2 : -z/2]} color={"#475569"} hovered={hovered} flipped={!front} name={props.name} />,
    (front: boolean) => <BoxFace scale={props.scale} horizontalRot={props.horizontalRot} position={[0, 0, front ? z/2 : -z/2]} color={"#c9b458"} hovered={hovered} flipped={!front} image={props.image} name={props.name} />,
    (front: boolean) => <BoxFace scale={props.scale} horizontalRot={props.horizontalRot} position={[0, 0, front ? z/2 : -z/2]} color={"#40663c"} hovered={hovered} flipped={!front} image={props.image} name={props.name} />,
  ]

  const getNextFace = (i: number) => (i + 1) % faces.length

  const [frontSide, setFrontSide] = useState(faces[currFaceI](true))
  const [backSide, setBackSide] = useState(faces[getNextFace(currFaceI)](false))

  useEffect(() => {
    // Set pointer cursor when hovered
    if (hovered && canFlip) document.body.style.cursor = 'pointer'
    else document.body.style.cursor = 'auto'
  }, [hovered, canFlip])

  const flip = () => {
    if (!canFlip) return
    setCurrRotation((currRotation + Math.PI))
    //setCurrRotation((currRotation + Math.PI) % (2 * Math.PI))
    setCanFlip(false)
    setTimeout(() => {
      //setLaggedRotation(currRotation)
      setCanFlip(true)
      setCurrFaceI(getNextFace(currFaceI))
    }, rotationFreezeTime);
  }

  useEffect(() => {
    if (currFaceI % 2 === 1) {
      setFrontSide(faces[getNextFace(currFaceI)](true))
    }
    if (currFaceI % 2 === 0) {
      setBackSide(faces[getNextFace(currFaceI)](false))
    }
    //setFrontSide(faces[currFaceI](true))
    //setBackSide(faces[currFaceI+1](false))
  }, [currFaceI])



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

      {frontSide}
      {backSide}

    </animated.mesh>
  )
}

const Poster = (props: any) => {
  const canvasRef = useRef()
  return <div className="h-[32rem]">
    <Canvas>
      <Box position={[0, 0, 0]}  scale={[4, 6, CARD_THICKNESS]} image={"/lotr.jpg"} name={"Poster"} horizontalRot={false}/>
    </Canvas>
  </div>
}

const Title = (props: any) => {
  const canvasRef = useRef()
  return <div className="h-[32rem]">
    <Canvas>
      <Box position={[0, 0, 0]} scale={[10, 2, CARD_THICKNESS]} text="Lord of the Rings" name={"Title"} horizontalRot={true}/>
    </Canvas>
  </div>
}

export { Poster, Title }