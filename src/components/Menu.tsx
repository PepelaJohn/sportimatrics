import React, { useState, useEffect, useRef } from 'react';
import { ChevronDown, Music, User, PlayCircle, Settings, LogOut } from 'lucide-react';
import Link from 'next/link';

interface UserState {
  display_name?: string;
  images?: Array<{ url: string }>;
  [key: string]: any;
}

const SpotifyDropdownMenu = ({user}:{user:UserState}) => {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  
  // Helper function to get initials
  const getInitials = (name:string) => {
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase();
  };
  
  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Close dropdown when a link is clicked
  const handleLinkClick = () => {
    setIsOpen(false);
  };
  
  return (
    <div className="relative" ref={menuRef}>
      {/* User profile button */}
      <div 
        className="flex items-center space-x-2 p-2 rounded-full hover:bg-gray-800 cursor-pointer transition-all duration-200"
        onClick={toggleMenu}
      >
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
        {/* <span className="text-white font-medium">{user.display_name}</span> */}
        <ChevronDown 
          className={`text-white w-4 h-4 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} 
        />
      </div>
      
      {/* Dropdown menu */}
      {isOpen && (
        <div 
          className="absolute right-0 mt-2 w-56 rounded-md shadow-lg bg-gray-900 ring-1 ring-black ring-opacity-5 z-10 animate-in fade-in slide-in-from-top-5 duration-200"
        >
          <div className="py-1">
            <Link 
              href="/profile" 
              className="flex items-center px-4 py-3 text-sm text-gray-100 hover:bg-gray-800 hover:text-white group"
              onClick={handleLinkClick}
            >
              <User className="mr-3 h-5 w-5 text-gray-400 group-hover:text-green-500" />
              Profile
            </Link>
            <Link  onClick={handleLinkClick} href="/recommendations" className="flex items-center px-4 py-3 text-sm text-gray-100 hover:bg-gray-800 hover:text-white group">
              <Music className="mr-3 h-5 w-5 text-gray-400 group-hover:text-green-500" />
              Recommendations
            </Link>
            {/* 
            <a href="#now-playing" className="flex items-center px-4 py-3 text-sm text-gray-100 hover:bg-gray-800 hover:text-white group">
              <PlayCircle className="mr-3 h-5 w-5 text-gray-400 group-hover:text-green-500" />
              Now Playing
            </a> */}
            {/* <Link 
              href="/recommendations" 
              className="flex items-center px-4 py-3 text-sm text-gray-100 hover:bg-gray-800 hover:text-white group"
              onClick={handleLinkClick}
            >
              <Settings className="mr-3 h-5 w-5 text-gray-400 group-hover:text-green-500" />
              Settings
            </Link> */}
            <div className="border-t border-gray-700 my-1"></div>
            <Link 
              href="/logout" 
              className="flex items-center px-4 py-3 text-sm text-gray-100 hover:bg-gray-800 hover:text-white group"
              onClick={handleLinkClick}
            >
              <LogOut className="mr-3 h-5 w-5 text-gray-400 group-hover:text-green-500" />
              Log out
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};

export default SpotifyDropdownMenu;