const Scorebar = (props: any) => {
  return <div className={`h-[3rem] ${true ? "md:h-[5vh]" : "md:h-[1vh]"} w-[96%] rounded-[1.2vh] bg-blue-900 overflow-hidden flex flex-col justify-center text-white`}>
    <div className="label">Points</div>
    <div className="grow bg-blue-600 text-right overflow-hidden transition-all" style={{ width: `${100 - props.points}%` }}>
      <span className="h-full text-[1.5rem] md:text-[3vh] leading-[0.90em] mr-2">{100 - props.points}</span>
    </div>
  </div>
}

export default Scorebar;