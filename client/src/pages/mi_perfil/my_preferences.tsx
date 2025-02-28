import Alert from '@/components/Alert/Alert';
import MyButton from '@/components/Button/Button';
import LoadingSpinner from '@/components/Loading/Loading';
import { Category } from '@/features/Categories/category';
import { findAllCategoriesWithPlaces } from '@/features/Categories/hooks/useFindAllWithPlaces';
import { findAllCategoriesWithVigentEvents } from '@/features/Categories/hooks/useFindAllWithVigentEvents';
import { UserPreference } from '@/features/UserPreference/userPreference';
import { getuserByEmail } from '@/features/Users/hooks/useGetUserByEmailQuery';
import { putUser } from '@/features/Users/hooks/usePutUserQuery';
import { User } from '@/features/Users/user';
import { hasPermission } from '@/hooks/useUserHasPermissionQuery';
import BasicLayout from '@/layouts/BasicLayout';
import en from '@/locale/en';
import es from '@/locale/es';
import {
	Autocomplete,
	FormControl,
	MenuItem,
	Select,
	TextField,
	Typography,
} from '@mui/material';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';

const MyPreferences = () => {
	const router = useRouter();
	const { locale } = router;
	const t: any = locale === 'en' ? en : es;
	const { data: session } = useSession();
	const [myUser, setMyUser] = useState<User | null>();

	const [showInfo, setShowInfo] = useState(false);
	const [showMessage, setShowMessage] = useState('');

	const [eventCategoryOptions, setEventCategoryOptions] = useState<Category[]>(
		[]
	);
	const [placeCategoryOptions, setPlaceCategoryOptions] = useState<Category[]>(
		[]
	);
	const [selectedContextOption, setSelectedContextOption] = React.useState('');
	const [selectedEventCategories, setSelectedEventCategories] = useState<
		Category[]
	>([]);
	const [selectedPlaceCategories, setSelectedPlaceCategories] = useState<
		Category[]
	>([]);

	const [isLoading, setIsLoading] = useState(true);

	const handleContextChange = (event: {
		target: { value: React.SetStateAction<string> };
	}) => {
		setSelectedContextOption(event.target.value);
	};

	const handleSubmitClick = async (values: Record<string, any>) => {
		const data = new FormData();

		const preference: UserPreference = {
			id: myUser?.preferences?.id,
			user: myUser!,
			categories: selectedEventCategories?.concat(selectedPlaceCategories),
			initialContext: selectedContextOption,
		};

		const preferenceString = JSON.stringify(preference);

		data.append(
			'name',
			values.name === undefined
				? myUser?.name
					? myUser?.name
					: ''
				: values.name
		);
		data.append('preferences', preferenceString);
		data.append('email', values.email || myUser?.email);
		data.append(
			'fechaNacimiento',
			values.fechaNacimiento === undefined
				? myUser?.fechaNacimiento
					? myUser?.fechaNacimiento
					: ''
				: values.fechaNacimiento
		);

		const response = await putUser(data);
		if (response.statusCode === 200) {
			setShowMessage(response.message);
			setShowInfo(true);
		}
	};

	const checkUserPermission = async (email: string) => {
		const response = await hasPermission(email, 'updateOwn', 'user');
		if (response.statusCode === 500) {
			router.replace('/permissionDenied');
		}
		setIsLoading(false);
	};

	useEffect(() => {
		if (!session) {
			router.push('/auth/signin');
		} else if (session?.user?.email) {
			checkUserPermission(session.user.email);
			fetchUserData(session.user.email);
		}
	}, [session]);

	useEffect(() => {
		if (myUser && myUser.preferences) {
			setSelectedEventCategories(
				myUser?.preferences?.categories?.filter(
					(category) => category.group == 'Eventos'
				) as Category[]
			);
			setSelectedPlaceCategories(
				myUser?.preferences?.categories?.filter(
					(category) => category.group !== 'Eventos'
				) as Category[]
			);
			setSelectedContextOption(myUser.preferences?.initialContext as string);
		}

		async function fetchCategories() {
			try {
				const categories = await findAllCategoriesWithVigentEvents();
				const categoriesPlace = await findAllCategoriesWithPlaces();
				setEventCategoryOptions(categories.data);
				setPlaceCategoryOptions(categoriesPlace.data);
			} catch (error) {
				console.error('Error fetching categories:', error);
			}
		}

		fetchCategories();
	}, [myUser]);

	const handleEventCategoriesChange = (newCategories: Category[]) => {
		setSelectedEventCategories(newCategories);
	};

	const handlePlaceCategoriesChange = (newCategories: Category[]) => {
		setSelectedPlaceCategories(newCategories);
	};

	const fetchUserData = async (email: string) => {
		try {
			const userResponse = await getuserByEmail(email);
			setMyUser(userResponse.data);
		} catch (error) {
			console.error('Error fetching user:', error);
		}
	};

	return (
		<>
			{isLoading ? (
				<LoadingSpinner />
			) : (
				<BasicLayout title={t['preferences']}>
					{showInfo && (
						<Alert
							label={showMessage}
							severity='info'
							onClose={() => setShowInfo(false)}
						/>
					)}
					<div
						style={{
							width: '70vw',
							minWidth: '100px',
							maxWidth: '300px',
							marginTop: 15,
						}}
					>
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
								onChange={handleContextChange}
							>
								<MenuItem value='EVENTS'>{t['events']}</MenuItem>
								<MenuItem value='PLACES'>{t['places']}</MenuItem>
								<MenuItem value='CIRCUITS'>{t['circuits']}</MenuItem>
							</Select>
						</FormControl>
						<MyButton
							onClick={handleSubmitClick}
							sx={{ marginTop: '20px' }}
							label={t['save']}
						></MyButton>
					</div>
				</BasicLayout>
			)}
		</>
	);
};

export default MyPreferences;
