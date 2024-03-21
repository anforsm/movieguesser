"use client";
import { Canvas } from "@react-three/fiber";
import GuessBox from "./guessbox";
import Score from "./score";
import CoreGame from "./core_game";



const Game = (props: any) => {

  return <div className="flex justify-center items-center flex-col bg-primary-800 p-4 grow">
    {/* <div className="h-14 w-full">
      <GuessBox/>
    </div> */}
    <div className="w-full h-16">
      <Score/>
    </div>
    <div className="grow">
      <CoreGame/>
    </div>
  </div>
}

export default Game;
