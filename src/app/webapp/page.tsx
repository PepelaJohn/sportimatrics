"use client";
import LoaderSpinner from "@/components/LoaderSpinner";
import React, { useEffect, useState } from "react";
import { getProfile, getToken } from "@/api";
import { useRouter } from "next/navigation";
import { getCookie } from "@/lib/utils";
import { useDispatch } from "react-redux";
import { ERROR, SIGN_IN } from "@/constants";
import { Loader } from "lucide-react";
type Props = {};

function page({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const router = useRouter();

  const dispatch = useDispatch();

  if (!searchParams.code) {
    router.push("/auth");
  }
  if (!!getCookie("_gtPaotwcsA")) {
    router.push("/");
  }

  useEffect(() => {
    const getAndCheckAuth = async () => {
      const isAuthenticated = await getToken();
     
  
      
      if (isAuthenticated.authenticated) {
        let user = getProfile(dispatch as React.Dispatch<UnknownAction>);
        user.then(async function (result: any) {
          if (result.display_name) {
            dispatch({ type: SIGN_IN, payload: result });

            const payload = {
              method: "POST",
              headers: {
                "Content-Type": "application/x-www-form-urlencoded",
              },
              body: JSON.stringify({
                refresh_token: isAuthenticated.refresh_token,
                ...result,
              }),
            };

            const promiseData = await fetch(
              "http://localhost:3000/api/auth",
              payload
            );
            // const data = await promiseData?.json();
           
            

            if (promiseData.status === 200) {
              router.replace("/");
              dispatch({ type: SIGN_IN, payload: result });
            } else {
              dispatch({ type: ERROR, payload: "Failed to login" });
              router.replace("/auth");
            }
          }
        });
      } else {
        dispatch({ type: ERROR, payload: "Failed to login" });
        router.replace("/auth");
      }
    };

    getAndCheckAuth();
  }, []);

  return (
    <div className="flex flex-col items-center justify-center h-[100vh] w-full">
      <Loader className="animate-spin text-green-400" size={30} />
      <span className="text-white-1 text-sm">Please Wait...</span>
    </div>
  );
}

export default page;
