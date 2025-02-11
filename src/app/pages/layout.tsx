/** @format */

import SideNavbar from "@/components/SideNavber";
import { Toaster } from "@/components/ui/toaster";
import { authOptions } from "../api/auth/[...nextauth]/route";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import Employees from "@/props/Employees";

export default async function RootLayout({
  children
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions)
  let userData: Employees = null;
  if (!session) {
    redirect("/")
  }

  if (session.user.role == "user") {
    const data = await fetch(`${process.env.NEXTAUTH_URL}/api/employees/get`)
    const employees = await data.json() as Employees[]
    const user = employees.filter(x => x.username == session.user.username)[0]
    userData = user
  }

  return (
    <div className="flex w-full">
      <div id="w-id" className="fixed top-0 left-0 h-full">
        {session.user.role == "admin" ? (
          <SideNavbar
            role={session.user.role}
            userName={session.user.username}
            userImage={"/no-profile.jpg"}
          />
        ) : (
          <SideNavbar
            role={session.user.role}
            userName={(session.user.role == "admin" ? (`${userData.username}`) : (`${userData?.profile.name}`))}
            userImage={(session.user.role == "admin" ? ("/no-profile.jpg") : (`${userData?.profile.image}`))}
          />
        )}
      </div>

      <div id="cont" className="p-8">
        {children}
      </div>
      <Toaster />
    </div>
  );
}