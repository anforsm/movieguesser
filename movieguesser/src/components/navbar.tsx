const Navbar = (props: any) => {

  return <div className="absolute w-screen top-0 h-16 bg-slate-900 flex-center">
    <div className="w-[100vw] max-w-[40rem] h-full flex flex-row-reverse items-center">
      <div onClick={props.onStats} className="text-white float-right cursor-pointer">Stats</div>
    </div>
  </div>
}

export default Navbar;