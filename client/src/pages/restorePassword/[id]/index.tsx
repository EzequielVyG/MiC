import { useEffect, useState } from 'react';

import * as Yup from 'yup';

import useCheckTokenExp from '@/features/Users/hooks/useCheckTokenExp';
import useRestorePasswordQuery from '@/features/Users/hooks/useRestorePasswordQuery';

import Alert from '@/components/Alert/Alert';
import GenericForm from '@/components/Form/ValidationForm';
import PasswordInput from '@/components/Input/PasswordInput';
import useGetPasswordToken from '@/features/Users/hooks/useGetPasswordToken';
import BasicLayout from '@/layouts/BasicLayout';
import MainLayout from '@/layouts/MainLayout';
import { useRouter } from 'next/router';
import en from '@/locale/en';
import es from '@/locale/es';

const Restore = () => {
	const router = useRouter();

	const { locale } = router;
	const t = locale === 'en' ? en : es;
	const [userEmail, setUserEmail] = useState('');

	const [isError, setIsError] = useState(false);
	const [info, setInfo] = useState({
		message: '',
		type: '',
	});
	const { id } = router.query;

	useEffect(() => {
		if (typeof id === 'string') {
			if (!isTokenExpired()) getData();
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [id]);

	const isTokenExpired = () => {
		const userData = useCheckTokenExp.checkTokenExpiration(id);
		setUserEmail(userData);
		if (userData === '') {
			setInfo({ message: t.expiredResetPassword, type: 'error' });
			setIsError(true);
			return true;
		}

		return false;
	};

	const getData = async () => {
		const aTokenComplete = (await useGetPasswordToken.getTokenData(id)).data;
		if (aTokenComplete.status === 'invalido') {
			setInfo({
				message: t.alreadyUsedResetPassword,
				type: 'error',
			});
			setIsError(true);
		}
	};

	const initialValues = {
		password: '',
		confirmPassword: '',
	};

	const validationSchema = Yup.object().shape({
		password: Yup.string().required(t.newpasswordrequired).min(8, t.eightchar),
		confirmPassword: Yup.string()
			.required(t.confirmnewpassword)
			.oneOf([Yup.ref('password')], t.matchingpasswords)
			.min(8, t.eightchar),
	});

	const handleFormSubmit = async (values: Record<string, any>) => {
		let response;
		try {
			// eslint-disable-next-line @typescript-eslint/no-unused-vars
			response = await useRestorePasswordQuery.restorePassword(
				userEmail,
				values.password,
				id
			);

			router.replace({
				pathname: '/auth/signin',
				query: { info: t.successfullyChanged },
			});
		} catch (error: any) {
			console.log(error);
		}
	};

	const fields = [
		{
			name: 'password',
			label: 'Campo 1',
			props: { label: t.newpassword },
			component: PasswordInput,
		},
		{
			name: 'confirmPassword',
			label: 'Campo 2',
			props: { label: t.confirmnewpassword },
			component: PasswordInput,
		},
	];

	return (
		<MainLayout>
			{isError ? (
				<Alert
					label={info.message}
					severity={info.type === 'error' ? 'error' : 'success'}
					onClose={() => router.replace('/auth/signin')}
				/>
			) : (
				<BasicLayout title={t.forgotPassword}>
					<GenericForm
						initialValues={initialValues}
						validationSchema={validationSchema}
						fields={fields}
						onSubmit={handleFormSubmit}
						buttonLabel={t.restorePasswordButton}
					/>
				</BasicLayout>
			)}
		</MainLayout>
	);
};

export default Restore;
