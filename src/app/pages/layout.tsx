/** @format */

import type { Metadata } from "next";
import { Kanit } from "next/font/google";
import { cn } from "../../lib/utils";
import SideNavbar from "@/components/SideNavber";
import { Toaster } from "@/components/ui/toaster";
import { authOptions } from "../api/auth/[...nextauth]/route";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

export default async function RootLayout({
  children
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions)
  if (!session) {
    redirect("/")
  }

  return (
    <div className="flex w-full">
      {/* Sidebar with 20% width */}
      <div id="w-id" className="fixed top-0 left-0 h-full"> {/* Sidebar takes 20% */}
        <SideNavbar
          role={session.user.role}
          userName={session.user.username}
          userImage={`https://icon-library.com/images/no-profile-pic-icon/no-profile-pic-icon-11.jpg`}
        />
      </div>

      {/* Main content area with 20% width */}
      <div id="cont" className="p-8"> {/* Content area takes 20% */}
        {children}
      </div>
      <Toaster />
    </div>
  );
}
