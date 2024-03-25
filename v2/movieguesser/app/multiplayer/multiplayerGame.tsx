import { useEffect, useState } from "react";
import Game from "../components/game";
import getMovie from "../dayinfo";



const MultiplayerGame = (props: any) => {
  const [movie, setMovie] = useState(getMovie(props.room.movieNumber));
  useEffect(() => {
    console.log(props)
  }, [props])

  return <Game movie={movie}/>
}

export default MultiplayerGame
