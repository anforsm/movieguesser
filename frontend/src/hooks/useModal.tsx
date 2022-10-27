import { FC, useMemo, useState } from "react";

const useModal = (
  Modal: any
): readonly [
  (value: boolean | ((val: boolean) => boolean)) => void,
  FC,
  any
] => {
  const [open, setOpen] = useState(false);

  return [
    setOpen,
    Modal,
    {
      onClose: () => setOpen(false),
      open: open,
    },
  ];
};

export default useModal;
