interface ClueProps {
  clue: string,
  maxReveals: number,
  pointCost: number[],
  Component: any,

  onReveal: (...args: any[]) => void,
  reveals: number
  value: any,
}

const Clue = ({ clue, value, maxReveals, onReveal, Component, pointCost, reveals }: ClueProps) => {
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
    onReveal(reveals + 1);
    //setRevealed(newRevealed);
  }

  return <div className={`clue w-full h-full ${colors[reveals]}`} onClick={reveal}>
    <Component value={value} reveal={reveals} />
  </div>
}



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