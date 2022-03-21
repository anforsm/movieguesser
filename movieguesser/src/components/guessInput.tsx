import { useEffect, useState } from "react"
import { collapseTextChangeRangesAcrossMultipleVersions } from "typescript";
import titles from "../titles";

const mod = (n: number, m: number) => ((n % m) + m) % m;

const getTitleMatches = (inputTitle: string) =>
  titles.filter(title =>
    title.toLowerCase().includes(inputTitle.toLocaleLowerCase())
  ).slice(0, 5);

const GuessInput = (props: any) => {
  const [suggestions, setSuggestions] = useState<string[]>(getTitleMatches(""));
  const [inputFocused, setInputFocused] = useState(false);
  const [currentGuess, setCurrenGuess] = useState("")
  const [currentSuggestionIndex, setCurrentSuggestionIndex] = useState(-1);
  const onGuess = () => props.onGuess(currentGuess)

  useEffect(() => {
  }, [currentGuess])

  useEffect(() => {
    if (currentSuggestionIndex === -1) return;
    if (currentSuggestionIndex >= suggestions.length) return;

    setCurrenGuess(suggestions[currentSuggestionIndex]);
  }, [currentSuggestionIndex])

  useEffect(() => {
    setCurrentSuggestionIndex(-1);
  }, [inputFocused])

  return (
    <div className="text-[1.5vh] w-full grow flex-center flex-col">
      <div onBlur={() => setInputFocused(false)} className="h-[2.5vh] relative w-full">
        <input
          onFocus={() => setInputFocused(true)}
          onChange={e => setCurrenGuess(e.target.value)}
          onKeyDown={e => {
            console.log("keydown");
            if (e.key === "Enter") {
              onGuess();
            } else if (e.key === "Tab") {
              e.preventDefault();
              if (e.getModifierState("Shift")) {
                // better modulo to handle negative numbers
                setCurrentSuggestionIndex(prevIndex => mod(prevIndex - 1, suggestions.length))
              } else {
                setCurrentSuggestionIndex(prevIndex => (prevIndex + 1) % suggestions.length)
              }
            } else {
            }
          }}
          onKeyUp={e => {
            // check if character key
            if (!(e.key.length === 1 || (e.key.length > 1 && /[^a-zA-Z0-9]/.test(e.key)) || e.key === "Spacebar" || e.key === "Backspace")) return
            setCurrentSuggestionIndex(-1);
            setSuggestions(getTitleMatches(currentGuess))
          }}
          value={currentGuess}
          className="bg-transparent border border-blue-700 h-full w-[30%] absolute top-0 -translate-x-1/2 indent-1"
          placeholder="Guess..."
        />

        <button
          className="bg-dark-600 h-full aspect-[1.3/1] absolute top-0 right-[30%]"
          onClick={onGuess}
        >
          &gt;
        </button>

        {inputFocused &&
          <ul
            className="absolute bg-black opacity-90 w-full z-10 text-[1.3vh] top-[2.5vh]"
          >
            {suggestions.map((title, i) =>
              <li
                key={title}
                onMouseDown={() => {
                  setSuggestions(getTitleMatches(title))
                  setCurrenGuess(title)
                }}
                className={`cursor-pointer ${i == currentSuggestionIndex ? "outline outline-2 outline-zinc-400" : ""}`}
              >
                {title}
              </li>)}
          </ul>
        }
      </div>
      <div className="h-[7%] w-full text-[0]">&nbsp;</div>
      {props.win && <span>You win! Congratulations! Score: {props.score}/110</span>}
      {!props.win && <span>{"❌".repeat(props.guesses) + "⬛".repeat(3 - props.guesses)}</span>}
      {props.guesses == 3 && <><br /><span>You lose, the movie was {props.movieTitle}</span></>}
    </div >)
}

export default GuessInput