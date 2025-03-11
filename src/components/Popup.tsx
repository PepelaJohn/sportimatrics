import React from "react";

type Props = {
  popup: {
    show: boolean;
    error: boolean;
    message: string;
  };
  popupRef: React.RefObject<HTMLDivElement>;
};

const Popup = ({ popup, popupRef }: Props) => {
  return (
    <div
      ref={popupRef}
      className={`fixed max-w-md w-full z-50 transition-all duration-300 ease-in-out 
      py-4 px-6 shadow-2xl rounded-full flex overflow-hidden m-auto mb-8 
      self-center bottom-4 left-0 right-0 justify-center items-center
      backdrop-blur-md border ${popup.error ? 'border-red-500/20' : 'border-green-500/20'}
      ${popup.error ? 'bg-black/80' : 'bg-black/80'} 
      ${popup.show ? 'translate-y-0 opacity-100' : 'translate-y-16 opacity-0 pointer-events-none'}`}
    >
      {popup.error ? (
        <div className="mr-3 flex-shrink-0 h-6 w-6 rounded-full bg-red-900/50 flex items-center justify-center">
          <span className="text-red-400 text-xs">✕</span>
        </div>
      ) : (
        <div className="mr-3 flex-shrink-0 h-6 w-6 rounded-full bg-green-900/50 flex items-center justify-center">
          <span className="text-green-400 text-xs">✓</span>
        </div>
      )}
      
      <p
        className={`text-center text-sm font-medium overflow-hidden text-ellipsis ${
          popup.error ? "text-red-400" : "text-green-400"
        }`}
      >
        {popup.message || ""}
      </p>
    </div>
  );
};

export default Popup;