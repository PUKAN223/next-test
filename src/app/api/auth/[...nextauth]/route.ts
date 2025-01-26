import NextAuth, { DefaultSession, NextAuthOptions } from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import adminAccount from "@/configs/AdminAccount";

declare module "next-auth" {
    interface Session {
        user: {
            username?: string
            password?: string;
            role?: string
        } & DefaultSession["user"]
    }
    interface User {
        username?: string
        password?: string;
        role?: string
    }
}

declare module "next-auth/jwt" {
    interface JWT {
        username?: string
        password?: string;
        role?: string
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
                if (credentials.role == "admin" && adminAccount.some(x => x.role == credentials.role) && adminAccount.some(x => x.username == credentials.username && adminAccount.some(x => x.password == credentials.password))) {
                    return { id: "01", username: credentials.username, password: credentials.password, role: credentials.role }
                }
                else if (credentials.role == "user") {
                    return { id: "01", username: credentials.username, password: credentials.password, role: "user" }
                }
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
                token.username = user.username
                token.password = user.password;
                token.role = user.role
            }
            return token;
        },
        async session({ session, token }) {
            if (session.user) {
                session.user.username = token.username
                session.user.password = token.password;
                session.user.role = token.role;
            }
            return session;
        },
    },
}

const handler = NextAuth(authOptions)

export { handler as GET, handler as POST }

