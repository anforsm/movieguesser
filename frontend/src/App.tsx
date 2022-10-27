import React, {
  createContext,
  ReactComponentElement,
  useEffect,
  useRef,
  useState,
} from "react";
import movies from "data/shuffled_titles";
import Game from "components/game/game";
import Statistics from "components/popups/statistics";
import Navbar from "components/layout/navbar";
import useGameState from "hooks/useGameState";
import Notifications from "components/layout/notification";
import NotificationHandler from "models/notificationHandler";
import { MenuModal, Modal } from "components/utils/modal";
import useModal from "hooks/useModal";
import Settings from "components/popups/settings";
import Info from "components/popups/info";
import moment from "moment";
import clueSpecification from "clueSpecification";
import SettingsHandler from "models/settings";

const daysPassed = (date: Date) => {
  return -moment([2022, 0, 1]).diff(date, "days");
};
let currentDay = daysPassed(new Date());
console.log(currentDay);
let movie: any = movies[currentDay % movies.length];

let DEV = false;
let devHash = window.location.hash;
if (devHash == "#1") {
  movie = movies.filter(
    (mov) =>
      mov.title ==
      "Borat: Cultural Learnings of America for Make Benefit Glorious Nation of Kazakhstan"
  )[0];
} else if (devHash == "#2") {
  movie = movies.filter((mov) => mov.title == "Up")[0];
} else if (devHash == "#3") {
  movie = movies.filter((mov) => mov.title == "Don't Look Up")[0];
} else if (devHash == "#dev") {
  DEV = true;
}

const clue2 = ["⬛", "🟩"];
const clue3 = ["⬛", "🟨", "🟩"];

const generateShareString = (
  gameState: any,
  points: number,
  win: boolean
) => `${win ? "🏆" : "💀"} Movieguesser #${currentDay} (${points}/100)

🇹:${clue3[gameState.title]}
🇾:${clue2[gameState.year]}
🇵:${clue3[gameState.poster]}
🇷:${clue2[gameState.rating]}
🇩:${clue2[gameState.director]}
🇧:${clue2[gameState.budget]}
🇶:${clue2[gameState.quote]}
🇦:${clue3[gameState.actor1]}${clue3[gameState.actor2]}${
  clue3[gameState.actor3]
}
`;

const loadGameHistory = () => {
  let history = localStorage.getItem("gameHistory");
  if (history) return JSON.parse(history);
  return [];
};

const notificationHandler = new NotificationHandler();
const settingsHandler = new SettingsHandler();
const SettingsContext = createContext(settingsHandler.getDefaultSettings());

document.documentElement.classList.add("og");

const showtutorial_local = localStorage.getItem("showtutorial");
let showtutorial = false;
if (!showtutorial_local) {
  localStorage.setItem("showtutorial", "false");
  showtutorial = true;
}

const latest_version = "0.12";

const version_local = localStorage.getItem("version");
let showchanges = false;
let version = version_local ? version_local : latest_version;

// send notification or w/e if version was not latest

// update version to latest
localStorage.setItem("version", latest_version);

const balanceChangeNoti = () =>
  notificationHandler.sendCustomNotification(
    <div>
      <p className="font-bold">New balance changes:</p>
      <ul className="m-2 list-disc text-left">
        <li>Poster nerfed:</li>
        <ul className=" ml-2">
          <li>Increased cost: 🟨: 15-&gt;20</li>
        </ul>
        <li>Actor buffed:</li>
        <ul className=" ml-2">
          <li>Decreased cost: 🟨: 6-&gt;5</li>
        </ul>
        <li>Quote buffed:</li>
        <ul className=" ml-2">
          <li>Decreased cost: 🟩: 9-&gt;8</li>
        </ul>
        <li>Director buffed:</li>
        <ul className=" ml-2">
          <li>Decreased cost: 🟩: 3-&gt;2</li>
        </ul>
      </ul>
    </div>,
    2000,
    false
  );

function App() {
  const [showStats, StatsModal, statsProps] = useModal(MenuModal);
  const [showSettings, SettingsModal, settingsProps] = useModal(MenuModal);
  const [showInfo, InfoModal, infoProps] = useModal(MenuModal);
  const [gameState, setGameState] = useGameState(currentDay, movie.title);
  const [newNotification, setNewNotification] = useState<string>();
  const [background, setBackground] = useState(settingsHandler.getBackground());
  const [gameOver, setGameOver] = useState(gameState.status !== "UNFINISHED");
  const [settings, setSettings] = useState(settingsHandler.getSettings());

  useEffect(() => {
    if (showtutorial) showInfo(true);

    if (latest_version > version || showchanges) {
      balanceChangeNoti();
    }
  }, []);

  useEffect(() => {
    setGameOver(gameState.status !== "UNFINISHED");
  }, [gameState]);

  useEffect(() => {
    let obs = () => {
      setSettings(settingsHandler.getSettings());
    };
    settingsHandler.addObserver(obs);
    return () => settingsHandler.removeObserver(obs);
  }, [settingsHandler]);

  return (
    <SettingsContext.Provider value={settings}>
      <div
        id="app"
        className="relative h-full max-h-screen min-h-screen w-screen overflow-y-auto overflow-x-hidden bg-primary-900 text-text-col"
      >
        <div className={`full absolute overflow-hidden`}>
          <img
            src={settings.background}
            className="full scale-125 object-cover blur-[1vh]"
            alt="Background image"
          />
        </div>
        <Notifications notificationHandler={notificationHandler} />
        <Navbar
          onStats={() => showStats(true)}
          onInfo={() => showInfo(true)}
          onSettings={() => showSettings(true)}
        />

        <SettingsModal {...settingsProps}>
          <Settings
            gameOver={gameOver}
            movieInfo={movie}
            settingsHandler={settingsHandler}
            notificationHandler={notificationHandler}
          />
        </SettingsModal>

        <StatsModal {...statsProps}>
          <Statistics
            stats={loadGameHistory()}
            points={100 - gameState.points}
            currentDay={currentDay}
            onShare={() => {
              navigator.clipboard.writeText(
                generateShareString(
                  gameState.clues,
                  100 - gameState.points,
                  gameState.status === "WIN"
                )
              );
              notificationHandler.sendNotification(
                "Copied results to clipboard"
              );
            }}
          />
        </StatsModal>

        <InfoModal {...infoProps}>
          <Info tutorialMovieInfo={movies[71]} />
        </InfoModal>

        <div className="flex-center z-10 flex-col">
          <Game
            {...gameState}
            onNewGameState={(newGameState: any) => {
              if (newGameState.status !== "UNFINISHED") {
                let gameHistory = localStorage.getItem("gameHistory");
                let history = gameHistory ? JSON.parse(gameHistory) : {};
                history[currentDay] = newGameState;
                localStorage.setItem("gameHistory", JSON.stringify(history));
                setTimeout(() => showStats(true), 2000);
              }

              setGameState(newGameState);
            }}
            movieInfo={movie}
            DEV={DEV}
            clueSpecification={clueSpecification}
            isTutorial={false}
          />
        </div>
        {DEV && (
          <button
            className="bg-white"
            onClick={() => {
              localStorage.removeItem("gameState");
              window.location.reload();
            }}
          >
            Reset day
          </button>
        )}
      </div>
    </SettingsContext.Provider>
  );
}

export { SettingsContext };

export default App;
