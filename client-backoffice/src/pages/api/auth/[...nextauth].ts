import { login } from "@/features/Users/hooks_next-auth/useLoginMICQuery";
import { getuserByEmail } from "@/features/Users/hooks_next-auth/useGetUserByEmailQuery";
import { getUserByProvider } from "@/features/Users/hooks_next-auth/usetGetUserByProviderQuery";
import { NextApiRequest, NextApiResponse } from "next";
import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import { parseCookies, setCookie } from 'nookies';

export default async function auth(req: NextApiRequest, res: NextApiResponse) {


    return await NextAuth(req, res, {
        secret: process.env.NEXTAUTH_SECRET,
        pages: {
            signIn: '/auth/signin',
        },
        providers: [
            CredentialsProvider({
                id: "credentials",
                name: "credentials",
                credentials: {
                    email: { label: "Email", type: "email", placeholder: "example@gmail.com" },
                    password: { label: "Contraseña", type: "password" }
                },
                authorize: async (credentials) => {
                    try {
                        if (!credentials) {
                            return null;
                        }
                        const userResponse = await login(credentials.email, credentials.password);
                        const user = userResponse.data;
                        if (user) {
                            return user;
                        } else {
                            return null;
                        }
                    }
                    catch (error) {
                        console.log(error)
                    }
                },
            }),
            GoogleProvider({
                clientId: process.env.GOOGLE_ID!,
                clientSecret: process.env.GOOGLE_SECRET!,
                authorization: {
                    params: {
                        prompt: "consent",
                        access_type: "offline",
                        response_type: "code"
                    }
                }
            })
        ],

        callbacks: {
            async redirect({ url }) {
                return url;
            },
            async session({ session }) {
                const cookies = parseCookies({ req });
                const email = cookies.email || '';
                const type = cookies.type || 'register';
                const provider = cookies.provider || 'credentials';

                setCookie({ res }, 'type', '', { path: '/', expires: new Date() });
                // setCookie({ res }, 'provider', '', { path: '/', expires: new Date() });
                setCookie({ res }, 'email', '', { path: '/', expires: new Date() });

                let newData = null
                if (type === 'link') {
                    newData = await getuserByEmail(email);
                } else {
                    if (provider === 'credentials') {
                        newData = await getuserByEmail(session.user!.email!);
                    } else {
                        const accountId = cookies.accountId || '';
                        newData = await getUserByProvider(session.user!.email!, provider, accountId)
                    }
                }
                session.user = newData.data;

                return Promise.resolve(session);
            },
        }
    });
}

