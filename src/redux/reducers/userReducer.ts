"use client";
import { SIGN_IN, SIGN_OUT } from "@/constants";
import cookie from "js-cookie";
type userProps = {
  [key: string | number | symbol]: any;
};

// let dispUser = localStorage.getItem("user");



export default (
  user: userProps = (typeof window !== undefined ||
    typeof window !== null) &&
  !!window.localStorage.getItem("user")
    ? JSON.parse(localStorage.getItem("user")!)
    : {},
  action: actionProp
) => {
  
  switch (action.type) {
   
    case SIGN_IN:
    
     
      if (typeof window !== "undefined" && typeof window !== undefined) {
        window.localStorage.setItem("user", JSON.stringify(action.payload));
      }  

      return action.payload;

    case SIGN_OUT:
      cookie.remove("_gtPaotwcsA", { expires: 3600 });
      cookie.remove("_gtPaotwcsR", {
        expires: 60 * 60 * 24 * 10,
        secure: true,
        httpOnly: true,
        sameSite: "strict",
        path: "/refresh",
      });

      if (typeof window !== "undefined" && typeof window !== undefined) {
        window.localStorage.removeItem("user");
      }

      return {};
    default:
      return user;
  }
};
