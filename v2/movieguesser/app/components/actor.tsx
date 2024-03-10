import { Canvas } from "@react-three/fiber";
import { useRef } from "react";
import Tile from "./tile";
import TileFace from "./tileface";

const Actor = (props: any) => {
  return <Tile 
      position={props.position} 
      size={[4, 6, props.thickness]}
      name={"Actor"} 
      horizontalRot={false}>

        <TileFace 
          color={"#475569"}/>

        <TileFace 
          color={"#40663c"}
          image={props.image}/>

    </Tile>
}

export default Actor;