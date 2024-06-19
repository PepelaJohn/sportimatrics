"use client";
import React, { useEffect, useRef, useState } from "react";
import Logo from "@/assets/Logo";
import Link from "next/link";
import { MdSearch } from "react-icons/md";
import { IoMdLogOut } from "react-icons/io";
import { usePathname } from "next/navigation";
import { getCookie, getInitials } from "@/lib/utils";
import { getProfile, searchSpotify } from "@/api";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { CLOSE_DISPLAY } from "@/constants";
import Popup from "./Popup";

const NavBar = () => {
  const [sidebar, setSideBar] = useState<boolean>(false);

  const [searchParams, setSearchParams] = useState<string>("");

  const [user, setUser] = useState<promiseUser>();
  const pathname = usePathname();
  const router = useRouter();
  const timoeoutRef = useRef<NodeJS.Timeout | null>(null);
  const popupRef = useRef<any>(null);
  const [loggedIn, setLoggedIn] = useState<boolean>(false);
  const dispatch = useDispatch();
  // console.log(document.cookie.split(',')[0].split(' '));

  // console.log(typeof(dispatch))
  const popup = useSelector((state: any) => state.info);
  useEffect(() => {
    if (popup.show) {
      // use different variable as this whill happen after variable has changed

      setTimeout(() => {
        popupRef.current.classList.add("translateandFade");
      }, 1800);

      timoeoutRef.current = setTimeout(() => {
        dispatch({ type: CLOSE_DISPLAY });
       
        
      }, 2000);
    }

    return () => {
      clearTimeout(timoeoutRef.current!);
    };
  }, [popup.show]);

  useEffect(() => {
    if (!!localStorage.getItem("user") || !!getCookie("_gtPaotwcsA")) {
      setLoggedIn(true);
      let user;
      if (!!localStorage.getItem("user")) {
        user = JSON.parse(localStorage.getItem("user")!);
        setUser(user);
      } else {
        user = getProfile(dispatch as React.Dispatch<UnknownAction>);
        user.then(function (result: any) {
          if (!!result?.display_name) {
            setUser(result);
            localStorage.setItem("user", JSON.stringify(result));
          }
        });
      }
    } else {
      setLoggedIn(false);
    }
  }, []);

  let style = {
    right: sidebar ? 0 : -300,
  };
  let navlinks = [
    "Top Tracks",
    "Top Artists",
    "Top Genres",
    "Recent Tracks",
    "Podcasts",
  ];
  return (
    <>
      <nav
        className={`w-full ${
          pathname === "/" ? " bg-transparent " : "bg-black-3 shadow-2xl "
        } easeinOut justify-center  !z-50 text-white   text-12 fixed top-0 left-0 right-0 h-[100px] flex items-center`}
      >
        <div className="max-w-5xl   max-sm:px-4 sm:px-14  w-full h-full flex items-center ">
          <Link
            href={"/"}
            className="flex items-center justify-center flex-grow-0 flex-shrink-0 h-6 w-6 md:h-8 md:w-8"
          >
            <Logo></Logo>
          </Link>
          {loggedIn && (
            <div className="flex-1 justify-end hidden  text-white-2 text-[10px]  easeinOut uppercase gap-5 md:flex items-center">
              {navlinks.map((link) => (
                <p key={link + "x"} className="hover:text-white-1  easeinOut">
                  <Link
                    onClick={() => setSideBar(false)}
                    key={link}
                    href={link.split(" ").join("-").toLowerCase()}
                  >
                    {link}
                  </Link>
                </p>
              ))}

              <form
                onSubmit={(e) => {
                  e.preventDefault();

                  router.push(`/search?q=${searchParams.split(" ").join("+")}`);
                  setSearchParams("");
                }}
                className="bg-black-5 h-8  items-center pr-3 pl-3 rounded-full w-[150px] flex"
              >
                <input
                  onChange={(e) => setSearchParams(e.target.value)}
                  className="bg-transparent flex-1 !text-xs outline-none border-none w-[100px]"
                  type="text"
                  value={searchParams!}
                />
                <MdSearch className="!text-[15px] cursor-pointer   h-full flex items-center " />
              </form>
            </div>
          )}

          <Link
            className={`ml-5 hidden text-[10px]  ${
              !loggedIn
                ? "bg-green-400  rounded-full h-8  flex justify-center items-center px-5 text-black-1 "
                : " !text-white-1 "
            }  !hover:text-white-1 easeinOut ml-auto text-white-1 uppercase md:flex`}
            href={loggedIn ? "/profile" : "/auth"}
          >
            {loggedIn ? (
              <span className="w-8 h-8 rounded-full ml-5 bg-black-5 text-sm flex items-center justify-center">
                {!!user?.display_name ? getInitials(user?.display_name!) : ""}
              </span>
            ) : (
              "Login"
            )}
          </Link>

          <div className="flex-1 max-md:flex hidden  text-white-1  easeinOut uppercase items-center justify-end">
            <button
              onClick={() => setSideBar((prev) => !prev)}
              className="rounded-lg bg-black-5 h-8 w-16 text-[10px]"
            >
              Menu
            </button>
          </div>

          <aside
            style={style}
            className="fixed hidden z-50 max-md:flex text-white-1 flex-col bg-black-1   top-0 easeinOut right-0 bg-black min-h-[100vh] h-full w-[300px]"
          >
            <div className="flex items-center justify-end px-5 text-[30px] h-[100px]">
              <button onClick={() => setSideBar(false)}>&times;</button>
            </div>
            <div className="flex-1 flex flex-col text-sm leading-10 gap-5 xl items-start pl-10">
              <Link onClick={() => setSideBar(false)} href={"/"}>
                Home
              </Link>
              {navlinks.map((link, i) => (
                <Link
                  onClick={() => setSideBar(false)}
                  key={i}
                  href={link.split(" ").join("-").toLowerCase()}
                >
                  {link}
                </Link>
              ))}
              <Link href={"/profile"}>Profile</Link>
              {loggedIn && (
                <div className="mt-auto flex items-center w-full justify-between pr-10 mb-5">
                  <Link href={"/logout"}>Logout</Link>
                  <IoMdLogOut className="cursor-pointer"></IoMdLogOut>
                </div>
              )}
            </div>
          </aside>
        </div>
      </nav>
      {popup.show && <Popup popup={popup} popupRef={popupRef} />}
    </>
  );
};

export default NavBar;
