import { useEffect, useRef, useState } from "react";
import { AiOutlineArrowRight } from "react-icons/ai";
import titles from "data/titles";

const mod = (n: number, m: number) => ((n % m) + m) % m;

const charactesToShowSuggestion = 0;

const getTitleMatches = (inputTitle: string) =>
  inputTitle.length > charactesToShowSuggestion
    ? titles
        .filter((title) =>
          title.toLowerCase().includes(inputTitle.toLocaleLowerCase())
        )
        .sort()
        .slice(0, 3)
    : [];

const GuessInputLine = (props: any) => {
  const [suggestions, setSuggestions] = useState<string[]>(getTitleMatches(""));
  const [inputFocused, setInputFocused] = useState(false);
  const [currentGuess, setCurrenGuess] = useState("");
  const [currentSuggestionIndex, setCurrentSuggestionIndex] = useState(-1);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [currentTextInput, setCurrentTextInput] = useState("");
  //const [pressedLetters, setPressedLetters] = useState("");
  const inputRef = useRef<any>();
  const onGuess = () => props.onGuess(currentGuess);

  useEffect(() => {}, [currentGuess]);

  useEffect(() => {}, [currentSuggestionIndex]);

  useEffect(() => {
    if (!inputFocused) setShowSuggestions(false);

    if (inputFocused) {
      if (currentGuess.length > charactesToShowSuggestion) {
        setShowSuggestions(true);
      } else {
        setShowSuggestions(false);
      }
    }
  }, [inputFocused, currentGuess]);

  useEffect(() => {
    setCurrenGuess(currentTextInput);
    setSuggestions(getTitleMatches(currentTextInput));
  }, [currentTextInput]);

  useEffect(() => {
    setCurrentSuggestionIndex(-1);
  }, [inputFocused]);

  return (
    <div
      className={`w-full ${
        !props.isTutorial ? "grow" : ""
      } flex-center flex-col ${
        true ? "pb-4 md:pb-[0.5vh]" : ""
      } text-[1.5rem] md:text-[2vh] `}
    >
      {!props.isTutorial && (
        <div className={`${props.isTutorial ? "text-base" : ""}`}>
          {props.guesses == 0 && <span>&nbsp;</span>}

          {props.win && (
            <span>
              You win! Congratulations! Score: {100 - props.score}/100
            </span>
          )}
          {props.guesses == 1 && !props.win && (
            <span>You lose, the movie was {props.movieTitle}</span>
          )}
        </div>
      )}
      <div className="h-[7%] w-full text-[0]">&nbsp;</div>
      <div
        onBlur={() => setInputFocused(false)}
        className="relative flex h-12 w-[96%] items-center md:h-[3.2vh]"
      >
        <input
          ref={inputRef}
          onFocus={() => setInputFocused(true)}
          onChange={(e) => setCurrentTextInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              inputRef.current.blur();
              onGuess();
            } else if (e.key === "Tab") {
              e.preventDefault();
              if (suggestions.length === 0) return;
              let newSuggestionIndex;
              if (e.getModifierState("Shift")) {
                // better modulo to handle negative numbers
                newSuggestionIndex = mod(
                  currentSuggestionIndex - 1,
                  suggestions.length
                );
              } else {
                newSuggestionIndex =
                  (currentSuggestionIndex + 1) % suggestions.length;
              }
              setCurrentSuggestionIndex(newSuggestionIndex);
              setCurrenGuess(suggestions[newSuggestionIndex]);
            } else if (e.key === "Escape") {
              inputRef.current.blur();
            }
          }}
          value={currentGuess}
          className="mr-[0.6vh] h-full grow px-[0.6vh] indent-1 focus:outline-none"
          placeholder="Guess..."
        />

        {inputFocused && (
          <ul className="absolute left-0 top-[3.5rem] z-10 w-[100%] overflow-y-hidden rounded-md bg-primary-700 text-left md:top-[3.8vh] md:w-[92%]">
            {suggestions.map((title, i) => (
              <li
                key={title}
                onMouseDown={() => {
                  setSuggestions(getTitleMatches(title));
                  setCurrenGuess(title);
                }}
                onMouseEnter={() => setCurrentSuggestionIndex(i)}
                className={`cursor-pointer ${
                  i == currentSuggestionIndex ? "bg-primary-600" : ""
                } flex-center flex-col border-b border-b-primary-800 py-2 pl-[calc(0.25rem+0.6vh)] text-center`}
                tabIndex={0}
              >
                {title}
              </li>
            ))}
          </ul>
        )}

        <button
          className=" flex-center top-0 aspect-[1.3/1] h-full border-0 border-white bg-slate-500 hover:bg-slate-400 md:aspect-[1.5/1]"
          onClick={onGuess}
          title="Make guess"
        >
          <AiOutlineArrowRight />
        </button>
      </div>
      {props.isTutorial && (
        <div className={`${props.isTutorial ? "text-base" : ""}`}>
          {props.guesses == 0 && <span>&nbsp;</span>}
          {props.win && (
            <span>You win! Congratulations! Score: {props.score}/100</span>
          )}
          {props.guesses == 1 && !props.win && (
            <>
              <br />
              <span>You lose, the movie was {props.movieTitle}</span>
            </>
          )}
        </div>
      )}
      {/*<div className="h-[7%] w-full text-[0]">&nbsp;</div>*/}
    </div>
  );
};

export default GuessInputLine;
