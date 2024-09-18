"use client";
import dotenv from "dotenv";
dotenv.config();
import {
  generateRandomString,
  authUrl,
  pkce_challenge_from_verifier,
} from "@/api";
import { useEffect } from "react";
import { getCookie } from "@/lib/utils";
import { useRouter } from "next/navigation";

import {SignpostIcon as Spotify} from 'lucide-react'
import { useDispatch } from "react-redux";
const scope =
  "user-read-private user-read-email user-read-playback-state  playlist-read-private playlist-read-collaborative user-follow-read user-top-read user-read-recently-played";
const clientId = process.env.NEXT_PUBLIC_SPOTIFY_CLIENT_ID!;
const redirectUri = process.env.NEXT_PUBLIC_REDIRECT_URI!;

const page = () => {
  const dispatch = useDispatch()
  const router = useRouter();
  useEffect(() => {
    if (!!getCookie("_gtPaotwcsA")) {
      router.push("/");
    }
  }, []);
  const LoginWithSpotify = async () => {
    let codeVerifier = localStorage.getItem("code_verifier");

    if (!codeVerifier) {
      codeVerifier = generateRandomString(64);
      localStorage.setItem("code_verifier", codeVerifier);
    }

    const codeChallenge = await pkce_challenge_from_verifier(codeVerifier);

    const querystring = `?response_type=code&client_id=${clientId}&scope=${scope
      .split(" ")
      .join(
        "+"
      )}&code_challenge_method=S256&code_challenge=${codeChallenge}&redirect_uri=${redirectUri}&show_dialog=true`;
    const url = (authUrl + querystring) as unknown as Location;
    //console.log(codeVerifier);

    window.location = url;
  };
  return (
    <div className="nav-height  w-full flex-col min-h-[50vh] h-full flex  items-center justify-center">
      <div className="w-[300px] flex flex-col gap-5">
        <button onClick={LoginWithSpotify} className=" text-sm bg-green-400 button">
          <Spotify/>
          Continue with Spotify
        </button>

        
      </div>
    </div>
  );
};

export default page;
