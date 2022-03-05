import React, { ReactComponentElement, useEffect, useRef, useState } from 'react';
import movieImage from "./movieimage.png";
import titles from "./titles";
import movies from "./shuffled_titles";
import useFitText from "use-fit-text";
import { Bar, BarChart, LabelList, Line, LineChart, ResponsiveContainer, XAxis, YAxis } from 'recharts';


const Statistics = (props: any) => {
  const stripNumbers = (str: any) => str.replace(/[0-9]/g, "");
  let clueStats: any = {};
  Object.values(props.stats).forEach((stat: any) => {
    Object.keys(stat.clues).forEach((category) => {
      if (!clueStats[stripNumbers(category)])
        clueStats[stripNumbers(category)] = 0;
      clueStats[stripNumbers(category)] += stat.clues[category];
    });
  });
  clueStats = Object.entries(clueStats)
  clueStats = clueStats.map((clue: any) => ({"clue": clue[0], "reveals": clue[1]}));
  let playedDays = Object.keys(props.stats).length;
  let pointStats = [];
  for (let i = 0; i <= 110; i++) {
    pointStats.push({"points": i, "probability": 0})
  }
  Object.values(props.stats).forEach((stat: any) => pointStats[stat.points] = {"points": stat.points, "probability": stat.points/playedDays});
  return <div className="absolute bg-black opacity-70 w-[20rem] h-[30rem] flex flex-col items-center p-[1rem] z-10 text-white">
    <span className="text-white">Statistics</span>
    <ResponsiveContainer height={200}>
      <BarChart data={clueStats} layout="vertical" barCategoryGap={0.9}>
        <XAxis type="number" axisLine={false} tick={false}/>
        <YAxis type="category" dataKey="clue" tickLine={false} interval={0} tick={{fill: "white"}}/>
        <Bar dataKey="reveals" fill="green" minPointSize={15}>
          <LabelList dataKey="reveals" position="insideRight" fill="white"/>
        </Bar>
      </BarChart>
    </ResponsiveContainer>
    <ResponsiveContainer height={200}>
      <LineChart data={pointStats}>
        <XAxis dataKey="points" domain={[0, 110]}/>
        <Line type="basis" dataKey="probability" stroke="white" dot={false}/>
      </LineChart>
    </ResponsiveContainer>
    {/*
    <div className="w-full grid grid-cols-[auto_1fr] gap-1">
        {Object.keys(clueStats).map(category => <>
            <div key={category+" label"} className="text-right">{category}</div>
            <div key={category}>
              <div className={`bg-lime-700 text-right`} style={{width: `calc(1em + ${clueStats[category]*10}%)`}}>
                {clueStats[category]}
              </div>
            </div>
          </>
        )}
    </div>
    */}
  </div>
}

interface ClueProps {
  clue: string,
  value: any,
  maxReveals: number,
  onReveal: (...args: any[]) => void,
  Child: any,
  pointCost: number[],
  reveals: number
}

const Clue = ({clue, value, maxReveals, onReveal, Child, pointCost, reveals}: ClueProps) => {
  let colors: Record<number, string>;
  colors = {
    0: "bg-slate-400",
  };
  if (maxReveals === 2) {
    colors[1] = "bg-yellow-400";
    colors[2] = "bg-green-400";
  }

  if (maxReveals === 1) {
    colors[1] = "bg-green-400";
  }

  const reveal = () => {
    if (reveals >= maxReveals)
      return;
    //const newRevealed = revealed+1
    onReveal(reveals+1);
    //setRevealed(newRevealed);
  }

  return <div className={`clue w-full h-full ${colors[reveals]}`} onClick={reveal}>
    <Child value={value} reveal={reveals}/>
  </div>
}

interface ClueValProps {
  value: string,
  reveal: number
}
const Title = ({value, reveal}: ClueValProps) => {
  let lettersToReveal = Math.ceil(value.length/10)*reveal;
  let step = Math.floor(value.length / (lettersToReveal));
  let title = ""
  for (let i = 0; i < value.length; i++) {
    title += i % step == 0 ? value[i] : "_";
    //title += value[i]
  }
  return <div>
      <span>Title</span>
      <br/>
      <span className={`text-3xl ${reveal >= 1 || 'hidden'}`}>{title}</span>
    </div>
}

const Year = ({value, reveal}: ClueValProps) => {
  return <div>
      <span>Release year</span>
      <br/>
      {reveal >= 1 && <span className="text-7xl">{value}</span>}
    </div>
}

const Poster = ({value, reveal}: ClueValProps) => {
  return <div className="overflow-hidden h-full">
      <span>Poster</span>
      {reveal >= 1 && <div className="overflow-hidden"><img className="h-full w-full object-cover blur-lg scale-125" src={value}/></div>}
    </div>
}

const Rating = ({value, reveal}: ClueValProps) => {
  return <div>
      <span>Rating</span>
      <br/>
      {reveal >= 1 && <span className="text-7xl">{value}</span>}
    </div>
}

const Director = ({value, reveal}: ClueValProps) => {
  return <div>
      <span>Director</span>
      <br/>
      {reveal >= 1 && <span className="text-4xl">{value}</span>}
    </div>
}

const Writer = ({value, reveal}: ClueValProps) => {
  return <div>
      <span>Writer</span>
      <br/>
      {reveal >= 1 && <span className="text-4xl">{value}</span>}
    </div>
}

const Quote = ({value, reveal}: ClueValProps) => {
  return <div>
      <span>Quote</span>
      <br/>
      {reveal >= 1 && <span className="text-4xl italic">"{value}"</span>}
    </div>
}

const Actor = (props: any) => {
  return <div className="overflow-hidden h-full">
      {props.reveal == 0 && <span>Actor</span>}
      {props.reveal >= 1 && <span className="text-xl">{props.value.name}</span>}
      {props.reveal == 1 && <div className=" h-full flex-center"><span className="text-xl">Show image</span></div>}
      {props.reveal >= 2 && <img className="h-full w-full object-cover" src={props.value.image}/>}
    </div>
}

/*
let movies = [{
    title: "Interstellar",
    year: "2014",
    image: movieImage,
    actors: [
      {name: "Matthew McConaughey", image: "https://m.media-amazon.com/images/M/MV5BMTg0MDc3ODUwOV5BMl5BanBnXkFtZTcwMTk2NjY4Nw@@._V1_UX214_CR0,0,214,317_AL_.jpg"},
      {name: "Anne Hathaway", image: "https://m.media-amazon.com/images/M/MV5BMTRhNzQ3NGMtZmQ1Mi00ZTViLTk3OTgtOTk0YzE2YTgwMmFjXkEyXkFqcGdeQXVyNzg5MzIyOA@@._V1_UY317_CR20,0,214,317_AL_.jpg"},
      {name: "Jessica Chastain", image: "https://m.media-amazon.com/images/M/MV5BMTU1MDM5NjczOF5BMl5BanBnXkFtZTcwOTY2MDE4OA@@._V1_UX214_CR0,0,214,317_AL_.jpg"},
    ],
    rating: "8.6",
    director: "Cristopher Nolan",
    writer: "Jonathan Nolan",
    quote: "We used to look up at the sky and wonder at our place in the stars. Now we just look down, and worry about our place in the dirt."
  },
  {
    title: "Blade Runner 2049",
    year: "2017",
    image: "https://m.media-amazon.com/images/M/MV5BNzA1Njg4NzYxOV5BMl5BanBnXkFtZTgwODk5NjU3MzI@._V1_.jpg",
    actors: [
      {name: "Harrison Ford", image: "https://m.media-amazon.com/images/M/MV5BMTY4Mjg0NjIxOV5BMl5BanBnXkFtZTcwMTM2NTI3MQ@@._V1_UX214_CR0,0,214,317_AL_.jpg"},
      {name: "Ryan Gosling", image: "https://m.media-amazon.com/images/M/MV5BMTQzMjkwNTQ2OF5BMl5BanBnXkFtZTgwNTQ4MTQ4MTE@._V1_UY317_CR18,0,214,317_AL_.jpg"},
      {name: "Ana de Armas", image: "https://m.media-amazon.com/images/M/MV5BMWM3MDMzNjMtODM5Ny00YmY0LWJhNzQtNTE1ZDNlNjllNDQ0XkEyXkFqcGdeQXVyODkzNTgxMDg@._V1_UY317_CR130,0,214,317_AL_.jpg"}
    ],
    rating: "8.0",
    director: "Denis Villeneuve",
    writer: "Hampton Fancher",
    quote: "Pain reminds you the joy you felt was real. More joy, then! Do not be afraid.",
  }
]
*/



const daysPassed = (date: Date) => {
  let current = new Date(date.getTime()).getTime();
  let previous = new Date(2022, 0, 1).getTime();
  return Math.floor((current-previous)/8.64e7);
}
let currentDay = daysPassed(new Date());

const getTitleMatches = (inputTitle: string) => titles.filter(title => title.toLowerCase().includes(inputTitle.toLocaleLowerCase())).slice(0,5);
let movie: any = movies[currentDay % movies.length];
let devHash = window.location.hash;
if (devHash == "#1") {
  movie = movies.filter(mov => mov.title == "Borat: Cultural Learnings of America for Make Benefit Glorious Nation of Kazakhstan")[0]
} else if (devHash == "#2") {
  movie = movies.filter(mov => mov.title == "Up")[0]
} else if (devHash == "#3") {
  movie = movies.filter(mov => mov.title == "Don't Look Up")[0]
}

type guessState = Record<string, number>

let clueSpecification: any = {};


const saveWonGameToLocalStorage = (state: any, points: number, guesses: number, status: string) => {
  let today = {
    "status": status,
    "clues": state,
    "points": points,
    "guesses": guesses,
    "day": currentDay,
    "movie": movie.title
  };
  localStorage.setItem("gameState", JSON.stringify(today));
  let gameHistory = localStorage.getItem("gameHistory");
  let history;
  history = gameHistory ? JSON.parse(gameHistory) : {};
  history[currentDay] = today;
  localStorage.setItem("gameHistory", JSON.stringify(history))
}



function App() {
  const [totalPoints, setTotalPoints] = useState(0);
  const [win, setWin] = useState(false);
  const [winScore, setWinScore] = useState(-1);
  const [guesses, setGuesses] = useState(0);
  const [titleInput, setTitleInput] = useState("");
  const [possibleTitles, setPossibleTitles] = useState<string[]>([]);
  const [showAC, setShowAC] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  // should make this dynamic
  const [clueState, setClueState] = useState<guessState>({
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
    });

  const loadGameState = () => {
    let state = localStorage.getItem("gameState")
    if (state) {
      let parsedState = JSON.parse(state);
      if (parsedState.day === currentDay) {
        setClueState(parsedState.clues);
        if (parsedState.status === "WIN") {
          setWin(true);
          setGameOver(true);
        }
        setGuesses(parsedState.guesses);
        setWinScore(parsedState.points);
        setTotalPoints(parsedState.points);
      }
    }
  }

  const loadGameHistory = () => {
    let history = localStorage.getItem("gameHistory");
    if (history)
      return JSON.parse(history);
    return [];
  }
  const increaseClueState = (category: string) => {
    setClueState((prevGuessState: guessState) => {
      let newGuessState: guessState = {...prevGuessState}
      newGuessState[category] = prevGuessState[category]+1
      return newGuessState;
    });
  }

  const revealClue = (clueID: string) => {
    if (!gameOver) {
      setTotalPoints(prevPoints => prevPoints + clueSpecification[clueID]["pointCost"][clueState[clueID]]);
      increaseClueState(clueID)
    }
  }

  const addClue = (clueName: string, component: any, pointCost: number[], id: number = -1) => {
    let value;
    // should change this...
    if (clueName === "poster") {
      value = movie["image"]
    } else if (id !== -1) {
      value = movie[clueName + "s"][id-1]
    } else {
      value = movie[clueName]
    }

    let clueId = id === -1 ? clueName : clueName + id.toString();
    clueSpecification[clueId] = {
      clue: clueName,
      value: value,
      maxReveals: pointCost.length,
      pointCost: pointCost,
      Child: component,
      onReveal: () => revealClue(clueId),
      reveals: clueState[clueId]
    }
  };


  addClue("title", Title, [10, 10])
  addClue("year", Year, [4])
  addClue("poster", Poster, [20])
  addClue("rating", Rating, [4])
  addClue("director", Director, [10])
  addClue("writer", Writer, [8])
  addClue("quote", Quote, [8])
  const actorGuesses = [6, 6]
  addClue("actor", Actor, actorGuesses, 1)
  addClue("actor", Actor, actorGuesses, 2)
  addClue("actor", Actor, actorGuesses, 3)


  
  useEffect(() => {
    loadGameState();
  }, [])

  useEffect(() => {
    setPossibleTitles(getTitleMatches(titleInput))

  }, [titleInput])

  useEffect(() => {
    if (guesses === 3) {
      saveWonGameToLocalStorage(clueState, totalPoints, guesses, "LOSE");
      setGameOver(true);
    }
  }, [guesses])



  const guess = () => {
    if (titleInput.toLowerCase() === movie.title.toLowerCase() && guesses < 3) {
      saveWonGameToLocalStorage(clueState, totalPoints, guesses, "WIN");
      setWin(true);
      setGameOver(true)
      setWinScore(totalPoints);
    } else {
      setGuesses(g => g+1);
    }
  }
  return (
    <div className="bg-slate-800 min-h-screen w-screen flex-center">
      <Statistics stats={loadGameHistory()}/>
      <div className="bg-slate-900 text-center text-slate-50 w-[42rem] max-w-[100vw] min-h-[1000px] flex flex-col">
        <h1 className="text-7xl">{totalPoints}</h1>
        <div onBlur={() => setShowAC(false)}>
          <input onFocus={() => setShowAC(true)} onChange={e => setTitleInput(e.target.value)} value={titleInput} className="bg-transparent border border-blue-700 h-8" placeholder="Guess..."></input><button className="bg-slate-600 py-1 px-3" onClick={guess}>&gt;</button>
          {showAC && <ul className="absolute bg-black opacity-90 w-[42rem] max-w-[100vw]">{possibleTitles.map(title => <li key={title} onMouseDown={() => setTitleInput(title)} className="cursor-pointer">{title}</li>)}</ul>}
        </div>
        <br/>
        {win && <span>You win! Congratulations! Score: {winScore}/110</span>}
        {!win && <span>{"❌".repeat(guesses) + "⬛".repeat(3-guesses)}</span>}
        {guesses == 3 && <><br/><span>You lose, the movie was {movie.title}</span></>}
        {/*<div className="p-4 grid grid-rows-[1fr_1fr_1fr_1fr_1fr_1fr_1fr] grid-cols-3 gap-4 w-128 min-w-[42em] max-w-[42em] min-h-[80vh] max-h-[80vh]">*/}
        <div id="clueTable" className="p-4">
          <div className="title"><Clue 
            {...clueSpecification["title"]}
            />
          </div>

          <div className="poster">
            <Clue 
              {...clueSpecification["poster"]}
            />
          </div>

          <div className="year">
            <Clue 
              {...clueSpecification["year"]}
            />
          </div>

          <div className="rating">
            <Clue 
              {...clueSpecification["rating"]}
            />
          </div>

          <div className="director">
            <Clue 
              {...clueSpecification["director"]}
            />
          </div>

          <div className="writer">
            <Clue 
              {...clueSpecification["writer"]}
            />
          </div>

          <div className="quote">
            <Clue 
              {...clueSpecification["quote"]}
            />
          </div>

          {movie.actors.map((actor: any, id: number) => 
            <div key={actor.name} className="actor">
              <Clue 
                {...clueSpecification["actor" + (id+1).toString()]}
              />
            </div>)}
        </div>
      </div>
    </div>
  );
}

export default App;
