import { LifeBuoy, LogOut, User } from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import React from "react";
import { FiGithub } from "react-icons/fi";
import { Logout } from "@/api";
import { useDispatch } from "react-redux";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function DropdownMenuDemo({
  children,
}: {
  children: React.ReactNode;
}) {
  const dispatch = useDispatch();
  const router = useRouter();
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>{children}</DropdownMenuTrigger>
      <DropdownMenuContent className="w-56 text-white-1 bg-black-3">
        <DropdownMenuLabel>My Account</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem>
            <Link className="flex w-full " href={"/profile"}>
              <User className="mr-2 h-4 w-4" />
              <span>Profile</span>
            </Link>
            {/* <DropdownMenuShortcut>⇧⌘P</DropdownMenuShortcut> */}
          </DropdownMenuItem>
        </DropdownMenuGroup>

        <DropdownMenuItem>
          <LifeBuoy className="mr-2 h-4 w-4" />
          <Link href={"/donate"}>Donate</Link>
        </DropdownMenuItem>

        <DropdownMenuSeparator />
        <DropdownMenuItem className="cursor-pointer">
          <LogOut className="mr-2 h-4 w-4" />
          <Link className="" href={"/logout"}>
            Log out
          </Link>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
