'use client';
import { useRouter } from 'next/router';

import BasicLayout from '@/layouts/BasicLayout';
import en from '@/locale/en';
import es from '@/locale/es';

import Alert from '@/components/Alert/Alert';
import CardLinkAccount from '@/components/Card/CardLinkAccount';
import LoadingSpinner from '@/components/Loading/Loading';
import { getuserByEmail } from '@/features/Users/hooks/useGetUserByEmailQuery';
import { User } from '@/features/Users/user';
import { signIn } from 'next-auth/react';
import { parseCookies, setCookie } from 'nookies';
import { useEffect, useState } from 'react';

const availableApps = [
	{
		provider: 'google',
		title: 'Google',
		image: 'google.svg',
	},
	{
		provider: 'twitter',
		title: 'Twitter',
		image: 'x.svg',
	},
	{
		provider: 'twitch',
		title: 'Twitch',
		image: 'twitch.svg',
	},
	// {
	// 	provider: 'tiktok',
	// 	title: 'Tik Tok',
	// 	image: 'tiktok.svg',
	// },
];

const MyLinkedAccounts = (props: any) => {
	const router = useRouter();
	const { locale } = router;
	const t: any = locale === 'en' ? en : es;
	const [myUser, setMyUser] = useState<User | null>();
	const [isLoading, setIsLoading] = useState(true);

	const message = parseCookies(null).message;

	const [showInfo, setShowInfo] = useState(false);
	const [showMessage, setShowMessage] = useState('');

	useEffect(() => {
		fetchUserData(props.email);
		setIsLoading(false);

		if (message) {
			setShowInfo(true);
			setShowMessage(message as string);
			setCookie(null, 'message', '', { path: '/', expires: new Date() });
		}

		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	const fetchUserData = async (email: string) => {
		try {
			const userResponse = await getuserByEmail(email);
			setMyUser(userResponse.data);
		} catch (error) {
			console.error('Error fetching user:', error);
		}
	};

	const handleClickLinkAccount = async (app: any) => {
		// Establece cookies
		setCookie(null, 'email', myUser!.email, {
			path: '/',
		});
		setCookie(null, 'type', 'link', { path: '/' });

		setCookie(null, 'provider', app.provider, { path: '/' });

		await signIn(app.provider, {
			callbackUrl: '/mi_perfil?tab=1',
		});
	};

	return (
		<BasicLayout title={t['my_accounts']}>
			{isLoading ? (
				<LoadingSpinner />
			) : (
				<>
					<div
						style={{
							display: 'flex',
							alignItems: 'center',
							flexDirection: 'column',
							marginBottom: 10,
						}}
					>
						{showInfo && (
							<>
								<Alert
									label={showMessage}
									severity='info'
									onClose={() => setShowInfo(false)}
								/>
								<br />
							</>
						)}
						<div
							style={{
								display: 'flex',
								flexWrap: 'wrap',
								justifyContent: 'space-around',
								gap: '40px',
								marginInline: '10',
							}}
						>
							{availableApps.map((app: any, index: number) => (
								<CardLinkAccount
									key={index}
									app={app}
									userAccount={myUser?.accounts?.find(
										(account) => account.provider === app.provider
									)}
									onClick={() => handleClickLinkAccount(app)}
									linkText={t['linkAccount']}
									linkedText={t['linked']}
								/>
							))}
						</div>
					</div>
				</>
			)}
		</BasicLayout>
	);
};

export default MyLinkedAccounts;
