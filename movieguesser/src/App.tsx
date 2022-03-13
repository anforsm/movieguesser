import React, { ReactComponentElement, useEffect, useRef, useState } from 'react';
import oldmovies from "./shuffled_titles";
import Game from './components/game';
import Statistics from './components/statistics';
import Navbar from './components/navbar';
import useGameState from './hooks/useGameState';
import Particles from 'react-tsparticles';
import { loadConfettiPreset } from 'tsparticles-preset-confetti';
const movies = oldmovies.map(movie => {
  let newMovie: any = { ...movie }
  newMovie.poster = newMovie["image"];
  delete newMovie.image
  return newMovie;
})


const daysPassed = (date: Date) => {
  let current = new Date(date.getTime()).getTime();
  let previous = new Date(2022, 0, 1).getTime();
  return Math.floor((current - previous) / 8.64e7);
}
let currentDay = daysPassed(new Date());
let movie: any = movies[currentDay % movies.length];

let DEV = false;
let devHash = window.location.hash;
if (devHash == "#1") {
  movie = movies.filter(mov => mov.title == "Borat: Cultural Learnings of America for Make Benefit Glorious Nation of Kazakhstan")[0]
} else if (devHash == "#2") {
  movie = movies.filter(mov => mov.title == "Up")[0]
} else if (devHash == "#3") {
  movie = movies.filter(mov => mov.title == "Don't Look Up")[0]
} else if (devHash == "#dev") {
  DEV = true;
}

const clue2 = ["⬛", "🟩"];
const clue3 = ["⬛", "🟨", "🟩"];

const generateShareString = (gameState: any, points: number) => `Movieguesser #${currentDay} (${points}/100)
🇹:${clue3[gameState.title]}
🇾:${clue2[gameState.year]}
🇵:${clue2[gameState.poster]}
🇷:${clue2[gameState.rating]}
🇩:${clue2[gameState.director]}
🇼:${clue2[gameState.writer]}
🇶:${clue2[gameState.quote]}
🇦:${clue3[gameState.actor1]}${clue3[gameState.actor2]}${clue3[gameState.actor3]}
`

const loadGameHistory = () => {
  let history = localStorage.getItem("gameHistory");
  if (history)
    return JSON.parse(history);
  return [];
}

function App() {
  const [showStats, setShowStats] = useState(false);
  const [gameState, setGameState] = useGameState(currentDay, movie.title);
  const [rerender, setRerender] = useState(false);

  useEffect(() => {
    if (gameState.status !== "UNFINISHED")
      setShowStats(true);
  }, [gameState])

  const particlesInit = async (main: any) => {
    loadConfettiPreset(main)
  }

  return (
    <div id="app" className="bg-slate-800 min-h-screen w-screen flex-center">
      <Navbar onStats={() => setShowStats(true)} />

      {showStats &&
        <Statistics
          onClose={() => setShowStats(false)}
          stats={loadGameHistory()}
          points={gameState.points}
          currentDay={currentDay}
          onShare={() => navigator.clipboard.writeText(generateShareString(gameState.clues, gameState.points))} />
      }
      {DEV && <button className="bg-slate-50" onClick={() => localStorage.removeItem("gameState")}>Reset</button>}
      {DEV && <button className="bg-slate-50" onClick={() => setRerender(prev => !prev)}>Confetti</button>}
      {DEV && rerender && <Particles init={particlesInit} options={{
        particles: {
          shape: {
            character: [
              {
                value: ["🥳", "🎉", "🎊"],
              },
            ],
            type: "char"
          },
          life: {
            duration: {
              value: 10,
            }
          },
          size: {
            value: 16,
          },
          tilt: {
            enable: false,
          },
          wobble: {
            enable: true,
          },
          roll: {
            enable: false,
          }
        },
        emitters: {
          startCount: 50,
          position: {
            x: 50,
            y: 20,
          },
          life: {
            duration: 10,
          }
        },
        preset: "confetti",
      }} />}
      <Game
        {...gameState}
        onNewGameState={(newGameState: any) => {
          if (newGameState.status !== "UNFINISHED") {
            let gameHistory = localStorage.getItem("gameHistory");
            let history = gameHistory ? JSON.parse(gameHistory) : {};
            history[currentDay] = newGameState;
            localStorage.setItem("gameHistory", JSON.stringify(history))
          }
          setGameState(newGameState)
        }}
        movieInfo={movie}
      />

    </div>
  );
}

export default App;
