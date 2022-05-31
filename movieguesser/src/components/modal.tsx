import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { IoMdCloseCircleOutline } from "react-icons/io";

const Modal = (props: any) => {
  const [closing, setClosing] = useState(false);
  const close = () => {
    if (props.onClose && props.open) {
      setClosing(true);
      setTimeout(() => {
        props.onClose()
        setClosing(false);
      }, 70);
    }
  }
  //useEffect(() => {
  //  setClosing(!props.open);
  //}, [props.open])

  //<div className={`modal relative ${closing ? "closing" : ""}`}>
  //className={`modalBG fixed w-screen h-screen bg-black/50 flex-center top-0 z-20 ${closing ? "closing" : ""}`}
  return createPortal(<> {props.open && <div
    className={`modalBG fixed w-screen h-screen flex-center top-0 z-20 ${closing && "closing"}`}
    onClick={(e) => {
      e.stopPropagation();
      if (e.target === e.currentTarget) {
        close();
      }
    }}
    onMouseEnter={(e) => e.stopPropagation()}
  >
    <div className={`modal relative ${closing && "closing"} `}>
      <div onClick={(e) => { close() }} className="close-button absolute right-0 top-0 cursor-pointer mr-2 my-2 text-xl"><IoMdCloseCircleOutline /></div>
      {props.children}
    </div>
  </div>}
  </>, document.getElementById("root")!)
}

const MenuModal = (props: any) => {
  return <Modal {...props}>
    <div className="bg-primary-900 rounded-2xl w-[90vw] md:w-[30rem] flex flex-col items-center p-8 shadow-2xl">
      {props.children}
    </div>
  </Modal>
}

export { MenuModal, Modal }