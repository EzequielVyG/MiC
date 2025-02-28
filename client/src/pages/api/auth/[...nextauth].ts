import { getuserByEmail } from '@/features/Users/hooks_next-auth/useGetUserByEmailQuery';
import { linkAccount } from '@/features/Users/hooks_next-auth/useLinkAccountQuery';
import { login } from '@/features/Users/hooks_next-auth/useLoginQuery';
import { postProviderUser } from '@/features/Users/hooks_next-auth/usePostProviderUserQuery';
import { getUserByProvider } from '@/features/Users/hooks_next-auth/usetGetUserByProviderQuery';
import { UserAccount } from '@/features/Users/userAccount';
import type { NextApiRequest, NextApiResponse } from "next";
import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import FacebookProvider from 'next-auth/providers/facebook';
import GoogleProvider from 'next-auth/providers/google';
import TwitchProvider from 'next-auth/providers/twitch';
import TwitterProvider from 'next-auth/providers/twitter';
import { parseCookies, setCookie } from 'nookies';
import { stringify } from 'querystring';

export default async function auth(req: NextApiRequest, res: NextApiResponse) {


	return await NextAuth(req, res, {
		secret: process.env.NEXTAUTH_SECRET,
		pages: {
			signIn: '/auth/signin',
		},
		providers: [
			CredentialsProvider({
				id: 'credentials',
				name: 'credentials',
				credentials: {
					email: {
						label: 'Email',
						type: 'email',
						placeholder: 'example@gmail.com',
					},
					password: { label: 'Contraseña', type: 'password' },
					fcmToken: { label: 'Tpken', type: 'text' },
				},
				authorize: async (credentials) => {
					try {
						if (!credentials) {
							return null;
						}

						const userResponse = await login(
							credentials.email,
							credentials.password,
							credentials.fcmToken
						);
						const user = userResponse.data;

						if (user) {
							return user;
						} else {
							return null;
						}
					} catch (error) {
						console.log(error);
					}
				},
			}),
			GoogleProvider({
				clientId: process.env.GOOGLE_ID!,
				clientSecret: process.env.GOOGLE_SECRET!,
				authorization: {
					params: {
						prompt: 'consent',
						access_type: 'offline',
						response_type: 'code',
					},
				},

			}),
			FacebookProvider({
				clientId: process.env.FACEBOOK_ID!,
				clientSecret: process.env.FACEBOOK_SECRET!,
			}),
			TwitterProvider({
				clientId: process.env.TWITTER_ID!,
				clientSecret: process.env.TWITTER_SECRET!,
			}),
			TwitchProvider({
				clientId: process.env.TWITCH_ID!,
				clientSecret: process.env.TWITCH_SECRET!,
			}),
			{
				id: 'tiktok',
				name: 'TikTok',
				type: 'oauth',
				version: '2.0',
				clientId: process.env.TIKTOK_KEY,
				clientSecret: process.env.TIKTOK_SECRET,
				authorization: {
					url: 'https://www.tiktok.com/auth/authorize/',
					params: {
						scope: 'user.info.basic,video.list',
						response_type: 'code',
						client_key: process.env.TIKTOK_KEY,
						redirect_uri: 'https://url/api/auth/signin',
					},
				},
				token: {
					url: 'https://open-api.tiktok.com/oauth/access_token/',
					params: {
						client_key: process.env.TIKTOK_KEY,
						client_secret: process.env.TIKTOK_SECRET,
						grant_type: 'authorization_code',
					},
				},
				userinfo: 'https://open-api.tiktok.com/user/info/',
				profile(profile) {
					return {
						profile: profile,
						id: profile.open_id,
					};
				},
				checks: ['state'],
			},
		],
		callbacks: {
			async signIn({ user, account }) {
				const cookies = parseCookies({ req });
				const email = cookies.email || '';
				const type = cookies.type || 'register';

				if (type === "link") {
					const createdAccount: UserAccount = {
						name: user.name!,
						image: user.image!,
						email: user.email!,
						provider: account!.provider!,
						accountID: account!.providerAccountId,
					};

					const response = await linkAccount(email, createdAccount);
					setCookie({ res }, 'message', response.message, { path: '/' });

					if (response.statusCode === 500) {
						setCookie({ res }, 'type', 'register', { path: '/' });
						setCookie({ res }, 'provider', '', { path: '/', expires: new Date() });
						return `/mi_perfil?tab=1`
					}

				} else {
					if (account!.provider !== 'credentials') {
						const fcmToken = cookies.fcmToken || '';

						const createdUser = {
							name: user.name!,
							avatar: user.image!,
							email: user.email!,
							accountID: account!.providerAccountId,
							fcmToken: fcmToken
						};

						const response = await postProviderUser(createdUser, account!.provider!);

						if (response.statusCode === 500) {
							const queryParams = { error: response.message };
							const queryString = stringify(queryParams);
							return `/auth/signin?${queryString}`;
						}

						setCookie({ res }, 'fcmToken', '', { path: '/', expires: new Date() });
					}


				}

				setCookie({ res }, 'accountId', account!.providerAccountId, {
					path: '/',
				});

				return true;
			},
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
			async jwt({ token, }) {
				return token;
			},
		},
	});
}
