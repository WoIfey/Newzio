import type { NextAuthOptions, User, Session } from 'next-auth'
import GitHubProvider from 'next-auth/providers/github'
import CredentialsProvider from 'next-auth/providers/credentials'
import { findUsers } from '@/server/db'
import { JWT } from 'next-auth/jwt'

interface Props {
    session: Session,
    token: JWT,
}

export const options: NextAuthOptions = {
    providers: [
        // GitHubProvider({
        //     clientId: process.env.GITHUB_ID as string,
        //     clientSecret: process.env.GITHUB_SECRET as string,
        // }),
        // CredentialsProvider({
        //     name: "Credentials",
        //     credentials: {
        //         email: {
        //             label: "Email:",
        //             type: "text",
        //             placeholder: "Email",
        //         },
        //         password: {
        //             label: "Password:",
        //             type: "password",
        //             placeholder: "Password",
        //         },
        //     },
        //     async authorize(credentials) {
        //         const users = await findUsers(credentials?.email || '', credentials?.password || '') as User
        //         if (users) {
        //             return users
        //         } else {
        //             return null
        //         }
        //     }
        // })
    ],
    callbacks: {
        async session({ session, token }: Props) {
            session.user.id = token.sub || ''
            return Promise.resolve(session)
        },
    },
    pages: {
        signIn: '/auth/signin'
    }
}