import { Canvas } from "@react-three/fiber";
import { useRef } from "react";
import Tile from "./tile";
import TileFace from "./tileface";

const Info = (props: any) => {
  return <Tile 
      position={[...props.position, 0]} 
      size={[...props.size, props.thickness]}
      name={props.name} 
      horizontalRot={false}
      onFlip={props.onFlip}>

        <TileFace 
          color={"#475569"}/>

        <TileFace 
          color={"#40663c"}
          text={props.value}
          fontSize={props.fontSize}
        />

    </Tile>
}

export default Info
