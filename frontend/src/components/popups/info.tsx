import Game from "../game/game";
import clueSpecification from "../../clueSpecification";
import { useState } from "react";
import Clue, { Actor } from "../game/clue";
import Scorebar from "../game/scorebar";
import GuessInputLine from "../game/searchbar";

import { AiOutlineArrowRight, AiOutlineArrowLeft } from "react-icons/ai";
import { VscDebugRestart } from "react-icons/vsc";

let tutorialClueSpec = { ...clueSpecification };
let remove = ["rating", "quote", "director", "actor2", "actor3"];
remove.forEach((clue: string) => delete tutorialClueSpec[clue]);

const Info = (props: any) => {
  const [page, setPage] = useState(0);
  const [actorReveals, setActorReveals] = useState(0);
  const [titleReveals, setTitleReveals] = useState(0);
  const [points, setPoints] = useState(0);
  const [won, setWon] = useState(false);
  const [guesses, setGuesses] = useState(0);

  const reset = () => {
    setPage(0);
    setActorReveals(0);
    setTitleReveals(0);
    setPoints(0);
    setWon(false);
    setGuesses(0);
  };

  const [tutorialGameState, setTutorialGameState] = useState({
    status: "UNFINISHED",
    clues: {
      title: 0,
      poster: 0,
      actor1: 0,
      year: 0,
      budget: 0,
    },
    points: 0,
    guesses: 0,
    day: 42,
    movie: props.tutorialMovieInfo.title,
  });

  return (
    <div className="relative flex h-[32rem] w-full flex-col items-center">
      <div className="text-xl">How to play</div>
      <div className="h-8 w-full">&nbsp;</div>
      <div className="w-full">
        {page === 0 && (
          <div>
            <span>
              Try to guess the movie, while revealing as few clues as possible.
            </span>
            <div className="h-4 w-full">&nbsp;</div>
            <div className="flex">
              <div className="grow">
                <span className="inline-block">
                  Press the clue to the right to reveal it...
                </span>
                <span
                  className={`mt-4 inline-block transition-all ${
                    actorReveals >= 1 ? "opacity-100" : "opacity-0"
                  }`}
                >
                  Some clues can be pressed several times to reveal more
                  information.
                </span>
                <span
                  className={`mt-4 inline-block transition-all ${
                    actorReveals >= 1 ? "opacity-100" : "opacity-0"
                  }`}
                >
                  Now, press the clue again.
                </span>
              </div>
              <div className="">
                <div className="ml-2 aspect-[1/1.3] h-48">
                  <Clue
                    clue="actor1"
                    maxReveals={clueSpecification["actor1"].maxReveals}
                    pointCost={clueSpecification["actor1"].pointCost}
                    Component={clueSpecification["actor1"].Component}
                    onReveal={(reveals) => setActorReveals(reveals)}
                    reveals={actorReveals}
                    value={props.tutorialMovieInfo.actors[0]}
                    initialFlipDelay={0}
                    gameOver={false}
                    dontShowPointCostOnHover={true}
                  />
                </div>
              </div>
            </div>
            <span
              className={`mt-4 inline-block transition-all ${
                actorReveals == 2 ? "opacity-100" : "opacity-0"
              }`}
            >
              When a clue has a green background, there is no more information
              to be revealed.
            </span>
            <span
              className={`mt-8 inline-block transition-all ${
                actorReveals == 2 ? "opacity-100" : "opacity-0"
              }`}
            >
              Click the <AiOutlineArrowRight style={{ display: "inline" }} />
              -button below to go to the next page.
            </span>
          </div>
        )}

        {page === 1 && (
          <>
            <div className="w-full">
              <span>
                You start the game with 100 points, but as you reveal clues your
                score will decrease.
              </span>
            </div>
            <div className="h-2 w-full">&nbsp;</div>
            <div className="h-24 w-full">
              <Scorebar points={points} />
            </div>

            <div className="w-full">
              <span>
                Each clue has a point cost associated with it. Hover over the
                title clue below to view its cost.
              </span>
              <div className="h-2 w-full">&nbsp;</div>
              <span>
                Reveal the title clue and watch your point total decrease.
              </span>
            </div>

            <div className="h-2 w-full">&nbsp;</div>
            <div className="flex-center h-32 w-full">
              <Clue
                clue="title"
                maxReveals={clueSpecification["title"].maxReveals}
                pointCost={clueSpecification["title"].pointCost}
                Component={clueSpecification["title"].Component}
                onReveal={(reveals) => {
                  setTitleReveals(reveals);
                  setPoints(
                    (prev) =>
                      prev + clueSpecification["title"].pointCost[reveals - 1]
                  );
                }}
                reveals={titleReveals}
                value={props.tutorialMovieInfo.title}
                initialFlipDelay={0}
                gameOver={false}
              />
            </div>
          </>
        )}

        {page === 2 && (
          <>
            <div className="w-full">
              <span>When you think you know the movie, take a guess:</span>
            </div>
            <div className="h-4 w-full">&nbsp;</div>

            <GuessInputLine
              isTutorial={true}
              onGuess={(guess: string) => {
                setWon(guess === props.tutorialMovieInfo.title);
                setGuesses((prev) => prev + 1);
              }}
              movieTitle={props.tutorialMovieInfo.title}
              win={won}
              score={100 - points}
              guesses={guesses}
            />

            <div className="w-full">
              <span className="text-sm">
                Hint: the name of the movie is &nbsp;
                <span className="bg-black text-black transition-all hover:bg-transparent hover:text-inherit">
                  John Wick
                </span>
              </span>
            </div>

            <div className="h-4 w-full">&nbsp;</div>

            {/*
    <div className="w-full">
      <span>Now, try a smaller version of the game</span>
    </div>

    <div className="w-full h-4">&nbsp;</div>

    <div className="tutorial w-full">
      <Game {...tutorialGameState}
        isTutorial={true}
        movieInfo={props.tutorialMovieInfo}
        clueSpecification={tutorialClueSpec}
        onNewGameState={(gameState: any) => setTutorialGameState(gameState)}
      />
</div>*/}

            <div className="w-full">
              <span>Each day there will be a new movie to guess.</span>
            </div>

            <div className="w-full">
              <span>Good luck!</span>
            </div>
          </>
        )}
        <div className="flex-center absolute bottom-0 w-full gap-2">
          <button
            title="Reset tutorial"
            onClick={reset}
            className="primary flex-center absolute left-0 aspect-square h-8"
          >
            <VscDebugRestart />
          </button>
          <button
            title="Previous page"
            disabled={page === 0}
            onClick={() => setPage((prevPage) => prevPage - 1)}
            className="primary flex-center aspect-square h-8"
          >
            <AiOutlineArrowLeft />
          </button>
          <span>{page + 1} / 3</span>
          <button
            title="Next page"
            disabled={page === 2}
            onClick={() => setPage((prevPage) => prevPage + 1)}
            className="primary flex-center aspect-square h-8"
          >
            <AiOutlineArrowRight />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Info;
