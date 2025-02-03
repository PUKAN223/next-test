import NextAuth, { DefaultSession, NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import adminAccount from "@/configs/AdminAccount";
import Employees from "@/props/Employees";

declare module "next-auth" {
    interface Session {
        user: {
            username?: string;
            password?: string;
            role?: string;
        } & DefaultSession["user"];
    }
    interface User {
        username?: string;
        password?: string;
        role?: string;
    }
}

declare module "next-auth/jwt" {
    interface JWT {
        username?: string;
        password?: string;
        role?: string;
    }
}

export const authOptions: NextAuthOptions = {
    providers: [
        CredentialsProvider({
            name: "Credentials",
            credentials: {
                username: { label: "Username", type: "text" },
                password: { label: "Password", type: "password" },
                role: { label: "Role", type: "text" }
            },
            async authorize(credentials) {
                if (!credentials) return null;

                // Admin authentication
                if (credentials.role === "admin") {
                    const admin = adminAccount.find(
                        (x) => x.username === credentials.username && x.password === credentials.password
                    );
                    if (admin) {
                        return { id: "01", username: admin.username, password: admin.password, role: admin.role };
                    }
                }

                // User authentication
                if (credentials.role === "user") {
                    try {
                        const allUser = await fetch(`${process.env.NEXTAUTH_URL}/api/employees/get`);
                        const users = (await allUser.json()) as Employees[];
                        const user = users.find(
                            (x) => x.username === credentials.username && x.password === credentials.password
                        );
                        if (user) {
                            return { id: (user as any)._id, username: user.username, password: user.password, role: credentials.role };
                        }
                    } catch (error) {
                        console.error("Failed to fetch users:", error);
                        return null;
                    }
                }

                return null;
            }
        })
    ],
    pages: {
        signIn: "/",
        signOut: "/"
    },
    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                token.username = user.username;
                token.password = user.password;
                token.role = user.role;
            }
            return token;
        },
        async session({ session, token }) {
            if (session.user) {
                session.user.username = token.username;
                session.user.password = token.password;
                session.user.role = token.role;
            }
            return session;
        },
    },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };