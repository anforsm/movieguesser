import { Bounds, OrthographicCamera, PerspectiveCamera } from "@react-three/drei"
import { Canvas } from "@react-three/fiber"
import { useEffect, useRef } from "react"


const WIDTH = 500
const DEPTH = 20
const PERCENTAGE = 0.8

const Score3D = (props: any) => {
  return <Canvas shadows>
    <Bounds fit clip observe maxDuration={0} margin={1}/>
    {/* <PerspectiveCamera makeDefault position={[0, 0, 50]}/> */}
    <OrthographicCamera makeDefault position={[0, 0, 20]}/>

    <ambientLight intensity={0.5}/>
    <pointLight position={[0, 10, 100]} decay={0} intensity={Math.PI} castShadow/>
    <pointLight position={[0, -10, 100]} decay={0} intensity={Math.PI} castShadow/>

    <group rotation-y={-0.3}>
      <mesh rotation-z={Math.PI/2}>
        <meshPhysicalMaterial thickness={0.2} color={"black"} transparent opacity={0.4}/>
        <capsuleGeometry args={[DEPTH, WIDTH, 10, 20]}/>
      </mesh>

      <mesh rotation-z={Math.PI/2} position={[-(1-PERCENTAGE)*WIDTH/2 - DEPTH, 0, 0]}>
        <meshLambertMaterial color="blue"/>
        <cylinderGeometry args={[DEPTH-4, DEPTH-4, PERCENTAGE*WIDTH, 20, 1, false]}/>
      </mesh>

    </group>
  </Canvas>
}

const Score = (props: any) => {
  const scorebar_ref = useRef(null)
  const text_container_ref = useRef(null)

  return <div className="w-full h-full bg-primary-900">
      <div className="h-full bg-primary-600 relative px-2 transition-all" style={{width: `${props.score}%`}}>
        <p className={`text-2xl m-0 text-right ${props.score < 5 ? "text-black" : ""}`}>{props.score}</p>
      </div>
    </div>
}

export default Score