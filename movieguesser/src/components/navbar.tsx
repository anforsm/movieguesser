const Navbar = (props: any) => {

  return <div id="navbar" className="w-screen h-full bg-dark-800 flex-center m-0">
    <div className="w-[100vw] max-w-[40rem] h-full flex flex-row-reverse items-center">
      <div onClick={props.onStats} className="text-white float-right cursor-pointer">Stats</div>
    </div>
  </div>
}

export default Navbar;