import user from "./userReducer";
import info from "./infoReducer";
import cookieselector from "./cookieprefrences"
import { combineReducers } from "@reduxjs/toolkit";

export const reducers = combineReducers({user, info, cookieselector})