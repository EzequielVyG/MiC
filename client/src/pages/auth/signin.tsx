import { useEffect, useState } from 'react';
import { object, string } from 'yup';

import { signIn, useSession } from 'next-auth/react';
import { useRouter } from 'next/router';

import Alert from '@/components/Alert/Alert';
import SignUpLink from '@/components/Button/SignUpLink';
import GenericForm from '@/components/Form/ValidationForm';
import Image from '@/components/Image/Image';
import Input from '@/components/Input/Input';
import PasswordInput from '@/components/Input/PasswordInput';
import BasicLayout from '@/layouts/BasicLayout';
import MainLayout from '@/layouts/MainLayout';
import en from '@/locale/en';
import es from '@/locale/es';
import { Grid, Link, Typography } from '@mui/material';

import SignInButton from '@/components/Button/SignInButton';
import LoadingSpinner from '@/components/Loading/Loading';
import useSelectedProvider from '@/hooks/useSelectedProvider';
import useFcmToken from '@/utils/hooks/useFcmToken';
import { FaTwitch, FaTwitter } from 'react-icons/fa';
// import { FaTiktok} from 'react-icons/fa';
import { setCookie } from 'nookies';
import { FcGoogle } from 'react-icons/fc';

const Login = () => {
	const { fcmToken } = useFcmToken();
	const { data: session } = useSession();

	const router = useRouter();

	const [showInfo, setShowInfo] = useState(false);
	const [error, setError] = useState({ message: '', type: '' });
	const [isLoading, setIsLoading] = useState(true);
	const [isSaving, setIsSaving] = useState(false);

	const { locale } = router;
	const t = locale === 'en' ? en : es;

	const setSelectedProvider = useSelectedProvider(
		(state: any) => state.setSelectedProvider
	);

	useEffect(() => {
		const { error } = router.query;
		const { info } = router.query;
		if (session) {
			router.replace(`${window.location.origin}/home`);
		}

		if (info) {
			setError({ message: 'Contraseña cambiada con éxito', type: 'success' });
			setShowInfo(true);
		}
		if (error) {
			if (error === 'CredentialsSignin') {
				setError({
					message: t['invalidcredentials'],
					type: 'error',
				});
				setShowInfo(true);
			} else {
				setError({ message: error as string, type: 'error' });
				setShowInfo(true);
			}
		}
		setIsLoading(false);
	}, [router.query, session]);

	const handleButtonClick = async (values: Record<string, string>) => {
		const { email, password } = values;
		setSelectedProvider(null);
		setCookie(null, 'type', 'register', { path: '/' });
		setCookie(null, 'provider', 'credentials', { path: '/' });
		setIsSaving(true);
		await signIn('credentials', {
			callbackUrl: `${window.location.origin}/home`,
			email,
			password,
			fcmToken,
		});
	};

	const handleGoogleLogin = () => {
		setCookie(null, 'type', 'register', { path: '/' });
		setCookie(null, 'provider', 'google', { path: '/' });
		setCookie(null, 'fcmToken', fcmToken, { path: '/' });
		setSelectedProvider('google');
		signIn('google', { callbackUrl: `${window.location.origin}/home` });
	};

	// const handleFacebookLogin = () => {
	//   signIn("facebook", { callbackUrl: "${window.location.origin}/home" });
	// };

	const handleTwitterLogin = () => {
		setCookie(null, 'type', 'register', { path: '/' });
		setCookie(null, 'provider', 'twitter', { path: '/' });
		setCookie(null, 'fcmToken', fcmToken, { path: '/' });
		setSelectedProvider('twitter');
		signIn('twitter', { callbackUrl: `${window.location.origin}/home` });
	};

	const handleTwitchLogin = () => {
		setCookie(null, 'type', 'register', { path: '/' });
		setCookie(null, 'provider', 'twitch', { path: '/' });
		setCookie(null, 'fcmToken', fcmToken, { path: '/' });
		setSelectedProvider('twitch');
		signIn('twitch', { callbackUrl: `${window.location.origin}/home` });
	};

	// const handleTikTokLogin = () => {
	// 	setCookie(null, 'type', 'register', { path: '/' });
	// 	setCookie(null, 'provider', 'tiktok', { path: '/' });
	// 	setSelectedProvider('tiktok');
	// 	signIn('tiktok', { callbackUrl: `${window.location.origin}/home` });
	// };

	const handleSignUpClick = () => {
		router.push('/register');
	};

	const onClickOlvideMiPass = () => {
		router.push('/restorePassword');
	};

	const initialValues = {
		email: '',
		password: '',
	};

	const validationSchema = object().shape({
		email: string().required('*Email requerido').email('Email inválido'),
		password: string().required('*Contraseña requerida'),
	});

	const fields = [
		{
			name: 'email',
			label: 'Campo 1',
			props: { label: 'Email', required: true },
			component: Input,
		},
		{
			name: 'password',
			label: 'Campo 2',
			props: { label: t.password },
			component: PasswordInput,
		},
	];
	return (
		<MainLayout>
			{isLoading ? (
				<LoadingSpinner />
			) : (
				<BasicLayout title={t.signin}>
					<div style={{ maxWidth: '150px' }}>
						<Image
							src='/logo.jpg' // Asegúrate de proporcionar la ruta correcta a la imagen dentro de la carpeta "public"
							alt='logo'
						/>
						<br />
					</div>
					<br />
					<br />
					{showInfo && error && (
						<div>
							<Alert
								label={error.message}
								severity={error.type === 'success' ? 'success' : 'error'}
								onClose={() => setShowInfo(false)}
							/>
							<br />
						</div>
					)}
					<br />
					<GenericForm
						initialValues={initialValues}
						validationSchema={validationSchema}
						fields={fields}
						onSubmit={handleButtonClick}
						isLoading={isSaving}
						buttonLabel={t.signin}
					/>
					<br />
					<Grid
						container
						alignItems='center'
						alignContent={'center'}
						justifyContent={'center'}
						style={{ flexDirection: 'column' }}
					>
						<div style={{ marginTop: '16px' }}></div>
						<div style={{ marginBottom: '16px' }}>
							<SignInButton
								provider='google'
								onClick={handleGoogleLogin}
								icon={<FcGoogle style={{ marginRight: '8px' }} />}
							/>
						</div>
						<div style={{ marginBottom: '16px' }}>
							<SignInButton
								provider='twitter'
								onClick={handleTwitterLogin}
								icon={<FaTwitter style={{ marginRight: '8px' }} />}
							/>
						</div>
						<div style={{ marginBottom: '16px' }}>
							<SignInButton
								provider='twitch'
								onClick={handleTwitchLogin}
								icon={<FaTwitch style={{ marginRight: '8px' }} />}
							/>
						</div>
						{/* <div style={{ marginBottom: '16px' }}>
							<SignInButton
								provider='tiktok'
								onClick={handleTikTokLogin}
								icon={<FaTiktok style={{ marginRight: '8px' }} />}
							/>
						</div> */}
					</Grid>
					<Typography variant='body2'>
						<Link component='button' onClick={onClickOlvideMiPass}>
							{t.forgotPassword}
						</Link>
					</Typography>
					<div style={{ marginBottom: '16px' }}></div>
					<SignUpLink onClick={handleSignUpClick} />
					<br />
				</BasicLayout>
			)}
		</MainLayout>
	);
};

export default Login;
