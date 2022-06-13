import { useState } from "react"
import ClueGrid from "./clueGrid"
import GuessInputLine from "./guessInputLine";
import Scorebar from "./scorebar";

const daysPassed = (date: Date) => {
  let current = new Date(date.getTime()).getTime();
  let previous = new Date(2022, 0, 1).getTime();
  return Math.floor((current - previous) / 8.64e7);
}
let currentDay = daysPassed(new Date());

const MAX_GUESSES = 1;

const Game = (props: any) => {
  const makeGuess = (guess: string) => {
    if (props.status !== "UNFINISHED")
      return;

    const correctGuess = guess.toLowerCase() === props.movieInfo.title.toLowerCase()
    let newState = {
      status: correctGuess ? "WIN" : (props.guesses + 1 === MAX_GUESSES ? "LOSE" : "UNFINISHED"),
      clues: props.clues,
      points: props.points,
      guesses: props.guesses + 1,
      day: props.day,
      movie: props.movie,
    }

    props.onNewGameState(newState);
  }

  const revealClue = (category: string, pointCost: number) => {
    if (props.status !== "UNFINISHED")
      return;

    let newClues = { ...props.clues }
    newClues[category] += 1

    let newState = {
      status: props.status,
      clues: newClues,
      points: props.points + pointCost,
      guesses: props.guesses,
      day: props.day,
      movie: props.movie,
    }

    props.onNewGameState(newState);
  }
  //min-h-[1000px]  w-[42rem]
  //<div id="game" className="flex-center grow">
  //</div>
  return (
    <div id="game" className={`bg-primary-800 text-center flex-center flex-col grow ${!props.isTutorial ? "aspect-[7/11]" : "aspect-[1/1.1]"} rounded-[2vh] mb-[1vh] shadow-2xl`}>
      <div className={`h-[15%] w-full flex-center flex-col`}>
        <GuessInputLine isTutorial={props.isTutorial} onGuess={makeGuess} movieTitle={props.movieInfo.title} guesses={props.guesses} win={props.status === "WIN"} score={props.points} />
        <Scorebar points={props.points} />
      </div>
      <ClueGrid isTutorial={props.isTutorial} clueSpecification={props.clueSpecification} onReveal={revealClue} reveals={props.clues} movie={props.movieInfo} showAll={props.status !== "UNFINISHED"} />
    </div>
  )
}

export default Game;