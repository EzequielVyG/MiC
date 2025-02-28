import Alert from '@/components/Alert/Alert';
import { useRouter } from 'next/router';
import React, { useState } from 'react';

import SignInButton from '@/components/Button/SignInButton';
import GenericForm from '@/components/Form/ValidationForm';
import Image from '@/components/Image/Image';
import Input from '@/components/Input/Input';
import PasswordInput from '@/components/Input/PasswordInput';
// import { Category } from '@/features/Categories/category';
// import { findAllCategoriesWithPlaces } from '@/features/Categories/hooks/useFindAllWithPlaces';
// import { findAllCategoriesWithVigentEvents } from '@/features/Categories/hooks/useFindAllWithVigentEvents';
import { postUser } from '@/features/Users/hooks/usePostUserQuery';
import { User } from '@/features/Users/user';
import useSelectedProvider from '@/hooks/useSelectedProvider';
import BasicLayout from '@/layouts/BasicLayout';
import MainLayout from '@/layouts/MainLayout';
import en from '@/locale/en';
import es from '@/locale/es';
import { Typography } from '@mui/material';
import { signIn } from 'next-auth/react';
// import { BsFacebook } from "react-icons/bs";
import { FaTwitch, FaTwitter } from 'react-icons/fa';
// import { FaTiktok } from 'react-icons/fa';
import ReactGA from 'react-ga4';
import { FcGoogle } from 'react-icons/fc';
import { object, string } from 'yup';
import MyButton from '@/components/Button/Button';

const UserList = () => {
	const router = useRouter();
	const { locale } = router;
	const t = locale === 'en' ? en : es;
	const [showInfo, setShowInfo] = useState(false);
	const [showMessage, setShowMessage] = useState('');
	// const [eventCategoryOptions, setEventCategoryOptions] = useState<Category[]>(
	// 	[]
	// );
	// const [placeCategoryOptions, setPlaceCategoryOptions] = useState<Category[]>(
	// 	[]
	// );
	// const [selectedContextOption, setSelectedContextOption] = React.useState('');
	// const [selectedEventCategories, setSelectedEventCategories] = useState<
	// 	Category[]
	// >([]);
	// const [selectedPlaceCategories, setSelectedPlaceCategories] = useState<
	// 	Category[]
	// >([]);
	const [isSaving, setIsSaving] = useState<boolean>(false);

	// useEffect(() => {
	// 	async function fetchCategories() {
	// 		try {
	// 			const categories = await findAllCategoriesWithVigentEvents();
	// 			const categoriesPlace = await findAllCategoriesWithPlaces();
	// 			// setEventCategoryOptions(categories.data);
	// 			// setPlaceCategoryOptions(categoriesPlace.data);
	// 		} catch (error) {
	// 			console.error('Error fetching categories:', error);
	// 		}
	// 	}

	// 	fetchCategories();
	// }, []);

	// const handleEventCategoriesChange = (newCategories: Category[]) => {
	// 	setSelectedEventCategories(newCategories);
	// };

	// const handlePlaceCategoriesChange = (newCategories: Category[]) => {
	// 	setSelectedPlaceCategories(newCategories);
	// };

	// const handleChange = (event: {
	// 	target: { value: React.SetStateAction<string> };
	// }) => {
	// 	setSelectedContextOption(event.target.value);
	// };

	const setSelectedProvider = useSelectedProvider(
		(state: any) => state.setSelectedProvider
	);

	const handleButtonClick = async (values: Record<string, any>) => {
		// const preference: UserPreference = {
		// 	user: {
		// 		email: values.email,
		// 		password: values.password,
		// 	},
		// 	categories: selectedEventCategories?.concat(selectedPlaceCategories),
		// 	initialContext: selectedContextOption,
		// };

		const user: User = {
			email: values.email as string,
			password: values.password,
		};

		setIsSaving(true);
		const response = await postUser(user);
		setIsSaving(false);

		if (response.statusCode === 200) {
			ReactGA.event({
				category: 'Usuarios',
				action: 'Registro nuevo usuario',
				label: `Se registró el usuario ${user.email}`,
			});
			setShowMessage(t['validateAccount']);
			setShowInfo(true);
		}

		if (response.statusCode === 500) {
			setShowMessage(response.message);
			setShowInfo(true);
		}
	};

	const initialValues = {
		email: '',
		password: '',
	};

	const validationSchema = object().shape({
		email: string().email('Email inválido').required(t.emailrequired),
		password: string().required(t.passwordrequired).min(8, t.eightchar),
	});

	const fields = [
		{
			name: 'email',
			label: 'Campo 1',
			props: { label: 'Email' },
			component: Input,
		},
		{
			name: 'password',
			label: 'Campo 2',
			props: { label: t.password },
			component: PasswordInput,
		},
	];

	const handleGoogleLogin = () => {
		setIsSaving(true);
		setSelectedProvider('google');
		signIn('google', { callbackUrl: '/home' });
		setIsSaving(false);
	};

	const handleTwitterLogin = () => {
		setIsSaving(true);
		setSelectedProvider('twitter');
		signIn('twitter', { callbackUrl: '/home' });
		setIsSaving(false);
	};

	const handleTwitchLogin = () => {
		setIsSaving(true);
		setSelectedProvider('twitch');
		signIn('twitch', { callbackUrl: '/home' });
		setIsSaving(false);
	};

	const handleLogInClick = () => {
		router.push('/auth/signin');
	};

	// const handleTikTokLogin = () => {
	// 	setSelectedProvider('tiktok');
	// 	signIn('tiktok', { callbackUrl: '/home' });
	// };

	return (
		<MainLayout>
			<BasicLayout title={t.register}>
				<div style={{ maxWidth: '150px' }}>
					<Image src='/logo.jpg' alt='logo' />
				</div>
				{showInfo && (
					<div
						style={{
							display: 'flex',
							justifyContent: 'space-around',
							margin: '0px 0px 10px 0px',
							maxWidth: '600px',
						}}
					>
						<Alert
							label={showMessage}
							severity='info'
							onClose={() => setShowInfo(false)}
						/>
					</div>
				)}
				<br />
				<GenericForm
					initialValues={initialValues}
					validationSchema={validationSchema}
					fields={fields}
					isLoading={isSaving}
					onSubmit={handleButtonClick}
					buttonLabel={t.signup}
				/>
				<br />
				<Typography variant='body2'>
					{t.haveAccount2}
					<MyButton
						sx={{ marginLeft: 2 }}
						color='primary'
						onClick={handleLogInClick}
					>
						{t.login}
					</MyButton>
				</Typography>
				{/* <div
					style={{
						width: '70vw',
						minWidth: '100px',
						maxWidth: '300px',
						marginTop: 15,
					}}
				>
					<Title
						textTitle={`${t['accountPreferences']} (${t['optional']})`}
					></Title>
					<Typography>{t['preferredPlacesEvents']}</Typography>
					<Autocomplete
						multiple
						sx={{
							backgroundColor: 'white',
							border: 'none',
							marginTop: 2,
						}}
						options={placeCategoryOptions}
						value={selectedPlaceCategories}
						getOptionLabel={(category) => category.name}
						onChange={(event, newValues) => {
							handlePlaceCategoriesChange(newValues);
						}}
						renderInput={(params: any) => (
							<TextField
								{...params}
								InputProps={{
									...params.InputProps,
									style: {
										borderWidth: 0,
									},
								}}
								label={t['preferredPlaces']}
							/>
						)}
					/>
					<Autocomplete
						multiple
						sx={{
							backgroundColor: 'white',
							border: 'none',
							marginTop: 2,
						}}
						options={eventCategoryOptions}
						value={selectedEventCategories}
						getOptionLabel={(category) => category.name}
						onChange={(event, newValues) => {
							handleEventCategoriesChange(newValues);
						}}
						renderInput={(params: any) => (
							<TextField
								{...params}
								InputProps={{
									...params.InputProps,
									style: {
										borderWidth: 0,
									},
								}}
								label={t['preferredEvents']}
							/>
						)}
					/>
					<Typography marginTop={2}>{t['initialContext']}</Typography>
					<FormControl sx={{ width: '100%', marginTop: 2, borderRadius: 20 }}>
						<Select
							sx={{ borderRadius: 20 }}
							value={selectedContextOption}
							onChange={handleChange}
						>
							<MenuItem value='EVENTS'>{t['events']}</MenuItem>
							<MenuItem value='PLACES'>{t['places']}</MenuItem>
							<MenuItem value='CIRCUITS'>{t['circuits']}</MenuItem>
						</Select>
					</FormControl>
				</div> */}
				<br />
				<SignInButton
					provider='google'
					onClick={handleGoogleLogin}
					icon={<FcGoogle style={{ marginRight: '8px' }} />}
				/>
				<br />
				<SignInButton
					provider='twitter'
					onClick={handleTwitterLogin}
					icon={<FaTwitter style={{ marginRight: '8px' }} />}
				/>
				<br />
				<SignInButton
					provider='twitch'
					onClick={handleTwitchLogin}
					icon={<FaTwitch style={{ marginRight: '8px' }} />}
				/>
				<br />
				{/* <SignInButton
					provider='tiktok'
					onClick={handleTikTokLogin}
					icon={<FaTiktok style={{ marginRight: '8px' }} />}
				/>
				<br /> */}
				{/* <SignInButton
          provider="facebook"
          onClick={handleGoogleLogin}
          icon={<BsFacebook style={{ marginRight: "8px" }} />}
        />
        <br /> */}
				{/* <SignInButton
          provider="instagram"
          onClick={handleGoogleLogin}
          icon={<FaInstagram style={{ marginRight: "8px" }} />}
        /> */}
			</BasicLayout>
		</MainLayout>
	);
};

export default UserList;
