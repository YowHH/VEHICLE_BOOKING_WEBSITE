import NextAuth, { customFetch } from "next-auth"
import Credentials from "next-auth/providers/credentials"
import connectDb from "./lib/db"
import User from "./models/user.models"
import bcrypt from "bcryptjs"
import Google from "next-auth/providers/google"
import { ProxyAgent, fetch as undiciFetch } from "undici"

const dispatcher = new ProxyAgent("http://127.0.0.1:57519")
function proxyFetch(...args: Parameters<typeof fetch>): ReturnType<typeof fetch> {
  return undiciFetch(args[0], { ...args[1], dispatcher }) as any
}

export const { handlers, signIn, signOut, auth } = NextAuth({

    providers: [
        Credentials({
        credentials: {
            email: { type: "email", label: "Email", placeholder: "johndoe@gmail.com" },
            password: { type: "password", label: "Password", placeholder: "*****" },
        },
        async authorize(credentials) {
            if (!credentials?.email || !credentials?.password) return null;
            
            const email = credentials.email
            const password = credentials.password as string
            await connectDb()
            const user = await User.findOne({ email })
            
            if (!user) return null;
            
            const isMatch = await bcrypt.compare(password, user.password)
            if (!isMatch) return null;
            
            return {
            id: user._id.toString(), 
            email: user.email,
            role: user.role
            }
        },
        }),
        Google({
        clientId: process.env.AUTH_GOOGLE_ID,
        clientSecret: process.env.AUTH_GOOGLE_SECRET,
        authorization: {
            url: "https://accounts.google.com/o/oauth2/v2/auth",
            params: { prompt: "consent", access_type: "offline", response_type: "code" }
        },
        token: "https://oauth2.googleapis.com/token",
        userinfo: "https://openidconnect.googleapis.com/v1/userinfo",
        [customFetch]: proxyFetch,
        })
    ],
    callbacks: {
        async signIn({ user, account }) {
        if (account?.provider === "google") {
            await connectDb();
            let dbUser = await User.findOne({ email: user.email });
            
            if (!dbUser) {
            dbUser = await User.create({
                name: user.name,
                email: user.email
            });
            }
            user.id = dbUser._id.toString();
            (user as any).role = dbUser.role;
        }
        return true;
        },
        async jwt({ token, user }) {
        if (user) {
            token.name = user.name;
            token.id = user.id;
            token.email = user.email;
            token.role = (user as any).role;
        }
        return token;
        },
        async session({ token, session }) {
        if (session.user) {
            session.user.name = token.name;
            session.user.id = token.id as string;
            session.user.email = token.email as string;
            (session.user as any).role = token.role as string;
        }
        return session;
        },
    },
    pages: {
        signIn: "/signin",
        error: "/signin",
    },
    session: {
        strategy: "jwt",
        maxAge: 10 * 24 * 60 * 60,
    },
    secret: process.env.AUTH_SECRET,
})