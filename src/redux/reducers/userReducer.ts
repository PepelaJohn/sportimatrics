'use client'
import { SIGN_IN, SIGN_OUT } from "@/constants";
import cookie from "js-cookie";
type userProps = {
  [key: string | number | symbol]: any;
};

// let dispUser = localStorage.getItem("user");

export default (
  user: userProps =  {},
  action: actionProp
) => {
  switch (action.type) {
    case "TEST":
      console.log("tested, WOrking");
      return user;
    case SIGN_IN:
      localStorage.setItem("user", JSON.stringify(action.payload));

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
      localStorage.removeItem("user");

      return {};
    default:
      return user;
  }
};
