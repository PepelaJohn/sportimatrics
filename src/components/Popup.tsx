import React from "react";

type Props = {
  popup: {
    show: boolean;
    error: boolean;
    message: string;
  };
  popupRef: any;
};
const Popup = ({ popup, popupRef }: Props) => {
  return (
    <div
      ref={popupRef}
      className={`fixed max-w-[300px] w-full  z-50 easeinOut  py-5 px-2 shadow-2xl rounded-lg flex  overflow-hidden m-auto mb-5 self-center bottom-[1vh] left-0 right-0 justify-center bg-black-5 min-h-[45px] ${
        popup.show ? "traslate-y-0" : "display-none"
      } pointer-events-none   items-center`}
    >
      <p
        className={`overflow-hidden text-center capitalize text-ellipsis whitespace-nowrap text-sm ${
          popup.error ? "text-red-500" : "text-green-500"
        }`}
      >
        {popup.message || ""}
      </p>
    </div>
  );
};

export default Popup;
