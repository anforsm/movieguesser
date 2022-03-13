const Navbar = (props: any) => {

  return <div id="navbar" className="w-screen h-full bg-slate-900 flex-center m-0">
    <div className="w-[100vw] max-w-[40rem] h-full flex flex-row-reverse items-center">
      <div onClick={props.onStats} className="text-white float-right cursor-pointer">Stats</div>
    </div>
  </div>
}

export default Navbar;