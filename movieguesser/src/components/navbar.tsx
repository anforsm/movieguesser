import { MdLeaderboard, MdSettings } from "react-icons/md";
import { IoMdInformationCircleOutline } from "react-icons/io";

const Navbar = (props: any) => {

  return <nav id="navbar" className="w-screen h-full bg-dark-800 flex-center m-0">
    <div className="w-[100vw] max-w-[60vh] h-full flex flex-row items-center text-white relative">
      <div onClick={props.onInfo} className="float-left cursor-pointer mr-auto h-full flex-center">
        <IoMdInformationCircleOutline />
      </div>

      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2" >Movieguesser</div>

      <div onClick={props.onStats} className="float-right cursor-pointer h-full flex-center mx-2">
        <MdLeaderboard />
      </div>

      <div onClick={props.onSettings} className="float-right cursor-pointer h-full flex-center mx-2">
        <MdSettings />
      </div>

    </div>
  </nav>
}

export default Navbar;