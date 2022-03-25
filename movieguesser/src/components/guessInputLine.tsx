import { useEffect, useRef, useState } from "react"
import { collapseTextChangeRangesAcrossMultipleVersions } from "typescript";
import { AiOutlineArrowRight } from "react-icons/ai";
import titles from "../titles";

const mod = (n: number, m: number) => ((n % m) + m) % m;

const getTitleMatches = (inputTitle: string) =>
  titles.filter(title =>
    title.toLowerCase().includes(inputTitle.toLocaleLowerCase())
  ).slice(0, 5);

const GuessInputLine = (props: any) => {
  const [suggestions, setSuggestions] = useState<string[]>(getTitleMatches(""));
  const [inputFocused, setInputFocused] = useState(false);
  const [currentGuess, setCurrenGuess] = useState("")
  const [currentSuggestionIndex, setCurrentSuggestionIndex] = useState(-1);
  const inputRef = useRef<any>();
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
    <div className="text-[5vh] w-full grow flex-center flex-col">
      <div onBlur={() => setInputFocused(false)} className="h-[5.2vh] relative w-full">
        <input
          ref={inputRef}
          onFocus={() => setInputFocused(true)}
          onChange={e => setCurrenGuess(e.target.value)}
          onKeyDown={e => {
            if (e.key === "Enter") {
              inputRef.current.blur();
              onGuess();
            } else if (e.key === "Tab") {
              e.preventDefault();
              if (e.getModifierState("Shift")) {
                // better modulo to handle negative numbers
                setCurrentSuggestionIndex(prevIndex => mod(prevIndex - 1, suggestions.length))
              } else {
                setCurrentSuggestionIndex(prevIndex => (prevIndex + 1) % suggestions.length)
              }
            } else if (e.key === "Escape") {
              inputRef.current.blur();
            } else { }
          }}
          onKeyUp={e => {
            // check if character key
            if (!(e.key.length === 1 || (e.key.length > 1 && /[^a-zA-Z0-9]/.test(e.key)) || e.key === "Spacebar" || e.key === "Backspace")) return
            setCurrentSuggestionIndex(-1);
            setSuggestions(getTitleMatches(currentGuess))
          }}
          value={currentGuess}
          className="bg-transparent border-b border-b-blue-700 h-full w-[96%] absolute top-0 -translate-x-1/2 indent-1 focus:outline-none"
          placeholder="Guess..."
        />

        <button
          className="h-full flex-center text-[2.5vh] aspect-[0.2/1] absolute top-0 right-[2%] border-0 border-white"
          onClick={onGuess}
        >
          <AiOutlineArrowRight />
        </button>

        {inputFocused &&
          <ul
            className="absolute bg-black opacity-90 w-full z-10 text-[1.3vh] top-[5.2vh] text-slate-50"
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
      {props.win && <span>You win! Congratulations! Score: {props.score}/100</span>}
      {/*!props.win && <span>{"❌".repeat(props.guesses) + "⬛".repeat(3 - props.guesses)}</span>*/}
      {props.guesses == 1 && !props.win && <><br /><span>You lose, the movie was {props.movieTitle}</span></>}
    </div >)
}

export default GuessInputLine