import { X } from "lucide-react";
import React from "react";

interface ModalProps {
  isOpen: boolean;
  onClose?: () => void;
  children: React.ReactNode;
  className?:string
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, children,className }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
      <div className={`bg-white rounded-2xl shadow-lg p-6 relative w-full min-w-md ${className ? className :"max-w-md"}`}> 
       {onClose && <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
        >
         <X size={20}/>
        </button>}
        {children}
      </div>
    </div>
  );
};

export default Modal;
