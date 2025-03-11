"use client";
import React, { useState } from "react";
import Logo from "@/assets/Logo";
import Link from "next/link";
import { CgMenuRight } from "react-icons/cg";
import { CgClose } from "react-icons/cg";
import { CgLogOff} from "react-icons/cg";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const NavBar = () => {
  const [sidebar, setSideBar] = useState<boolean>(false);
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
    <nav className="w-full justify-center  z-50 text-white-1   text-xs fixed top-0 left-0 right-0 h-[100px] flex items-center">
      <div className="max-w-5xl  w-full h-full flex items-center ">
        <Link
          href={"/"}
          className="flex items-center justify-center flex-grow-0 flex-shrink-0 h-6 w-6 md:h-8 md:w-8"
        >
          <Logo></Logo>
        </Link>
        <div className="flex-1 justify-end hidden gap-5 md:flex items-center">
          {navlinks.map((link) => (
            <Link
              onClick={() => setSideBar(false)}
              key={link}
              href={link.split(" ").join("-").toLowerCase()}
            >
              {link}
            </Link>
          ))}
        </div>

        <DropdownMenu  >
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
              <Link className="flex text-red-500 items-center justify-between w-full" href={"/profile"}><p>Logout</p> <CgLogOff></CgLogOff></Link>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <div className="flex-1 max-md:flex hidden  items-center justify-end">
          <button
            onClick={() => setSideBar((prev) => !prev)}
            className="text-2xl"
          >
            <CgMenuRight></CgMenuRight>
          </button>
        </div>

        <aside
          style={style}
          className="fixed hidden z-50 max-md:flex flex-col  top-0 easeinOut right-0 bg-black min-h-[100vh] h-full w-[300px]"
        >
          <div className="flex items-center justify-center px-5 text-lg h-[100px]">
            <button onClick={() => setSideBar(false)}>
              <CgClose></CgClose>
            </button>
          </div>
          <div className="flex-1 flex flex-col text-lg leading-10 gap-5 xl items-center">
            <Link onClick={() => setSideBar(false)} href={"/"}>
              Home
            </Link>
            {navlinks.map((link) => (
              <Link
                onClick={() => setSideBar(false)}
                key={link}
                href={link.split(" ").join("-").toLowerCase()}
              >
                {link}
              </Link>
            ))}
            <Link href={"/profile"}>Profile</Link>
          </div>
        </aside>
      </div>
    </nav>
  );
};

export default NavBar;
