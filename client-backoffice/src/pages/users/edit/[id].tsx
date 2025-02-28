import Alert from '@/components/Alert/Alert';
import Button from '@/components/Button/Button';
import LoadingSpinner from '@/components/Loading/Loading';
import { findAllRoles } from '@/features/Roles/hooks/useFindAllQuery';
import { Role } from '@/features/Roles/role';
import { UserPreference } from '@/features/UserPreference/userPreference';
import { getUserById } from '@/features/Users/hooks/useGetUserByIdQuery';
import { putUser } from '@/features/Users/hooks/usePutUserQuery';
import BasicLayout from '@/layouts/BasicLayout';
import MainLayout from '@/layouts/MainLayout';
import LoadingButton from '@mui/lab/LoadingButton';
import { FormHelperText } from '@mui/material';
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
import { DateTimePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { ErrorMessage, Form, Formik } from 'formik';
import moment from 'moment';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { array, object } from 'yup';
import dayjs from 'dayjs';
import 'dayjs/locale/es';
dayjs.locale('es');

const EditUser = () => {
	const { data: session } = useSession();
	const router = useRouter();
	const { id } = router.query;

	const [showInfo, setShowInfo] = useState(false);
	const [showMessage, setShowMessage] = useState('');

	const [userId, setUserId] = useState('');
	const [name, setName] = useState('');
	const [fechaNacimiento, setFechaNacimiento] = useState('');
	const [email, setEmail] = useState('');
	const [avatar, setAvatar] = useState('');
	const [favoriteEvents, setFavoriteEvents] = useState([]);
	const [preferences, setPreferences] = useState<UserPreference | null>(null);

	const [roles, setRoles] = useState<Role[]>([]);
	const [rolesSelected, setRolesSelected] = useState<Role[]>([]);
	const [isSaving, setIsSaving] = useState<boolean>(false);
	const [isLoading, setIsLoading] = useState(true);

	useEffect(() => {
		if (!session || new Date(session.expires) < new Date()) {
			router.replace({
				pathname: '/auth/signin',
				query: { expired: true },
			});
		} else {
			fetchUserData();
			fetchRoles();
			setIsLoading(false);
		}
	}, [id, session]);

	async function fetchUserData() {
		try {
			if (typeof id === 'string' && id !== 'new') {
				const user = await getUserById(id);
				setUserId(user.data.id);
				setName(user.data.name);
				if (user.data.fechaNacimiento) {
					setFechaNacimiento(
						moment(user.data.fechaNacimiento).format('YYYY-MM-DD')
					);
				}
				setEmail(user.data.email);
				setRolesSelected(user.data.roles);
				setAvatar(user.data.avatar);
				setPreferences(user.data.preferences);
				setFavoriteEvents(user.data.favoriteEvents);
			}
		} catch (error) {
			console.error('Error fetching place data:', error);
		}
	}

	async function fetchRoles() {
		try {
			const roles = await findAllRoles();
			setRoles(roles.data);
		} catch (error) {
			console.error('Error fetching categories:', error);
		}
	}

	const onSubmit = async () => {
		setIsSaving(true);
		const formData = new FormData();
		formData.append('id', userId as string);
		formData.append('name', name);
		formData.append('fechaNacimiento', fechaNacimiento);
		console.log("🚀 ~ file: [id].tsx:96 ~ onSubmit ~ fechaNacimiento:", fechaNacimiento)
		formData.append('email', email);
		formData.append('roles', JSON.stringify(rolesSelected));
		formData.append('avatar', avatar);
		formData.append(
			'preferences',
			preferences ? JSON.stringify(preferences) : ''
		);
		formData.append('favoriteEvents', JSON.stringify(favoriteEvents));
		const response = await putUser(formData);
		if (response.statusCode !== 500) {
			setIsSaving(false);
			router.push({
				pathname: `/users`,
				query: { message: response.message },
			});
		} else {
			setIsSaving(false);
			setShowMessage(response.message);
			setShowInfo(true);
		}
	};

	const handleGoBack = () => {
		router.push('/users');
	};

	const inputStyle = {
		width: '80vw',
		minWidth: '100px',
		maxWidth: '400px',
		marginBottom: '20px',
	};

	const handleRolesChange = async (
		e: React.SyntheticEvent<Element, Event>,
		values: any[]
	) => {
		let someRoles = rolesSelected;
		someRoles = [...values];
		setRolesSelected(someRoles);
	};

	const initialValues: any = {
		name: name,
		fechaNacimiento: fechaNacimiento
			? moment(fechaNacimiento).format('YYYY-MM-DD')
			: undefined,
		rolesSelected: rolesSelected,
		email: email,
	};

	const validationSchema = object().shape({
		rolesSelected: array()
			.required('El rol es requerido')
			.min(1, '*El usuario debe tener al menos un rol'),
	});

	return (
		<MainLayout>
			{isLoading ? (
				<LoadingSpinner />
			) : (
				<BasicLayout title={'Editar Usuario'}>
					<Formik
						enableReinitialize
						initialValues={initialValues}
						validationSchema={validationSchema}
						onSubmit={onSubmit}
						buttonLabel='Guardar cambios'
					>
						<Form>
							<div
								style={{
									display: 'flex',
									justifyContent: 'space-around',
									position: 'sticky',
									top: 10,
									zIndex: 2,
									gap: '10px',
									flexDirection: 'column',
									margin: '0px 0px 20px 0px',
								}}
							>
								<div
									style={{
										display: 'flex',
										justifyContent: 'space-around',
										margin: '0px 10px 0px 10px',
									}}
								>
									<Button
										type='button'
										onClick={handleGoBack}
										disabled={isSaving}
									>
										Volver
									</Button>
									<LoadingButton
										variant='contained'
										loading={isSaving}
										type='submit'
									>
										Guardar cambios
									</LoadingButton>
								</div>

								{showInfo && (
									<div
										style={{
											display: 'flex',
											justifyContent: 'space-around',
											margin: '0px 0px 10px 0px',
										}}
									>
										<Alert
											label={showMessage}
											severity='info'
											onClose={() => setShowInfo(false)}
										/>
									</div>
								)}
							</div>
							<div style={inputStyle}>
								<TextField
									label='Nombre'
									fullWidth
									margin='normal'
									value={name}
									onChange={(e) => setName(e.target.value)}
								/>
								<br />
								<br />
								<LocalizationProvider dateAdapter={AdapterDayjs}>
									<DateTimePicker
										label={'Fecha de nacimiento'}
										value={fechaNacimiento ? dayjs(fechaNacimiento) : null}
										onChange={(fechaNacimiento) =>
											fechaNacimiento
												? setFechaNacimiento(fechaNacimiento.toString())
												: undefined
										}
										ampm={false}
										format='DD/MM/YYYY'
										views={['year', 'month', 'day']}
										sx={{
											width: '100%',
											'& input': {
												borderColor: 'grey !important',
											},
											'& label': {
												color: 'grey !important',
											},
										}}
									/>
								</LocalizationProvider>

								<br />
								<TextField
									label='Email'
									fullWidth
									margin='normal'
									value={email}
									onChange={(e) => setEmail(e.target.value)}
									disabled
								/>
								<br />
								<Autocomplete
									multiple
									options={roles}
									isOptionEqualToValue={(option: any, value) =>
										option.id === value.id
									}
									getOptionLabel={(option) => option.name}
									onChange={handleRolesChange}
									value={rolesSelected!}
									renderInput={(params: any) => (
										<TextField {...params} label={'Roles'} />
									)}
								/>
								<FormHelperText style={{ color: 'red' }}>
									<ErrorMessage name={'rolesSelected'} />
								</FormHelperText>
							</div>
						</Form>
					</Formik>
				</BasicLayout>
			)}
		</MainLayout>
	);
};

export default EditUser;
