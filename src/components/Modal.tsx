import React from "react";

type ModalProps = {
  children: React.ReactNode;
  isOpen: boolean;
};

const Modal = ({ children, isOpen }: ModalProps) => {
  if (!isOpen) {
    return;
  }

  return (
    <>
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
        <h1>{children}</h1>
      </div>
    </>
  );
};
export default Modal;
