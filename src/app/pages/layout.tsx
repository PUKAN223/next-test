/** @format */

import type { Metadata } from "next";
import { Kanit } from "next/font/google";
import "../globals.css";
import { cn } from "../../lib/utils";
import SideNavbar from "@/components/SideNavber";
import { Toaster } from "@/components/ui/toaster"
import { authOptions } from "../api/auth/[...nextauth]/route";
import { getServerSession } from "next-auth";

const inter = Kanit({
  weight: ['400', '700'],
  style: ['normal', 'italic'],
  subsets: ['latin'],
  display: 'swap',
});

export const metadata: Metadata = {
  title: "Stock Management",
  description: "Generated by create next app"
};

export default async function RootLayout({
  children
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions)
  return (
    <html lang="en">
      <meta
        name="format-detection"
        content="telephone=no, date=no, email=no, address=no"
      />
      <body
        className={cn(
          "min-h-screen w-full bg-white text-black flex ",
          inter.className,
          {
            "debug-screens": process.env.NODE_ENV === "development"
          }
        )}
      >
        <div className="flex w-full">
          <SideNavbar role={session.user.role} userName={session.user.username} userImage={"https://ui.shadcn.com/avatars/shadcn.jpg"} />
          <div className="p-8 w-full">{children}</div>
          <Toaster />
        </div>
      </body>
    </html>
  );
}
