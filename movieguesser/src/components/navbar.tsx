import { MdLeaderboard, MdSettings } from "react-icons/md";
import { IoMdInformationCircleOutline } from "react-icons/io";
import { useState } from "react";

const Navbar = (props: any) => {
  const [col, setCol] = useState(0);

  return <nav id="navbar" className="w-screen h-full bg-primary-800 flex-center m-0 text-[3vh] z-10 shadow-md">
    <div className="w-[100vw] max-w-[60vh] h-full flex flex-row items-center relative px-4">

      <div onClick={props.onInfo} className="float-left cursor-pointer mr-auto h-full flex-center">
        <IoMdInformationCircleOutline />
      </div>


      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 font-[Quicksand] font-semibold" >Movieguesser</div>

      <div onClick={props.onStats} className="float-right cursor-pointer h-full flex-center mx-4">
        <MdLeaderboard />
      </div>

      <div onClick={props.onSettings} className="float-right cursor-pointer h-full flex-center">
        <MdSettings />
      </div>

    </div>
  </nav>
}

export default Navbar;