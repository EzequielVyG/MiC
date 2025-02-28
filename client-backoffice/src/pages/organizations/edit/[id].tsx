import Alert from '@/components/Alert/Alert';
import Button from '@/components/Button/Button';
import CmiInput from '@/components/Input/CmiInput';
import CuilInput from '@/components/Input/CuilInput';
import Input from '@/components/Input/Input';
import PhoneInput from '@/components/Input/PhoneInput';
// import GenericList from '@/components/List/List';
import SocialMediaInput from '@/components/Input/SocialMediaInput';
import OperatorList from '@/components/List/OperatorList';
import LoadingSpinner from '@/components/Loading/Loading';
import { getAllCategorias } from '@/features/Categories/hooks/useGetAllCategoriasQuery';
import { getCategoriasByParent } from '@/features/Categories/hooks/useGetCategoriasQuery';
import { createSolicitud } from '@/features/Organizations/hooks/useCreateSolicitudQuery';
import { getById } from '@/features/Organizations/hooks/useGetByIdQuery';
import { putStatusOrganization } from '@/features/Organizations/hooks/usePutStatusQuery';
import { updateSolicitud } from '@/features/Organizations/hooks/useUpdateSolicitudQuery';
import { getUsers } from '@/features/Users/hooks/useGetUsersQuery';
import { User } from '@/features/Users/user';
import BasicLayout from '@/layouts/BasicLayout';
import MainLayout from '@/layouts/MainLayout';
import LoadingButton from '@mui/lab/LoadingButton';
import { Autocomplete, FormHelperText, Grid, TextField } from '@mui/material';
import { ErrorMessage, Field, Form, Formik } from 'formik';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import { object, string } from 'yup';

const RegistroInstitucion = () => {
	const { data: session } = useSession();
	const router = useRouter();

	const [categoriasPrincipales, setCategoriasPrincipales] = useState<any[]>([]);
	const [categoriasPrincipalesSelected, setCategoriasPrincipalesSelected] =
		useState<any[]>([]);

	const [showInfo, setShowInfo] = useState(false);
	const [showMessage, setShowMessage] = useState('');

	const [principalCategory, setPrincipalCategory] = useState<any[]>([]);
	const [principalCategorySelected, setPrincipalCategorySelected] =
		useState(null);

	const [owner, setOwner] = useState<User | null>(null);
	const [usuarios, setUsuarios] = useState<any[]>([]);

	const [operadores, setOperadores] = useState<any[]>([]);

	const { id } = router.query;
	const [organizationId, setORganizationId] = useState('');
	const [legalName, setLegalName] = useState('');
	const [address, setAddress] = useState('');
	const [cuit, setCuit] = useState('');
	const [cmi, setCmi] = useState('+54');
	const [phone, setPhone] = useState('');
	const [facebookUrl, setFacebookUrl] = useState('');
	const [twitterUrl, setTwitterUrl] = useState('');
	const [instagramUrl, setInstagramUrl] = useState('');
	const [email, setEmail] = useState('');
	const [webOrganizationUrl, setWebOrganizationUrl] = useState('');
	const [description, setDescription] = useState('');
	const [isLoading, setIsLoading] = useState(true);
	const [isSaving, setIsSaving] = useState<boolean>(false);

	useEffect(() => {
		if (!session || new Date(session.expires) < new Date()) {
			router.replace({
				pathname: '/auth/signin',
				query: { expired: true },
			});
		} else {
			getData();
			fetchOrganizationData();
			setIsLoading(false);
		}
	}, [id, session]);

	const initialValues = {
		razonSocial: legalName,
		principalCategory: principalCategorySelected,
		cuit: cuit,
		telefono: phone,
		owner: owner,
		operador: '',
		email: email,
	};

	async function fetchOrganizationData() {
		try {
			if (typeof id === 'string' && id !== 'new') {
				const organization = await getById(id);
				setORganizationId(organization.data.id);
				setLegalName(organization.data.legalName);
				setAddress(organization.data.address);
				setCuit(organization.data.cuit);
				setCategoriasPrincipalesSelected(organization.data.categories);
				setPrincipalCategorySelected(organization.data.principalCategory);
				setCmi(organization.data.cmi);
				setPhone(organization.data.phone);
				setOwner(organization.data.owner);
				setOperadores(organization.data.operators);
				setFacebookUrl(organization.data.facebook_url);
				setTwitterUrl(organization.data.twitter_url);
				setInstagramUrl(organization.data.instagram_url);
				setEmail(organization.data.email);
				setWebOrganizationUrl(organization.data.web_organization_url);
				setDescription(organization.data.description);
			}
		} catch (error) {
			console.error('Error fetching place data:', error);
		}
	}

	const getData = async () => {
		const someCategoriasPrincipales = await getCategoriasByParent(null);
		setPrincipalCategory(someCategoriasPrincipales.data);
		const someCategorias = await getAllCategorias();
		setCategoriasPrincipales(someCategorias.data);
		setUsuarios((await getUsers()).data);
	};

	const onSubmit = async (values: Record<string, any>) => {
		setIsSaving(true);
		const formData = new FormData();
		if (id !== 'new') {
			formData.append('id', organizationId as string);
		}
		formData.append('legalName', values.razonSocial);
		formData.append('address', address);
		formData.append('cuit', values.cuit);
		formData.append(
			'categories',
			JSON.stringify(categoriasPrincipalesSelected)
		);
		formData.append(
			'principalCategory',
			JSON.stringify(values.principalCategory)
		);
		formData.append('cmi', cmi);
		formData.append('phone', values.telefono);
		formData.append('owner', JSON.stringify(owner));

		formData.append('operators', JSON.stringify(operadores));
		formData.append('facebook_url', facebookUrl);
		formData.append('twitter_url', twitterUrl);
		formData.append('instagram_url', instagramUrl);
		formData.append('email', email);
		formData.append('web_organization_url', webOrganizationUrl);
		formData.append('description', description);

		let response;
		if (id !== 'new') {
			response = await updateSolicitud(formData);
		} else {
			response = await createSolicitud(formData);
			await putStatusOrganization(response.data.id, 'ACTIVE', null);
		}
		if (response.statusCode !== 500) {
			setIsSaving(false);
			router.replace(`/organizations/edit/${response.data.id}`);
			setShowMessage(response.message);
			setShowInfo(true);
		} else {
			setIsSaving(false);
			setShowMessage(response.message);
			setShowInfo(true);
		}
	};

	const validationSchema = object().shape({
		razonSocial: string().required('*Campo requerido'),
		cuit: string()
			.required('*Campo requerido')
			.test('cuit', 'El CUIT no es válido', (value) => {
				const cuitWithoutDashes = value.replace(/-/g, '');
				if (!/^\d{2}\d{8,9}\d{1}$/.test(cuitWithoutDashes)) {
					return false;
				}
				return true;
			}),
		telefono: string()
			.required('*Campo requerido')
			.test('telefono', 'El número de teléfono no es válido', (value) => {
				const phoneWithoutFormatting = value.replace(/[() -]/g, '');
				if (!/^\d{11}$/.test(phoneWithoutFormatting)) {
					return false;
				}
				return true;
			}),
		principalCategory: object().required('*Campo requerido'),
		email: string()
			.required('*Campo requerido')
			.test(
				'email',
				'El formato del correo electrónico no es válido',
				(value) => {
					const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
					return emailRegex.test(value);
				}
			),
	});

	const handleCatPrincipalesChange = async (
		e: React.SyntheticEvent<Element, Event>,
		values: any[]
	) => {
		setCategoriasPrincipalesSelected(values);
	};

	const onAddOperator = (aEmail: string) => {
		setOperadores([...operadores, { user: { email: aEmail } }]);
	};

	const onDeleteOperator = (aindex: number) => {
		// operadores.push({email: aEmail});
		const someOperadores = operadores.filter((op, index) => index !== aindex);
		setOperadores(someOperadores);
	};

	const isValidEmailFormat = (email: string) => {
		// Expresión regular para validar el formato de un correo electrónico
		const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
		return emailRegex.test(email);
	};

	const inputStyle = {
		width: '80vw',
		minWidth: '100px',
		maxWidth: '400px',
		marginBottom: '20px',
	};

	const operatorStatusColor = {
		PENDING: 'rgba(255, 165, 0, 0.5)',
		ACCEPTED: 'rgba(144, 238, 144, 0.5)',
		REJECTED: 'rgba(255, 105, 97, 0.5)',
		NOT_EXISTS: 'rgba(192, 192, 192, 0.5)',
	};

	return (
		<MainLayout>
			{isLoading ? (
				<LoadingSpinner />
			) : (
				<BasicLayout
					title={id === 'new' ? 'Nueva organización' : 'Editar organización'}
				>
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
					<Formik
						enableReinitialize
						initialValues={initialValues}
						validationSchema={validationSchema}
						onSubmit={onSubmit}
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
											onClick={() => router.back()}
											disabled={isSaving}
										>
											Volver
										</Button>
										<LoadingButton
											variant='contained'
											loading={false}
											type='submit'
										>
											Guardar cambios
										</LoadingButton>
									</div>
								</div>
								<div style={inputStyle}>
									<Field
										value={legalName}
										name={'razonSocial'}
										as={Input}
										label={`*Nombre`}
										onChange={(e: { target: { value: any } }) => {
											setLegalName(e.target.value);
											setFieldValue('razonSocial', e.target.value);
										}}
									/>
									<FormHelperText style={{ color: 'red' }}>
										<ErrorMessage name={'razonSocial'} />
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
										}}
									/>
								</div>
								<div style={inputStyle}>
									<Field
										name='cuit'
										as={CuilInput}
										label={'*Cuit'}
										onInputChange={
											id !== 'new'
												? (e: { target: { value: any } }) => {
														setCuit(e.target.value);
														setFieldValue('cuit', e.target.value);
												  }
												: (value: any) => {
														setCuit(value);
														setFieldValue('cuit', value);
												  }
										}
										inputValue={id !== 'new' ? values.cuit : undefined}
										{...(id !== 'new' ? { disabled: true } : {})}
									/>
									<FormHelperText style={{ color: 'red' }}>
										<ErrorMessage name={'cuit'} />
									</FormHelperText>
								</div>
								<div style={{ display: 'flex', alignItems: 'center' }}>
									<Grid
										container
										alignItems='center'
										alignContent={'center'}
										justifyContent={'space-between'}
										translate='no'
									>
										<Field
											name={'cmi'}
											as={CmiInput}
											onChange={(event: any) => setCmi(event.target.value)}
											value={cmi}
											notranslate='true'
										/>
										<FormHelperText style={{ color: 'red' }}>
											<ErrorMessage name='cmi' />
										</FormHelperText>
										<Field
											name={'phone'}
											as={PhoneInput}
											onChange={(event: any) => setPhone(event.target.value)}
											value={phone}
											label={`*Telefono`}
											cmiValue={cmi}
										/>
									</Grid>
								</div>{' '}
								<FormHelperText style={{ color: 'red' }}>
									<ErrorMessage name='telefono' />
								</FormHelperText>
								<br />
								<div style={inputStyle}>
									<Input
										field={{
											name: 'email',
											value: values.email,
											onChange: (e) => setEmail(e.target.value),
											onBlur: () => {},
											label: '*Email',
										}}
									/>
									<FormHelperText style={{ color: 'red' }}>
										<ErrorMessage name='email' />
									</FormHelperText>
								</div>
								<div style={inputStyle}>
									<Input
										field={{
											name: 'webOrganizationUrl',
											value: webOrganizationUrl,
											onChange: (e) => setWebOrganizationUrl(e.target.value),
											onBlur: () => {},
											label: 'Su página web',
										}}
									/>
								</div>
								<div style={inputStyle}>
									<SocialMediaInput
										field={{
											value: facebookUrl,
											onChange: (e) => setFacebookUrl(e.target.value),
											onBlur: () => {},
											label: 'Facebook',
										}}
										form={undefined}
									/>
								</div>
								<div style={inputStyle}>
									<SocialMediaInput
										field={{
											value: twitterUrl,
											onChange: (e) => setTwitterUrl(e.target.value),
											onBlur: () => {},
											label: 'Twitter',
										}}
										form={undefined}
									/>
								</div>
								<div style={inputStyle}>
									<SocialMediaInput
										field={{
											value: instagramUrl,
											onChange: (e) => setInstagramUrl(e.target.value),
											onBlur: () => {},
											label: 'Instagram',
										}}
										form={undefined}
									/>
								</div>
								<div style={inputStyle}>
									<Autocomplete
										options={principalCategory}
										getOptionLabel={(category) => category.name}
										value={principalCategorySelected}
										onChange={(event, newValue) =>
											setPrincipalCategorySelected(newValue)
										}
										renderInput={(params) => (
											<div>
												<TextField {...params} label={`*Categoria principal`} />
											</div>
										)}
									/>
									<FormHelperText style={{ color: 'red' }}>
										<ErrorMessage name='principalCategory' />
									</FormHelperText>
								</div>
								<div style={inputStyle}>
									<Autocomplete
										multiple
										options={categoriasPrincipales}
										getOptionLabel={(option) => option.name}
										value={categoriasPrincipalesSelected}
										onChange={(event, newValues) => {
											handleCatPrincipalesChange(event, newValues as any[]);
										}}
										renderInput={(params: any) => (
											<TextField {...params} label='Categorias' />
										)}
									/>
								</div>
								<div style={inputStyle}>
									<Field
										name={'domicilio'}
										value={address}
										as={Input}
										label={'Domicilio'}
										onChange={(e: { target: { value: any } }) =>
											setAddress(e.target.value)
										}
									/>
								</div>
								<div style={inputStyle}>
									<Autocomplete
										options={usuarios}
										getOptionLabel={(user) => user.email}
										value={owner}
										onChange={(event, newValue) => setOwner(newValue)}
										renderInput={(params) => (
											<div>
												<TextField {...params} label='Dueño:' />
												{owner &&
													id !== 'new' &&
													owner.email === session?.user?.email && (
														<FormHelperText style={{ color: 'green' }}>
															Usted es el dueño de la organización
														</FormHelperText>
													)}
											</div>
										)}
									/>
								</div>
								<div style={{}}>
									<Field
										value={values.operador}
										name={'operador'}
										as={Input}
										label={'Email del operador'}
										onChange={(e: { target: { value: any } }) =>
											setFieldValue('operador', e.target.value)
										}
										// {...(id !== 'new' ? { disabled: true } : {})}
									/>
									<br />
									<br />
									{/* <FormHelperText style={{ color: 'red' }}>
										<ErrorMessage name={'operadores'} />
									</FormHelperText> */}
									<Button
										type='button'
										onClick={() => onAddOperator(values.operador)}
										disabled={!isValidEmailFormat(values.operador)}
									>
										Agregar
									</Button>
								</div>
								{operadores.length > 0 && (
									<OperatorList
										atributo={'user[email]'}
										elements={operadores}
										colorRef={operatorStatusColor}
										onDelete={onDeleteOperator}
									/>
								)}
							</Form>
						)}
					</Formik>
				</BasicLayout>
			)}
		</MainLayout>
	);
};

export default RegistroInstitucion;
