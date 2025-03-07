"use client";
import Logo from '../assets/logom.png'
import React, { useEffect, useCallback, useState, useRef } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { motion, AnimatePresence } from "framer-motion";
import { getCookie, getInitials } from "@/lib/utils";
import { CLOSE_DISPLAY } from "@/constants";
import Popup from "./Popup";
import DropdownMenuDemo from "./DropDown";
import { 
  Search, 
  Menu, 
  X, 
  LogOut, 
  Music, 
  User, 
  Clock, 
  BarChart2, 
  Upload 
} from "lucide-react";

// Type definitions
interface NavLink {
  name: string;
  href: string;
  icon: React.ReactNode;
  highlight?: boolean;
}

interface UserState {
  display_name?: string;
  images?: Array<{ url: string }>;
  [key: string]: any;
}

interface RootState {
  user: UserState;
  info: {
    show: boolean;
    message: string;
    type: string;
  };
}

const NavBar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [loggedIn, setLoggedIn] = useState<boolean>(false);
  
  const pathname = usePathname();
  const router = useRouter();
  const dispatch = useDispatch();
  
  const popup = useSelector((state: any) => state.info);
  const user = useSelector((state: RootState) => state.user);
   const popupRef = useRef<any>(null);

  const navLinks: NavLink[] = [
    { 
      name: "Top Tracks", 
      href: "/top-tracks?range=short_term",
      icon: <Music className="w-4 h-4" />
    },
    { 
      name: "Top Artists", 
      href: "/top-artists?range=short_term",
      icon: <User className="w-4 h-4" />
    },
    { 
      name: "Recent Tracks", 
      href: "/recent-tracks",
      icon: <Clock className="w-4 h-4" />
    },
    { 
      name: "Insights", 
      href: "/insights?t=artists",
      icon: <BarChart2 className="w-4 h-4" />
    },
    { 
      name: "Upload", 
      href: "/upload",
      icon: <Upload className="w-4 h-4" />,
      highlight: true
    }
  ];


  useEffect(() => {
    let dismissTimer: NodeJS.Timeout;
    let fadeTimer: NodeJS.Timeout;
    
    if (popup.show) {
      fadeTimer = setTimeout(() => {
        document.querySelector('.popup-container')?.classList.add("fade-out");
      }, 2800);
      
      dismissTimer = setTimeout(() => {
        dispatch({ type: CLOSE_DISPLAY });
      }, 3000);
    }
    
    return () => {
      clearTimeout(dismissTimer);
      clearTimeout(fadeTimer);
    };
  }, [popup.show, dispatch]);


  useEffect(() => {
    setLoggedIn(!!Object.keys(user).length || !!getCookie("_gtPaotwcsA"));
  }, []);


  const handleSearchSubmit = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery("");
      setIsMenuOpen(false);
    }
  }, [searchQuery, router]);


  const toggleMenu = useCallback(() => {
    setIsMenuOpen(prev => !prev);
  }, []);

  return (
    <>
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ type: "spring", stiffness: 100, damping: 20 }}
        className={`fixed top-0 left-0 right-0 z-50 text-white-1 ${
          pathname === "/" ? "bg-black/70 backdrop-blur-md" : "bg-black/90 backdrop-blur-md shadow-xl"
        } h-16 md:h-20`}
      >
        <div className="container mx-auto h-full flex items-center justify-between px-4">
     
          <Link 
            href="/"
            className="flex items-center"
          >
            <div className="flex items-center justify-center relative w-8 h-8 md:w-10 md:h-10">
              <span className="absolute text-green-400 font-bold text-xl md:text-2xl">
                <img src={Logo.src} alt="" className='w-11/12 object-' />
              </span>
              {/* <div className="w-full h-full rounded-full border-2 border-green-400/30 animate-pulse"></div> */}
            </div>
            <span className="ml-2 text-white font-semibold tracking-wider text-white-1   hidden sm:block">MUSIMETER</span>
          </Link>

       
          {loggedIn && (
            <div className="hidden md:flex items-center space-x-6">
              {navLinks.map((link) => {
                return <Link
                key={link.name}
                href={link.href}
                className={`group flex items-center space-x-1 text-xs uppercase easeinOut tracking-wide transition-colors ${
                  (link.href.startsWith(pathname) && !link.highlight && pathname !== "/")
                    ? "!text-green-400 hover:text-white-1" 
                    : " text-white-1"
                } ${
                  link.highlight 
                    ? "bg-amber-500 px-3 py-1 rounded-full text-black hover:bg-amber-400" 
                    : ""
                }`}
              >
                <span className={`${!link.highlight ? "" : ""}`}>
                  {link.name}
                </span>
              </Link>
              })}

         
              <form 
                onSubmit={handleSearchSubmit}
                className="relative flex items-center"
              >
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search..."
                  className="bg-gray-900/80 rounded-full py-1.5 pl-3  pr-8 text-xs w-36 focus:w-48 transition-all duration-300 focus:outline-none focus:ring-1 focus:ring-green-500"
                />
                <button 
                  type="submit" 
                  className="absolute right-2 text-gray-400 hover:text-white"
                >
                  <Search className="w-4 h-4" />
                </button>
              </form>

           
              <DropdownMenuDemo>
                <div className="flex items-center cursor-pointer">
                  <div className="h-8 w-8 rounded-full overflow-hidden bg-gray-800 border border-gray-700 flex items-center justify-center text-xs">
                    {user?.images?.length ? (
                      <img
                        src={user.images[0].url}
                        alt={user.display_name || "User"}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <span>{user?.display_name ? getInitials(user.display_name) : ""}</span>
                    )}
                  </div>
                </div>
              </DropdownMenuDemo>
            </div>
          )}

        
          <div className="md:hidden flex items-center space-x-4">
            {loggedIn && (
              <>
                
                
                <DropdownMenuDemo>
                  <div className="h-8 w-8 rounded-full overflow-hidden bg-gray-800 border border-gray-700 flex items-center justify-center text-xs">
                    {user?.images?.length ? (
                      <img
                        src={user.images[0].url}
                        alt={user.display_name || "User"}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <span>{user?.display_name ? getInitials(user.display_name) : ""}</span>
                    )}
                  </div>
                </DropdownMenuDemo>
              </>
            )}
            
            {!loggedIn ? (
              <Link
                href="/auth"
                className="bg-green-500 hover:bg-green-400 transition-colors duration-200 px-4 py-1.5 rounded-full text-xs font-medium uppercase tracking-wide"
              >
                Login
              </Link>
            ) : (
              <button
                onClick={toggleMenu}
                className="p-2 text-gray-400 hover:text-white transition-colors"
                aria-label="Toggle menu"
              >
                {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            )}
          </div>

       
          {!loggedIn && (
            <Link
              href="/auth"
              className="bg-green-500 hover:bg-green-400 transition-colors duration-200 px-5 py-2 rounded-full text-sm font-medium uppercase tracking-wide hidden md:block"
            >
              Login
            </Link>
          )}
        </div>
      </motion.nav>

     
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="fixed top-16 inset-x-0 z-40 bg-gray-900  backdrop-blur-md text-white-1 md:hidden"
          >
            <div className="px-4 py-6 space-y-4">
              {/* Mobile Search */}
              <form 
                onSubmit={handleSearchSubmit}
                className="relative  flex items-center"
              >
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search..."
                  className="bg-gray-900 rounded-md py-2 pl-4 pr-10 text-sm w-full focus:outline-none focus:ring-1 focus:ring-green-500"
                />
                <button 
                  type="submit" 
                  className="absolute right-3 text-gray-400 hover:text-white"
                >
                  <Search className="w-5 h-5" />
                </button>
              </form>

              {/* Navigation Links */}
              <div className="space-y-2">
                <Link
                  href="/"
                  onClick={() => setIsMenuOpen(false)}
                  className={`flex items-center space-x-3 p-3 rounded-md ${
                    pathname === "/" ? "bg-gray-800 text-white" : "text-gray-300 hover:bg-gray-800/50"
                  }`}
                >
                  <span className="text-green-400">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                    </svg>
                  </span>
                  <span>Home</span>
                </Link>
                
                {navLinks.map((link) => (
                  <Link
                    key={link.name}
                    href={link.href}
                    onClick={() => setIsMenuOpen(false)}
                    className={`flex items-center space-x-3 p-3 rounded-md ${
                      pathname.includes(link.href.split("?")[0])
                        ? "bg-gray-800 text-white"
                        : link.highlight
                          ? "bg-amber-500/20 text-amber-500"
                          : "text-gray-300 hover:bg-gray-800/50"
                    }`}
                  >
                    <span className={link.highlight ? "text-amber-500" : "text-green-400"}>
                      {link.icon}
                    </span>
                    <span>{link.name}</span>
                  </Link>
                ))}
                
                {/* Profile Link */}
                <Link
                  href="/profile"
                  onClick={() => setIsMenuOpen(false)}
                  className={`flex items-center space-x-3 p-3 rounded-md ${
                    pathname === "/profile" ? "bg-gray-800 text-white" : "text-gray-300 hover:bg-gray-800/50"
                  }`}
                >
                  <span className="text-green-400">
                    <User className="w-5 h-5" />
                  </span>
                  <span>Profile</span>
                </Link>
                
                {/* Logout Button */}
                <Link
                  href="/logout"
                  onClick={() => setIsMenuOpen(false)}
                  className="flex items-center justify-between w-full p-3 text-red-400 hover:bg-gray-800/50 rounded-md"
                >
                  <div className="flex items-center space-x-3">
                    <LogOut className="w-5 h-5" />
                    <span>Logout</span>
                  </div>
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

    
      <AnimatePresence>
        {popup.show && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="popup-container"
          >
            <Popup popup={popup} popupRef={popupRef} />
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default NavBar;