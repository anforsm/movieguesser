import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { IoMdCloseCircleOutline } from "react-icons/io";

const Modal = (props: any) => {
  const [closing, setClosing] = useState(false);
  const close = () => {
    if (props.onClose && props.open) {
      setClosing(true);
      setTimeout(() => {
        props.onClose();
        setClosing(false);
      }, 70);
    }
  };

  return createPortal(
    <>
      {" "}
      {props.open && (
        <div
          className={`modalBG flex-center fixed top-0 z-20 h-screen w-screen ${
            closing && "closing"
          }`}
          onClick={(e) => {
            e.stopPropagation();
            if (e.target === e.currentTarget) {
              close();
            }
          }}
          onMouseEnter={(e) => e.stopPropagation()}
        >
          <div className={`modal relative ${closing && "closing"} `}>
            <div
              onClick={(e) => {
                close();
              }}
              className="close-button absolute right-0 top-0 my-2 mr-2 cursor-pointer text-xl"
            >
              <IoMdCloseCircleOutline />
            </div>
            {props.children}
          </div>
        </div>
      )}
    </>,
    document.getElementById("root")!
  );
};

const MenuModal = (props: any) => {
  return (
    <Modal {...props}>
      <div className="flex w-[90vw] flex-col items-center rounded-2xl bg-primary-900 p-8 shadow-2xl md:w-[30rem]">
        {props.children}
      </div>
    </Modal>
  );
};

export { MenuModal, Modal };
