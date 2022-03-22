import { forwardRef, useEffect, useImperativeHandle, useRef, useState } from "react";
import { MdOutlineSwapVerticalCircle } from "react-icons/md";
import { isPropertySignature } from "typescript";
import { useLongPress } from "use-long-press";
import useFirstRender from "../hooks/useFirstRender";
import budgetFormatter from "../utils/budgetFormatter"

interface ClueProps {
  clue: string,
  maxReveals: number,
  pointCost: number[],
  Component: any,

  onReveal: (...args: any[]) => void,
  reveals: number,
  value: any,
  initialFlipDelay: number,
  gameOver: boolean,
}

interface card {
  swap: () => any,
  flip: () => any,
  flipNswap: () => any,
}

const animationDuration = 300;

const Clue = ({ clue, value, maxReveals, onReveal, Component, pointCost, reveals, initialFlipDelay, gameOver }: ClueProps) => {
  const firstRender = useFirstRender();
  const [showPointCost, setShowPointCost] = useState(false);
  const [delayedReveals, setDelayedReveals] = useState(reveals);
  const [initialFlip, setInitialFlip] = useState(initialFlipDelay && reveals > 0 ? "PENDING" : "NOFLIP");
  const [initialRender, setInitialRender] = useState(false);
  const flipCard = useRef<card>();

  useEffect(() => {
    // if we have an initial flip pending, set it in progress after delay
    if (initialFlip === "PENDING")
      setTimeout(() => {
        setInitialFlip("IN PROGRESS")
        flipCard.current?.flip();
      }, initialFlipDelay);
  }, [])

  let colors: Record<number, string>;

  const bind = useLongPress(() => {
  }, {
    onStart: e => setShowPointCost(true),
    onFinish: e => setShowPointCost(false),
    onCancel: e => setShowPointCost(false),
  })

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
    if (reveals >= maxReveals)
      return;

    //flipCard.current?.swap();
    onReveal(reveals + 1)
    //const newRevealed = revealed+1
    //setTimeout(() => onReveal(reveals + 1), 500);
    //setTimeout(() => setDeanimate(prevDeanimate => !prevDeanimate), 500);
    //setTimeout(() => setDeanimate(prevDeanimate => !prevDeanimate), 600);
    //setAnimate(prevAnimate => !prevAnimate);
    //setRevealed(revealed+1);

  }

  useEffect(() => {
    if (firstRender) return;

    if (!gameOver) {
      flipCard.current?.flip();
    } else {
      setTimeout(() => flipCard.current?.flip(), initialFlipDelay);
    }
    //if (initialRender) {
    //  // if the number of reveals have changed we want to start flip animation,
    //  // and swap sides when flip animation is done (further down)
    //  flipCard.current?.flip()
    //}
    //setTimeout(() => {
    //}, animationDuration)
    //setInitialRender(true)
  }, [reveals])

  useEffect(() => {
    if (firstRender) return;

    // if flip has changed from IN_PROGRESS to DONE,  we then swap the sides
    /*
    if (initialFlip === "DONE") {
      flipCard.current?.swap()
      console.log("swap after change to done")
    }
    */

    if (initialFlip === "DONE")
      setTimeout(() => { ; flipCard.current?.swap() }, 10)
  }, [initialFlip])

  useEffect(() => {
    if (firstRender) return;

    flipCard.current?.swap();
  }, [delayedReveals])


  return <div {...bind} onMouseEnter={() => setShowPointCost(true)} onMouseLeave={() => setShowPointCost(false)} className={`clue w-full h-full `} onClick={reveal}>
    <div className={`${showPointCost ? "flex" : "invisible"} pointCost absolute z-10 w-full h-full flex-center text-7xl ${reveals !== maxReveals ? "bg-zinc-500/40" : ""} pointer-events-none`}>{pointCost[reveals]}</div>

    <div className="w-full h-full">
      <FlipCard ref={flipCard}
        disabled={reveals >= maxReveals}
        onSwap={() => {
          if (initialFlip === "DONE") {
            setInitialFlip("POST FLIP")
          }
        }}
        onFlipDone={() => {
          if (initialFlip === "IN PROGRESS") {
            setInitialFlip("DONE")
          } else {
            setDelayedReveals(reveals);
          }
          /*
          if (initialFlip === "IN PROGRESS") {
            // if this was the initial flip, the backside and frontside were switched
            // so we need to swap back
            //flipCard.current?.swap();
            setInitialFlip("DONE");
            console.log("initial flip")
          } else {
            // if this was a normal flip, we want to update the reveals
            // and swap sides
            setDelayedReveals(reveals);
            //flipCard.current?.swap();
            console.log("flip done")
          }
            */
        }}

        // front side will always be the current side
        FrontSide={
          //<span className=" bg-slate-800">Side One</span>
          // if we want an initial flip, then the front side should be set to "gray"
          (initialFlip === "PENDING" || initialFlip === "IN PROGRESS") ?
            <div className={`w-full h-full ${colors[0]}`}>
              <Component value={value} reveal={0} />
            </div>
            : // initialFlip === DONE or === NO FLIP
            <div className={`w-full h-full ${colors[delayedReveals]}`}>
              <Component value={value} reveal={delayedReveals} />
            </div>

        }
        BackSide={
          //<span className="bg-slate-800">Side Two</span>
          // if not first flip (or no flip at all) and if we have another reveal, the backside should be the next reveal

          // back side will be the next reveal
          // if we want an initial flip, then the back side should be set as the correct side
          (initialFlip === "PENDING" || initialFlip === "IN PROGRESS" || initialFlip === "DONE") ?
            <div className={`w-full h-full ${colors[delayedReveals]}`}>
              <Component value={value} reveal={delayedReveals} />
            </div>
            :
            // otherwise we want to show the normal, +1 side, given there is another side
            delayedReveals < maxReveals ?
              <div className={`w-full h-full ${colors[gameOver ? maxReveals : delayedReveals + 1]}`}>
                <Component value={value} reveal={gameOver ? maxReveals : delayedReveals + 1} />
              </div>
              :
              // if there is no other side, we use the gray side
              <div className={`w-full h-full ${colors[0]}`}>
                <Component value={value} reveal={0} />
              </div>

          /*
          (initialFlip === "DONE") && delayedReveals + 1 <= maxReveals ?
            <div className={`w-full h-full ${colors[delayedReveals + 1]}`}>
              <Component value={value} reveal={delayedReveals + 1} />
            </div>
            :
            <div className={`w-full h-full ${colors[0]}`}>
              <Component value={value} reveal={0} />
            </div>
            */

        }
        animationDuration={animationDuration} />
    </div>
    {/*
      <div className={`face one ${colors[flipped ? reveals + 1 : reveals]}`}>
        <Component value={value} reveal={flipped ? reveals + 1 : reveals} />
      </div>

      <div className={`face two overflow-hidden ${colors[flipped ? reveals : reveals + 1]}`}>
        <Component value={value} reveal={flipped ? reveals : reveals + 1} />
      </div>
*/}

  </div>
}

const FlipCard = forwardRef((props: any, ref) => {
  const firstRender = useFirstRender();
  const [frontSide, setFrontSide] = useState(true);
  const [currentSwap, setSwap] = useState(false);
  const [initial, setInitial] = useState(false);
  const [didInitialFlip, setDidInitialFlip] = useState(false);
  const flip = () => setFrontSide(side => !side);
  const swap = () => setSwap(prevSwap => !prevSwap);
  const flipNswap = () => { flip(); swap(); };

  useImperativeHandle(ref, () => ({
    swap: swap,
    flip: flip,
    flipNswap: flipNswap,
  }));

  useEffect(() => {
    // call flip done
    if (initial) {
      if (props.onFlipDone)
        setTimeout(props.onFlipDone, props.animationDuration)
    } else {
      setInitial(true);
    }
  }, [frontSide])

  useEffect(() => {
    if (firstRender) return;
    if (props.onSwap)
      props.onSwap();
  }, [currentSwap])

  /*
  useEffect(() => {
    if (props.initialFlip && !didInitialFlip) {
      flipNswap();
      setDidInitialFlip(true);
    }
  }, [props.initialFlip]);
  */

  //onClick={() => !props.disabled && flipNswap()}
  return (
    <div
      className={`content w-full h-full ${frontSide ? "" : "flip"} duration-300`}
    >
      <div className="face one">
        {!currentSwap ? props.FrontSide : props.BackSide}
      </div>

      <div className="face two">
        {!currentSwap ? props.BackSide : props.FrontSide}
      </div>
    </div>
  )

});



interface ClueValProps {
  value: string,
  reveal: number
}

const Title = ({ value, reveal }: ClueValProps) => {
  let lettersToReveal = Math.ceil(value.length / 10) * reveal;
  let step = Math.floor(value.length / (lettersToReveal));
  let title = ""
  for (let i = 0; i < value.length; i++) {
    title += i % step == 0 ? value[i] : "_";
  }
  return <div>
    <span>Title</span>
    <br />
    <span className={`text-3xl ${reveal >= 1 || 'hidden'}`}>{title}</span>
  </div>
}

const Year = ({ value, reveal }: ClueValProps) => {
  return <div>
    <span>Release year</span>
    <br />
    {reveal >= 1 && <span className="text-7xl">{value}</span>}
  </div>
}

const Poster = ({ value, reveal }: ClueValProps) => {
  return <div className="overflow-hidden h-full">
    <span>Poster</span>
    {reveal === 1 && <div className="overflow-hidden"><img className="h-full w-full object-cover blur-[1vh] scale-125" src={value} /></div>}
    {reveal >= 2 && <div className="overflow-hidden"><img className="h-full w-full object-cover blur-[0.5vh] scale-125" src={value} /></div>}
  </div>
}

const Rating = ({ value, reveal }: ClueValProps) => {
  return <div>
    <span>Rating</span>
    <br />
    {reveal >= 1 && <span className="text-7xl">{value}</span>}
  </div>
}

const Director = ({ value, reveal }: ClueValProps) => {
  return <div>
    <span>Director</span>
    <br />
    {reveal >= 1 && <span className="text-4xl">{value}</span>}
  </div>
}

const Writer = ({ value, reveal }: ClueValProps) => {
  return <div>
    <span>Writer</span>
    <br />
    {reveal >= 1 && <span className="text-4xl">{value}</span>}
  </div>
}

const Budget = ({ value, reveal }: ClueValProps) => {
  let formattedBudget = budgetFormatter(value);
  return <div className="w-full h-full">
    <span>Budget</span>
    <br />
    {reveal >= 1 && <div className="flex-center flex-col">
      <span className="text-7xl inline-block">{formattedBudget.unit}{formattedBudget.number}</span>
      <span className="text-4xl">{formattedBudget.suffix.toUpperCase()}</span>
    </div>}
  </div>
}

const Quote = ({ value, reveal }: ClueValProps) => {
  return <div>
    <span>Quote</span>
    <br />
    {reveal >= 1 && <span className="text-4xl italic">"{value}"</span>}
  </div>
}

const Actor = (props: any) => {
  return <div className="overflow-hidden h-full">
    {props.reveal == 0 && <span>Actor</span>}
    {props.reveal >= 1 && <span className="text-xl">{props.value.name}</span>}
    {props.reveal == 1 && <div className=" h-full flex-center"><span className="text-xl">Show image</span></div>}
    {props.reveal >= 2 && <img className="h-full w-full object-cover" src={props.value.image} />}
  </div>
}

export { Title, Year, Poster, Rating, Director, Writer, Budget, Quote, Actor }
export default Clue;