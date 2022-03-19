import { useEffect, useState } from "react"
import titles from "../titles";

const getTitleMatches = (inputTitle: string) =>
  titles.filter(title =>
    title.toLowerCase().includes(inputTitle.toLocaleLowerCase())
  ).slice(0, 5);

const GuessInput = (props: any) => {
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [currentGuess, setCurrenGuess] = useState("")
  const onGuess = () => props.onGuess(currentGuess)

  useEffect(() => {
    setSuggestions(getTitleMatches(currentGuess))
  }, [currentGuess])

  return (
    <div>
      <div onBlur={() => setShowSuggestions(false)}>
        <input
          onFocus={() => setShowSuggestions(true)}
          onChange={e => setCurrenGuess(e.target.value)}
          value={currentGuess}
          className="bg-transparent border border-blue-700 h-8"
          placeholder="Guess..."
        />

        <button
          className="bg-dark-600 py-1 px-3"
          onClick={onGuess}
        >
          &gt;
        </button>

        {showSuggestions &&
          <ul
            className="absolute bg-black opacity-90 w-[42rem] max-w-[100vw] z-10"
          >
            {suggestions.map(title =>
              <li
                key={title}
                onMouseDown={() => setCurrenGuess(title)}
                className="cursor-pointer"
              >
                {title}
              </li>)}
          </ul>
        }
      </div>

      <br />

      {props.win && <span>You win! Congratulations! Score: {props.score}/110</span>}
      {!props.win && <span>{"❌".repeat(props.guesses) + "⬛".repeat(3 - props.guesses)}</span>}
      {props.guesses == 3 && <><br /><span>You lose, the movie was {props.movieTitle}</span></>}
    </div>)
}

export default GuessInput