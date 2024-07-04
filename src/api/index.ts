"use client";
import { ERROR } from "@/constants";
import { getCookie } from "@/lib/utils";
import axios from "axios";
import dotenv from "dotenv";
dotenv.config();
import cookie from "js-cookie";
// const cookie = document.cookie;
export const authUrl = new URL("https://accounts.spotify.com/authorize");
const apiUrl = new URL("https://accounts.spotify.com/api/token");
// const scope = "user-read-private user-read-email";
const clientId = process.env.NEXT_PUBLIC_SPOTIFY_CLIENT_ID!;
const redirectUri = process.env.NEXT_PUBLIC_REDIRECT_URI!;

//https://accounts.spotify.com/en/authorize?response_type=code&client_id=0430499af2784a53b2ac15f5dae104f2&scope=user-read-private+user-read-email&code_challenge_method=S256&code_challenge=IT2Z_WJTTlrvBJjnNDIV6R8Nv9nWCi1-G5gcZrR6aXE&redirect_uri=http%3A%2F%2Flocalhost%3A3000
// =================================REQUESTING AUTH============================================
export const generateRandomString = (length: number) => {
  const possible =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
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
  // console.log(response);

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
      "http://localhost:3000/api/refresh",
      payload
    );
    const data = await promiseData.json();
    return data.refresh_token;
  } catch (error: any) {
    console.warn(error, "error in getrefreshToken");
    // throw new Error(error)
  }
};

const renewAccessToken = async (refreshToken: string, email: string) => {
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
  const response = await data.json();
  if (!!response.refresh_token) {
    const payload = {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: email,
      }),
    };

    await fetch("http://localhost:3000/api/refresh", payload);
  }

  if (!!response.access_token) {
    cookie.set("_gtPaotwcsA", response.access_token, { expires: 3600 * 1000 });

    return true;
  }

  return false;
};

const rectifyToken = async (error: any) => {
  if (error?.response?.data?.error?.status === 401) {
    const userEmail = JSON.parse(localStorage.getItem("user")!)?.email;
    if (
      !userEmail ||
      userEmail === undefined ||
      userEmail === null ||
      userEmail === "undefined"
    )
      alert("Please Login again");

    const refresh_token = await getRefreshToken(userEmail);
    renewAccessToken(refresh_token, userEmail);
  }
};
export async function getProfile(
  dispatch?: React.Dispatch<UnknownAction>
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
    if (!!dispatch) {
      dispatch({ type: ERROR, payload: "Please Refresh the page!" });
    }
    console.log(error);
    rectifyToken(error);
  }
}

export async function fetchRecentTracks(): Promise<any> {
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
    console.error("Error fetching recently played tracks:", error.message);
    rectifyToken(error);
  }
}
export async function fetchTopTracks(): Promise<any> {
  try {
    let accessToken = getCookie("_gtPaotwcsA");
    const response = await axios.get<any>(
      "https://api.spotify.com/v1/me/top/tracks",
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    const topTracks: any = response.data.items;
    return topTracks;
  } catch (error: any) {
    console.error("Error fetching top tracks:", error.message);
    throw error;
  }
}

export async function fetchTopArtists(): Promise<any> {
  try {
    let accessToken = getCookie("_gtPaotwcsA");
    const response = await axios.get<any>(
      "https://api.spotify.com/v1/me/top/artists",
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    // Extracting the array of items (top artists) from response
    const topArtists: any = response.data.items;
    return topArtists;
  } catch (error: any) {
    console.error("Error fetching top artists:", error.message);
    throw error;
  }
}

export const searchSpotify = async (
  query: string,
  setsearchData: React.Dispatch<React.SetStateAction<{ [key: string]: any }>>,
  dispatch?: React.Dispatch<UnknownAction>
) => {
  console.log(query, "search spotify");

  const q = query.split(" ").join("+");
  try {
    let accessToken = getCookie("_gtPaotwcsA");
    if (!accessToken) return;
    // const querystring = `q` + query.split(" ").join("%20");
    const response = await axios.get(
      `https://api.spotify.com/v1/search?q=${q}&type=track%2Cartist%2Calbum`,
      {
        headers: {
          Authorization: "Bearer " + accessToken,
        },
      }
    );

    const data = await response.data;
    console.log(data, "search");
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
    rectifyToken(error);
  }
};

export const getuserTopItems = async (
  type: string,
  time_range: string,
  limit: number,
  offset: number
) => {
  try {
    let accessToken = getCookie("_gtPaotwcsA");
    if (!accessToken) return;

    const response = await axios.get(
      `https://api.spotify.com/v1/me/top/?type=${type}&time_range=${time_range}&limit=${limit}&offset=${offset}`,
      {
        headers: {
          Authorization: "Bearer " + accessToken,
        },
      }
    );

    const data = await response.data();
    return data;
  } catch (error) {
    rectifyToken(error);
  }
};

export const uploadToDB = async (formData: { [key: string]: any }) => {
  try {
    const payload = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        formData,
      }),
    };

    const promiseData = await fetch(
      "http://localhost:3000/api/upload",
      payload
    );
    const data = await promiseData.json();
    console.log(data);
  } catch (error: any) {
    console.table(error);
  }
};
