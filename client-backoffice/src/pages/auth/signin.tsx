import React, { useState, useEffect } from 'react';
import { object, string } from 'yup';

import { signIn, useSession } from 'next-auth/react';
import { useRouter } from 'next/router';

import BasicLayout from '@/layouts/BasicLayout';
import Input from '@/components/Input/Input';
import PasswordInput from '@/components/Input/PasswordInput';
import Alert from '@/components/Alert/Alert';
import Image from '@/components/Image/Image';
import GenericForm from '@/components/Form/ValidationForm';
import MainLayout from '@/layouts/MainLayout';
import { Link, Typography } from '@mui/material';
import LoadingSpinner from '@/components/Loading/Loading';

const Login = () => {
	const router = useRouter();
	const { data: session } = useSession();

	const [showInfo, setShowInfo] = useState(false);
	const [error, setError] = useState({ message: '', type: '' });
	const [isLoading, setIsLoading] = useState(true);
	const [isSaving, setIsSaving] = useState(false);

	useEffect(() => {
		if (session) {
			router.replace({
				pathname: '/home',
			});
		} else {
			const { error } = router.query;
			const { info } = router.query;
			const { expired } = router.query;

			if (info) {
				setError({ message: 'Contraseña cambiada con éxito', type: 'success' });
				setShowInfo(true);
			}

			if (error) {
				if (error === 'CredentialsSignin') {
					setError({
						message: 'Las credenciales proporcionadas no son válidas',
						type: 'error',
					});
					setShowInfo(true);
				} else {
					setError({ message: error as string, type: 'error' });
					setShowInfo(true);
				}
			}

			if (expired) {
				setError({
					message:
						'Su sesión ha expirado, para seguir navegando deberá volver a iniciar sesión',
					type: 'error',
				});
				setShowInfo(true);
			}
			setIsLoading(false);
		}
	}, [router.query, session]);

	const handleButtonClick = async (values: Record<string, string>) => {
		const { email, password } = values;

		setIsSaving(true);
		await signIn('credentials', {
			callbackUrl: '/home',
			email,
			password,
		});
		setIsSaving(false);
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
			props: { label: 'Contraseña' },
			component: PasswordInput,
		},
	];
	return (
		<MainLayout>
			{isLoading ? (
				<LoadingSpinner />
			) : (
				<BasicLayout title={'Iniciar sesión'}>
					{showInfo && error && (
						<Alert
							label={error.message}
							severity={error.type === 'success' ? 'success' : 'error'}
							onClose={() => setShowInfo(false)}
						/>
					)}
					<br />
					<Image
						src='/logo.jpg' // Asegúrate de proporcionar la ruta correcta a la imagen dentro de la carpeta "public"
						alt='logo'
					/>
					<br />
					<GenericForm
						initialValues={initialValues}
						validationSchema={validationSchema}
						fields={fields}
						onSubmit={handleButtonClick}
						buttonLabel={'Iniciar sesión'}
						isLoading={isSaving}
					/>
					<br />

					<Typography variant='body2'>
						<Link component='button' onClick={onClickOlvideMiPass}>
							Olvidé mi contraseña
						</Link>
					</Typography>
					<br />
				</BasicLayout>
			)}
		</MainLayout>
	);
};

export default Login;
