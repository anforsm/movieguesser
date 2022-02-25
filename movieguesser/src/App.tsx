import React, { useEffect, useRef, useState } from 'react';
import movieImage from "./movieimage.png";

interface ClueProps {
  value: any,
  maxReveals: number,
  onReveal: (...args: any[]) => void,
  Child: any
}

const Clue = ({value, maxReveals, onReveal, Child}: ClueProps) => {
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

  let [revealed, setRevealed] = useState<number>(0)

  const reveal = () => {
    if (revealed >= maxReveals)
      return;
    const newRevealed = revealed+1
    onReveal(newRevealed);
    setRevealed(newRevealed);
  }

  return <div className={`clue w-full h-full ${colors[revealed]}`} onClick={reveal}>
    <Child value={value} reveal={revealed}/>
  </div>
}

interface ClueValProps {
  value: string,
  reveal: number
}
const Title = ({value, reveal}: ClueValProps) => {
  let lettersToReveal = Math.ceil(value.length * reveal/10);
  let step = Math.floor(value.length / (lettersToReveal-1));
  let title = ""
  for (let i = 0; i < value.length; i++) {
    title += i % step == 0 ? value[i] : "_";
  }
  return <div>
      <span>Title</span>
      <br/>
      {reveal >= 1 && <span className="text-7xl">{title}</span>}
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
  return <div>
      <span>Poster</span>
      {reveal >= 1 && <img className="h-full w-full object-cover" src={value}/>}
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

let movie = {
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
}

function App() {
  let [totalPoints, setTotalPoints] = useState(0);
  let [win, setWin] = useState(false);
  let [winScore, setWinScore] = useState(-1);
  let [guesses, setGuesses] = useState(0);
  let inputField = useRef<HTMLInputElement>(null);
  const guess = () => {
    if (inputField.current?.value.toLowerCase() === movie.title.toLowerCase()) {
      setWin(true);
      setWinScore(totalPoints);
    } else {
      setGuesses(g => g+1);
    }
  }
  return (
    <div className="bg-slate-800 h-screen w-screen flex-center">
      <div className="bg-slate-900 text-center text-slate-50">
        <h1 className="text-7xl">{totalPoints}</h1>
        <input ref={inputField} className="bg-transparent border border-blue-700 h-8" placeholder="Guess..."></input><button className="bg-slate-600 py-1 px-3" onClick={guess}>&gt;</button>
        <br/>
        {win && <span>You win! Congratulations! Score: {winScore}/110</span>}
        {!win && <span>{"❌".repeat(guesses) + "⬛".repeat(3-guesses)}</span>}
        {guesses == 3 && <><br/><span>You lose</span></>}
        <div className="p-4 grid grid-rows-[1fr_1fr_1fr_1fr_1fr_1fr_1fr] grid-cols-3 gap-4 w-128 min-w-[42em] max-w-[42em] min-h-[80vh] max-h-[80vh]">
          <div className="row-span-1 col-span-2"><Clue 
            value={movie.title} 
            maxReveals={2} 
            onReveal={() => setTotalPoints(pts => pts+10)}
            Child={Title}
            />
          </div>

          <div className="row-span-1 col-span-1">
            <Clue 
              value={movie.year} 
              maxReveals={1} 
              onReveal={() => setTotalPoints(pts => pts+4)}
              Child={Year}
            />
          </div>

          <div className="row-span-2 col-span-1">
            <Clue 
              value={movie.image} 
              maxReveals={1} 
              onReveal={() => setTotalPoints(pts => pts+20)}
              Child={Poster}
            />
          </div>

          <div className="row-span-1 col-span-2">
            <Clue 
              value={movie.rating} 
              maxReveals={1} 
              onReveal={() => setTotalPoints(pts => pts+4)}
              Child={Rating}
            />
          </div>

          <div className="row-span-1 col-span-1">
            <Clue 
              value={movie.director} 
              maxReveals={1} 
              onReveal={() => setTotalPoints(pts => pts+10)}
              Child={Director}
            />
          </div>

          <div className="row-span-1 col-span-1">
            <Clue 
              value={movie.writer} 
              maxReveals={1} 
              onReveal={() => setTotalPoints(pts => pts+8)}
              Child={Writer}
            />
          </div>

          <div className="row-span-2 col-span-3">
            <Clue 
              value={movie.quote} 
              maxReveals={1} 
              onReveal={() => setTotalPoints(pts => pts+8)}
              Child={Quote}
            />
          </div>

          {movie.actors.map(actor => 
            <div className="row-span-2 col-span-1">
              <Clue 
                value={actor} 
                maxReveals={2} 
                onReveal={() => setTotalPoints(pts => pts+6)}
                Child={Actor}
              />
            </div>)}
        </div>
      </div>
    </div>
  );
}

export default App;
