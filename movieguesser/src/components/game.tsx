import { useState } from "react"
import ClueGrid from "./clueGrid"
import GuessInput from "./guessInput"

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
    <div id="game" className="bg-dark-800 text-center text-slate-50 flex-center flex-col grow aspect-[7/11] rounded-md mb-3">
      <div className="h-[15%] w-full flex-center flex-col">
        <h1 className="text-[5vh] w-full">{props.points}</h1>
        <GuessInput onGuess={makeGuess} movieTitle={props.movieInfo.title} guesses={props.guesses} win={props.status === "WIN"} score={props.points} />
      </div>
      <ClueGrid onReveal={revealClue} reveals={props.clues} movie={props.movieInfo} showAll={props.status !== "UNFINISHED"} />
    </div>
  )
}

export default Game;