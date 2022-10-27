const Scorebar = (props: any) => {
  return (
    <div
      className={`h-[3rem] ${
        true ? "md:h-[5vh]" : "md:h-[1vh]"
      } flex w-[96%] flex-col justify-center overflow-hidden rounded-[1.2vh] bg-blue-900 text-white`}
    >
      <div className="label">Points</div>
      <div
        className="grow overflow-hidden bg-blue-600 text-right transition-all"
        style={{ width: `${100 - props.points}%` }}
      >
        <span className="mr-2 flex h-full flex-col justify-center text-[1.5rem] leading-[0.90em] md:text-[3vh]">
          {100 - props.points}
        </span>
      </div>
    </div>
  );
};

export default Scorebar;
