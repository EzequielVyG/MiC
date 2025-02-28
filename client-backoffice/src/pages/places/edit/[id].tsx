import Alert from '@/components/Alert/Alert';
import Button from '@/components/Button/Button'; // Ajusta la ruta según la ubicación real
import ImageSlider from '@/components/ImageSlider/ImageSlider';
import CmiInput from '@/components/Input/CmiInput';
import FileUploadPreview from '@/components/Input/FileInput';
import Input from '@/components/Input/Input'; // Ajusta la ruta según la ubicación real
import PhoneInput from '@/components/Input/PhoneInput';
import SocialMediaInput from '@/components/Input/SocialMediaInput';
import Label from '@/components/Label/Label';
import LoadingSpinner from '@/components/Loading/Loading';
import MapChequeoBidireccionalComponent from '@/components/Map/MapChequeoBidireccional';
import SchedulerModal from '@/components/ModalComponent/ShedulerModal';
import SchedulerTable from '@/components/Table/SchedulerTable';

import { Accessibility } from '@/features/Accessibilities/Accessibility';
import { findAllAccessibility } from '@/features/Accessibilities/hooks/useFindAllQuery';
import { Category } from '@/features/Categories/category';
import { findAllNotEventCategories } from '@/features/Categories/hooks/useFindAllNotEventCategories';
import { findAllPrincipalCategoriesPlace } from '@/features/Categories/hooks/useFindAllPrincipalCategoriesPlace';
import { getByStatus } from '@/features/Organizations/hooks/useGetByStatusQuery';
import { Organization } from '@/features/Organizations/organization';
import { findById } from '@/features/Places/hooks/useFindByIdQuery';
import { postPlace } from '@/features/Places/hooks/usePostPlaceQuery';
import { putPlace } from '@/features/Places/hooks/usePutPlaceQuery';
import { Minors } from '@/features/Places/minors.enum';
import { Place } from '@/features/Places/place';
import { PlacePhoto } from '@/features/PlacesPhotos/place_photo';
import { PlaceSchedule } from '@/features/PlacesSchedules/place_schedule';
import { Service } from '@/features/Services/Service';
import { findAllService } from '@/features/Services/hooks/useFindAllQuery';
import { findByIdentificador } from '@/features/Traslators/hooks/getbyIdentificator';
import { createTranslator } from '@/features/Traslators/hooks/useCreateTranslator';
import { updateTranslator } from '@/features/Traslators/hooks/useUpdateTranslator';

import BasicLayout from '@/layouts/BasicLayout';
import MainLayout from '@/layouts/MainLayout';

import languages from '@/locale/languages';

import {
	FormHelperText,
	Grid,
	MenuItem,
	Select,
	TextField,
} from '@mui/material';
import Autocomplete from '@mui/material/Autocomplete';

import FlagInput from '@/components/Input/FlagInput';
import LoadingButton from '@mui/lab/LoadingButton';
import { ErrorMessage, Field, Form, Formik } from 'formik';
import Image from 'next/image';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import { object, string } from 'yup';
import { IconButton, Snackbar, Typography } from '@mui/material';
import InfoIcon from '@mui/icons-material/Info';

// import Image from "next/image";

const EditPlace: React.FC = () => {
	const router = useRouter();
	const { id } = router.query;

	const [isLoading, setIsLoading] = useState(true);
	const [selectedLanguage, setSelectedLanguage] = useState('es');
	const [languageData, setLanguageData] = useState<{
		[key: string]: {
			idName: string;
			name: string;
			idDescription: string;
			description: string;
			idNote: string;
			note: string;
		};
	}>({});

	const [showInfo, setShowInfo] = useState(false);
	const [showInfoAddress, setShowInfoAddress] = useState(false);
	const [showMessage, setShowMessage] = useState('');

	const [placeData, setPlaceData] = useState<Place | null>(null);
	const [name, setName] = useState<string>('');
	const [description, setDescription] = useState('');
	const [note, setNote] = useState('');
	const [url, setUrl] = useState('');
	const [facebook_url, setFacebook_url] = useState('');
	const [twitter_url, setTwitter_url] = useState('');
	const [instagram_url, setInstagram_url] = useState('');
	const [cmi, setCmi] = useState('+54');
	const [phone, setPhone] = useState('');
	const [domicile, setDomicile] = useState('');
	const [minors, setMinors] = useState('');
	const [principalCategory, setCategory] = useState<Category | null>(null);
	const [categoryOptions, setCategoryOptions] = useState<Category[]>([]);
	const [principalCategoryOptions, setPrincipalCategoryoptions] = useState<
		Category[]
	>([]);
	const [organization, setOrganization] = useState<Organization | null>(null);
	const [organizationOptions, setOrganizationOptions] = useState<
		Organization[]
	>([]);

	const [categoriesSelected, setCategoriesSelected] = useState<Category[]>([]);

	const [services, setServices] = useState<Service[]>([]);
	const [servicesSelected, setServiceSelected] = useState<Service[] | null>();

	const [accesibilities, setAccesibilities] = useState<Accessibility[]>([]);
	const [accesibilitiesSelected, setAccesibilitiesSelected] = useState<
		Accessibility[] | null
	>();

	const [photos, setPhotos] = useState<PlacePhoto[]>([]);

	const [files, setFiles] = useState<File[]>([]);

	const [edit, setEdit] = useState<boolean>(false);

	const [isImageSnackbarOpen, setImageSnackbarOpen] = useState(false);

	const [modalOpen, setModalOpen] = useState(false);

	const [schedules, setSchedules] = useState<PlaceSchedule[]>([]);

	const [coordinates, setCoordinates] = useState<{
		lat: number;
		lng: number;
	} | null>(null);

	const [daysOfWeek, setDayOfWeek] = useState<any[]>([
		{
			day: 'LUNES',
			checked: false,
			schedules: [],
		},
		{
			day: 'MARTES',
			checked: false,
			schedules: [],
		},
		{
			day: 'MIERCOLES',
			checked: false,
			schedules: [],
		},
		{
			day: 'JUEVES',
			checked: false,
			schedules: [],
		},
		{
			day: 'VIERNES',
			checked: false,
			schedules: [],
		},
		{
			day: 'SABADO',
			checked: false,
			schedules: [],
		},
		{
			day: 'DOMINGO',
			checked: false,
			schedules: [],
		},
	]);

	const [isSaving, setIsSaving] = useState<boolean>(false);

	const handleCoordinatesFromAddress = (domicile: string) => {
		const geocoder = new google.maps.Geocoder();
		return new Promise((resolve, reject) => {
			geocoder.geocode({ address: domicile }, (results, status) => {
				if (status === 'OK' && results![0]?.geometry?.location) {
					const newCoordinates = {
						lat: results![0].geometry.location.lat(),
						lng: results![0].geometry.location.lng(),
					};
					setCoordinates(newCoordinates);
					resolve(newCoordinates);
				} else {
					console.error('Error geocodificando la dirección:', status);
					reject(status);
				}
			});
		});
	};

	const handleMarkOnMap = async (domicile: string) => {
		try {
			const newCoordinates = await handleCoordinatesFromAddress(domicile);
			setCoordinates(
				newCoordinates as {
					lat: number;
					lng: number;
				} | null
			);
		} catch (error) {
			if (error == 'ZERO_RESULTS') {
				setShowMessage(
					'No se pudo geolocalizar la dirección indicada, por favor marque el punto en el mapa que se encuentra a continuación'
				);
				setShowInfoAddress(true);
			}
			console.error('Error al marcar en el mapa:', error);
		}
	};

	useEffect(() => {
		async function fetchCategories() {
			try {
				const categories = await findAllNotEventCategories();
				const principalCategories = await findAllPrincipalCategoriesPlace();
				setCategoryOptions(categories.data);
				setPrincipalCategoryoptions(principalCategories.data);
				if (placeData) {
					setCategory(placeData.principalCategory!);
				}
			} catch (error) {
				console.error('Error fetching categories:', error);
			}
		}

		async function fetchOrganizations() {
			try {
				const organizations = await getByStatus(['ACTIVE']);
				setOrganizationOptions(organizations.data);
				if (placeData) {
					setOrganization(placeData.organization!);
				}
			} catch (error) {
				console.error('Error fetching categories:', error);
			}
		}

		async function fetchServices() {
			try {
				const services = await findAllService();
				setServices(services.data);
				if (placeData) {
					setServices(placeData.services!);
				}
			} catch (error) {
				console.error('Error fetching categories:', error);
			}
		}

		async function fetchAccesibility() {
			try {
				const accesibilities = await findAllAccessibility();
				setAccesibilities(accesibilities.data);
				if (placeData) {
					setAccesibilities(placeData.accessibilities!);
				}
			} catch (error) {
				console.error('Error fetching categories:', error);
			}
		}

		async function fetchPlaceData() {
			try {
				if (id === 'new') {
					// Caso para crear un nuevo lugar
					setEdit(false); // No estamos editando, sino creando un nuevo lugar
				} else if (typeof id === 'string') {
					// Caso para editar un lugar existente
					const place = await findById(id);

					const translatorList = await findByIdentificador(id, 'Place');

					const newLanguageData = { ...languageData }; // Copia el estado actual

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
								translation.campo === 'description' ||
								translation.campo === 'note'
							) {
								const { idioma, campo, traduccion, id } = translation;

								if (!newLanguageData[idioma]) {
									newLanguageData[idioma] = {
										idName: '',
										name: '',
										idDescription: '',
										description: '',
										idNote: '',
										note: '',
									};
								}

								// Asigna la traducción y la ID del campo correspondiente
								if (campo === 'name') {
									newLanguageData[idioma].idName = id;
									newLanguageData[idioma].name = traduccion;
								} else if (campo === 'description') {
									newLanguageData[idioma].idDescription = id;
									newLanguageData[idioma].description = traduccion;
								} else if (campo === 'note') {
									newLanguageData[idioma].idNote = id;
									newLanguageData[idioma].note = traduccion;
								}
							}
						}
					);

					setLanguageData(newLanguageData);
					setPlaceData(place.data);
					setName(place.data.name);
					setDescription(place.data.description ? place.data.description : '');
					setNote(place.data.note ? place.data.note : '');
					setUrl(place.data.url ? place.data.url : '');
					setFacebook_url(
						place.data.facebook_url ? place.data.facebook_url : ''
					);
					setTwitter_url(place.data.twitter_url ? place.data.twitter_url : '');
					setInstagram_url(
						place.data.instagram_url ? place.data.instagram_url : ''
					);
					setCmi(place.data.cmi);
					setPhone(place.data.phone ? place.data.phone : '');
					setDomicile(place.data.domicile);
					setMinors(place.data.minors);
					setCategory(place.data.principalCategory);
					place.data.location && setCoordinates(place.data.location);
					const categ: Category[] = [];
					place.data.categories.forEach((cat: Category) => {
						categ.push(cat);
					});
					setCategoriesSelected(categ);
					// setCategoriesSelected(place.data.categories)
					setOrganization(place.data.organization);
					setPhotos(place.data.photos);
					setServiceSelected(place.data.services);
					setAccesibilitiesSelected(place.data.accessibilities);
					const updatedDaysOfWeek = daysOfWeek.map((day) => {
						const schedulesForDay = place.data.schedules.filter(
							(schedule: { dayOfWeek: { name: any } }) =>
								schedule.dayOfWeek.name === day.day
						);
						if (schedulesForDay.length > 0) {
							return {
								...day,
								checked: true,
								schedules: schedulesForDay,
							};
						}
						return day;
					});

					setDayOfWeek(updatedDaysOfWeek);

					setSchedules(place.data.schedules);
					setEdit(true);
					if (placeData && placeData.domicile) {
						handleCoordinatesFromAddress(place.data.domicile);
					}
				}
			} catch (error) {
				console.error('Error fetching place data:', error);
			}
			setIsLoading(false);
		}

		fetchAccesibility();
		fetchCategories();
		fetchOrganizations();
		fetchPlaceData();
		fetchServices();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [id]);

	const handleSaveChanges = async (values: {
		name: string;
		domicile: string;
		principalCategory: any;
		phone: string;
	}) => {
		let response;
		try {
			const formData = new FormData();
			const updatedSchedules: PlaceSchedule[] = [...schedules];

			setIsSaving(true);

			daysOfWeek.forEach((day) => {
				if (day.checked) {
					day.schedules.forEach(
						(schedule: { openingHour: string; closingHour: string }) => {
							const existingScheduleIndex = updatedSchedules.findIndex(
								(s) =>
									s.dayOfWeek?.name === day.day &&
									s.openingHour === schedule.openingHour &&
									s.closingHour === schedule.closingHour
							);

							if (existingScheduleIndex === -1) {
								// Only add the schedule if it's not already in updatedSchedules
								updatedSchedules.push({
									place: placeData!,
									dayOfWeek: { name: day.day },
									openingHour: schedule.openingHour,
									closingHour: schedule.closingHour,
								});
							}
						}
					);
				}
			});

			const updatedCategories: any[] = [];
			categoriesSelected.forEach((cat) => {
				updatedCategories.push(cat);
			});
			files.forEach((file) => {
				formData.append('files', file);
			});

			formData.append('name', values.name);
			formData.append('description', description);
			formData.append('note', note);
			formData.append('url', url);
			formData.append('facebook_url', facebook_url);
			formData.append('twitter_url', twitter_url);
			formData.append('instagram_url', instagram_url);
			formData.append('cmi', cmi);
			formData.append('phone', values.phone);
			formData.append('domicile', values.domicile);
			formData.append('minors', minors);

			formData.append(
				'schedules',
				updatedSchedules ? JSON.stringify(updatedSchedules) : ''
			);

			formData.append(
				'services',
				servicesSelected ? JSON.stringify(servicesSelected) : ''
			);
			formData.append(
				'accessibilities',
				accesibilitiesSelected ? JSON.stringify(accesibilitiesSelected) : ''
			);

			formData.append(
				'principalCategory',
				values.principalCategory ? JSON.stringify(values.principalCategory) : ''
			);

			formData.append('photos', photos ? JSON.stringify(photos) : '');

			formData.append('location', JSON.stringify(coordinates));

			formData.append(
				'categories',
				updatedCategories ? JSON.stringify(updatedCategories) : ''
			);
			formData.append(
				'organization',
				organization ? JSON.stringify(organization) : ''
			);

			if (edit) {
				if (placeData) {
					// Itera sobre cada idioma
					for (const [language, translation] of Object.entries(languageData)) {
						// Verifica si alguna de las propiedades idName, idNote o idDescription está cargada
						if (translation.idName) {
							const nameTranslator = {
								id: translation.idName,
								entity: 'Place',
								campo: 'name',
								identificador: id,
								idioma: language,
								traduccion: languageData[language].name,
							};
							updateTranslator(nameTranslator);
						} else if (translation.name) {
							const nameTranslator = {
								entity: 'Place',
								campo: 'name',
								identificador: id,
								idioma: language,
								traduccion: languageData[language].name,
							};
							createTranslator(nameTranslator);
						}

						if (translation.idNote) {
							const noteTranslator = {
								id: translation.idNote,
								entity: 'Place',
								campo: 'note',
								identificador: id,
								idioma: language,
								traduccion: languageData[language].note,
							};
							updateTranslator(noteTranslator);
						} else if (translation.note) {
							const noteTranslator = {
								entity: 'Place',
								campo: 'note',
								identificador: id,
								idioma: language,
								traduccion: languageData[language].note,
							};
							createTranslator(noteTranslator);
						}

						if (translation.idDescription) {
							const descriptionTranslator = {
								id: translation.idDescription,
								campo: 'description',
								entity: 'Place',
								identificador: id,
								idioma: language,
								traduccion: languageData[language].description,
							};
							updateTranslator(descriptionTranslator);
						} else if (translation.description) {
							const descriptionTranslator = {
								entity: 'Place',
								campo: 'description',
								identificador: id,
								idioma: language,
								traduccion: languageData[language].description,
							};
							createTranslator(descriptionTranslator);
						}
					}
					// Termina el guardado de idioma

					formData.append('id', placeData.id as string);
					formData.append('origin', placeData.origin!);
					response = await putPlace(formData);
				} else {
					console.error('No place data to update.');
				}
			} else {
				response = await postPlace(formData);
				for (const [language, translation] of Object.entries(languageData)) {
					// Verifica si alguna de las propiedades idName, idNote o idDescription está cargada
					if (translation.name) {
						const nameTranslator = {
							entity: 'Place',
							campo: 'name',
							identificador: response.data.id,
							idioma: language,
							traduccion: languageData[language].name,
						};
						await createTranslator(nameTranslator);
					}

					if (translation.note) {
						const noteTranslator = {
							entity: 'Place',
							campo: 'note',
							identificador: response.data.id,
							idioma: language,
							traduccion: languageData[language].note,
						};
						await createTranslator(noteTranslator);
					}

					if (translation.description) {
						const descriptionTranslator = {
							campo: 'description',
							entity: 'Place',
							identificador: response.data.id,
							idioma: language,
							traduccion: languageData[language].description,
						};
						await createTranslator(descriptionTranslator);
					}
				}
				//Termina el guardado de idioma
			}

			setIsSaving(false);
			if (response.statusCode !== 500) {
				router.replace(`/places/edit/${response.data.id}`);
			}
			setShowMessage(response.message);
			setShowInfo(true);
		} catch (error) {
			setIsSaving(false);
			router.push({
				pathname: `/places`,
				query: { message: error as string },
			});
		}
	};

	const handleGoBack = () => {
		router.push('/places');
	};

	const inputStyle = {
		width: '80vw',
		minWidth: '100px',
		maxWidth: '400px',
		marginBottom: '20px',
	};

	const handleFileChange = (newFiles: File[] | null) => {
		if (newFiles) setFiles((prevFiles) => [...prevFiles, ...newFiles]);
	};

	const handleDeleteFile = (index: number) => {
		setFiles((prevFiles) => prevFiles.filter((_, i) => i !== index));
	};

	const handleServicesChange = async (
		e: React.SyntheticEvent<Element, Event>,
		values: any[]
	) => {
		let someServices = servicesSelected;
		someServices = [...values];
		setServiceSelected(someServices);
	};

	const handleAccesibilitiesChange = async (
		e: React.SyntheticEvent<Element, Event>,
		values: any[]
	) => {
		let someAccessibilities = accesibilitiesSelected;
		someAccessibilities = [...values];
		setAccesibilitiesSelected(someAccessibilities);
	};

	const handleCategoriesChange = async (
		e: React.SyntheticEvent<Element, Event>,
		values: any[]
	) => {
		let someCategories = categoriesSelected;
		someCategories = [...values];
		setCategoriesSelected(someCategories);
	};

	const handleOpenModal = () => {
		setModalOpen(true);
	};

	const handleCloseModal = () => {
		setModalOpen(false);
		const updatedDaysOfWeek = daysOfWeek.map((day: any) => {
			day.schedules = day.schedules.filter(
				(schedule: any) =>
					schedule.openingHour != '' && schedule.closingHour != ''
			);
			return day;
		});
		setDayOfWeek(updatedDaysOfWeek);
	};

	const handleOpeningHourChange = (
		newOpeningHour: string,
		dayIndex: number,
		scheduleIndex: string | number
	) => {
		const updatedDaysOfWeek = [...daysOfWeek];
		updatedDaysOfWeek[dayIndex].schedules[scheduleIndex].openingHour =
			newOpeningHour;
		setDayOfWeek(updatedDaysOfWeek);
	};

	const handleClosingHourChange = (
		newClosingHour: string,
		dayIndex: number,
		scheduleIndex: string | number
	) => {
		const updatedDaysOfWeek = [...daysOfWeek];
		updatedDaysOfWeek[dayIndex].schedules[scheduleIndex].closingHour =
			newClosingHour;
		setDayOfWeek(updatedDaysOfWeek);
	};

	const removeSchedule = (dayIndex: number, openingHour: string) => {
		const updatedSchedules = schedules;
		const day = daysOfWeek[dayIndex];
		const daySchedules = updatedSchedules.filter(
			(schedule) =>
				schedule.dayOfWeek?.name === day.day &&
				schedule.openingHour === openingHour
		);

		daySchedules.forEach((scheduleToRemove) => {
			const index = updatedSchedules.findIndex(
				(schedule) =>
					schedule.dayOfWeek?.name === scheduleToRemove.dayOfWeek?.name &&
					schedule.openingHour === scheduleToRemove.openingHour &&
					schedule.closingHour === scheduleToRemove.closingHour
			);
			if (index !== -1) {
				updatedSchedules.splice(index, 1);
			}
		});
		setSchedules(updatedSchedules);

		const updatedDaysOfWeek = [...daysOfWeek];
		updatedDaysOfWeek[dayIndex].schedules = day.schedules.filter(
			(schedule: any) => schedule.openingHour !== openingHour
		);

		if (updatedDaysOfWeek[dayIndex].schedules.length === 0) {
			updatedDaysOfWeek[dayIndex].checked = false;
		}

		setDayOfWeek(updatedDaysOfWeek);
	};

	const addNewSchedule = (
		dayIndex: number,
		aOpeningHour: string = '',
		aClosingHour: string = ''
	) => {
		const updatedDaysOfWeek = [...daysOfWeek];
		updatedDaysOfWeek[dayIndex].schedules.push({
			openingHour: aOpeningHour,
			closingHour: aClosingHour,
		});
		setDayOfWeek(updatedDaysOfWeek);
	};

	const handleDeletePhoto = (index: number) => {
		const updatedPhotos = [...photos];
		updatedPhotos.splice(index, 1); // Elimina la foto del arreglo en el índice proporcionado
		setPhotos(updatedPhotos); // Actualiza el estado con las fotos restantes
	};

	const handleChangeLanguage = (event: {
		target: { value: React.SetStateAction<string> };
	}) => {
		setSelectedLanguage(event.target.value);
	};

	const handleFieldChange = (fieldName: string, value: string) => {
		if (selectedLanguage === 'es') {
			if (fieldName === 'description') {
				setDescription(value);
			} else if (fieldName === 'note') {
				setNote(value);
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

	const handleImageSnackbarClick = () => {
		setImageSnackbarOpen(true);
	};

	const handleImageSnackbarClose = () => {
		setImageSnackbarOpen(false);
	};

	const validationSchema = object().shape({
		name: string().required('*Campo requerido'),
		domicile: string().required('*Campo requerido'),
		principalCategory: object().required('*Campo requerido'),
		phone: string().test(
			'phone',
			'El número de teléfono no es válido',
			(value) => {
				if (value) {
					const phoneWithoutFormatting = value.replace(/[() -]/g, '');
					if (!/^\d{11}$/.test(phoneWithoutFormatting)) {
						return false;
					}
					return true;
				}
				return true;
			}
		),
	});

	const initialValues: any = {
		name: name,
		domicile: domicile,
		principalCategory: principalCategory,
		phone: phone,
	};

	return (
		<div>
			<MainLayout>
				{isLoading ? (
					<LoadingSpinner />
				) : (
					<BasicLayout title={edit ? 'Editar lugar' : 'Nuevo lugar'}>
						<Formik
							enableReinitialize
							initialValues={initialValues}
							validationSchema={validationSchema}
							onSubmit={handleSaveChanges}
							buttonLabel='Guardar cambios'
						>
							{({ setFieldValue, values }) => (
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
										<Grid
											container
											alignItems='center'
											alignContent={'center'}
											justifyContent={'center'}
										>
											<Label text={'Seleccione el idioma'}></Label>
											<Select
												value={selectedLanguage}
												onChange={handleChangeLanguage}
												autoWidth
												sx={{ marginLeft: '3%' }}
												size='small'
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
									{selectedLanguage && (
										<div>
											<div style={inputStyle}>
												<FlagInput
													field={{
														name: 'name',
														value:
															selectedLanguage === 'es'
																? values.name
																: languageData[selectedLanguage]?.name || '',
														onChange: (e) => {
															if (selectedLanguage === 'es') {
																setFieldValue('name', e.target.value);
															} else {
																handleFieldChange('name', e.target.value);
															}
														},
														onBlur: () => { },
														label: (
															<>
																{"*Nombre"}&nbsp;
																<Image src={languages.find(lang => lang.idioma === selectedLanguage)?.bandera.props.src}
																	alt={languages.find(lang => lang.idioma === selectedLanguage)?.bandera.props.alt}
																	width={20} height={14} />
															</>
														),
													}}
												/>
												<FormHelperText style={{ color: 'red' }}>
													<ErrorMessage name='name' />
												</FormHelperText>
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
												/>
											</div>
											<div style={inputStyle}>
												<FlagInput
													field={{
														name: 'note',
														value:
															selectedLanguage === 'es'
																? note
																: languageData[selectedLanguage]?.note || '',
														onChange: (e) => {
															handleFieldChange('note', e.target.value);
														},
														onBlur: () => { },
														label: (
															<>
																{'Nota'}&nbsp;
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
												/>
											</div>
										</div>
									)}
									<div style={inputStyle}>
										<Autocomplete
											options={principalCategoryOptions}
											getOptionLabel={(category) => category.name}
											value={values.principalCategory}
											onChange={(_, newValue) => {
												setFieldValue('principalCategory', newValue);
											}}
											renderInput={(params) => (
												<TextField {...params} label='*Categoría principal' />
											)}
										/>
										<FormHelperText style={{ color: 'red' }}>
											<ErrorMessage name='principalCategory' />
										</FormHelperText>
									</div>
									<div style={inputStyle}>
										<Autocomplete
											multiple
											options={categoryOptions}
											isOptionEqualToValue={(option: any, value) =>
												option.id === value.id
											}
											getOptionLabel={(option) => option.name}
											onChange={handleCategoriesChange}
											value={categoriesSelected!}
											renderInput={(params: any) => (
												<TextField {...params} label={'Categorias'} />
											)}
										/>
									</div>
									<div style={inputStyle}>
										<div style={inputStyle}>
											<Input
												field={{
													name: 'domicile',
													value: values.domicile,
													onChange: (e) => {
														setFieldValue("domicile", e.target.value)
													},
													onBlur: () => { }, // Pasar el valor del domicilio al perder el foco
													label: '*Domicilio',
												}}
											/>
											<FormHelperText style={{ color: "red" }}>
												<ErrorMessage name="domicile" />
											</FormHelperText>
										</div>
										<Button onClick={() => handleMarkOnMap(values.domicile)}>Marcar en el Mapa</Button>
										{showInfoAddress && (
											<div
												style={{
													display: "flex",
													justifyContent: "space-around",
													margin: "0px 0px 10px 0px",
												}}
											>
												<Alert
													label={showMessage}
													severity="error"
													onClose={() => setShowInfoAddress(false)}
												/>
											</div>
										)}
									</div>
									<MapChequeoBidireccionalComponent
										coordinates={coordinates}
										onMapClick={async (lat: number, lng: number) => {
											setCoordinates({ lat, lng });

											try {
												const response = await fetch(
													`https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${process
														.env.NEXT_PUBLIC_GOOGLE_APIKEY!}`
												);
												const data = await response.json();
												const newDomicile = data.results[0].formatted_address;
												setFieldValue("domicile", newDomicile);
											} catch (error) {
												console.error('Error fetching geocode data:', error);
											}
										}}
									/>
									<div style={inputStyle}></div>
									<div style={inputStyle}>
										<Input
											field={{
												name: 'url',
												value: url,
												onChange: (e) => setUrl(e.target.value),
												onBlur: () => { },
												label: 'Url',
											}}
										/>
									</div>
									<div style={inputStyle}>
										<SocialMediaInput
											field={{
												value: facebook_url,
												onChange: (e) => setFacebook_url(e.target.value),
												onBlur: () => { },
												label: 'Facebook',
											}}
											form={undefined}
										/>
									</div>
									<div style={inputStyle}>
										<SocialMediaInput
											field={{
												value: twitter_url,
												onChange: (e) => setTwitter_url(e.target.value),
												onBlur: () => { },
												label: 'Twitter',
											}}
											form={undefined}
										/>
									</div>
									<div style={inputStyle}>
										<SocialMediaInput
											field={{
												value: instagram_url,
												onChange: (e) => setInstagram_url(e.target.value),
												onBlur: () => { },
												label: 'Instagram',
											}}
											form={undefined}
										/>
									</div>
									<div style={inputStyle}>
										<Grid
											container
											alignItems='center'
											alignContent={'center'}
											justifyContent={'space-between'}
										>
											<Field
												name={'cmi'}
												as={CmiInput}
												onChange={(event: any) => setCmi(event.target.value)}
												value={cmi}
											/>
											<Field
												name={'phone'}
												as={PhoneInput}
												onChange={(event: any) =>
													setFieldValue('phone', event.target.value)
												}
												value={values.phone}
												cmiValue={cmi}
												required={false}
											/>
											<FormHelperText style={{ color: 'red' }}>
												<ErrorMessage name='phone' />
											</FormHelperText>
										</Grid>
									</div>
									<div style={inputStyle}>
										<Autocomplete
											options={Object.values(Minors)}
											getOptionLabel={(minor) => minor}
											value={minors}
											isOptionEqualToValue={(option, value) => option === value}
											onChange={(event, newValue) => setMinors(newValue || '')}
											renderInput={(params) => (
												<TextField {...params} label={'Edad recomendada'} />
											)}
										/>
									</div >
									<div style={inputStyle}>
										<Autocomplete
											options={organizationOptions}
											getOptionLabel={(organization) => organization.legalName}
											value={organization}
											onChange={(event, newValue) => setOrganization(newValue)}
											renderInput={(params) => (
												<TextField {...params} label='Organización' />
											)}
										/>
									</div>
									<div style={inputStyle}>
										<Autocomplete
											multiple
											options={services}
											isOptionEqualToValue={(option: any, value) =>
												option.id === value.id
											}
											getOptionLabel={(option) => option.name}
											onChange={handleServicesChange}
											value={servicesSelected!}
											renderInput={(params: any) => (
												<TextField {...params} label={'Servicios'} />
											)}
										/>
									</div>
									<div style={inputStyle}>
										<Autocomplete
											multiple
											options={accesibilities}
											isOptionEqualToValue={(option: any, value) =>
												option.id === value.id
											}
											getOptionLabel={(option) => option.name}
											onChange={handleAccesibilitiesChange}
											value={accesibilitiesSelected!}
											renderInput={(params: any) => (
												<TextField {...params} label={'Accesibilidades'} />
											)}
										/>
									</div>
									{
										photos && photos.length > 0 && (
											<Label text={'Imágenes del lugar'} />
										)
									}
									<div
										style={{
											...inputStyle,
											justifyContent: 'center',
											display: 'flex',
										}}
									>
										{photos && photos.length > 0 && (
											<div>
												<Label text={'Imágenes'} />
												<ImageSlider
													images={photos.map((photo) => photo.photoUrl)}
													onDelete={(index) => handleDeletePhoto(index)}
													sx={{ maxWidth: '100%' }}
												/>
											</div>
										)}
									</div>
									<FileUploadPreview
										label={'Agregar imágenes'}
										accept={'image/jpg,image/jpeg,image/png'}
										onChange={handleFileChange}
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
									<div style={inputStyle}></div>
									{
										files.length > 0 && (
											<div>
												<Label text={'Imágenes a ser cargadas'} />
												<br />
												<ImageSlider
													images={files.map((file) => URL.createObjectURL(file))}
													onDelete={(index) => handleDeleteFile(index)}
													sx={{ maxWidth: '100%' }}
												/>
											</div>
										)
									}
									<br />
									<div>
										<Button onClick={handleOpenModal}>Agregar horarios</Button>
										<br />
										<br />
										<SchedulerModal
											isOpen={modalOpen}
											onClose={handleCloseModal}
											daysOfWeek={daysOfWeek}
											setDaysOfWeek={setDayOfWeek}
											handleOpeningHourChange={handleOpeningHourChange}
											handleClosingHourChange={handleClosingHourChange}
											removeSchedule={removeSchedule}
											addNewSchedule={addNewSchedule}
										/>
										<SchedulerTable data={daysOfWeek} />
									</div>
									<br />
									<br />
								</Form >
							)}
						</Formik >
					</BasicLayout >
				)}
			</MainLayout >
		</div >
	);
};

export default EditPlace;
