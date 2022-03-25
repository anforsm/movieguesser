import { useState } from "react"
import ClueGrid from "./clueGrid"
import GuessInput from "./guessInput"
import GuessInputLine from "./guessInputLine";

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
    <div id="game" className="bg-primary-800 text-center flex-center flex-col grow aspect-[7/11] rounded-[2vh] mb-3">
      <div className="h-[15%] w-full flex-center flex-col">
        {!props.DEV && <h1 className="text-[5vh] w-full">{props.points}</h1>}
        {!props.DEV && <GuessInput onGuess={makeGuess} movieTitle={props.movieInfo.title} guesses={props.guesses} win={props.status === "WIN"} score={props.points} />}
        {props.DEV && <GuessInputLine onGuess={makeGuess} movieTitle={props.movieInfo.title} guesses={props.guesses} win={props.status === "WIN"} score={props.points} />}
        {props.DEV && <div className="h-[5vh] w-[96%] rounded-[1.2vh] bg-red-900 overflow-hidden flex flex-col justify-center">
          <div className="label">Health</div>
          <div className="grow bg-red-600 text-right overflow-hidden" style={{ width: `${100 - props.points}%` }}>
            <span className="h-full text-[3vh] leading-[0.90em] mr-2">{100 - props.points}</span>
          </div>
        </div>}
      </div>
      <ClueGrid onReveal={revealClue} reveals={props.clues} movie={props.movieInfo} showAll={props.status !== "UNFINISHED"} />
    </div>
  )
}

export default Game;