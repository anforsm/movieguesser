const Toggle = (props: any) => {
  const toggle = () => props.onToggle(!props.toggle);

  return (
    <button
      onClick={toggle}
      className="toggle relative aspect-[2/1] h-6 rounded-full bg-primary-600"
    >
      <div className="absolute left-[3%] bottom-[5%] top-[5%] h-[90%] w-[94%] overflow-hidden rounded-full bg-none">
        <div
          className={`toggle--background full absolute bg-primary-700 ${
            !props.toggle ? "right-[79%]" : "right-[21%]"
          } `}
        ></div>
      </div>
      <div
        className={`switch absolute aspect-square h-[90%] rounded-full bg-text-col ${
          props.toggle ? "left-[52%]" : "left-[3%]"
        } bottom-[5%] top-[5%]`}
      ></div>
    </button>
  );
};

export default Toggle;
