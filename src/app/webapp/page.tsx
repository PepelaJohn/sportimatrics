"use client";
import LoaderSpinner from "@/components/LoaderSpinner";
import React, { useEffect } from "react";
import { getProfile, getToken } from "@/api";
import { useRouter } from "next/navigation";
import { getCookie } from "@/lib/utils";
import { useDispatch } from "react-redux";
import { ERROR, SIGN_IN } from "@/constants";
import { Loader } from "lucide-react";

type Props = {
  searchParams: { [key: string]: string | string[] | undefined };
};

function Page({ searchParams }: Props) {
  const router = useRouter();
  const dispatch = useDispatch();

  useEffect(() => {
    // Redirect if code is missing
    if (!searchParams.code) {
      router.push("/auth");
      return;
    }

    // Redirect if already authenticated
    if (getCookie("_gtPaotwcsA")) {
      router.push("/");
      return;
    }

    const getAndCheckAuth = async () => {
      try {
 
        const isAuthenticated = await getToken();

        if (!isAuthenticated.authenticated) {
          dispatch({ type: ERROR, payload: "Failed to login" });
          router.replace("/auth");
          return;
        }

        const user = await getProfile(dispatch as React.Dispatch<UnknownAction>);
        if (user.display_name) {
          dispatch({ type: SIGN_IN, payload: user });

          const payload = {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              refresh_token: isAuthenticated.refresh_token,
              ...user,
            }),
          };

          const response = await fetch("/api/auth", payload);
          if (response.ok) {
            router.replace("/");
          } else {
            dispatch({ type: ERROR, payload: "Failed to login" });
            router.replace("/auth");
          }
        }
      } catch (error) {
        dispatch({ type: ERROR, payload: "Failed to login" });
        router.replace("/auth");
      }
    };

    getAndCheckAuth();
  }, [searchParams.code]);

  return (
    <div className="flex flex-col items-center justify-center h-screen w-full">
      <Loader className="animate-spin text-green-400" size={30} />
      <span className="text-white-1 text-sm">Please Wait...</span>
    </div>
  );
}

export default Page;
