import React, {useState} from "react";

type ModalProps = {
    children: React.ReactNode;
    buttonName:string;
}

function Modal({children, buttonName}: ModalProps) {

    const [isOpen, setIsOpen] = useState(false);

    return (
        <>
            {!isOpen && (
                <button className={"border bg-gray-300 text-black px-4 py-2 rounded-lg ms-2 mt-2"} onClick={() => setIsOpen(true)}>

                    {buttonName}
                </button>
            )}
            {isOpen && (
                <div>
                    <div className={' flex-col fixed inset-0 bg-black/50  flex items-center justify-center'}>
                        {children}
                        <button className={"bg-blue-500 text-white border-r-2 border-black px-4 py-2 rounded-lg"}
                                onClick={() => setIsOpen(false)}>Close
                        </button>
                    </div>
                </div>)
            }
        </>
    );
}

export default Modal;