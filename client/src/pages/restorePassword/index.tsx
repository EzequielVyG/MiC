import React, { useState } from 'react';
import { object, string } from 'yup';

import BasicLayout from '@/layouts/BasicLayout';
import Input from '@/components/Input/Input';
import Label from '@/components/Label/Label';
import Alert from '@/components/Alert/Alert';
import GenericForm from '@/components/Form/ValidationForm';
import MainLayout from '@/layouts/MainLayout';
import { sendPasswordTokenQuery } from '@/features/Users/hooks/useSendPasswordTokenQuery';
import { useRouter } from 'next/router';
import en from '@/locale/en';
import es from '@/locale/es';

const ForgotMyPassword = () => {
	const router = useRouter();

	const { locale } = router;
	const t = locale === 'en' ? en : es;

	const [showInfo, setShowInfo] = useState(false);
	const [info, setInfo] = useState({
		message: '',
		type: '',
	});

	const handleButtonClick = async (values: Record<string, string>) => {
		await sendPasswordTokenQuery(values.email);
		setInfo({
			message: t.passwordResetRequestSend,
			type: 'success',
		});
		setShowInfo(true);
	};

	const initialValues = {
		email: '',
	};

	const validationSchema = object().shape({
		email: string().required(t.emailrequired).email(t.invalidemail),
	});

	const fields = [
		{
			name: 'email',
			label: 'Campo 1',
			props: { label: 'Email', required: true },
			component: Input,
		},
	];

	return (
		<MainLayout>
			<BasicLayout title={t.forgotPassword}>
				{showInfo && info && (
					<Alert
						label={info.message}
						severity={info.type === 'success' ? 'success' : 'error'}
						onClose={() => setShowInfo(false)}
					/>
				)}
				<br />

				<Label text={t.enterEmailResetPassword} />
				<br />
				<GenericForm
					initialValues={initialValues}
					validationSchema={validationSchema}
					fields={fields}
					onSubmit={handleButtonClick}
					buttonLabel={t.restorePasswordButton}
				/>
				<br />
				<br />
			</BasicLayout>
		</MainLayout>
	);
};

export default ForgotMyPassword;
