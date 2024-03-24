import { Canvas } from "@react-three/fiber"
import Tile from "./tile"
import TileFace from "./tileface"

const Title = (props: any) => {
  return <Tile 
      position={[...props.position, 0]} 
      size={[...props.size, props.thickness]}
      name={"Title"} 
      horizontalRot={true}
      onFlip={props.onFlip}>

        <TileFace 
          color={"#475569"}/>

        <TileFace 
          color={"#c9b458"}
          text={props.value}/>

        <TileFace 
          color={"#40663c"}
          text={props.value}/>

    </Tile>
}

export default Title;