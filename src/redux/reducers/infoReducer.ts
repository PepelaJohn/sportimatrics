'use client'
import {  CLOSE_DISPLAY, ERROR, SUCCESS } from "@/constants";
const fxt =   (
  popup = {
    show: false,
    error: false,
    message: "",
  },
  action:actionProp
) => {
  switch (action.type) {
    case ERROR:
      return { show: true, error: true, message: action.payload };
    case SUCCESS:
      return { show: true, error: false, message: action.payload };

    case CLOSE_DISPLAY:
      return {show:false, error:false, message:''}
    
    default:
      return popup;
  }
};

export default fxt