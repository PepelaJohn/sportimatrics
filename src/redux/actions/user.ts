"use client";
import * as userCon from "@/constants";
import { AppDispatch } from "@/redux/store/StoreProvider";
// import {useDispatch} from 'react-redux'

export const LoginUser = () => {
  return async (dispatch: AppDispatch) => {
    try {
      console.log("here i come");
      const dataPromise = await fetch("http://localhost:3000/api/test", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name: "John" }),
      });
      dispatch({ type: "TEST", payload: { test: "ok" } });
      // console.log();
      const data = await dataPromise.json();
      console.log(data);
    } catch (error) {
      console.log(error);
    }
  };
};
