import { Canvas } from "@react-three/fiber"
import Tile from "./tile"
import TileFace from "./tileface"
import { useEffect, useState } from "react"

const Quote = (props: any) => {
  // Add a newline to props.value for every 50 characters
  const [quote, setQuote] = useState(props.value)

  useEffect(() => {
    let newQuote = ""
    let words = props.value.split(" ")
    let line = ""
    for (let i = 0; i < words.length; i++) {
      if (line.length + words[i].length > 60) {
        newQuote += line + "\n"
        line = ""
      }
      line += words[i] + " "
    }
    newQuote += line
    setQuote(newQuote)
  }, [props.value])

  return <Tile 
      position={[...props.position, 0]} 
      size={[...props.size, props.thickness]}
      name={"Quote"} 
      horizontalRot={true}
      onFlip={props.onFlip}>

        <TileFace 
          color={"#475569"}/>

        <TileFace 
          color={"#40663c"}
          text={"Placeholder quote"}
          fontSize={0.4}
          />

    </Tile>
}

export default Quote;