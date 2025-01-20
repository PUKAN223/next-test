/** @format */

import type { Metadata } from "next";
import { Kanit } from "next/font/google";
import "./globals.css";
import SideNavbar from "@/components/SideNavber";
import { Toaster } from "@/components/ui/sonner"
import SessionProvider from "@/components/SessionProviders";
import { getServerSession } from "next-auth";
import { authOptions } from "./api/auth/[...nextauth]/route";
import { getServerSideProps } from "next/dist/build/templates/pages";
import Wrap from "@/components/Wrap";

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
        <html>
            <body className={inter.className}>
                <SessionProvider session={session}>
                    {children}
                    <Toaster />
                </SessionProvider>
            </body>
        </html>
    )
}
