import { Image, Text } from "@react-three/drei";


const h = 0.01
const CARD_THICKNESS=0.2

const HEADER_HEIGHT = 0.5

const TileFace = (props: any) => {
    let [xs, ys, zs] = props.size;
    let [x, y, z] = props.position;
    //let positive_z = z > 0 ? 1 : -1;
    //let h_ = h * positive_z;
    let mul = props.flipped ? -1 : 1;

    return <group
        scale={[
          props.flipped && !props.horizontalRot ? -1 : 1, 
          props.flipped && props.horizontalRot ? -1 : 1, 
          props.flipped ? -1 : 1]
        }
        position={[x, y, z*mul]}>

        <mesh>
          <meshBasicMaterial color={props.color} />
          {/* @ts-ignore*/}
          <boxGeometry args={props.size} />
        </mesh>

        <group
          position={[0, 0, zs]}
        >

          {/* Header group */}
          <group
            position={[0, (ys - HEADER_HEIGHT)/2, 0]}
          >
            <mesh>
              <meshBasicMaterial color={"black"} opacity={0.4} transparent={true}/>
              <planeGeometry args={[xs, HEADER_HEIGHT]} />
            </mesh>

            <Text color={"white"} fontSize={0.3} position={[0, 0, h]} castShadow={false}>
              {props.name}
            </Text>

          </group>

          {/* Content group */}
          <group
            position={[0, -(HEADER_HEIGHT)/2, 0]}
          >
            {props.children && props.children}

            {props.image && <Image
              toneMapped={false}
              position={[0, 0, h]}
              scale={[xs, ys-HEADER_HEIGHT]}
              url={props.image}
            >
            </Image>}

            {props.text && <Text color={"white"} fontSize={0.5} position={[0, 0, h]}>
              {props.text}
            </Text>}

          </group>

        </group>
      </group>
}

export default TileFace 