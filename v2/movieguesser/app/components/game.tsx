"use client";
import Game3D from "./3d_game";
import GuessBox from "./guessbox";



const Game = (props: any) => {

  return <div className="flex justify-center items-center flex-col bg-primary-800 p-4 grow">
    <div className="h-14 w-full">
      <GuessBox/>
    </div>
    <div className="grow">
      <Game3D/>
    </div>
  </div>
}

export default Game;
