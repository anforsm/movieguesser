import React, { ReactComponentElement, useEffect, useRef, useState } from 'react';
import oldmovies from "./shuffled_titles";
import Game from './components/game';
import Statistics from './components/statistics';
import Navbar from './components/navbar';
import useGameState from './hooks/useGameState';
import Notifications from './components/notification';
import NotificationHandler from './models/notificationHandler';
const movies = oldmovies.map(movie => {
  let newMovie: any = { ...movie }
  newMovie.poster = newMovie["image"];
  delete newMovie.image
  return newMovie;
})


let latestNotification = `Introducing:
* New point costs (out of a total of 100)
* A new category
* Second guess for poster
* Only ONE guess allowed`

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
🇧:${clue2[gameState.budget]}
🇶:${clue2[gameState.quote]}
🇦:${clue3[gameState.actor1]}${clue3[gameState.actor2]}${clue3[gameState.actor3]}
`

const loadGameHistory = () => {
  let history = localStorage.getItem("gameHistory");
  if (history)
    return JSON.parse(history);
  return [];
}

const notificationHandler = new NotificationHandler()

function App() {
  const [showStats, setShowStats] = useState(false);
  const [gameState, setGameState] = useGameState(currentDay, movie.title);
  const [newNotification, setNewNotification] = useState<string>();

  useEffect(() => {
    //notificationHandler.sendNotification(latestNotification, 10000);
  }, [])

  return (
    <div id="app" className="bg-dark-900 min-h-screen max-h-screen h-full w-screen">
      <Notifications notificationHandler={notificationHandler} />
      <Navbar
        onStats={() => setShowStats(true)}
        onInfo={() => notificationHandler.sendNotification("Tutorial coming soon...")}
        onSettings={() => notificationHandler.sendNotification("Settings coming soon...")}
      />

      {showStats &&
        <Statistics
          onClose={() => setShowStats(false)}
          stats={loadGameHistory()}
          points={gameState.points}
          currentDay={currentDay}
          onShare={() => {
            navigator.clipboard.writeText(generateShareString(gameState.clues, gameState.points))
            notificationHandler.sendNotification("Copied results to clipboard")
          }}
        />}

      <div className="flex-center flex-col mb-2">
        <Game
          {...gameState}
          onNewGameState={(newGameState: any) => {
            if (newGameState.status !== "UNFINISHED") {
              let gameHistory = localStorage.getItem("gameHistory");
              let history = gameHistory ? JSON.parse(gameHistory) : {};
              history[currentDay] = newGameState;
              localStorage.setItem("gameHistory", JSON.stringify(history))
              setTimeout(() => setShowStats(true), 2000)
            }

            setGameState(newGameState)
          }}
          movieInfo={movie}
        />
      </div>
      {DEV && <button className="bg-white" onClick={() => { localStorage.removeItem("gameState"); window.location.reload() }}>Reset day</button>}

    </div>
  );
}

export default App;
