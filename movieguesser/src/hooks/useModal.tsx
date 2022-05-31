import { FC, useMemo, useState } from "react";
//import Modal from "../components/modal";

//=> <Modal onClose={() => setOpen(false)} open={open}>{props.children}</Modal>, [open])
const useModal = (Modal: any): readonly [(value: boolean | ((val: boolean) => boolean)) => void, FC, any] => {
  const [open, setOpen] = useState(false);


  return [setOpen, Modal, {
    onClose: () => setOpen(false),
    open: open,
  }]
}

export default useModal;