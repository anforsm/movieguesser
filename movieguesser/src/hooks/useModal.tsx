import { FC, useState } from "react";
import Modal from "../components/modal";

const useModal = (): readonly [(value: boolean | ((val: boolean) => boolean)) => void, FC] => {
  const [open, setOpen] = useState(false);

  const ModalWrapper = (props: any) => open ? <Modal onClose={() => setOpen(false)}>{props.children}</Modal> : <></>

  return [setOpen, ModalWrapper]
}

export default useModal;