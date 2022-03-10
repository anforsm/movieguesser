import { useMemo } from "react";
import useLocalStorage from "./useLocalStorage";

interface gameState {
  status: string;
  clues: {
    title: number;
    year: number;
    poster: number;
    rating: number;
    director: number;
    writer: number;
    quote: number;
    actor1: number;
    actor2: number;
    actor3: number;
  };
  points: number;
  guesses: number;
  day: number;
  movie: string;
}

const useGameState = (gameDay: number, movieTitle: string): readonly [gameState, (value: gameState | ((val: gameState) => gameState)) => void] => {
  const defaultGameState: gameState = useMemo(() => ({
    status: "UNFINISHED",
    clues: {
      title: 0,
      year: 0,
      poster: 0,
      rating: 0,
      director: 0,
      writer: 0,
      quote: 0,
      actor1: 0,
      actor2: 0,
      actor3: 0
    },
    points: 0,
    guesses: 0,
    day: gameDay,
    movie: movieTitle,
  }), [gameDay]);

  const [gameState, setGameState] = useLocalStorage<gameState>("gameState", defaultGameState)
  if (gameState.day !== gameDay)
    setGameState(defaultGameState);

  return [gameState, setGameState];
}

export default useGameState;