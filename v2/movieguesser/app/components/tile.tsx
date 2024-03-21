import { Children, cloneElement, useEffect, useRef, useState } from "react";
import TileFace from "./tileface";
import { useSpring, animated } from "@react-spring/three";
import { clone } from "three/examples/jsm/utils/SkeletonUtils.js";



const rotationFreezeTime = 500
const DEBUG_MODE = false

const Tile = (props: any) => {
  let [x, y, z] = props.size;
  let positive_z = z > 0 ? 1 : -1;
  // Rotate in y when clicked
  // This reference will give us direct access to the mesh
  const meshRef = useRef()
  const [hovered, setHover] = useState(false)
  const [canFlip, setCanFlip] = useState(true)
  const [currRotation, setCurrRotation] = useState(DEBUG_MODE ? 0.8 : 0)
  const [frontVisible, setFrontVisible] = useState(true)
  const [faces, setFaces] = useState([]);


  const { rotation } = useSpring({ rotation: [props.horizontalRot ? currRotation: 0, props.horizontalRot ? 0 : currRotation, 0]})

  const [currFaceI, setCurrFaceI] = useState(0);

  useEffect(() => {
    setFaces(
      props.children.map((Child: any) => cloneElement(Child, {
        size: props.size,
        horizontalRot: props.horizontalRot,
        position: [0, 0, z/2],
      }))
    )

  }, [])

  const getNextFace = (i: number) => (i + 1) % faces.length

  useEffect(() => {
    // Set pointer cursor when hovered
    if (hovered && canFlip) document.body.style.cursor = 'pointer'
    else document.body.style.cursor = 'auto'
  }, [hovered, canFlip])

  const flip = () => {
    if (!canFlip) return
    setCurrRotation((currRotation + Math.PI))
    setCanFlip(false)

    setTimeout(() => {
      setCanFlip(true)
      setCurrFaceI(getNextFace(currFaceI))
      setFrontVisible(!frontVisible)
    }, rotationFreezeTime);
  }

  return (
    <animated.mesh
  // @ts-ignore
      ref={meshRef}
      scale={0.5}
      position={props.position}
  // @ts-ignore
      rotation={rotation}
      onClick={(event) => flip()}
      onPointerOver={(event) => setHover(true)}
      onPointerOut={(event) => setHover(false)}>
    
      {Children.map(props.children, (child, i) => {
        if (i !== currFaceI && i !== getNextFace(currFaceI)) return null 

        child = cloneElement(child, {
          ...child.props,
          size: props.size,
          horizontalRot: props.horizontalRot,
          position: [0, 0, z/2],
          name: props.name,
        })

        if (i === currFaceI) {
          return cloneElement(child, {
            ...child.props,
            flipped: !frontVisible,
          })
        }

        if (i === getNextFace(currFaceI)) {
          return cloneElement(child, {
            ...child.props,
            flipped: frontVisible,
          })
        }

      })}

    </animated.mesh>
  )
}

export default Tile;