import { MdLeaderboard, MdSettings } from "react-icons/md";
import { IoMdInformationCircleOutline } from "react-icons/io";

const Navbar = (props: any) => {
  return (
    <nav
      id="navbar"
      className="flex-center z-10 m-0 h-full w-screen bg-primary-800 text-[1.4rem] shadow-md md:text-[3vh]"
    >
      <div className="relative flex h-full w-[100vw] flex-row items-center px-4 md:max-w-[60vh]">
        <button
          onClick={props.onInfo}
          className="flex-center float-left mr-auto h-full cursor-pointer"
          tabIndex={0}
          title="Tutorial"
        >
          <IoMdInformationCircleOutline />
        </button>

        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 font-logo-font text-[1.6rem] font-semibold tracking-wider md:text-[3.6vh] ">
          Movieguesser
        </div>

        <button
          onClick={props.onStats}
          className="flex-center float-right mx-4 h-full cursor-pointer"
          tabIndex={0}
          title="Statistics"
        >
          <MdLeaderboard />
        </button>

        <button
          onClick={props.onSettings}
          className="flex-center float-right h-full cursor-pointer"
          tabIndex={0}
          title="Settings"
        >
          <MdSettings />
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
