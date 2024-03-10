import { Canvas } from "@react-three/fiber";
import { useRef } from "react";
import Tile from "./tile";
import TileFace from "./tileface";

const Poster = (props: any) => {
  return <Tile 
      position={props.position} 
      size={[4, 6, props.thickness]}
      name={"Poster"} 
      horizontalRot={false}>

        <TileFace 
          color={"#475569"}/>

        <TileFace 
          color={"#c9b458"}
          image={"/lotr.jpg"}/>

        <TileFace 
          color={"#40663c"}
          image={"/lotr.jpg"}/>

    </Tile>
}

export default Poster;