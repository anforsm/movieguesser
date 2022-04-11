import { useState } from "react";


const Toggle = (props: any) => {
  const toggle = () => props.onToggle(!props.toggle);

  return <button onClick={toggle} className="toggle h-6 aspect-[2/1] rounded-full relative bg-primary-600 overflow-none">
    <div className="absolute h-[90%] w-[94%] rounded-full left-[3%] bottom-[5%] top-[5%] overflow-hidden bg-none">
      <div className={`toggle--background bg-primary-700 full absolute ${!props.toggle ? "right-[79%]" : "right-[21%]"} `}></div>
    </div>
    <div className={`switch bg-text-col h-[90%] rounded-full aspect-square absolute ${props.toggle ? "left-[52%]" : "left-[3%]"} bottom-[5%] top-[5%]`}></div>
  </button>
}

export default Toggle;