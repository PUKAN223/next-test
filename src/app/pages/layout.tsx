/** @format */

import type { Metadata } from "next";
import { Kanit } from "next/font/google";
import { cn } from "../../lib/utils";
import SideNavbar from "@/components/SideNavber";
import { Toaster } from "@/components/ui/toaster";
import { authOptions } from "../api/auth/[...nextauth]/route";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import Nofications from "@/components/Nofications";

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
      <div id="w-id" className="fixed top-0 left-0 h-full">
        <SideNavbar
          role={session.user.role}
          userName={session.user.username}
          userImage={"/no-profile.jpg"}
        />
      </div>

      <div id="cont" className="p-8">
        {children}
      </div>
      <Toaster />
    </div>
  );
}