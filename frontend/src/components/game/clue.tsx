import {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from "react";

import { useLongPress } from "use-long-press";

import useFirstRender from "hooks/useFirstRender";
import useModal from "hooks/useModal";
import budgetFormatter from "utils/budgetFormatter";
import { Modal } from "components/utils/modal";

import { ImEnlarge2 } from "react-icons/im";

import { SettingsContext } from "App";

interface ClueProps {
  clue: string;
  maxReveals: number;
  pointCost: number[];
  Component: any;

  onReveal: (...args: any[]) => void;
  reveals: number;
  value: any;
  initialFlipDelay: number;
  gameOver: boolean;
  dontShowPointCostOnHover?: boolean;
}

interface card {
  swap: () => any;
  flip: () => any;
  flipNswap: () => any;
}

const animationDuration = 300;

const Clue = ({
  clue,
  value,
  maxReveals,
  onReveal,
  Component,
  pointCost,
  reveals,
  initialFlipDelay,
  gameOver,
  dontShowPointCostOnHover,
}: ClueProps) => {
  const firstRender = useFirstRender();
  const [delayedReveals, setDelayedReveals] = useState(reveals);
  const [initialFlip, setInitialFlip] = useState(
    initialFlipDelay && reveals > 0 ? "PENDING" : "NOFLIP"
  );
  const flipCard = useRef<card>();

  useEffect(() => {
    // if we have an initial flip pending, set it in progress after delay
    if (initialFlip === "PENDING")
      setTimeout(() => {
        setInitialFlip("IN PROGRESS");
        flipCard.current?.flip();
      }, initialFlipDelay);
  }, []);

  let colors: Record<number, string>;

  const bind = useLongPress(() => {}, {
    onStart: (e) => setShowPointCost(true),
    onFinish: (e) => setShowPointCost(false),
    onCancel: (e) => setShowPointCost(false),
  });

  colors = {
    0: "bg-clue-gray",
  };
  if (maxReveals === 2) {
    colors[1] = "bg-clue-yellow";
    colors[2] = "bg-clue-green";
  }

  if (maxReveals === 1) {
    colors[1] = "bg-clue-green";
  }

  const reveal = () => {
    if (reveals >= maxReveals) return;

    setShowPointCost(false);

    onReveal(reveals + 1);
  };

  useEffect(() => {
    if (firstRender) return;

    if (!gameOver) {
      flipCard.current?.flip();
    } else {
      setTimeout(() => flipCard.current?.flip(), initialFlipDelay);
    }
  }, [reveals]);

  useEffect(() => {
    if (firstRender) return;

    // if flip has changed from IN_PROGRESS to DONE,  we then swap the sides
    if (initialFlip === "DONE") setTimeout(() => flipCard.current?.swap(), 10);
  }, [initialFlip]);

  useEffect(() => {
    if (firstRender) return;

    flipCard.current?.swap();
  }, [delayedReveals]);

  const [showPointCostForceDisabled, setShowPointCostForceDisabled] =
    useState(false);
  const [showPointCostForceEnabled, setShowPointCostForceEnabled] =
    useState(false);
  const [mouseOverClue, setMouseOverClue] = useState(false);
  const [showPointCost, _setShowPointCost] = useState(false);

  useEffect(() => {
    if (!showPointCostForceDisabled) setShowPointCost(mouseOverClue);

    if (showPointCostForceDisabled) _setShowPointCost(false);
  }, [showPointCostForceDisabled, mouseOverClue]);

  useEffect(() => {
    if (!showPointCostForceEnabled) setShowPointCost(mouseOverClue);

    if (showPointCostForceEnabled) _setShowPointCost(true);
  }, [showPointCostForceEnabled, mouseOverClue]);

  useEffect(() => {
    setShowPointCost(mouseOverClue);
  }, [mouseOverClue]);

  const setShowPointCost = (show: boolean) => {
    if (!showPointCostForceDisabled && !showPointCostForceEnabled)
      _setShowPointCost(show);
  };

  // _setMouseOverClue because react bug https://github.com/facebook/react/issues/19016
  const [standardComponentProps, setStandardComponentProps] = useState({
    value: value,
    forceDisableShowPointCost: setShowPointCostForceDisabled,
    _setMouseOverClue: setMouseOverClue,
  });
  useEffect(() => {
    setStandardComponentProps({
      value: value,
      forceDisableShowPointCost: setShowPointCostForceDisabled,
      _setMouseOverClue: setMouseOverClue,
    });
  }, [value]);

  return (
    <div
      {...bind}
      onMouseEnter={() => setMouseOverClue(true)}
      onMouseLeave={() => setMouseOverClue(false)}
      className={`clue full text-slate-50 shadow-2xl`}
      onClick={reveal}
      tabIndex={0}
    >
      {true && reveals !== maxReveals && (
        <div
          className={`${
            showPointCost ? "pointCostShow" : "pointCostHide"
          } pointCost full flex-center pointer-events-none absolute z-10 bg-black/20 text-[4.5vh]`}
        >
          {!dontShowPointCostOnHover && `-${pointCost[delayedReveals]}`}
        </div>
      )}

      <div
        className={`h-full w-full ${
          reveals !== maxReveals ? "cursor-pointer" : ""
        }`}
      >
        <FlipCard
          ref={flipCard}
          disabled={reveals >= maxReveals}
          onSwap={() => {
            if (initialFlip === "DONE") {
              setInitialFlip("POST FLIP");
            }
          }}
          onFlipDone={() => {
            if (initialFlip === "IN PROGRESS") {
              setInitialFlip("DONE");
            } else {
              setDelayedReveals(reveals);
            }
          }}
          // front side will always be the current side
          FrontSide={
            // if we want an initial flip, then the front side should be set to "gray"
            initialFlip === "PENDING" || initialFlip === "IN PROGRESS" ? (
              <div
                className={`h-full w-full ${colors[0]} ${
                  reveals == 0 ? "overflow-hidden" : ""
                }`}
              >
                <Component
                  {...standardComponentProps}
                  reveal={0}
                  gameOver={gameOver}
                />
              </div>
            ) : (
              // initialFlip === DONE or === NO FLIP
              <div
                className={`h-full w-full ${colors[delayedReveals]} ${
                  reveals == 0 ? "overflow-hidden" : ""
                }`}
              >
                <Component
                  {...standardComponentProps}
                  reveal={delayedReveals}
                  gameOver={gameOver}
                />
              </div>
            )
          }
          BackSide={
            // if not first flip (or no flip at all) and if we have another reveal, the backside should be the next reveal

            // back side will be the next reveal
            // if we want an initial flip, then the back side should be set as the correct side
            initialFlip === "PENDING" ||
            initialFlip === "IN PROGRESS" ||
            initialFlip === "DONE" ? (
              <div
                className={`h-full w-full ${colors[delayedReveals]} ${
                  reveals == 0 ? "overflow-hidden" : ""
                }`}
              >
                <Component
                  {...standardComponentProps}
                  reveal={delayedReveals}
                  gameOver={gameOver}
                />
              </div>
            ) : // otherwise we want to show the normal, +1 side, given there is another side
            delayedReveals < maxReveals ? (
              <div
                className={`h-full w-full ${
                  colors[gameOver ? maxReveals : delayedReveals + 1]
                } ${reveals == 0 ? "overflow-hidden" : ""}`}
              >
                <Component
                  {...standardComponentProps}
                  reveal={gameOver ? maxReveals : delayedReveals + 1}
                  gameOver={gameOver}
                />
              </div>
            ) : (
              // if there is no other side, we use the gray side
              <div
                className={`h-full w-full ${colors[0]} ${
                  reveals == 0 ? "overflow-hidden" : ""
                }`}
              >
                <Component
                  {...standardComponentProps}
                  reveal={0}
                  gameOver={gameOver}
                />
              </div>
            )
          }
          animationDuration={animationDuration}
        />
      </div>
    </div>
  );
};

const FlipCard = forwardRef((props: any, ref) => {
  const firstRender = useFirstRender();
  const [frontSide, setFrontSide] = useState(true);
  const [currentSwap, setSwap] = useState(false);
  const [initial, setInitial] = useState(false);
  const flip = () => setFrontSide((side) => !side);
  const swap = () => setSwap((prevSwap) => !prevSwap);
  const flipNswap = () => {
    flip();
    swap();
  };

  useImperativeHandle(ref, () => ({
    swap: swap,
    flip: flip,
    flipNswap: flipNswap,
  }));

  useEffect(() => {
    // call flip done
    if (initial) {
      if (props.onFlipDone)
        setTimeout(props.onFlipDone, props.animationDuration);
    } else {
      setInitial(true);
    }
  }, [frontSide]);

  useEffect(() => {
    if (firstRender) return;
    if (props.onSwap) props.onSwap();
  }, [currentSwap]);

  return (
    <div
      className={`content h-full w-full ${
        frontSide ? "" : "flip"
      } duration-300`}
    >
      <div className="face one">
        {!currentSwap ? props.FrontSide : props.BackSide}
      </div>

      <div className="face two">
        {!currentSwap ? props.BackSide : props.FrontSide}
      </div>
    </div>
  );
});

// _setMouseOverClue because react bug https://github.com/facebook/react/issues/19016
interface ClueValProps {
  value: string;
  reveal: number;
  gameOver: boolean;
  forceDisableShowPointCost: any;
  _setMouseOverClue: any;
}

const Title = ({ value, reveal }: ClueValProps) => {
  let lettersToReveal = Math.ceil(value.length / 10) * reveal;
  let step = Math.floor(value.length / lettersToReveal);
  let title = "";
  for (let i = 0; i < value.length; i++) {
    title += i % step == 0 ? value[i] : "_";
  }
  return (
    <div className="full flex flex-col">
      <div className="label">Title</div>
      <div className="flex-center grow">
        <span
          className={`text-[1.5rem] md:text-[2.3vh] ${reveal >= 1 || "hidden"}`}
        >
          {title}
        </span>
      </div>
    </div>
  );
};

const Year = ({ value, reveal }: ClueValProps) => {
  // 6
  return (
    <div className="full flex flex-col">
      <div className="label">Release year</div>
      {reveal >= 1 && (
        <div className="flex-center grow">
          <span className="min-h-[1.1em] text-[4rem] leading-[0.95em] md:text-[6vh]">
            {value}
          </span>
        </div>
      )}
    </div>
  );
};

// _setMouseOverClue because react bug https://github.com/facebook/react/issues/19016
const Poster = ({
  value,
  reveal,
  gameOver,
  forceDisableShowPointCost,
  _setMouseOverClue,
}: ClueValProps) => {
  const poster_no_blur = `https://storage.googleapis.com/movieguesser-4997e.appspot.com/posters/${value}.jpg`;
  const poster_medium_blur = `https://storage.googleapis.com/movieguesser-4997e.appspot.com/posters_medium_blur/${value}_medium_blur.jpg`;
  const poster_large_blur = `https://storage.googleapis.com/movieguesser-4997e.appspot.com/posters_large_blur/${value}_large_blur.jpg`;
  const [showEnlargedPoster, EnlargedPoster, enlargedPosterProps] =
    useModal(Modal);

  const getPosterImage = (posterblur: boolean) =>
    reveal === 1
      ? poster_large_blur
      : posterblur && gameOver
      ? poster_no_blur
      : poster_medium_blur;

  return (
    <div className="h-full overflow-hidden rounded-[1.2vh]">
      <div className="label">Poster</div>
      <div className="relative overflow-hidden">
        <SettingsContext.Consumer>
          {(settings) => (
            <>
              <EnlargedPoster {...enlargedPosterProps}>
                <img
                  className="h-[80vh] object-cover"
                  src={getPosterImage(settings.toggleStates.posterblur)}
                  alt="Zoomed in movie poster"
                />
              </EnlargedPoster>
              {settings.toggleStates.posterzoom && (
                <button
                  className="enlarge-button absolute top-1 right-1 cursor-pointer rounded-md bg-black/60 p-2 text-white hover:bg-black/60"
                  onClick={(e: any) => {
                    e.stopPropagation();
                    showEnlargedPoster(true);
                    _setMouseOverClue(false);
                  }}
                  onMouseEnter={() => forceDisableShowPointCost(true)}
                  onMouseLeave={() => forceDisableShowPointCost(false)}
                  title="Zoom in"
                >
                  <ImEnlarge2 />
                </button>
              )}
              {reveal >= 1 && (
                <img
                  className="h-full w-full object-cover"
                  src={getPosterImage(settings.toggleStates.posterblur)}
                  alt="Movie poster"
                />
              )}
            </>
          )}
        </SettingsContext.Consumer>
      </div>
    </div>
  );
};

const Rating = ({ value, reveal }: ClueValProps) => {
  return (
    <div className="full flex flex-col">
      <div className="label">Rating</div>
      {reveal >= 1 && (
        <div className="flex-center grow">
          <span className="min-h-[1.1em] text-[4rem] leading-[0.95em] md:text-[6vh]">
            {value}
          </span>
        </div>
      )}
    </div>
  );
};

const Director = ({ value, reveal }: ClueValProps) => {
  return (
    <div className="full flex flex-col">
      <div className="label">Director</div>
      {reveal >= 1 && (
        <div className="flex-center grow flex-col">
          <span className="min-h-[1.1em] text-[2rem] leading-[0.95em] md:text-[3vh]">
            {value}
          </span>
        </div>
      )}
    </div>
  );
};

const Writer = ({ value, reveal }: ClueValProps) => {
  return (
    <div>
      <span>Writer</span>
      {reveal >= 1 && <span className="text-4xl">{value}</span>}
    </div>
  );
};

const Budget = ({ value, reveal }: ClueValProps) => {
  let formattedBudget = budgetFormatter(value);
  return (
    <div className="flex h-full w-full flex-col">
      <div className="label">Budget</div>
      {reveal >= 1 && (
        <div className="flex-center grow flex-col">
          <span className="min-h-[1.1em] text-[4rem] leading-[0.95em] md:text-[6vh]">
            {formattedBudget.unit}
            {formattedBudget.number}
          </span>
          <span className="min-h-[1.1em] text-[2rem] leading-[0.95em] md:text-[3vh]">
            {formattedBudget.suffix?.toUpperCase()}
          </span>
        </div>
      )}
    </div>
  );
};

const Quote = ({ value, reveal }: ClueValProps) => {
  return (
    <div className="bg-inherit">
      <div className="label">Quote</div>
      {reveal >= 1 && (
        <span className="text-[1.8rem] italic md:text-[2.7vh]">"{value}"</span>
      )}
    </div>
  );
};

const Actor = (props: any) => {
  return (
    <div className="full flex flex-col items-center overflow-hidden rounded-[1.2vh]">
      {props.reveal == 0 && <div className="label">Actor</div>}
      {props.reveal >= 1 && <span className="label">{props.value.name}</span>}
      {props.reveal == 1 && (
        <div className="flex-center grow">
          <span className="text-[6.7rem] md:text-[10vh]">?</span>
        </div>
      )}
      {props.reveal >= 2 && (
        <img
          className="h-full w-full object-cover"
          src={props.value.image}
          alt="Headshot of actor"
        />
      )}
    </div>
  );
};

export {
  Title,
  Year,
  Poster,
  Rating,
  Director,
  Writer,
  Budget,
  Quote,
  Actor,
  FlipCard,
};
export default Clue;
