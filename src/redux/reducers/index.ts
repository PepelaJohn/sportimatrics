import user from "./userReducer";
import info from "./infoReducer";
import { combineReducers } from "@reduxjs/toolkit";

export const reducers = combineReducers({user, info})