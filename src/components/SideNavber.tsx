/** @format */
"use client";

import { useEffect, useState } from "react";
import { Nav } from "./ui/nav";
import AdminLink from "@/configs/SideNavbars";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Button } from "./ui/button";
import { ChevronRight } from "lucide-react";
import { useWindowWidth } from "@react-hook/window-size";
import { usePathname, useRouter } from "next/navigation";
import Configs from "@/configs/SideNavbars";
import NavbarLinks from "@/props/SideNavbar";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "./ui/tooltip";

type Props = { role: string; userName: string; userImage: string };

export default function SideNavbar({ role, userName, userImage }: Props) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const pathname = usePathname();
  const onlyWidth = useWindowWidth();
  const mobileWidth = onlyWidth < 768;

  function toggleSidebar() {
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
    <div className="relative min-w-[80px] border-r px-3 pb-10 pt-24 sidebar">
      <div className="mb-6">
        <TooltipProvider>
          <Tooltip delayDuration={0}>
            <TooltipTrigger asChild>
              <div className="flex justify-center pl-4">
                <Avatar className="w-16 h-16">
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

      {/* Navigation Links */}
      <Nav isCollapsed={mobileWidth ? true : isCollapsed} links={Link} />
    </div>
  );
}
