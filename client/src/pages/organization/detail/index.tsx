import { getuserByEmail } from '@/features/Users/hooks/useGetUserByEmailQuery';
import { useSession } from 'next-auth/react';
import React, { useEffect, useState } from 'react';

import Button from '@/components/Button/Button';
import FileUploadPreview from '@/components/Input/FileInput';
import Input from '@/components/Input/Input';
import Label from '@/components/Label/Label';
import GenericInputList from '@/components/List/ListWithInput';
import Loading from '@/components/Loading/Loading';
import { getAllCategorias } from '@/features/Categories/hooks/useGetAllCategoriasQuery';
import { getCategoriasByParent } from '@/features/Categories/hooks/useGetCategoriasQuery';
import { createSolicitud } from '@/features/Organizations/hooks/useCreateSolicitudQuery';
import useGetUsersQuery from '@/features/Users/hooks/useGetUsersQuery';
import { User } from '@/features/Users/user';
import BasicLayout from '@/layouts/BasicLayout';
import MainLayout from '@/layouts/MainLayout';
import { Autocomplete, TextField } from '@mui/material';
import { ErrorMessage, Field, Form, Formik } from 'formik';
import { useRouter } from 'next/router';
import { number, object, string } from 'yup';
import { hasPermission } from '../../../hooks/useUserHasPermissionQuery';

const RegistroInstitucion = () => {
	const { data: session } = useSession();
	const router = useRouter();

	const [isLoading, setIsLoading] = useState(true);

	const [categoriasPrincipales, setCategoriasPrincipales] = useState<any[]>([]);
	const [categoriasPrincipalesSelected, setCategoriasPrincipalesSelected] =
		useState<any[]>([]);

	const [principalCategory, setPrincipalCategory] = useState<any>(null);
	const [principalCategorySelected, setPrincipalCategorySelected] =
		useState<any>(null);

	const [operadores, setOperadores] = useState<any[]>([]);
	const [operadoresSelected, setOperadoresSelected] = useState<any[]>([]);

	const [files, setFiles] = useState<File[]>([]);
	const [myUser, setMyUser] = useState<User | null>();

	const [descriptionsGenericas, setDescriptionsGenericas] = useState<string[]>(
		[]
	);

	useEffect(() => {
		if (!session || new Date(session.expires) < new Date()) {
			router.replace({
				pathname: "/auth/signin",
				query: { expired: true },
			});
		}
		else {
			if (session?.user?.email) {
				checkUserPermission(session?.user?.email);
				getuserByEmail(session?.user?.email).then((response) => {
					if (response.data) {
						setMyUser(response.data);
					}
				});
			}
			getData();
			setIsLoading(false);
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [session]);

	const checkUserPermission = async (email: string) => {
		const response = await hasPermission(
			email,
			'createOwn',
			'organizationRequest'
		);
		if (response.statusCode === 500) {
			router.replace('/permissionDenied');
		}
	};

	const getData = async () => {
		const someCategoriasPrincipales = await getCategoriasByParent(null);
		setPrincipalCategory(someCategoriasPrincipales.data);
		const someCategorias = await getAllCategorias();
		setCategoriasPrincipales(someCategorias.data);

		setOperadores((await useGetUsersQuery.getUsers()).data);
	};

	const onSubmit = async (values: Record<string, any>) => {
		const formData = new FormData();

		files.forEach((file, index: number) => {
			formData.append('supportingDocumentation', file);
			const aDescription = {
				description: descriptionsGenericas[index],
				filename: file.name,
			};
			formData.append('documentDescriptions', JSON.stringify(aDescription));
		});
		formData.append('legalName', values.razonSocial);
		formData.append('address', values.domicilio);
		formData.append('cuit', values.cuit);
		formData.append(
			'principalCategory',
			JSON.stringify(principalCategorySelected)
		);
		formData.append(
			'categories',
			JSON.stringify(categoriasPrincipalesSelected)
		);

		formData.append('phone', values.telefono);

		if (myUser) {
			formData.append('owner', JSON.stringify(myUser));
		}
		formData.append('operators', JSON.stringify(operadoresSelected));

		await createSolicitud(formData);
		router.replace({
			pathname: '/home',
			query: { selectedTab: 0, message: 'Organizacion creada con exito' },
		});
	};

	const initialValues = {
		razonSocial: '',
		domicilio: '',
		cuit: '',
		telefono: '',
		categoriasPrincipales: 0,
	};

	const validationSchema = object().shape({
		razonSocial: string().required('*Campo requerido'),
		domicilio: string().required('*Campo requerido'),
		cuit: string().required('*Campo requerido'),
		telefono: string().required('*Campo requerido'),
		categoriasPrincipales: number().min(1, 'Seleccione al menos una categoría'),
	});

	const fields = [
		{
			name: 'razonSocial',
			label: 'razonSocial',
			props: { label: 'Razon Social' },
			component: Input,
		},
		{
			name: 'domicilio',
			label: 'domicilio',
			props: { label: 'Domicilio' },
			component: Input,
		},
		{
			name: 'cuit',
			label: 'cuit',
			props: { label: 'CUIT/CUIL' },
			component: Input,
		},
		{
			name: 'telefono',
			label: 'telefono',
			props: { label: 'Numero de telefono' },
			component: Input,
		},
	];

	const handleCatPrincipalesChange = async (
		e: React.SyntheticEvent<Element, Event>,
		values: any[]
	) => {
		setCategoriasPrincipalesSelected(values);
	};

	const handleOperadoresChange = async (
		e: React.SyntheticEvent<Element, Event>,
		values: any[]
	) => {
		let someOperadores = operadoresSelected;
		someOperadores = [...values];
		setOperadoresSelected(someOperadores);
	};

	const handleFileChange = (newFiles: File[] | null) => {
		if (newFiles) setFiles((prevFiles) => [...prevFiles, ...newFiles]);
	};

	const handleDeleteFile = (index: number) => {
		setFiles((prevFiles) => prevFiles.filter((_, i) => i !== index));
	};

	return (
		<MainLayout>
			{isLoading ? (
				<Loading />
			) : (
				<>
					<BasicLayout title='Solicitud de alta de institución/organización'>
						<br />
						<Formik
							enableReinitialize
							initialValues={initialValues}
							validationSchema={validationSchema}
							onSubmit={onSubmit}
						>
							{({ setFieldValue, errors, touched }) => (
								<Form>
									{fields.map((field) => (
										<div key={field.name} style={{ marginBottom: '14px' }}>
											<Field
												name={field.name}
												as={field.component}
												{...field.props}
											/>
											{/* {errors[field.name] && touched[field.name] && (
										<span style={{ color: 'red' }}>
											<ErrorMessage name={field.name} />
										</span>
									)} */}
										</div>
									))}

									<Autocomplete
										options={principalCategory}
										getOptionLabel={(category) => category.name}
										value={principalCategorySelected}
										onChange={(event, newValue) =>
											setPrincipalCategorySelected(newValue)
										}
										renderInput={(params) => (
											<TextField {...params} label={'Categoria principal'} />
										)}
									/>

									<br />
									<Autocomplete
										multiple
										options={categoriasPrincipales}
										getOptionLabel={(option) => option.name}
										onChange={(event, newValues) => {
											handleCatPrincipalesChange(event, newValues as string[]);
											setFieldValue('categoriasPrincipales', newValues.length);
										}}
										renderInput={(params: any) => (
											<TextField {...params} label={'Categorías'} />
										)}
									/>
									{errors.categoriasPrincipales &&
										touched.categoriasPrincipales && (
											<span style={{ color: 'red' }}>
												<ErrorMessage name={'categoriasPrincipales'} />
											</span>
										)}

									<br />
									<Autocomplete
										multiple={true}
										options={operadores}
										getOptionLabel={(option) => option.name}
										onChange={handleOperadoresChange}
										renderInput={(params: any) => (
											<TextField {...params} label={'Operadores'} />
										)}
									/>
									<br />
									<Label text={'Documentación de soporte'} />
									<FileUploadPreview
										label={'Seleccionar documentacion'}
										accept={'image/jpg,image/jpeg,image/png,application/pdf'}
										onChange={handleFileChange}
									/>
									{files.length > 0 && (
										<GenericInputList
											elements={files}
											onDelete={handleDeleteFile}
											someDescriptions={descriptionsGenericas}
											handleTextChange={setDescriptionsGenericas}
										/>
									)}
									<br />
									<br />
									<Button label={'Guardar'} type='submit' />
								</Form>
							)}
						</Formik>
					</BasicLayout>
				</>
			)}
		</MainLayout>
	);
};

export default RegistroInstitucion;
