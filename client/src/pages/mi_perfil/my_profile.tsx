import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

import Avatar from '@/components/Avatar/Avatar';
import { default as MyButton } from '@/components/Button/Button';
import GenericForm from '@/components/Form/ValidationForm';
import ImageInput from '@/components/Input/ImageInput';
import Input from '@/components/Input/Input';
import DateInput from '@/components/Input/DateInput';
import { getuserByEmail } from '@/features/Users/hooks/useGetUserByEmailQuery';
import { putUser } from '@/features/Users/hooks/usePutUserQuery';
import { User } from '@/features/Users/user';
import BasicLayout from '@/layouts/BasicLayout';
import en from '@/locale/en';
import es from '@/locale/es';
import { object, string } from 'yup';

import useSelectedProvider from '@/hooks/useSelectedProvider';

import Alert from '@/components/Alert/Alert';
import LoadingSpinner from '@/components/Loading/Loading';
import moment from 'moment';

const MyProfile = (props: any) => {
	const router = useRouter();
	const { locale } = router;
	const t: any = locale === 'en' ? en : es;
	const selectedProvider = useSelectedProvider(
		(state: any) => state.selectedProvider
	);

	const [showInfo, setShowInfo] = useState(false);
	const [showMessage, setShowMessage] = useState('');

	const [avatarTmpImage, setAvatarTmpImage] = useState<File | null>(null);
	const [initialValues, setInitialValues] = useState<any>({
		avatar: undefined,
		name: '',
		email: '',
		fechaNacimiento: '',
	});
	const [myUser, setMyUser] = useState<User | null>(null);
	const [isLoading, setIsLoading] = useState(true);

	useEffect(() => {
		if (myUser) {
			setInitialValues({
				avatar: myUser.avatar || undefined,
				name: myUser.name || '',
				email: myUser.email || '',
				fechaNacimiento:
					(myUser.fechaNacimiento &&
						moment(myUser.fechaNacimiento).format('YYYY-MM-DD')) ||
					'',
			});
		}
		setIsLoading(false);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [myUser]);

	useEffect(() => {
		fetchUserData(props.email);
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

	const handleAvatarChange = (file: File | null) => {
		setAvatarTmpImage(file);
	};

	const handleSubmitClick = async (values: Record<string, any>) => {
		const data = new FormData();

		data.append('name', values.name);

		data.append('email', values.email || myUser?.email);

		data.append(
			'fechaNacimiento',
			values.fechaNacimiento ? values.fechaNacimiento : ''
		);

		if (avatarTmpImage) {
			const newFile = new File([avatarTmpImage], myUser!.email, {
				type: avatarTmpImage.type,
			});
			setAvatarTmpImage(newFile);
			data.append('avatar', values.avatar);
		} else if (myUser?.avatar) {
			data.append('avatar', myUser!.avatar);
		}
		const response = await putUser(data);
		if (response.statusCode === 200) {
			setShowMessage(response.message);
			setShowInfo(true);
		}
	};

	const validationSchema = object().shape({
		name: string(),
		fechaNacimiento: string().test(
			'fechaNacimiento',
			'Fecha de nacimiento incorrecta, no puede ser mayor al día actual.',
			function (value) {
				// Utiliza Moment.js para comparar la fecha con la fecha actual
				if (!value) return true; // Si el campo está vacío, no se realiza la validación

				const maxDate = moment(new Date(), 'YYYY-MM-DD'); // Fecha actual
				const inputDate = moment(new Date(value), 'YYYY-MM-DD'); // Fecha ingresada en el campo

				return inputDate.isSameOrBefore(maxDate);
			}
		),
		email: string().required(),
	});

	const myProfileFields = [
		{
			name: 'avatar',
			props: {
				label: t['change_avatar'],
				type: 'file',
				name: 'avatar',
				onChange: handleAvatarChange,
			},
			component: ImageInput,
		},
		{
			name: 'name',
			props: {
				label: t['full_name'],
				text: 'text',
			},
			component: Input,
		},
		{
			name: 'email',
			props: {
				type: t['email'],
				label: 'Email',
				disabled: true,
			},
			component: Input,
		},
		{
			name: 'fechaNacimiento',
			props: {
				views: ['year', 'month', 'day'],
				label: t['birth_date'],
				shrink: true,
			},
			component: DateInput,
		},
	];
	return (
		<BasicLayout title={t['profile']}>
			{isLoading ? (
				<LoadingSpinner />
			) : (
				<>
					<div
						style={{
							flex: 1,
							display: 'flex',
							justifyContent: 'center',
							alignItems: 'center',
							flexDirection: 'column',
							textAlign: 'center',
						}}
					>
						{showInfo && (
							<Alert
								label={showMessage}
								severity='info'
								onClose={() => setShowInfo(false)}
							/>
						)}
					</div>

					{!selectedProvider && (
						<MyButton
							onClick={() => {
								router.push('/mi_perfil/change-password');
							}}
							sx={{ marginBottom: '20px' }}
							label={t['change_password']}
						/>
					)}

					<Avatar
						sx={{ height: 70, width: 70, marginBottom: '20px' }}
						src={
							(avatarTmpImage && URL.createObjectURL(avatarTmpImage)) ||
							myUser?.avatar ||
							undefined
						}
						alt={myUser?.name}
					></Avatar>
					<GenericForm
						initialValues={initialValues}
						validationSchema={validationSchema}
						fields={myProfileFields}
						onSubmit={handleSubmitClick}
						buttonLabel={t['confirm_changes']}
					/>
				</>
			)}
		</BasicLayout>
	);
};

export default MyProfile;
