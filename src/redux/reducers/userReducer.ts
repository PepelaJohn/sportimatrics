"use client";
import { SIGN_IN, SIGN_OUT } from "@/constants";
import cookie from "js-cookie";

type ActionProps = {
  type: string;
  payload?: any;
};

type UserProps = Record<string | number | symbol, any>;

export default (user: UserProps = {}, action: ActionProps) => {
  if (typeof window !== "undefined") {
    const storedUser = localStorage.getItem("user");
    user = storedUser ? JSON.parse(storedUser) : {};
  }

  switch (action.type) {
    case SIGN_IN:
      if (typeof window !== "undefined") {
        localStorage.setItem("user", JSON.stringify(action.payload));
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

      if (typeof window !== "undefined") {
        localStorage.removeItem("user");
      }

      return {};

    default:
      return user;
  }
};
