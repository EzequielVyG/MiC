import Alert from '@/components/Alert/Alert';
import Button from '@/components/Button/Button';
import DialogConfirmDelete from '@/components/Dialog/ConfirmDeleteDialog';
import CmiInput from '@/components/Input/CmiInput';
import CuilInput from '@/components/Input/CuilInput';
import FileUploadPreview from '@/components/Input/FileInput';
import Input from '@/components/Input/Input';
import PhoneInput from '@/components/Input/PhoneInput';
import SocialMediaInput from '@/components/Input/SocialMediaInput';
import Label from '@/components/Label/Label';
import GenericList from '@/components/List/List';
import OperatorList from '@/components/List/OperatorList';
import LoadingSpinner from '@/components/Loading/Loading';
import { getAllCategorias } from '@/features/Categories/hooks/useGetAllCategoriasQuery';
import { createSolicitud } from '@/features/Organizations/hooks/useCreateSolicitudQuery';
import { deleteSolicitud } from '@/features/Organizations/hooks/useDeleteQuery';
import { getById } from '@/features/Organizations/hooks/useGetByIdQuery';
import { updateSolicitud } from '@/features/Organizations/hooks/useUpdateSolicitudQuery';
// import { getuserByEmail } from '@/features/Users/hooks/useGetUserByEmailQuery';
import getUsers from '@/features/Users/hooks/useGetUsersQuery';
import { User } from '@/features/Users/user';
import BasicLayout from '@/layouts/BasicLayout';
import MainLayout from '@/layouts/MainLayout';
import en from '@/locale/en';
import es from '@/locale/es';
import { LoadingButton } from '@mui/lab';
import { Autocomplete, FormHelperText, Grid, TextField } from '@mui/material';
import { ErrorMessage, Field, Form, Formik } from 'formik';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import { object, string } from 'yup';

const RegistroInstitucion = () => {
	const { data: session } = useSession();
	const router = useRouter();

	const [categoriasOptions, setCategoriasOptions] = useState<any[]>([]);
	const [categoriasSelected, setCategoriasSelected] = useState<any[]>([]);

	const [showInfo, setShowInfo] = useState(false);
	const [showMessage, setShowMessage] = useState('');

	const [principalCategorySelected, setPrincipalCategorySelected] =
		useState<any>(null);

	const [operadores, setOperadores] = useState<any[]>([]);

	const [files, setFiles] = useState<File[]>([]);
	// const [myUser, setMyUser] = useState<User | null>();
	const { id } = router.query;
	const { locale } = router;
	const t: any = locale === 'en' ? en : es;
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
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	const [status, setStatus] = useState('');
	const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
	const [isLoading, setIsLoading] = useState(true);
	const [isSaving, setIsSaving] = useState<boolean>(false);
	const [usuarios, setUsuarios] = useState<any[]>([]);
	const [owner, setOwner] = useState<User | null>(null);

	useEffect(() => {
		if (!session || new Date(session.expires) < new Date()) {
			router.replace({
				pathname: '/auth/signin',
				query: { expired: true },
			});
		} else {
			// if (session?.user?.email) {
			// 	getuserByEmail(session?.user?.email).then((response) => {
			// 		if (response.data) {
			// 			setMyUser(response.data);
			// 		}
			// 	});
			// }
			getData();
			fetchOrganizationData();
		}
	}, [id, session]);

	const initialValues = {
		razonSocial: legalName,
		domicilio: address,
		description: description,
		cuit: cuit,
		principalCategory: principalCategorySelected,
		phone: phone,
		cmi: cmi,
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
				setCategoriasSelected(organization.data.categories);
				setPrincipalCategorySelected(organization.data.principalCategory);
				setFiles(organization.data.supportingDocumentation);
				setCmi(organization.data.cmi);
				setPhone(organization.data.phone);
				setOperadores(organization.data.operators);
				setStatus(organization.data.status);
				setOwner(organization.data.owner);
				setFacebookUrl(organization.data.facebook_url);
				setTwitterUrl(organization.data.twitter_url);
				setInstagramUrl(organization.data.instagram_url);
				setEmail(organization.data.email);
				setWebOrganizationUrl(organization.data.web_organization_url);
				setDescription(organization.data.description);
				console.log(
					'🚀 ~ file: [id].tsx:115 ~ fetchOrganizationData ~ organization.data.:',
					organization.data
				);
			} else {
				setOwner(session?.user as User);
			}
		} catch (error) {
			console.error('Error fetching place data:', error);
		}
		setIsLoading(false);
	}

	const getData = async () => {
		const someSubcategorias = await getAllCategorias();
		setCategoriasOptions(someSubcategorias.data);
		setUsuarios((await getUsers.getUsers()).data);
	};

	const onSubmit = async (values: Record<string, any>) => {
		setIsSaving(true);
		const formData = new FormData();

		if (id != 'new') {
			formData.append('id', organizationId as string);
			formData.append('status', status);
		}

		formData.append('legalName', values.razonSocial);
		formData.append('address', values.domicilio);
		formData.append('cuit', values.cuit);
		formData.append('categories', JSON.stringify(categoriasSelected));
		formData.append(
			'principalCategory',
			JSON.stringify(principalCategorySelected)
		);
		formData.append('cmi', cmi);
		formData.append('phone', phone);

		formData.append('owner', JSON.stringify(owner));
		formData.append('operators', JSON.stringify(operadores));

		files.forEach((file) => {
			formData.append('supportingDocumentation', file);
		});
		formData.append('facebook_url', facebookUrl);
		formData.append('twitter_url', twitterUrl);
		formData.append('instagram_url', instagramUrl);
		formData.append('email', email);
		formData.append('web_organization_url', webOrganizationUrl);
		formData.append('description', description);
		let response;
		if (id != 'new') {
			response = await updateSolicitud(formData);
		} else {
			response = await createSolicitud(formData);
		}
		if (response.statusCode !== 500) {
			setIsSaving(false);
			router.replace(`/organization/edit/${response.data.id}`);
			setShowMessage(response.message);
			setShowInfo(true);
		} else {
			setIsSaving(false);
			setShowMessage(response.message);
			setShowInfo(true);
		}
	};

	const handleDelete = () => {
		setIsDeleteDialogOpen(true);
	};

	const handleConfirmDelete = async () => {
		const response = await deleteSolicitud(organizationId);
		router.push({
			pathname: `/mi_perfil`,
			query: { message: response.message, tab: 1 },
		});
		setIsDeleteDialogOpen(false);
	};

	const validationSchema = object().shape({
		razonSocial: string().required(t['requiredField']),
		domicilio: string().required(t['requiredField']),
		cuit: string()
			.required('*Campo requerido')
			.test('cuit', 'El CUIT no es válido', (value) => {
				const cuitWithoutDashes = value.replace(/-/g, '');
				if (!/^\d{2}\d{8,9}\d{1}$/.test(cuitWithoutDashes)) {
					return false;
				}
				return true;
			}),
		phone: string()
			.required('*Campo requerido')
			.test('telefono', 'El número de teléfono no es válido', (value) => {
				const phoneWithoutFormatting = value.replace(/[() -]/g, '');
				if (!/^\d{11}$/.test(phoneWithoutFormatting)) {
					return false;
				}
				return true;
			}),
		principalCategory: object().required(t['requiredField']),
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

	const handleCuitInputChange = (newValue: string) => {
		setCuit(newValue);
	};

	const fields = [
		{
			name: 'razonSocial',
			label: 'razonSocial',
			props: {
				label: `* ${t['legalName']}`,
				onBlur: (event: any) => setLegalName(event.target.value),
			},
			component: Input,
			value: legalName,
			disabled: status === 'Activo' || status === 'En revisión',
		},
		{
			name: 'description',
			label: 'description',
			props: {
				label: `${t['description']}`,
				onBlur: (event: any) => setDescription(event.target.value),
			},
			component: Input,
			value: description,
		},
		{
			name: 'domicilio',
			label: 'domicilio',
			props: {
				label: `* ${t['address']}`,
				onBlur: (event: any) => setAddress(event.target.value),
			},
			component: Input,
			value: address,
			disabled: false,
		},
		{
			name: 'cuit',
			label: 'cuit',
			props: {
				label: '* CUIT/CUIL',
				inputValue: cuit,
				onInputChange: handleCuitInputChange,
			},
			component: CuilInput,
			value: cuit,
			disabled: status === 'Activo' || status === 'En revisión',
		},
	];

	const handleChangeCategories = async (
		e: React.SyntheticEvent<Element, Event>,
		values: any[]
	) => {
		setCategoriasSelected(values);
	};

	const handleFileChange = (newFiles: File[] | null) => {
		if (newFiles) setFiles((prevFiles) => [...prevFiles, ...newFiles]);
	};

	const handleDeleteFile = (index: number) => {
		setFiles((prevFiles) => prevFiles.filter((_, i) => i !== index));
	};

	const onAddOperator = (aEmail: string) => {
		setOperadores([...operadores, { user: { email: aEmail } }]);
	};

	const onDeleteOperator = (aindex: number) => {
		const someOperadores = operadores.filter((op, index) => index !== aindex);
		setOperadores(someOperadores);
	};

	const isValidEmailFormat = (email: string) => {
		// Expresión regular para validar el formato de un correo electrónico
		const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
		return emailRegex.test(email);
	};

	const operatorStatusColor = {
		PENDING: 'rgba(255, 165, 0, 0.5)',
		ACCEPTED: 'rgba(144, 238, 144, 0.5)',
		REJECTED: 'rgba(255, 105, 97, 0.5)',
		NOT_EXISTS: 'rgba(192, 192, 192, 0.5)',
	};

	const inputStyle = {
		width: '80vw',
		minWidth: '100px',
		maxWidth: '400px',
		marginBottom: '20px',
	};

	return (
		<MainLayout>
			{isLoading ? (
				<LoadingSpinner />
			) : (
				<BasicLayout
					title={id === 'new' ? t['createorganization'] : t['editorganization']}
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
					>
						{({ values, setFieldValue }) => (
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
											label={t['go_back']}
											disabled={isSaving}
											onClick={() => router.back()}
										/>
										<LoadingButton
											variant='contained'
											loading={isSaving}
											type='submit'
											sx={{
												padding: '5px 5px',
												marginRight: '3%',
											}}
										>
											{t['save']}{' '}
										</LoadingButton>
										<Button
											label={t['delete']}
											onClick={handleDelete}
											disabled={id === 'new'}
										/>
									</div>
								</div>
								{fields.map((field) => (
									<div key={field.name} style={{ marginBottom: '14px' }}>
										<Field
											name={field.name}
											as={field.component}
											{...field.props}
											disabled={field.disabled}
										/>
										<FormHelperText style={{ color: 'red' }}>
											<ErrorMessage name={field.name} />
										</FormHelperText>
									</div>
								))}
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
											label={`* ${t['phone']}`}
											cmiValue={cmi}
										/>
									</Grid>
								</div>{' '}
								<FormHelperText style={{ color: 'red' }}>
									<ErrorMessage name='phone' />
								</FormHelperText>
								<br />
								<div style={inputStyle}>
									<Input
										field={{
											name: 'email',
											value: email,
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
											onChange: (e: {
												target: { value: React.SetStateAction<string> };
											}) => setFacebookUrl(e.target.value),
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
											onChange: (e: {
												target: { value: React.SetStateAction<string> };
											}) => setTwitterUrl(e.target.value),
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
											onChange: (e: {
												target: { value: React.SetStateAction<string> };
											}) => setInstagramUrl(e.target.value),
											onBlur: () => {},
											label: 'Instagram',
										}}
										form={undefined}
									/>
								</div>
								<div style={inputStyle}>
									<Autocomplete
										options={categoriasOptions}
										getOptionLabel={(category) => category.name}
										value={principalCategorySelected}
										onChange={(event, newValue) =>
											setPrincipalCategorySelected(newValue)
										}
										renderInput={(params) => (
											<div>
												<TextField
													{...params}
													label={`* ${t['principalCategory']}`}
												/>
											</div>
										)}
									/>
								</div>
								<FormHelperText style={{ color: 'red' }}>
									<ErrorMessage name='principalCategory' />
								</FormHelperText>
								<div style={inputStyle}>
									<Autocomplete
										multiple
										options={categoriasOptions}
										getOptionLabel={(option) => option.name}
										value={categoriasSelected}
										onChange={(event, newValues) => {
											handleChangeCategories(event, newValues as string[]);
										}}
										renderInput={(params: any) => (
											<TextField {...params} label={t['categories']} />
										)}
									/>
								</div>
								<div style={inputStyle}>
									<Autocomplete
										options={usuarios}
										getOptionLabel={(user) => user.email}
										value={owner}
										disabled={true}
										// onChange={(event, newValue) => setOwner(newValue)}
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
								<div style={inputStyle}>
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
								</div>
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
								{operadores.length > 0 && (
									<OperatorList
										atributo={'user[email]'}
										elements={operadores}
										colorRef={operatorStatusColor}
										t={t}
										onDelete={onDeleteOperator}
									/>
								)}
								<br />
								<Label text={t['supportingDocumentation']} />
								<FileUploadPreview
									label={t['selectDocumentation']}
									accept={'image/jpg,image/jpeg,image/png,application/pdf'}
									onChange={handleFileChange}
									disabled={status === 'Activo' || status === 'En revisión'}
								/>
								{files.length > 0 && (
									<GenericList elements={files} onDelete={handleDeleteFile} />
								)}
								<br />
								<DialogConfirmDelete
									isOpen={isDeleteDialogOpen}
									onClose={() => setIsDeleteDialogOpen(false)}
									onConfirm={handleConfirmDelete}
									title={'Confirmar eliminación'}
									message={
										' ¿Estás seguro de que deseas eliminar esta organización?'
									}
									cancelButtonText={'Cancelar'}
									confirmButtonText={'Eliminar'}
								/>
							</Form>
						)}
					</Formik>
				</BasicLayout>
			)}
		</MainLayout>
	);
};

export default RegistroInstitucion;
