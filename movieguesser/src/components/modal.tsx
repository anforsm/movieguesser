import { useState } from "react";
import { IoMdCloseCircleOutline } from "react-icons/io";

const Modal = (props: any) => {
  const [closing, setClosing] = useState(false);
  const close = () => {
    setClosing(true);
    setTimeout(() => {
      setClosing(false);
      if (props.onClose)
        props.onClose()
    }, 200);
  }

  return <div id="modalBG"
    onClick={(e) => {
      if (e.target === e.currentTarget) {
        close()
      }
    }}
    className={`absolute w-screen h-screen bg-black/50 flex-center top-0 z-20 ${closing ? "closing" : ""}`}
  >
    <div id="modal" className={`bg-primary-900 rounded-lg w-[30rem] flex flex-col items-center p-8 relative ${closing ? "closing" : ""}`}>
      <div onClick={close} className="absolute right-0 top-0 cursor-pointer mr-2 my-2 text-xl"><IoMdCloseCircleOutline /></div>
      {props.children}
    </div>
  </div>
}

export default Modal;