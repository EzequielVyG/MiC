import { signIn, useSession } from 'next-auth/react';
import Button from '@/components/Button/Button';
import GenericForm from '@/components/Form/ValidationForm';
import { object, string, ref } from 'yup';
import PasswordInput from '@/components/Input/PasswordInput';
import { changePassword } from '@/features/Users/hooks/useChangePassword';
import { useRouter } from 'next/router';
import MainLayout from '@/layouts/MainLayout';
import { useEffect, useState } from 'react';
import Alert from '@/components/Alert/Alert';
import BasicLayout from '@/layouts/BasicLayout';
import en from '@/locale/en';
import es from '@/locale/es';
import LoadingSpinner from '@/components/Loading/Loading';

const ChangePassword: React.FC = () => {
	const { data: session } = useSession();
	const [passwordError, setError] = useState(false);
	const [isLoading, setIsLoading] = useState(true);
	const [showInfo, setShowInfo] = useState(false);

	const router = useRouter();
	const { locale } = router;
	const t = locale === 'en' ? en : es;

	useEffect(() => {
		if (!session || new Date(session.expires) < new Date()) {
			router.replace({
				pathname: '/auth/signin',
				query: { expired: true },
			});
		} else {
			setIsLoading(false);
		}
	}, [session]);

	const isActualPasswordValid = function () {
		return passwordError;
	};

	const initialValues = {
		acualPassword: '',
		newPassword: '',
		checkNewPassword: '',
	};

	const fields = [
		{
			name: 'actualPassword',
			label: 'Campo 1',
			props: { label: t['actualpassword'] },
			component: PasswordInput,
		},
		{
			name: 'newPassword',
			label: 'Campo 2',
			props: { label: t['newpassword'] },
			component: PasswordInput,
		},
		{
			name: 'checkNewPassword',
			label: 'Campo 3',
			props: { label: t['confirmnewpassword'] },
			component: PasswordInput,
		},
	];

	const handleButtonClick = async (values: Record<string, any>) => {
		setError(false);
		const user = {
			email: session!.user?.email,
			actualPassword: values.actualPassword,
			newPassword: values.newPassword,
			checkNewPassword: values.checkNewPassword,
		};
		const response = await changePassword(user.email!, user);
		if (response.statusCode === 200) {
			router.push({
				pathname: `/mi_perfil`,
				query: { message: response.message },
			});
		} else {
			setError(true);
		}
		setShowInfo(true);
	};

	const validationSchema = object().shape({
		actualPassword: string().required(t['passwordrequired']),
		newPassword: string()
			.required(t['newpasswordrequired'])
			.min(8, t['eightchar']),
		checkNewPassword: string().oneOf(
			[ref('newPassword')],
			t['matchingpasswords']
		),
	});

	return (
		<div>
			{isLoading ? (
				<LoadingSpinner />
			) : (
				<MainLayout>
					{session ? (
						<div>
							<BasicLayout title={t['change_password']}>
								{isActualPasswordValid() && showInfo ? (
									<Alert
										label={t['incorrectpassword']}
										severity='error'
										onClose={() => setShowInfo(false)}
									/>
								) : (
									<></>
								)}
								<GenericForm
									initialValues={initialValues}
									validationSchema={validationSchema}
									fields={fields}
									onSubmit={handleButtonClick}
									buttonLabel={t['change_password']}
									isCancelable={true}
									cancelLabel={t['go_back']}
									onCancel={() => router.back()}
								/>
							</BasicLayout>
						</div>
					) : (
						<Button label={t['signin']} onClick={() => signIn()}></Button>
					)}
				</MainLayout>
			)}
		</div>
	);
};

export default ChangePassword;
