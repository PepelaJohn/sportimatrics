"use client";
import { getProfile, Logout } from "@/api";
import { getCookie, getInitials } from "@/lib/utils";
import Head from "next/head";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";

export default function Profile() {
  const [user, setUser] = useState<promiseUser>();
  const dispatch = useDispatch();
  const router = useRouter();
  useEffect(() => {
    let user: any;
    if (!!localStorage.getItem("user")) {
      user = JSON.parse(localStorage.getItem("user")!);
      setUser(user);
    } else {
      user = getProfile(dispatch as React.Dispatch<UnknownAction>);
      user.then(function (result: any) {
        if (!!result?.display_name) {
          setUser(result);
          localStorage.setItem("user", JSON.stringify(result));
        } else {
          Logout(dispatch as React.Dispatch<UnknownAction>);
          router.push("/auth?next=profile");
        }
      });
    }
  }, []);
  // console.log(user); https://buymeacoffee.com/spotimetrics
  
  return (
    <div className="min-h-screen w-full  flex flex-col items-center  text-gray-100">
      <Head>
        <title>Profile - SpotiMetrics</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="max-w-7xl p-8 nav-height">
        <div className="relative flex flex-col w-full min-w-0 mb-6 break-words border border-dashed bg-clip-border rounded-2xl border-stone-200 bg-light/30 draggable">
          <div className="px-9 pt-9 flex-auto min-h-[70px] pb-0 bg-transparent">
            <div className="flex mb-6 xl:flex-nowrap">
              <div className="flex-shrink-0 mb-5 mr-5">
                <div
                  className={`relative inline-block shrink-0  cursor-pointer  ${
                    user?.images?.length
                      ? ""
                      : "items-center justify-center flex w-[80px] h-[80px] lg:w-[160px] lg:h-[160px] bg-gray-800"
                  } rounded-2xl`}
                >
                  {!!user?.images.length ? (
                    <img
                      className="inline-block shrink-0 rounded-2xl w-[80px] h-[80px] lg:w-[160px] lg:h-[160px]"
                      src={user?.images[1]?.url}
                      //src="https://raw.githubusercontent.com/Loopple/loopple-public-assets/main/riva-dashboard-tailwind/img/avatars/avatar1.jpg"
                      alt="image"
                    />
                  ) : (
                    <span className="text-gray-600 text-2xl">
                      {!!user?.display_name
                        ? getInitials(user?.display_name!)
                        : ""}
                    </span>
                  )}
                </div>
              </div>
              <div className="grow text-white-1">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex flex-col">
                    <div className="flex items-center mb-2">
                      <span className="text-secondary-inverse hover:text-primary transition-colors duration-200 ease-in-out font-semibold text-[1.5rem] mr-1">
                        {user?.display_name}
                      </span>
                    </div>
                    <div className="flex pr-2 !text-xs !text-gray-500  font-medium">
                      <span className="flex items-center mb-2 mr-5 text-secondary-dark hover:text-primary">
                        <span className="mr-1">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 24 24"
                            fill="currentColor"
                            className="w-5 h-5"
                          >
                            <path
                              fill-rule="evenodd"
                              d="M11.54 22.351l.07.04.028.016a.76.76 0 00.723 0l.028-.015.071-.041a16.975 16.975 0 001.144-.742 19.58 19.58 0 002.683-2.282c1.944-1.99 3.963-4.98 3.963-8.827a8.25 8.25 0 00-16.5 0c0 3.846 2.02 6.837 3.963 8.827a19.58 19.58 0 002.682 2.282 16.975 16.975 0 001.145.742zM12 13.5a3 3 0 100-6 3 3 0 000 6z"
                              clip-rule="evenodd"
                            />
                          </svg>
                        </span>{" "}
                        {user?.country}
                      </span>
                      <span className="flex items-center mb-2 mr-5 text-secondary-dark text-sm hover:text-primary">
                        <span className="mr-1">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 24 24"
                            fill="currentColor"
                            className="w-5 h-5"
                          >
                            <path d="M1.5 8.67v8.58a3 3 0 003 3h15a3 3 0 003-3V8.67l-8.928 5.493a3 3 0 01-3.144 0L1.5 8.67z" />
                            <path d="M22.5 6.908V6.75a3 3 0 00-3-3h-15a3 3 0 00-3 3v.158l9.714 5.978a1.5 1.5 0 001.572 0L22.5 6.908z" />
                          </svg>
                        </span>{" "}
                        {user?.email}
                      </span>
                    </div>
                    <span
                      className={`${
                        user?.product === "premium"
                          ? "!bg-yellow-400 text-black-1"
                          : ""
                      } uppercase text-xs  my-2 inline-flex items-center justify-center text-secondary-inverse rounded-full bg-black-5 hover:bg-neutral-200 transition-all duration-200 ease-in-out px-3 py-1 t font-medium leading-normal`}
                    >
                      {user?.product}
                    </span>
                    <a
                      className="text-xs my-2"
                      target="_blank"
                      href={user?.uri}
                    >
                      View{" "}
                    </a>
                  </div>
                </div>
                <div className="flex flex-wrap justify-between">
                  <div className="flex flex-wrap items-center">
                    <span className=" mb-2 inline-flex items-center justify-center text-secondary-inverse rounded-full bg-black-5 hover:!text-black-1 hover:bg-neutral-200 transition-all duration-200 ease-in-out px-3 py-1 text-sm font-medium leading-normal">
                      {" "}
                      {user?.followers.total} Followers{" "}
                    </span>
                  </div>
                </div>
              </div>
            </div>
            <hr className="w-full h-px border-neutral-200" />
            <ul
              nav-tabs
              className="group flex flex-wrap items-stretch text-[1.15rem] font-semibold list-none border-b-2 border-transparent border-solid active-assignments"
            >
              <li className="flex mt-2 -mb-[2px]">
                <a
                  aria-controls="summary"
                  className="py-5 mr-1 sm:mr-3 lg:mr-10 transition-colors duration-200 ease-in-out border-b-2 border-transparent group-[.active-summary]:border-primary group-[.active-summary]:text-primary text-muted hover:border-primary"
                  href="javascript:void(0)"
                >
                  SUMMARY
                </a>
              </li>

              <li className="flex mt-2 -mb-[2px]">
                <a
                  aria-controls="marketing"
                  className="py-5 mr-1 sm:mr-3 uppercase lg:mr-10 transition-colors duration-200 ease-in-out border-b-2 border-transparent group-[.active-marketing]:border-primary group-[.active-marketing]:text-primary text-muted hover:border-primary"
                  href="javascript:void(0)"
                >
                  {" "}
                  Top 10 Tracks
                </a>
              </li>
              <li className="flex mt-2 -mb-[2px]">
                <a
                  aria-controls="followers"
                  className="py-5 mr-1 sm:mr-3 lg:mr-10 uppercase transition-colors duration-200 ease-in-out border-b-2 border-transparent group-[.active-followers]:border-primary group-[.active-followers]:text-primary text-muted hover:border-primary"
                  href="javascript:void(0)"
                >
                  {" "}
                  Top 10 Artists
                </a>
              </li>
              <li className="flex mt-2 -mb-[2px] group">
                <a
                  aria-controls="history"
                  className="py-5 mr-1 sm:mr-3 lg:mr-10 transition-colors uppercase duration-200 ease-in-out border-b-2 border-transparent group-[.active-history]:border-primary group-[.active-history]:text-primary text-muted hover:border-primary"
                  href="javascript:void(0)"
                >
                  {" "}
                  Playlists
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
