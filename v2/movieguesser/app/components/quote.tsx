import { Canvas } from "@react-three/fiber"
import Tile from "./tile"
import TileFace from "./tileface"

const Quote = (props: any) => {
  return <Tile 
      position={props.position} 
      size={[12, 3, props.thickness]}
      name={"Quote"} 
      horizontalRot={true}>

        <TileFace 
          color={"#475569"}/>

        <TileFace 
          color={"#40663c"}
          text={"I wish the ring had never come to me."}/>

    </Tile>
}

export default Quote;