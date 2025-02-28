import Alert from '@/components/Alert/Alert';
import Button from '@/components/Button/Button';
import DialogConfirmDelete from '@/components/Dialog/ConfirmDeleteDialog';
import ImageSlider from '@/components/ImageSlider/ImageSlider';
import FileUploadPreview from '@/components/Input/EventFileInput';
import FlagInput from '@/components/Input/FlagInput';
import Input from '@/components/Input/Input';
import PriceInput from '@/components/Input/PriceInput';
import Label from '@/components/Label/Label';
import LoadingSpinner from '@/components/Loading/Loading';
import { Category } from '@/features/Categories/category';
import { findAllEventCategories } from '@/features/Categories/hooks/useFindAllEventCategories';
import { EventStatus } from '@/features/Events/Event-status.enum';
import { EventFlyer } from '@/features/Events/EventFlyer';
import { EventParticipantesRoles } from '@/features/Events/EventParticipantesRoles.enum';
import { EventPhoto } from '@/features/Events/EventPhoto';
import { cancelEvent } from '@/features/Events/hooks/useCancelEventQuery';
import { deleteEvent } from '@/features/Events/hooks/useDeleteEventQuery';
import { getById } from '@/features/Events/hooks/useGetByIdQuery';
import { postEvent } from '@/features/Events/hooks/usePostEventQuery';
import { putEvent } from '@/features/Events/hooks/usePutEventQuery';
import { getByStatus } from '@/features/Organizations/hooks/useGetByStatusQuery';
import { getOrganizationsByUserEmail } from '@/features/Organizations/hooks/useGetByUserEmailQuery';
import { Organization } from '@/features/Organizations/organization';
import { OrganizationStatus } from '@/features/Organizations/status.enum';
import { findAll } from '@/features/Places/hooks/useFindAllQuery';
import { Minors } from '@/features/Places/minors.enum';
import { Place } from '@/features/Places/place';
import { findByIdentificador } from '@/features/Traslators/hooks/getbyIdentificator';
import { createTranslator } from '@/features/Traslators/hooks/useCreateTranslator';
import { updateTranslator } from '@/features/Traslators/hooks/useUpdateTranslator';
import { getuserByEmail } from '@/features/Users/hooks/useGetUserByEmailQuery';
import { User } from '@/features/Users/user';
import BasicLayout from '@/layouts/BasicLayout';
import MainLayout from '@/layouts/MainLayout';
import languages from '@/locale/languages';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import InfoIcon from '@mui/icons-material/Info';
import { LoadingButton } from '@mui/lab';
import {
	Grid,
	IconButton,
	Snackbar,
	TextField,
	Typography,
} from '@mui/material';
import Autocomplete from '@mui/material/Autocomplete';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import { DateTimePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';
import 'dayjs/locale/es';
import { ErrorMessage, Field, Form, Formik } from 'formik';
import moment from 'moment';
import { useSession } from 'next-auth/react';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import ReactGA from 'react-ga4';
import { object, string } from 'yup';
dayjs.locale('es');

const EditEvento = () => {
	const { data: session } = useSession();
	const router = useRouter();
	const [showInfo, setShowInfo] = useState(false);
	const [showMessage, setShowMessage] = useState('');
	const [isDraft, setDraft] = useState<boolean>(false);
	const [isLoading, setIsLoading] = useState(true);

	const { id } = router.query;
	const [edit, setEdit] = useState<boolean>(false);

	const [eventId, setEventId] = useState('');
	const [startDate2, setStartDate2] = useState<Date>(new Date());
	const [name, setName] = useState('');
	const [description, setDescription] = useState('');
	const [minors, setMinors] = useState('');
	const [price, setPrice] = useState('');
	const [url, setUrl] = useState('');
	const [status, setStatus] = useState('');
	const [photos, setPhotos] = useState<EventPhoto[]>([]);
	const [flyers, setFlyers] = useState<EventFlyer[]>([]);
	const [creator, setCreator] = useState<User | null>(null);
	const [place, setPlace] = useState<Place | null>(null);
	const [principalCategory, setPrincipalCategory] = useState<Category | null>(
		null
	);
	const [categories, setCategories] = useState<Category[]>([]);
	const [startDate, setStartDate] = useState('');
	const [endDate, setEndDate] = useState('');
	const [urlTicketera, setUrlTicketera] = useState('');

	const [files, setFiles] = useState<File[]>([]);

	const [places, setPlaces] = useState<Place[]>([]);

	const [userOrganizations, setUserOrganizations] = useState<Organization[]>(
		[]
	);

	const [isImageSnackbarOpen, setImageSnackbarOpen] = useState(false);

	const [isFlyerSnackbarOpen, setFlyerSnackbarOpen] = useState(false);

	const [allOrganizations, setAllOrganizations] = useState<Organization[]>([]);

	const [organization, setOrganization] = useState<Organization | null>(null);

	const [categoryOptions, setCategoryOptions] = useState<Category[]>([]);

	const [initialValues, setInitialValues] = useState<any>({
		name: '',
		description: '',
		minors: '',
		price: '',
		url: '',
		status: '',
		photos: [],
		flyers: [],
		creator: null,
		place: null,
		principalCategory: null,
		categories: [],
		startDate: '',
		endDate: '',
		urlTicketera: ''
	});

	const [participantes, setParticipantes] = useState<any[]>([]);

	const [showDeleteModal, setShowDeleteModal] = useState(false);

	const rolesParticipantes = [
		EventParticipantesRoles.CONTENIDO,
		EventParticipantesRoles.ORGANIZADOR,
		EventParticipantesRoles.PRODUCTOR,
	];

	const [selectedLanguage, setSelectedLanguage] = useState('es');
	const [languageData, setLanguageData] = useState<{
		[key: string]: {
			idName: string;
			name: string;
			idDescription: string;
			description: string;
		};
	}>({});

	const [isSaving, setIsSaving] = useState<boolean>(false);

	useEffect(() => {
		fetchUserOrganizations(session?.user?.email || null);
		fetchUser(session?.user?.email || null);
		fetchOrganizations();
		fetchEventCategories();
		fetchPlaces();
		getEventData();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [id, session]);

	useEffect(() => {
		getEventData();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [userOrganizations]);

	const fetchOrganizations = async () => {
		const someOrganizations = await getByStatus(['ACTIVE']);
		setAllOrganizations(someOrganizations.data);
	};

	// const bandera = languages.find((lang) => lang.idioma === selectedLanguage);

	const fetchPlaces = async () => {
		const somePlaces = await findAll();
		setPlaces(somePlaces.data);
	};

	const fetchEventCategories = async () => {
		const someCategories = await findAllEventCategories();
		setCategoryOptions(someCategories.data);
	};

	const fetchUserOrganizations = async (email: string | null) => {
		if (email) {
			const someOrganizations = await getOrganizationsByUserEmail(email);
			setUserOrganizations(someOrganizations.data);
		}
	};

	const fetchUser = async (email: string | null) => {
		if (email) {
			const aUser = await getuserByEmail(email);

			if (!edit) {
				setCreator(aUser.data);
			}
		}
	};

	const getEventData = async () => {
		try {
			if (typeof id === 'string' && id !== 'new') {
				const event = await getById(id);
				//esto es todo para cargar los campos en ingles
				const translatorList = await findByIdentificador(id, 'Event');
				const newLanguageData = { ...languageData };
				//Lleno el mapa de traducciones con las traducciones de name, description y note
				translatorList.data.forEach(
					(translation: {
						id: string;
						campo: string;
						idioma: string | number;
						traduccion: any;
					}) => {
						if (
							translation.campo === 'name' ||
							translation.campo === 'description'
						) {
							const { idioma, campo, traduccion, id } = translation;

							if (!newLanguageData[idioma]) {
								newLanguageData[idioma] = {
									idName: '',
									name: '',
									idDescription: '',
									description: '',
								};
							}

							// Asigna la traducción y la ID del campo correspondiente
							if (campo === 'name') {
								newLanguageData[idioma].idName = id;
								newLanguageData[idioma].name = traduccion;
							} else if (campo === 'description') {
								newLanguageData[idioma].idDescription = id;
								newLanguageData[idioma].description = traduccion;
							}
						}
					}
				);
				setLanguageData(newLanguageData);
				setEventId(event.data.id);
				setName(event.data.name);
				setDescription(event.data.description);
				setMinors(event.data.minors);
				setPrice(event.data.price);
				setUrl(event.data.url);
				setUrlTicketera(event.data.urlTicketera);
				setStatus(event.data.status);
				setPhotos(event.data.photos);
				setFlyers(event.data.flyers);
				setCreator(event.data.creator);
				setPlace(event.data.place);
				setPrincipalCategory(event.data.principalCategory);
				setCategories(event.data.categories);
				if (event.data.startDate) {
					setStartDate(moment(event.data.startDate).format('YYYY-MM-DD HH:mm'));
					setStartDate2(new Date(event.data.startDate));
				}
				if (event.data.endDate) {
					setEndDate(moment(event.data.endDate).format('YYYY-MM-DD HH:mm'));
				}
				if (event.data.participants && userOrganizations.length > 0) {
					const someParticipants = [];
					// Chequeo cual es mi organización organizadora para ponerla en primer lugar (con rol no editable), si hay más de una pone a la que encuentra primero
					for (const aParticipant of event.data.participants) {
						let isOrganizador = false;
						if (aParticipant.role === 'Organizador') {
							if (
								organization === null &&
								userOrganizations.find(
									(anOrg) => aParticipant.organization.id === anOrg.id
								)
							) {
								setOrganization(aParticipant.organization);
								isOrganizador = true;
							}
						}

						if (!isOrganizador) someParticipants.push(aParticipant);
					}
					for (const participant of participantes) {
						if (
							someParticipants.findIndex(
								(p) => p.organization?.id === participant.organization?.id
							) === -1
						) {
							someParticipants.push(participant);
						}
					}
					setParticipantes(someParticipants);
				}

				setEdit(true);

				setInitialValues({
					name: event.data.name,
					description: event.data.description,
					minors: event.data.minors,
					price: event.data.price,
					url: event.data.url,
					status: event.data.status,
					photos: event.data.photos,
					flyers: event.data.flyers,
					creator: event.data.creator,
					place: event.data.place,
					principalCategory: event.data.principalCategory,
					categories: event.data.categories,
					startDate: event.data.startDate
						? moment(event.data.startDate).format('YYYY-MM-DD HH:mm')
						: undefined,
					endDate: event.data.endDate
						? moment(event.data.endDate).format('YYYY-MM-DD HH:mm')
						: undefined,
					urlTicketera: event.data.urlTicketera
				});
			} else {
				setEdit(false);
			}
			setIsLoading(false);
		} catch (error) {
			console.error('Error fetching place data:', error);
		}
	};

	const validationSchema = object().shape({
		// name: string().required("*Campo requerido"),
		// description: string(),
		price: string(),
		minors: string(),
		url: string(),
		status: string(),
		phone: string(),
		startDate: string(),
		endDate: string(),
	});

	const handlePriceInputChange = (newValue: string) => {
		setPrice(newValue);
	};

	const isInProgress = () => {
		const fechaActual = new Date();
		/* fechaActual = new Date(
			fechaActual.getFullYear(),
			fechaActual.getMonth(),
			fechaActual.getDate(),
			fechaActual.getHours(),
			fechaActual.getMinutes() + fechaActual.getTimezoneOffset(),
			fechaActual.getSeconds()
		); */
		const stDate = new Date(
			startDate2.getFullYear(),
			startDate2.getMonth(),
			startDate2.getDate(),
			startDate2.getHours(),
			startDate2.getMinutes(),
			startDate2.getSeconds()
		);
		return stDate <= fechaActual && status == EventStatus.SCHEDULED;
	};

	const fields = [
		{
			name: 'price',
			label: 'Precio Entrada',
			props: {
				label: 'Precio entrada',
				isFree: true,
				inputValue: price,
				onInputChange: handlePriceInputChange,
				onBlur: (event: any) => setPrice(event.target.value),
			},
			component: PriceInput,
			value: price,
			disabled: isInProgress(),
		},
		{
			name: 'urlTicketera',
			label: 'Ticketera',
			props: {
				label: 'Ticketera',
			},
			component: Input,
			value: urlTicketera,
			disabled: isInProgress() || price === 'Gratuito',
		},
		{
			name: 'url',
			label: 'Pagina web',
			props: { label: 'Pagina web'},
			component: Input,
			value: url,
			disabled: isInProgress(),
		},
	];

	const handleOrganizationChange = (newOrganization: Organization | null) => {
		if (
			participantes.findIndex(
				(p) => p.organization?.id === newOrganization?.id
			) === -1
		)
			setOrganization(newOrganization);
	};

	const handlePlaceChange = (newPlace: Place | null) => {
		if (place?.organization) setOrganization(place.organization);
		setPlace(newPlace);
	};

	const handlePrincipalCategoryChange = (newCategory: Category | null) => {
		setPrincipalCategory(newCategory);
	};

	const handleCategoriesChange = (newCategories: Category[]) => {
		setCategories(newCategories);
	};

	const handleFileChange = (newFiles: File[] | null, folder: string) => {
		if (newFiles) {
			const filesWithFolder = newFiles.map((file) => {
				const modifiedFile = new File([file], `${folder}-${file.name}`, {
					type: file.type,
				});
				return modifiedFile;
			});
			setFiles((prevFiles) => [...prevFiles, ...filesWithFolder]);
		}
	};

	const handleDeleteFile = (index: number) => {
		setFiles((prevFiles) => prevFiles.filter((_, i) => i !== index));
	};

	const handleDeletePhoto = (index: number) => {
		const updatedPhotos = [...photos];
		updatedPhotos.splice(index, 1); // Elimina la foto del arreglo en el índice proporcionado
		setPhotos(updatedPhotos); // Actualiza el estado con las fotos restantes
	};

	const handleDeleteFlyer = (index: number) => {
		const updatedFlyers = [...flyers];
		updatedFlyers.splice(index, 1); // Elimina la foto del arreglo en el índice proporcionado
		setFlyers(updatedFlyers); // Actualiza el estado con las fotos restantes
	};

	function handleSaveAsDraft() {
		setDraft(true);
	}

	const isProgrammable = (startDate: any, endDate: any) => {
		if (!startDate) {
			return false;
		}
		if (startDate && endDate == null) {
			return new Date() < startDate;
		} else if (startDate && endDate) {
			return new Date() < startDate && startDate < endDate;
		}
	};

	const addParticipanteInput = () => {
		const newParticipantes = [...participantes];
		const aNewParticipante = { organization: null, role: '' };
		newParticipantes.push(aNewParticipante);
		setParticipantes(newParticipantes);
	};

	const handleOrganization = (
		event: React.ChangeEvent<HTMLInputElement>,
		index: number
	) => {
		const newParticipantes = [...participantes];
		newParticipantes[index].organization = event;
		setParticipantes(newParticipantes);
	};

	const handleRol = (
		event: React.ChangeEvent<HTMLInputElement>,
		index: number
	) => {
		const newParticipantes = [...participantes];
		newParticipantes[index].role = event;
		setParticipantes(newParticipantes);
	};

	const handleDeleteParticipante = (index: number) => {
		const newParticipantes = [...participantes];
		newParticipantes.splice(index, 1);
		setParticipantes(newParticipantes);
	};

	const createFormData = (values: Record<string, any>) => {
		const someParticipantes = [...participantes];
		someParticipantes.push({
			organization: organization,
			role: EventParticipantesRoles.ORGANIZADOR,
		});
		const formData = new FormData();
		formData.append('name', name);
		formData.append('description', description);

		formData.append('urlTicketera', values.urlTicketera);
		formData.append('minors', minors);
		formData.append('place', place ? JSON.stringify(place) : '');
		formData.append(
			'principalCategory',
			principalCategory ? JSON.stringify(principalCategory) : ''
		);
		formData.append('categories', JSON.stringify(categories));
		formData.append('creator', creator ? JSON.stringify(creator) : '');
		formData.append('startDate', startDate);
		formData.append('endDate', endDate);
		formData.append('price', price);
		formData.append('url', values.url);
		formData.append('photos', JSON.stringify(photos));
		formData.append('flyers', JSON.stringify(flyers));
		formData.append('isDraft', JSON.stringify(isDraft));
		files.forEach((file) => {
			formData.append('files', file);
		});
		// //esto lo hago porque habia una organizacion como null
		const filteredParticipantes = someParticipantes.filter(
			(element) => element.organization !== null
		);
		// formData.append("participants", JSON.stringify(filteredParticipantes));
		formData.append('participants', JSON.stringify(filteredParticipantes));

		return formData;
	};

	const onSubmit = async (values: Record<string, any>) => {
		try {
			const formData = createFormData(values);
			setIsSaving(true);
			let response;
			if (edit) {
				for (const [language, translation] of Object.entries(languageData)) {
					// Verifica si alguna de las propiedades idName, idNote o idDescription está cargada
					if (translation.idName) {
						const nameTranslator = {
							id: translation.idName,
							entity: 'Event',
							campo: 'name',
							identificador: id,
							idioma: language,
							traduccion: languageData[language].name,
						};
						updateTranslator(nameTranslator);
					} else if (translation.name) {
						const nameTranslator = {
							entity: 'Event',
							campo: 'name',
							identificador: id,
							idioma: language,
							traduccion: languageData[language].name,
						};
						createTranslator(nameTranslator);
					}

					if (translation.idDescription) {
						const descriptionTranslator = {
							id: translation.idDescription,
							campo: 'description',
							entity: 'Event',
							identificador: id,
							idioma: language,
							traduccion: languageData[language].description,
						};
						updateTranslator(descriptionTranslator);
					} else if (translation.description) {
						const descriptionTranslator = {
							entity: 'Event',
							campo: 'description',
							identificador: id,
							idioma: language,
							traduccion: languageData[language].description,
						};
						createTranslator(descriptionTranslator);
					}
				}
				// Termina el guardado de idioma
				formData.append('id', eventId);
				response = await putEvent(formData);
			} else {
				response = await postEvent(formData);

				if (response.statusCode === 200) {
					ReactGA.event({
						category: 'Eventos',
						action: 'Se creó un nuevo evento',
						label: `Se creó el evento ${values.name}`,
					});
				}

				for (const [language, translation] of Object.entries(languageData)) {
					// Verifica si alguna de las propiedades idName, idNote o idDescription está cargada
					if (translation.name) {
						const nameTranslator = {
							entity: 'Event',
							campo: 'name',
							identificador: response.data.id,
							idioma: language,
							traduccion: languageData[language].name,
						};
						await createTranslator(nameTranslator);
					}

					if (translation.description) {
						const descriptionTranslator = {
							campo: 'description',
							entity: 'Event',
							identificador: response.data.id,
							idioma: language,
							traduccion: languageData[language].description,
						};
						await createTranslator(descriptionTranslator);
					}
				}
			}
			if (isDraft) {
				router.push({
					pathname: `/events`,
					query: { message: response.message},
				});
			}
			setShowMessage(response.message);
			setShowInfo(true);
			setIsSaving(false);
			router.replace(`/events/${response.data.id}`);
		} catch (error) {
			setIsSaving(false);
			setShowMessage(
				'Ocurrió un error al guardar los datos, tienes campos obligatorios sin llenar'
			);
		}
	};

	const handleChangeLanguage = (event: {
		target: { value: React.SetStateAction<string> };
	}) => {
		setSelectedLanguage(event.target.value);
	};

	const handleFieldChange = (fieldName: string, value: string) => {
		if (selectedLanguage === 'es') {
			if (fieldName === 'name') {
				setName(value);
			} else if (fieldName === 'description') {
				setDescription(value);
			}
		} else {
			setLanguageData((prevLanguageData) => ({
				...prevLanguageData,
				[selectedLanguage]: {
					...prevLanguageData[selectedLanguage],
					[fieldName]: value,
				},
			}));
		}
	};

	const inputStyle = {
		width: '100%',
		marginBottom: '20px',
	};
	const toggleShowDeleteModal = async () => {
		setShowDeleteModal(!showDeleteModal);
	};

	const handleConfirmModal = async () => {
		// if delete o if cancel para la req
		let action = 'cancelado';
		let response; 
		if (status === EventStatus.DRAFT) {
			action = 'eliminado';
			response=await deleteEvent(eventId);
		} else {
			response=await cancelEvent(eventId);
		}
		setShowDeleteModal(!showDeleteModal);
		setShowMessage(`Evento ${action} con éxito`);
		setShowInfo(true);
		setIsSaving(false);
		if (action==='eliminado'){
			router.push({
				pathname: `/events`,
				query: { message: response.message},
			});
		} else {
		router.replace(`/events/${response.data.id}`);
	}
	};

	const onClickDelete = async () => {
		setShowDeleteModal(!showDeleteModal);
	};

	const onClickCancel = async () => {
		setShowDeleteModal(!showDeleteModal);
	};

	const handleImageSnackbarClick = () => {
		setImageSnackbarOpen(true);
	};

	const handleImageSnackbarClose = () => {
		setImageSnackbarOpen(false);
	};

	const handleFlyerSnackbarClick = () => {
		setFlyerSnackbarOpen(true);
	};

	const handleFlyerSnackbarClose = () => {
		setFlyerSnackbarOpen(false);
	};

	return (
		<MainLayout>
			{isLoading ? (
				<LoadingSpinner />
			) : (
				<BasicLayout title={'Editar evento'}>
					<Formik
						enableReinitialize
						initialValues={initialValues}
						validationSchema={validationSchema}
						onSubmit={onSubmit}
					>
						{({ errors, touched }) => (
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
										{isInProgress() ? (
											<Button
												label={'Volver'}
												disabled={isSaving}
												onClick={() => router.back()}
												sx={{
													fontSize: 12,
													padding: '5px 5px',
												}}
											/>
										) : (
											<Grid
												container
												alignItems='center'
												alignContent={'center'}
												justifyContent={'center'}
											>
												<Button
													label={'Volver'}
													onClick={() => router.back()}
													disabled={isSaving}
													sx={{
														fontSize: 12,
														padding: '5px 5px',
														marginRight: '3%',
													}}
												/>
												{status !== EventStatus.SCHEDULED && (
													<LoadingButton
														variant='contained'
														loading={isSaving}
														type='submit'
														sx={{
															fontSize: 12,
															padding: '5px 5px',
															marginRight: '3%',
														}}
														onClick={handleSaveAsDraft}
													>
														{'Guardar como borrador'}
													</LoadingButton>
												)}

												<LoadingButton
													variant='contained'
													loading={isSaving}
													type='submit'
													sx={{
														fontSize: 12,
														padding: '5px 5px',
														marginRight: '3%',
													}}
													disabled={
														!isProgrammable(
															new Date(startDate),
															endDate ? new Date(endDate) : null
														)
													}
												>
													{'Programar'}
												</LoadingButton>
												{id !== 'new' && status === EventStatus.DRAFT && (
													<Button
														label={'Eliminar'}
														variant='outlined'
														sx={{
															fontSize: 12,
															padding: '5px 5px',
														}}
														onClick={onClickDelete}
														color='inherit'
													/>
												)}
												{/* Agregar en pending? */}
												{id !== 'new' &&
													(status === EventStatus.SCHEDULED ||
														status === EventStatus.PENDING) && (
														<Button
															label={'Cancelar'}
															variant='outlined'
															sx={{
																fontSize: 12,
																padding: '5px 5px',
															}}
															onClick={() => onClickCancel()}
															color='inherit'
														/>
													)}
											</Grid>
										)}
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
								<div style={{ margin: '0px 30px 0px 30px' }}>
									<div style={inputStyle}>
										<Grid
											container
											alignItems='center'
											alignContent={'center'}
											justifyContent={'center'}
										>
											<Label text={'Seleccionar lenguaje'}></Label>
											<Select
												value={selectedLanguage}
												onChange={handleChangeLanguage}
												autoWidth
												sx={{ marginLeft: '3%' }}
											>
												{languages.map((language) => (
													<MenuItem
														key={language.idioma}
														value={language.idioma}
													>
														{language.bandera}
													</MenuItem>
												))}
											</Select>
										</Grid>
									</div>
									<div style={{ margin: '0px 30px 0px 30px' }}>
										<div style={inputStyle}>
											<FlagInput
												field={{
													name: 'name',
													value:
														selectedLanguage === 'es'
															? name
															: languageData[selectedLanguage]?.name || '',
													onChange: (e) => {
														handleFieldChange('name', e.target.value);
													},
													onBlur: () => { },
													label: (
														<>
															{'*Nombre'}&nbsp;
															<Image
																src={
																	languages.find(
																		(lang) => lang.idioma === selectedLanguage
																	)?.bandera.props.src
																}
																alt={
																	languages.find(
																		(lang) => lang.idioma === selectedLanguage
																	)?.bandera.props.alt
																}
																width={20}
																height={14}
															/>
														</>
													),
												}}
												shrink
											/>
										</div>
										<div style={inputStyle}>
											<FlagInput
												field={{
													name: 'description',
													value:
														selectedLanguage === 'es'
															? description
															: languageData[selectedLanguage]?.description ||
															'',
													onChange: (e) => {
														handleFieldChange('description', e.target.value);
													},
													onBlur: () => { },
													label: (
														<>
															{'Descripción'}&nbsp;
															<Image
																src={
																	languages.find(
																		(lang) => lang.idioma === selectedLanguage
																	)?.bandera.props.src
																}
																alt={
																	languages.find(
																		(lang) => lang.idioma === selectedLanguage
																	)?.bandera.props.alt
																}
																width={20}
																height={14}
															/>
														</>
													),
													multiline: true,
												}}
												shrink
											/>
										</div>
										{fields.map((field) => (
											<div key={field.name} style={{ marginBottom: '14px' }}>
												<Field
													name={field.name}
													as={field.component}
													{...field.props}
													disabled={field.disabled}
												/>
												{errors[field.name] && touched[field.name] && (
													<span style={{ color: 'red' }}>
														<ErrorMessage name={`${[field.name]}`} />
													</span>
												)}
											</div>
										))}

										<br />
										<LocalizationProvider dateAdapter={AdapterDayjs}>
											<DateTimePicker
												label={'*Fecha de inicio'}
												value={startDate ? dayjs(startDate) : null}
												onChange={(startDate) =>
													startDate
														? setStartDate(startDate.toString())
														: undefined
												}
												ampm={false}
												format='DD/MM/YYYY HH:mm'
												sx={{
													width: '100%',
													'& input': {
														borderColor: 'grey !important',
													},
													'& label': {
														color: 'grey !important',
													},
												}}
												disabled={isInProgress()}
											/>
										</LocalizationProvider>
										<br />
										<br />
										<LocalizationProvider dateAdapter={AdapterDayjs}>
											<DateTimePicker
												label={'Fecha de fin'}
												value={endDate ? dayjs(endDate) : null}
												onChange={(endDate) =>
													endDate ? setEndDate(endDate.toString()) : undefined
												}
												ampm={false}
												format='DD/MM/YYYY HH:mm'
												sx={{
													width: '100%',
												}}
											/>
										</LocalizationProvider>
										<br />
										<br />
										<Autocomplete
											options={categoryOptions}
											getOptionLabel={(category) => category.name}
											value={principalCategory}
											isOptionEqualToValue={(option, value) =>
												option.id === value.id
											}
											onChange={(event, newValue) => {
												handlePrincipalCategoryChange(newValue);
											}}
											disabled={isInProgress()}
											renderInput={(params) => (
												<TextField
													{...params}
													label={`*Categoria principal`}
												/>
											)}
										/>
										<br />
										<Autocomplete
											multiple
											options={categoryOptions}
											getOptionLabel={(category) => category.name}
											value={categories}
											onChange={(event, newValues) => {
												handleCategoriesChange(newValues);
											}}
											renderInput={(params: any) => (
												<TextField {...params} label={'Categorias'} />
											)}
										/>
										<br />
										<Autocomplete
											options={places}
											getOptionLabel={(place) => place.name!}
											isOptionEqualToValue={(option, value) =>
												option.id === value.id
											}
											value={place}
											disabled={isInProgress()}
											onChange={(event, newValue) =>
												handlePlaceChange(newValue)
											}
											renderInput={(params) => (
												<TextField
													{...params}
													label={`*Lugar`}
													InputLabelProps={{ shrink: true }}
												/>
											)}
										/>
										<br />
										<Autocomplete
											options={Object.values(Minors)}
											getOptionLabel={(minor) => minor}
											value={minors}
											isOptionEqualToValue={(option, value) => option === value}
											onChange={(event, newValue) => setMinors(newValue || '')}
											disabled={isInProgress()}
											renderInput={(params) => (
												<TextField
													{...params}
													label={'Edad recomendada'}
													InputLabelProps={{ shrink: true }}
												/>
											)}
										/>
										<br />
										<Label text={'Participantes'} />
										<br />
										<div>
											<Button
												label={'Agregar participante'}
												onClick={() => addParticipanteInput()}
												// disabled={
												//   !isProgrammable(new Date(startDate), new Date(endDate))
												// }
												icon={<AddIcon style={{ color: 'black' }} />}	
												disabled={isInProgress()}			
											/>
										</div>
										<br />
										<div style={{ display: 'flex', alignItems: 'center' }}>
											<Autocomplete
												options={userOrganizations.filter((aOrganization) => {
													if (
														aOrganization.status === OrganizationStatus.ACTIVE
													) {
														if (
															participantes.findIndex(
																(p) => p.organization?.id === aOrganization?.id
															) === -1
														) {
															return true;
														}
														return false;
													}
												})}
												getOptionLabel={(organization) =>
													organization.legalName
												}
												value={organization}
												isOptionEqualToValue={(option, value) =>
													option.id === value.id
												}
												onChange={(event, newValue) =>
													handleOrganizationChange(newValue)
												}
												disabled={isInProgress()}
												style={{ margin: '2.5%', flex: 1 }}
												renderInput={(params) => (
													<TextField
														{...params}
														label={`*Organización`}
														InputLabelProps={{ shrink: true }}
													/>
												)}
											/>
											<TextField
												label={'Rol'}
												value='Organizador'
												disabled={true}
												style={{ margin: '2.5%', flex: 1 }}
											/>
										</div>
										{participantes.length > 0 &&
											participantes.map((aParticipante, index) => {
												return aParticipante.organization?.id !==
													organization?.id ? (
													<div style={{ display: 'flex' }} key={index}>
														<Autocomplete
															id={aParticipante.organization?.id}
															options={allOrganizations.filter((org) => {
																if (
																	participantes.findIndex(
																		(p) => p.organization?.id === org?.id
																	) === -1 &&
																	organization?.id !== org?.id
																) {
																	return true;
																}
																return false;
															})}
															getOptionLabel={(organization) =>
																organization.legalName
															}
															value={aParticipante.organization}
															isOptionEqualToValue={(option, value) =>
																option.id === value.id
															}
															onChange={(event, newValue) =>
																handleOrganization(newValue, index)
															}
															disabled={isInProgress()}
															style={{ margin: '2.5%', flex: 1 }}
															renderInput={(params) => (
																<TextField
																	{...params}
																	label={'Organización'}
																	InputLabelProps={{ shrink: true }}
																/>
															)}
														/>

														<Autocomplete
															options={rolesParticipantes}
															value={aParticipante.role}
															// isOptionEqualToValue={(option, value) => option.id === value.id}
															onChange={(event, newValue) =>
																handleRol(newValue, index)
															}
															disabled={isInProgress()}
															style={{ margin: '2.5%', flex: 1 }}
															renderInput={(params) => (
																<TextField
																	{...params}
																	label={'Rol'}
																	InputLabelProps={{ shrink: true }}
																/>
															)}
														/>

														<DeleteIcon
															onClick={() => handleDeleteParticipante(index)} // Manejador para eliminar el participante
															style={{ cursor: 'pointer', alignSelf: 'center' }}
														/>
													</div>
												) : (
													<></>
												);
											})}
										{errors.participantes && touched.participantes && (
											<span style={{ color: 'red' }}>
												<ErrorMessage name={'participantes'} />
											</span>
										)}{' '}
										<br />
										<div
											style={{
												display: 'flex',
												justifyContent: 'center',
											}}
										>
											{photos && photos.length > 0 && (
												<div>
													<Label text={'Imagenes'} />
													<ImageSlider
														images={photos.map((photo) => photo.photoUrl)}
														onDelete={(index) => handleDeletePhoto(index)}
														sx={{ maxWidth: '100%' }}
													/>
												</div>
											)}
										</div>
										<div
											style={{
												display: 'flex',
												justifyContent: 'center',
											}}
										>
											{flyers && flyers.length > 0 && (
												<div>
													<Label text={'Flyers'} />
													<ImageSlider
														images={flyers.map((flyer) => flyer.flyerUrl)}
														onDelete={(index) => handleDeleteFlyer(index)}
														sx={{ maxWidth: '100%' }}
													/>
												</div>
											)}
										</div>
										<div
											style={{
												display: 'flex',
												justifyContent: 'center',
											}}
										>
											{files.length > 0 && (
												<div>
													<Label text={'Archivos a ser subidos (Flyers/Fotos)'} />
													<ImageSlider
														images={files.map((file) =>
															URL.createObjectURL(file)
														)}
														onDelete={(index) => handleDeleteFile(index)}
														sx={{ maxWidth: '100%' }}
													/>
												</div>
											)}
										</div>
										<FileUploadPreview
											label={'Agregar imagenes'}
											accept={'image/jpg,image/jpeg,image/png'}
											onChange={(newFiles: File[] | null) =>
												handleFileChange(newFiles, 'fotos')
											}
											disabled={isInProgress()}
											isFlyer={false}
										/>
										<IconButton onClick={handleImageSnackbarClick}>
											<InfoIcon style={{ color: 'grey' }} />
										</IconButton>
										<Snackbar
											open={isImageSnackbarOpen}
											autoHideDuration={6000}
											onClose={handleImageSnackbarClose}
											message={<Typography>{'Puedes cargar más de una foto a la vez'}</Typography>}
										/>
										<br />
										<br />
										<FileUploadPreview
											label={'Añadir flyers'}
											accept={'image/jpg,image/jpeg,image/png'}
											onChange={(newFiles: File[] | null) =>
												handleFileChange(newFiles, 'flyer')
											}
											disabled={isInProgress()}
											isFlyer={false}
										/>
										<IconButton onClick={handleFlyerSnackbarClick}>
											<InfoIcon style={{ color: 'grey' }} />
										</IconButton>
										<Snackbar
											open={isFlyerSnackbarOpen}
											autoHideDuration={6000}
											onClose={handleFlyerSnackbarClose}
											message={
												<Typography>
													{'Sólo puedes cargar un flyer a la vez.'}
													<br />
													{'Los tamaños permitidos son:'}
													<br />
													{'1080x1350, 1080x1080, 1080x1050, 1080x1920'}
												</Typography>
											}
										/>
										<br />
										<br />
									</div>
								</div>
							</Form>
						)}
					</Formik>
					<br />
					<DialogConfirmDelete
						confirmButtonText='Confirmar'
						cancelButtonText='Cancelar'
						title={`¿Está seguro de que desea ${status === EventStatus.DRAFT ? 'eliminar' : 'cancelar'
							} este evento?`}
						message='Este es una acción que no se puede revertir'
						isOpen={showDeleteModal}
						onConfirm={handleConfirmModal}
						onClose={toggleShowDeleteModal}
					/>
				</BasicLayout>
			)}
		</MainLayout>
	);
};

export default EditEvento;
