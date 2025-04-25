"use client";

import { useUser } from "@clerk/nextjs";
import Image from "next/image";
import { useEffect, useState } from "react";

const Navbar = () => {
  const { isLoaded, user } = useUser();
  const [role, setRole] = useState<string>("");
  const [userName, setUserName] = useState<string>("User");
  
  useEffect(() => {
    // Get user role from Clerk user metadata
    if (isLoaded && user) {
      const userRole = user.publicMetadata.role as string;
      if (userRole) {
        setRole(userRole);
        
        // Set user name from Clerk user data
        if (user.fullName) {
          setUserName(user.fullName);
        } else if (user.username) {
          setUserName(user.username);
        } else if (user.emailAddresses && user.emailAddresses.length > 0) {
          setUserName(user.emailAddresses[0].emailAddress.split('@')[0]);
        } else {
          // Fallback to role-based names if no user info is available
          switch(userRole) {
            case 'admin':
              setUserName('Admin User');
              break;
            case 'teacher':
              setUserName('Teacher User');
              break;
            case 'student':
              setUserName('Student User');
              break;
            case 'parent':
              setUserName('Parent User');
              break;
            default:
              setUserName('Guest User');
          }
        }
      }
    }
  }, [isLoaded, user]);
  return (
    <div className="flex items-center justify-between p-4">
      {/* SEARCH BAR */}
      <div className="hidden md:flex items-center gap-2 text-xs rounded-full ring-[1.5px] ring-gray-300 px-2">
        <Image src="/search.png" alt="" width={14} height={14} />
        <input
          type="text"
          placeholder="Search..."
          className="w-[200px] p-2 bg-transparent outline-none"
        />
      </div>
      {/* ICONS AND USER */}
      <div className="flex items-center gap-6 justify-end w-full">
        <div className="bg-white rounded-full w-7 h-7 flex items-center justify-center cursor-pointer">
          <Image src="/message.png" alt="" width={20} height={20} />
        </div>
        <div className="bg-white rounded-full w-7 h-7 flex items-center justify-center cursor-pointer relative">
          <Image src="/announcement.png" alt="" width={20} height={20} />
          <div className="absolute -top-3 -right-3 w-5 h-5 flex items-center justify-center bg-purple-500 text-white rounded-full text-xs">
            1
          </div>
        </div>
        <div className="flex flex-col">
          <span className="text-xs leading-3 font-medium">{userName}</span>
          <span className="text-[10px] text-gray-500 text-right">
            {role}
          </span>
        </div>
        <div className="rounded-full bg-gray-200 w-9 h-9 flex items-center justify-center overflow-hidden">
          <Image src="/avatar.png" alt="User" width={36} height={36} className="rounded-full" />
        </div>
      </div>
    </div>
  );
};

export default Navbar;
