import { FormHelperText, TextField } from '@mui/material';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';

import BasicLayout from '@/layouts/BasicLayout';
import MainLayout from '@/layouts/MainLayout';

import Alert from '@/components/Alert/Alert';
import Button from '@/components/Button/Button';
import Input from '@/components/Input/Input';
import MapCircuit from '@/components/Map/MapCircuits';
import Autocomplete from '@mui/material/Autocomplete';

import LoadingSpinner from '@/components/Loading/Loading';

import { Category } from '@/features/Categories/category';

import { Circuit } from '@/features/Circuits/circuit';
import { findCircuitById } from '@/features/Circuits/hooks/useFindCircuitByIdQuery';
import { postCircuit } from '@/features/Circuits/hooks/usePostCircuitQuery';
import { putCircuit } from '@/features/Circuits/hooks/usePutCircuitQuery';

import { findAllNotEventCategories } from '@/features/Categories/hooks/useFindAllNotEventCategories';
import { findAll } from '@/features/Places/hooks/useFindAllQuery';
import { Place } from '@/features/Places/place';
import LoadingButton from '@mui/lab/LoadingButton';
import { ErrorMessage, Form, Formik } from 'formik';
import { useSession } from 'next-auth/react';
import { array, object, string } from 'yup';

const CircuitDetail: React.FC = () => {
	const router = useRouter();
	const { id } = router.query;
	const { data: session } = useSession();
	const [isSaving, setIsSaving] = useState<boolean>(false);
	const [isLoading, setIsLoading] = useState(true);

	const [showInfo, setShowInfo] = useState(false);
	const [showMessage, setShowMessage] = useState('');

	const [circuitData, setCircuitData] = useState<Circuit | null>(null);
	const [name, setName] = useState('');
	const [description, setDescription] = useState('');
	const [principalCategory, setPrincipalCategory] = useState<Category | null>(
		null
	);
	const [categories, setCategories] = useState<Category[]>([]);
	const [placesSelected, setPlaceSelected] = useState<any[]>([]);

	const [places, setPlaces] = useState<Place[]>([]);

	const [categoryOptions, setCategoryOptions] = useState<Category[]>([]);

	const [edit, setEdit] = useState<boolean>(false);

	useEffect(() => {
		async function fetchData() {
			try {
				const categories = await findAllNotEventCategories();
				setCategoryOptions(categories.data);

				const places = await findAll();
				setPlaces(places.data);

				if (id === 'new') {
					setEdit(false);
				} else if (typeof id === 'string') {
					const circuit = await findCircuitById(id);

					setCircuitData(circuit.data);
					setName(circuit.data.name);
					setDescription(circuit.data.description);
					setPrincipalCategory(circuit.data.principalCategory);
					setCategories(circuit.data.categories);
					setPlaceSelected(circuit.data.places);

					setEdit(true);
				}

				setIsLoading(false);
			} catch (error) {
				console.error('Error fetching data:', error);
			}
		}
		if (!session || new Date(session.expires) < new Date()) {
			router.replace({
				pathname: '/auth/signin',
				query: { expired: true },
			});
		} else {
			fetchData();
		} // eslint-disable-next-line react-hooks/exhaustive-deps
	}, [id, session]);

	const handleSaveChanges = async (values: any) => {
		let response;
		try {
			setIsSaving(true);
			if (edit) {
				if (circuitData) {
					const circuit: Circuit = {
						id: circuitData.id,
						name: values.name,
						description: description,
						places: values.placesSelected,
						principalCategory: values.principalCategory!,
						categories: categories,
					};
					response = await putCircuit(circuit);
				} else {
					console.error('No circuit data to update.');
				}
			} else {
				const circuit: Circuit = {
					name: values.name,
					description: description,
					places: values.placesSelected,
					principalCategory: values.principalCategory!,
					categories: categories,
				};
				response = await postCircuit(circuit);
			}
			if (response.statusCode !== 500) {
				router.replace(`/circuits/${response.data.id}`);
			}
			setIsSaving(false);
			setShowMessage(response.message);
			setShowInfo(true);
		} catch (error) {
			router.push({
				pathname: `/circuits`,
				query: { message: error as string },
			});
		}
	};

	const handleCategoriesChange = async (
		e: React.SyntheticEvent<Element, Event>,
		values: any[]
	) => {
		setCategories(values);
	};

	const volver = () => {
		router.back();
	};

	const inputStyle = {
		width: '80vw',
		minWidth: '100px',
		maxWidth: '400px',
		marginBottom: '20px',
	};

	const validationSchema = object().shape({
		name: string().required('*Campo requerido'),
		principalCategory: object().required('*Campo requerido'),
		placesSelected: array()
			.required('El circuito es requerido')
			.min(2, 'El circuito debe tener al menos dos lugares'),
	});

	const initialValues: any = {
		name: name,
		principalCategory: principalCategory,
		placesSelected: placesSelected,
	};

	return (
		<div>
			<MainLayout>
				{isLoading ? (
					<LoadingSpinner />
				) : (
					<BasicLayout title={edit ? 'Editar circuito' : 'Nuevo circuito'}>
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
												onClick={volver}
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
										<Input
											field={{
												name: 'name',
												value: values.name,
												onChange: (e) => setFieldValue('name', e.target.value),
												onBlur: () => {},
												label: '*Nombre',
											}}
										/>
										<FormHelperText style={{ color: 'red' }}>
											<ErrorMessage name='name' />
										</FormHelperText>
									</div>
									<div style={inputStyle}>
										<Input
											field={{
												name: 'description',
												value: description,
												onChange: (e) => setDescription(e.target.value),
												onBlur: () => {},
												label: 'Descripción',
												multiline: true,
											}}
										/>
									</div>
									<div style={inputStyle}>
										<Autocomplete
											options={categoryOptions}
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
											getOptionLabel={(category) => category.name}
											value={categories}
											onChange={(event, newValues) => {
												handleCategoriesChange(event, newValues as any[]);
											}}
											renderInput={(params: any) => (
												<TextField {...params} label='Categorias' />
											)}
										/>
									</div>
									<div style={inputStyle}>
										<Autocomplete
											multiple
											options={places}
											isOptionEqualToValue={(option: any, value) =>
												option.id === value.id
											}
											getOptionLabel={(option) => option.name}
											onChange={(_, newValue) => {
												let somePlaces = values.placesSelected;
												somePlaces = [...newValue];
												setFieldValue('placesSelected', somePlaces);
											}}
											value={values.placesSelected!}
											renderInput={(params: any) => (
												<TextField
													{...params}
													label={
														places.length === 0 ? 'No hay lugares' : '*Lugares'
													}
												/>
											)}
											disabled={places.length === 0 ? true : false}
										/>
										<FormHelperText style={{ color: 'red' }}>
											<ErrorMessage name='placesSelected' />
										</FormHelperText>
									</div>
									<div
										style={{
											height: '30vh',
											marginBottom: '20px',
										}}
									>
										<MapCircuit places={values.placesSelected} />
									</div>
								</Form>
							)}
						</Formik>
					</BasicLayout>
				)}
			</MainLayout>
		</div>
	);
};

export default CircuitDetail;
