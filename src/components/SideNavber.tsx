/** @format */
"use client";

import { useEffect, useState } from "react";
import { Nav } from "./ui/nav";
import AdminLink from "@/configs/SideNavbars";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Button } from "./ui/button";
import { ChevronRight, LogOutIcon } from "lucide-react";
import { useWindowWidth } from "@react-hook/window-size";
import { usePathname, useRouter } from "next/navigation";
import Configs from "@/configs/SideNavbars";
import NavbarLinks from "@/props/SideNavbar";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "./ui/tooltip";
import { signOut } from "next-auth/react";

type Props = { role: string; userName: string; userImage: string };

export default function SideNavbar({ role, userName, userImage }: Props) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const pathname = usePathname();
  const onlyWidth = useWindowWidth();
  const mobileWidth = onlyWidth < 1100;

  useEffect(() => {
    document.getElementById("w-id").style.width = "12%"
    document.getElementById("cont").style.marginLeft = "12%"
    document.getElementById("cont").style.width = "88%"
  }, [])

  function toggleSidebar() {
    if (isCollapsed) {
      document.getElementById("w-id").style.width = "12%"
      document.getElementById("cont").style.marginLeft = "12%"
      document.getElementById("cont").style.width = "88%"
    } else {
      document.getElementById("w-id").style.width = "8%"
      document.getElementById("cont").style.marginLeft = "8%"
      document.getElementById("cont").style.width = "92%"
    }
    setIsCollapsed(!isCollapsed);
  }

  let Link: NavbarLinks[];
  if (role === "user") {
    Link = [];
  } else {
    if (pathname.includes("/admin")) {
      Link = AdminLink;
    } else {
      Link = [];
    }
  }

  return (
    <div className="sticky min-w-[80px] border-r px-3 pb-10 pt-24 sidebar flex flex-col justify-between h-screen fixed top-0 left-0 bottom-0">
      <div className="mb-6">
        <TooltipProvider>
          <Tooltip delayDuration={0}>
            <TooltipTrigger asChild>
              <div className="flex justify-center pl-4">
                <Avatar className="w-16 h-16 translate-x-[-5px]">
                  {userImage ? (
                    <AvatarImage src={userImage} alt={userName} />
                  ) : (
                    <AvatarFallback>{userName?.[0]}</AvatarFallback>
                  )}
                </Avatar>
              </div>
            </TooltipTrigger>
            <TooltipContent side="right" className="flex items-center gap-4">
              {userName}
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>

      {!mobileWidth && (
        <div className="absolute right-[-20px] top-7">
          <Button
            onClick={toggleSidebar}
            variant="secondary"
            className="rounded-full p-2"
          >
            <ChevronRight />
          </Button>
        </div>
      )}

      <Nav isCollapsed={mobileWidth ? true : isCollapsed} links={Link} />
      <div className="h-full flex flex-col">
        <div className="w-full"></div>
        <Button className="w-full" variant={"ghost"} onClick={() => {
          signOut({ redirect: true, callbackUrl: "/" })
        }}>
          <LogOutIcon />
        </Button>
      </div>
    </div>
  );
}
