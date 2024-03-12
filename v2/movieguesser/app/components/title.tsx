import { Canvas } from "@react-three/fiber"
import Tile from "./tile"
import TileFace from "./tileface"

const Title = (props: any) => {
  return <Tile 
      position={[...props.position, 0]} 
      size={[...props.size, props.thickness]}
      name={"Title"} 
      horizontalRot={true}>

        <TileFace 
          color={"#475569"}/>

        <TileFace 
          color={"#c9b458"}
          text={"Lord of the ______"}/>

        <TileFace 
          color={"#40663c"}
          text={"Lord of the Rings"}/>

    </Tile>
}

export default Title;