'use client'
import {  HIDE_COOKIE_PREFERENCES, SHOW_COOKIE_PREFERENCES } from "@/constants";
const fxt =  (
  popup = HIDE_COOKIE_PREFERENCES,
  action:actionProp
) => {
  switch (action.type) {
    case SHOW_COOKIE_PREFERENCES:
      return true;
    case HIDE_COOKIE_PREFERENCES:
      return false;

   
    default:
      return popup === SHOW_COOKIE_PREFERENCES;
  }
};


export default fxt