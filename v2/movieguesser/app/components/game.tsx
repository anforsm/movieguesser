"use client";
import { Canvas } from "@react-three/fiber";
import GuessBox from "./guessbox";
import Score from "./score";
import CoreGame from "./core_game";
import { useEffect, useState } from "react";
import { useProgress } from "@react-three/drei";
import LoadingCover from "./loading";



const Game = (props: any) => {
  const [progress_, setProgress] = useState(0)
  const {active, progress, errors, item, loaded, total} = useProgress()
  const [score, setScore] = useState(100)

  useEffect(() => {
    if (progress === 100) {
      setProgress(99)
      setTimeout(() => {
        setProgress(100)
      }, 200)
    }
    console.log(progress)
  }, [progress])

  return <><LoadingCover progress={progress_}/><div className="flex justify-center items-center flex-col bg-primary-800 p-4 grow">
      <div className="h-14 w-full mb-4">
        <GuessBox/>
      </div>
      <div className="w-full h-8 mb-4">
        <Score score={score}/>
      </div>
      <div className="grow">
        <CoreGame onReveal={(cost: number) => {
          setScore(Math.max(score - cost, 0))
        }} />
      </div>
    </div>
  </>
}

export default Game;
