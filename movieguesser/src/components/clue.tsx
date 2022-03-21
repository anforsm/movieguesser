import { forwardRef, useEffect, useImperativeHandle, useRef, useState } from "react";
import { isPropertySignature } from "typescript";
import { useLongPress } from "use-long-press";

interface ClueProps {
  clue: string,
  maxReveals: number,
  pointCost: number[],
  Component: any,

  onReveal: (...args: any[]) => void,
  reveals: number
  value: any,
}

interface card {
  swap: () => any,
  flip: () => any,
}

const animationDuration = 300;

const Clue = ({ clue, value, maxReveals, onReveal, Component, pointCost, reveals }: ClueProps) => {
  const [showPointCost, setShowPointCost] = useState(false);
  const [delayedReveals, setDelayedReveals] = useState(reveals);
  const [initialFlip, setInitialFlip] = useState(reveals !== 0);

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

  const flipCard = useRef<card>();
  const reveal = () => {
    if (reveals >= maxReveals)
      return;

    flipCard.current?.swap();
    onReveal(reveals + 1)
    //const newRevealed = revealed+1
    //setTimeout(() => onReveal(reveals + 1), 500);
    //setTimeout(() => setDeanimate(prevDeanimate => !prevDeanimate), 500);
    //setTimeout(() => setDeanimate(prevDeanimate => !prevDeanimate), 600);
    //setAnimate(prevAnimate => !prevAnimate);
    //setRevealed(revealed+1);

  }

  useEffect(() => {
    setTimeout(() => {
      //flipCard.current?.flip();
      setDelayedReveals(reveals);
    }, animationDuration)
  }, [reveals])

  //<div className={`${showPointCost ? "flex" : "invisible"} pointCost absolute z-10 w-full h-full flex-center text-7xl ${reveals !== maxReveals ? "bg-zinc-500/40" : ""} `}>{pointCost[reveals]}</div>
  return <div {...bind} onMouseEnter={() => setShowPointCost(true)} onMouseLeave={() => setShowPointCost(false)} className={`clue w-full h-full `} onClick={reveal}>

    <div className="w-full h-full">
      <FlipCard ref={flipCard}
        disabled={reveals >= maxReveals}
        onFlipDone={() => {
          if (!initialFlip) {
            flipCard.current?.swap();
          } else {
            setInitialFlip(false);
          }
        }}
        FrontSide={
          //<span className=" bg-slate-800">Side One</span>
          <div className={`w-full h-full ${colors[delayedReveals]}`}>
            <Component value={value} reveal={delayedReveals} />
          </div>

        }
        BackSide={
          //<span className="bg-slate-800">Side Two</span>
          // if not first flip (or no flip at all) and if we have another reveal, the backside should be the next reveal
          !initialFlip && delayedReveals + 1 <= maxReveals ?
            <div className={`w-full h-full ${colors[delayedReveals + 1]}`}>
              <Component value={value} reveal={delayedReveals + 1} />
            </div>
            :
            <div className={`w-full h-full ${colors[0]}`}>
              <Component value={value} reveal={0} />
            </div>

        }
        initialFlip={reveals > 0}
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
  const [frontSide, setFrontSide] = useState(true);
  const [currentSwap, setSwap] = useState(false);
  const [initial, setInitial] = useState(false);
  const flip = () => setFrontSide(side => !side);
  const swap = () => setSwap(prevSwap => !prevSwap);
  const flipNswap = () => { flip(); swap(); };

  useImperativeHandle(ref, () => ({
    swap: swap,
    flip: flip,
  }));

  useEffect(() => {
    if (initial) {
      if (props.onFlipDone)
        setTimeout(props.onFlipDone, props.animationDuration)
    } else {
      setInitial(true);
    }
  }, [frontSide])

  useEffect(() => {
    if (props.initialFlip)
      flipNswap()
  }, [])

  return (
    <div
      onClick={() => !props.disabled && flipNswap()}
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
    {reveal >= 1 && <div className="overflow-hidden"><img className="h-full w-full object-cover blur-lg scale-125" src={value} /></div>}
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

export { Title, Year, Poster, Rating, Director, Writer, Quote, Actor }
export default Clue;