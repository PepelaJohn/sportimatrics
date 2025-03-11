"use client";
import { ERROR, SIGN_OUT, SUCCESS } from "@/constants";
import { getCookie } from "@/lib/utils";
import axios from "axios";
import dotenv from "dotenv";
dotenv.config();
import cookie from "js-cookie";
import React from "react";
// const cookie = document.cookie;
export const authUrl = new URL("https://accounts.spotify.com/authorize");
const apiUrl = new URL("https://accounts.spotify.com/api/token");
// const scope = "user-read-private user-read-email";
const clientId = process.env.NEXT_PUBLIC_SPOTIFY_CLIENT_ID!;
const redirectUri = process.env.NEXT_PUBLIC_REDIRECT_URI!;

// =================================REQUESTING AUTH============================================
export const generateRandomString = (length: number) => {
  const possible =
    "0354cd09ea3b6e955c24cf110a5499495d23d5dec4fd1ae45813642f078d7667b240ab2692b3a73ca13369be0abce2351191";
  const values = crypto.getRandomValues(new Uint8Array(length));
  return values.reduce((acc, x) => acc + possible[x % possible.length], "");
};

export async function sha256(plain: string) {
  const encoder = new TextEncoder();
  const data = encoder.encode(plain);

  return window.crypto.subtle.digest("SHA-256", data);
}

export function base64urlencode(a: ArrayBuffer) {
  // Convert the ArrayBuffer to string using Uint8 array.
  // btoa takes chars from 0-255 and base64 encodes.
  // Then convert the base64 encoded to base64url encoded.
  // (replace + with -, replace / with _, trim trailing =)
  return btoa(String.fromCharCode.apply(null, Array.from(new Uint8Array(a))))
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");
}

export async function pkce_challenge_from_verifier(v: string) {
  const hashed = await sha256(v);
  const base64encoded = base64urlencode(hashed);
  return base64encoded;
}

// the response has a code that can be exchanged for the access token
export const getToken = async () => {
  const codeVerifier = window.localStorage.getItem("code_verifier");
  if (!codeVerifier) return { authenticated: false };
  const urlParams = new URLSearchParams(window.location.search);
  let code = urlParams.get("code")!;
  const payload = {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({
      client_id: clientId,
      grant_type: "authorization_code",
      code,
      redirect_uri: redirectUri,
      code_verifier: codeVerifier!,
    }),
  };

  const body = await fetch(apiUrl, payload);
  const response = await body.json();

  if (!!response.access_token) {
    cookie.set("_gtPaotwcsA", response.access_token, { expires: 3600 });

    return { authenticated: true, refresh_token: response.refresh_token };
  }
  return { authenticated: false };
};

const getRefreshToken = async (email: string) => {
  try {
    const payload = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: email,
      }),
    };

    const promiseData = await fetch(
      `${process.env.NEXT_PUBLIC_URL}/api/refresh`,
      payload
    );
    const data = await promiseData.json();
    return data.refresh_token;
  } catch (error: any) {
    ////console.warn(error, "error in getrefreshToken");
    // throw new Error(error)
  }
};

const renewAccessToken = async (
  refreshToken: string,
  email: string,
  dispatch: React.Dispatch<UnknownAction>
) => {
  // const refreshToken = localStorage.getItem('refresh_token');
  const url = "https://accounts.spotify.com/api/token";

  const payload = {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({
      grant_type: "refresh_token",
      refresh_token: refreshToken,
      client_id: clientId,
    }),
  };
  const data = await fetch(url, payload);
  if (!data.ok) {
    Logout(dispatch, email);
    return false;
  }
  const response = await data.json();
  if (!!response.refresh_token) {
    const payload = {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: email,
        refresh_token: response.refresh_token,
      }),
    };

    await fetch(`${process.env.NEXT_PUBLIC_URL}/api/refresh`, payload);
    window.location.reload();
  }

  if (!!response.access_token) {
    cookie.set("_gtPaotwcsA", response.access_token, { expires: 3600 * 1000 });

    return true;
  }

  return false;
};

const rectifyToken = async (
  error: any,
  dispatch: React.Dispatch<UnknownAction>
) => {
  if (error?.response?.data?.error?.status === 401) {
    const userEmail = JSON.parse(localStorage.getItem("user")!)?.email;
    if (
      !userEmail ||
      userEmail === undefined ||
      userEmail === null ||
      userEmail === "undefined"
    ) {
      Logout(dispatch, userEmail);
    }

    const refresh_token = await getRefreshToken(userEmail);
    renewAccessToken(refresh_token, userEmail, dispatch);
  }
};
export async function getProfile(
  dispatch: React.Dispatch<UnknownAction>
): Promise<any> {
  try {
    let accessToken = getCookie("_gtPaotwcsA");
    if (!accessToken) return;
    const response = await axios.get("https://api.spotify.com/v1/me", {
      headers: {
        Authorization: "Bearer " + accessToken,
      },
    });
    return response.data;
  } catch (error: any) {
    dispatch({ type: ERROR, payload: "Please Refresh the page!" });

    rectifyToken(error, dispatch);
  }
}

export const Logout = async (
  dispatch: React.Dispatch<UnknownAction>,
  userEmail: string
) => {
  try {
    if (!userEmail) {
      dispatch({ type: ERROR, payload: "Unable to complete request" });
    } else {
      const payload = {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: userEmail,
        }),
      };

      const promiseData = await fetch(
        `${process.env.NEXT_PUBLIC_URL}/api/logout`,
        payload
      );
      const data = await promiseData.json();
      console.log(promiseData.status)
      console.log(data)

      if (promiseData.status === 200) {
        // localStorage.clear();
        dispatch({ type: SIGN_OUT });
        cookie.remove("_gtPaotwcsA");
        dispatch({ type: SUCCESS, payload: "Logged Out" });
        if (typeof window !== "undefined" && typeof window !== undefined) {
          window.location.href = process.env.NEXT_PUBLIC_URL!;
        }
      }
    }

    
    return;
  } catch (error: any) {
    dispatch({ type: ERROR, payload: "Failed to logout" });
    //console.warn(error.message, "Logout component");
  }
};

export async function fetchRecentTracks(
  dispatch: React.Dispatch<UnknownAction>
): Promise<any> {
  try {
    let accessToken = getCookie("_gtPaotwcsA");
    const response = await axios.get<any>(
      "https://api.spotify.com/v1/me/player/recently-played",
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    const recentTracks = response.data.items;

    return recentTracks;
  } catch (error: any) {
    //console.error("Error fetching recently played tracks:", error.message);
    rectifyToken(error, dispatch);
  }
}

export const searchSpotify = async (
  query: string,
  setsearchData: React.Dispatch<React.SetStateAction<{ [key: string]: any }>>,
  dispatch: React.Dispatch<UnknownAction>
) => {
  const q = query.split(" ").join("+");
  try {
    let accessToken = getCookie("_gtPaotwcsA");
    if (!accessToken) return;
    // const querystring = `q` + query.split(" ").join("%20");
    const response = await axios.get(
      `https://api.spotify.com/v1/search?q=${q}&type=track%2Cartist%2Calbum&limit=10`,
      {
        headers: {
          Authorization: "Bearer " + accessToken,
        },
      }
    );

    const data = await response.data;

    setsearchData(data);
    return data;
  } catch (error: any) {
    if (!!dispatch) {
      dispatch({
        type: ERROR,
        payload: error.description || "Please Refresh the page!",
      });
    }
    // setsearchData({ error: "Error occured" });
    rectifyToken(error, dispatch);
  }
};

export const getuserTopItems = async (
  type: string,
  time_range: string,
  dispatch: React.Dispatch<UnknownAction>,
  limit?: number,
  offset?: number
) => {
  try {
    let accessToken = getCookie("_gtPaotwcsA");
    if (!accessToken) return;

    const response = await axios.get(
      `https://api.spotify.com/v1/me/top/${type}?time_range=${time_range}&limit=${
        limit || 50
      }&offset=${offset || 0}`,
      {
        headers: {
          Authorization: "Bearer " + accessToken,
        },
      }
    );

    const data = response.data.items;

    return data;
  } catch (error) {
    rectifyToken(error, dispatch);
  }
};

export const uploadToDB = async (formData: { [key: string]: any }) => {
  try {
    const userEmail = JSON.parse(localStorage.getItem("user")!)?.email;
    const payload = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        ...formData,
        email: userEmail,
      }),
    };

    const promiseData = await fetch(
      `${process.env.NEXT_PUBLIC_URL}/api/upload`,
      payload
    );
    const data = await promiseData.json();

   
    return {...data, ok:promiseData.ok}
  } catch (error: any) {
    //console.table(error);
  }
};
export const getFormDB = async () => {
  try {
    const userEmail = JSON.parse(localStorage.getItem("user")!)?.email;
    if (!userEmail) throw new Error("Please refresh page or Login");
    const payload = {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    };

    const promiseData = await fetch(
      `${process.env.NEXT_PUBLIC_URL}/api/upload?email=${userEmail}`,
      payload
    );
    const data = await promiseData.json();

    return {...data,ok:promiseData.ok };
  } catch (error: any) {
    //console.table(error);
  }
};
