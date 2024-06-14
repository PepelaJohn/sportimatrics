"use client";
import LoaderSpinner from "@/components/LoaderSpinner";
import React, { useEffect, useState } from "react";
import { getProfile, getToken } from "@/api";
import { useRouter } from "next/navigation";
import { getCookie } from "@/lib/utils";
type Props = {};

function page({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const router = useRouter();

  const [user, setUser] = useState<promiseUser>();

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
        let user = getProfile();
        user.then(async function (result: any) {
          if (result.display_name) {
            setUser(result);
            localStorage.setItem("user", JSON.stringify(result));
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
            const data = await promiseData.json();
            if (data.status === 200) {
              router.replace("/");
            } else {
              router.replace("/auth");
            }
          }
        });
      } else {
        router.replace("/auth");
      }
    };

    getAndCheckAuth();
  }, []);

  return <LoaderSpinner />;
}

export default page;
