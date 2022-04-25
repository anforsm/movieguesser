import React, { ReactComponentElement, useEffect, useRef, useState } from 'react';
import oldmovies from "./shuffled_titles";
import Game from './components/game';
import Statistics from './components/statistics';
import Navbar from './components/navbar';
import useGameState from './hooks/useGameState';
import Notifications from './components/notification';
import NotificationHandler from './models/notificationHandler';
import Modal from './components/modal';
import useModal from './hooks/useModal';
import Settings from './components/settings';
import Info from './components/info';
import loadSettings from './utils/loadSettings';
import moment from 'moment';
import clueSpecification from './clueSpecification';
/*
const movies = oldmovies.map(movie => {
  let newMovie: any = { ...movie }
  newMovie.poster = newMovie["image"];
  delete newMovie.image
  return newMovie;
})
*/
const movies = oldmovies;


let latestNotification = `Introducing:
* New point costs (out of a total of 100)
* A new category
* Second guess for poster
* Only ONE guess allowed`

const daysPassed = (date: Date) => {
  //let current = new Date(date.getTime()).getTime();
  //let previous = new Date(2022, 0, 1).getTime();
  //return Math.floor((current - previous) / 8.64e7);
  return -moment([2022, 0, 1]).diff(date, "days");
}
let currentDay = daysPassed(new Date());
console.log(currentDay)
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

const generateShareString = (gameState: any, points: number, win: boolean) => `${win ? "🏆" : "💀"} Movieguesser #${currentDay} (${100 - points}/100)

🇹:${clue3[gameState.title]}
🇾:${clue2[gameState.year]}
🇵:${clue3[gameState.poster]}
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

document.documentElement.classList.add("og");
let settings = localStorage.getItem("settings");
if (settings)
  loadSettings(JSON.parse(settings))

function App() {
  const [showStats, StatsModal] = useModal();
  const [showSettings, SettingsModal] = useModal();
  const [showInfo, InfoModal] = useModal();
  const [gameState, setGameState] = useGameState(currentDay, movie.title);
  const [newNotification, setNewNotification] = useState<string>();
  const [background, setBackground] = useState(settings ? JSON.parse(settings).background : "");
  const [gameOver, setGameOver] = useState(gameState.status !== "UNFINISHED");

  useEffect(() => {
    //notificationHandler.sendNotification(latestNotification, 10000);
    setGameOver(gameState.status !== "UNFINISHED")
  }, [gameState])

  //style={{ backgroundImage: `url(${movie.backdrop})` }} 
  return (
    <div id="app" className="bg-primary-900 min-h-screen max-h-screen h-full w-screen text-text-col overflow-auto relative">
      <div className={`absolute full overflow-hidden`}><img src={background} className="full object-cover blur-[1vh]" /></div>
      <Notifications notificationHandler={notificationHandler} />
      <Navbar
        onStats={() => showStats(true)}
        onInfo={() => showInfo(true)}
        onSettings={() => showSettings(true)}
      />

      <SettingsModal>
        <Settings
          gameOver={gameOver}
          movieInfo={movie}
          onSetBackground={(bg: any) => setBackground(bg)}
          notificationHandler={notificationHandler}
        />
      </SettingsModal>

      <StatsModal>
        <Statistics
          stats={loadGameHistory()}
          points={gameState.points}
          currentDay={currentDay}
          onShare={() => {
            navigator.clipboard.writeText(generateShareString(gameState.clues, gameState.points, gameState.status === "WIN"))
            notificationHandler.sendNotification("Copied results to clipboard")
          }}
        />
      </StatsModal>

      <InfoModal>
        <Info tutorialMovieInfo={movies[71]} />
      </InfoModal>

      {/*showStats &&
        <Statistics
          onClose={() => setShowStats(false)}
          stats={loadGameHistory()}
          points={gameState.points}
          currentDay={currentDay}
          onShare={() => {
            navigator.clipboard.writeText(generateShareString(gameState.clues, gameState.points))
            notificationHandler.sendNotification("Copied results to clipboard")
          }}
        />*/}

      <div className="flex-center flex-col z-10">
        <Game
          {...gameState}
          onNewGameState={(newGameState: any) => {
            if (newGameState.status !== "UNFINISHED") {
              let gameHistory = localStorage.getItem("gameHistory");
              let history = gameHistory ? JSON.parse(gameHistory) : {};
              history[currentDay] = newGameState;
              localStorage.setItem("gameHistory", JSON.stringify(history))
              setTimeout(() => showStats(true), 2000)
            }

            setGameState(newGameState)
          }}
          movieInfo={movie}
          DEV={DEV}
          clueSpecification={clueSpecification}
          isTutorial={false}
        />
      </div>
      {DEV && <button className="bg-white" onClick={() => { localStorage.removeItem("gameState"); window.location.reload() }}>Reset day</button>}

    </div>
  );
}

export default App;
