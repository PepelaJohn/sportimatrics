"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import { getCookie } from "@/lib/utils";
import Logo from "@/assets/logom.png";
import {
  generateRandomString,
  authUrl,
  pkce_challenge_from_verifier,
} from "@/api";
import { Music } from "lucide-react";
import Link from "next/link";
import { RiSpotifyFill } from "react-icons/ri";

const url = process.env.NEXT_PUBLIC_URL!;
// Environment variables
const scope =
  "user-read-private user-read-email user-read-playback-state playlist-read-private playlist-read-collaborative user-follow-read user-top-read user-read-recently-played";
const clientId = process.env.NEXT_PUBLIC_SPOTIFY_CLIENT_ID!;
const redirectUri = process.env.NEXT_PUBLIC_REDIRECT_URI!;

const LoginPage = () => {
  const dispatch = useDispatch();
  const router = useRouter();

  useEffect(() => {
    if (!!getCookie("_gtPaotwcsA")) {
      router.push("/");
    }
  }, [router]);

  const loginWithSpotify = async () => {
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

    const url = (authUrl + querystring);
    window.location.href = url;
  };

  return (
    <div className="min-h-screen  flex flex-col items-center justify-center p-4">
      <div className="bg-black bg-opacity-60 backdrop-blur-md rounded-xl shadow-2xl p-8 max-w-md w-full border border-green-500 border-opacity-20">
        <div className="flex flex-col items-center mb-8">
          <div className="w-16 h-16 border-2 border-green-500 rounded-full flex items-center text-white-1 justify-center mb-4 shadow-lg shadow-green-500/30">
            {/* <Music size={32} className="text-black" /> */}
            <img src={Logo.src} className="w-10/12" alt="logo" />
          </div>
          <h1 className="text-2xl md:text-3xl font-bold text-white-1">
            Welcome Back
          </h1>
          <p className="text-gray-400 mt-2 text-center">
            Sign in to access your playlists and personalized recommendations
          </p>
        </div>

        <button
          onClick={loginWithSpotify}
          className="w-full bg-green-500 hover:bg-green-600 text-black font-bold py-4 px-6 rounded-full transition-all duration-300 shadow-lg hover:shadow-green-500/30 flex items-center justify-center gap-2 transform "
        >
          <RiSpotifyFill size={20} className="text-black" />
          <span>Continue with Spotify</span>
        </button>

        <div className="mt-8 text-center">
          <p className="text-gray-500 text-sm">
            By continuing, you agree to our
            <Link href={`/terms-and-conditions`} className="!text-green-500">
              {" "}
              Terms of Service 
            </Link>

            {" "}and {" "}

            <Link className="!text-green-500" href='/privacy-policy'> Privacy Policy.</Link>
          </p>
        </div>
      </div>

      <div className="mt-8 text-gray-400 text-sm text-center">
        <p>
          Need help?{" "}
          <span className="text-green-400 cursor-pointer hover:underline">
            Contact Support
          </span>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
