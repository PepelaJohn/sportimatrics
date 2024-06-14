"use client";
import React, { useEffect, useState } from "react";
import Logo from "@/assets/Logo";
import Link from "next/link";
import { MdSearch } from "react-icons/md";

import { usePathname } from "next/navigation";
import { getCookie, getInitials } from "@/lib/utils";
import { getProfile } from "@/api";

const NavBar = () => {
  const [sidebar, setSideBar] = useState<boolean>(false);

  const [user, setUser] = useState<promiseUser>();
  const pathname = usePathname();

  const [loggedIn, setLoggedIn] = useState<boolean>(false);

  // console.log(document.cookie.split(',')[0].split(' '));

  useEffect(() => {
    if (!!localStorage.getItem("user") || !!getCookie("_gtPaotwcsA")) {
      setLoggedIn(true);
      let user;
      if (!!localStorage.getItem("user")) {
        user = JSON.parse(localStorage.getItem("user")!);
        setUser(user);
      } else {
        user = getProfile();
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

            <form className="bg-black-5 h-8  items-center pr-3 pl-3 rounded-full w-[150px] flex">
              <input
                className="bg-transparent flex-1 !text-xs outline-none border-none w-[100px]"
                type="text"
                name=""
                id=""
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

        {/* <DropdownMenu  >
          <DropdownMenuTrigger>
            <p className="ml-5 hidden  md:flex"> Menu </p>
          </DropdownMenuTrigger>
          <DropdownMenuContent  className="shadow-md bg-black bg-r border">
            <DropdownMenuLabel>My Account</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <Link href={"/profile"}>Profile</Link>
            </DropdownMenuItem>
            
            <DropdownMenuItem>Upgrade</DropdownMenuItem>
            <DropdownMenuItem>
              <Link className="flex text-red-500 items-center justify-between w-full" href={"/profile"}>Logout</Link>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu> */}

        <div className="flex-1 max-md:flex hidden  !text-[#747474]  easeinOut uppercase items-center justify-end">
          <button onClick={() => setSideBar((prev) => !prev)} className="">
            Menu
          </button>
        </div>

        <aside
          style={style}
          className="fixed hidden z-50 max-md:flex flex-col bg-black-1   top-0 easeinOut right-0 bg-black min-h-[100vh] h-full w-[300px]"
        >
          <div className="flex items-center justify-center px-5 text-lg h-[100px]">
            <button onClick={() => setSideBar(false)}>&times;</button>
          </div>
          <div className="flex-1 flex flex-col text-lg leading-10 gap-5 xl items-center">
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
            <Link href={"/profile"}>
              {user?.display_name && (
                <span className="w-8 h-8 rounded-full bg-black-5 text-sm flex items-center justify-center">
                  {getInitials(user?.display_name!)}
                </span>
              )}
            </Link>
          </div>
        </aside>
      </div>
    </nav>
  );
};

export default NavBar;
