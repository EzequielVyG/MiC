import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { Box } from '@mui/material';
import ImageIcon from '@mui/icons-material/Image';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile';

import BasicLayout from '@/layouts/BasicLayout';
import MainLayout from '@/layouts/MainLayout';

import { getById } from '@/features/Organizations/hooks/useGetByIdQuery';
import { putDropOrganization } from '@/features/Organizations/hooks/usePutDropQuery';
import { putStatusOrganization } from '@/features/Organizations/hooks/usePutStatusQuery';

import Label from '@/components/Label/Label';
import Button from '@/components/Button/Button';
import Dialog from '@/components/Dialog/EmailDialog';
import { useSession } from 'next-auth/react';

const RegistroInstitucion = () => {
	const router = useRouter();
	const { id } = router.query;
	const { data: session } = useSession();

	const [loading, setLoading] = useState(true);
	const [organization, setOrganization] = useState<any>();

	const [dialogOpen, setDialogOpen] = useState(false); // Estado para controlar la apertura del diálogo
	const [selectedButton, setSelectedButton] = useState(''); // Estado para almacenar el botón seleccionado

	useEffect(() => {
		if (!session || new Date(session.expires) < new Date()) {
			router.replace({
				pathname: "/auth/signin",
				query: { expired: true },
			});
		}
		else {
			getData(); setLoading(false);

		}		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [id, session]);

	const getData = async () => {
		if (id && typeof id === 'string') {
			const response = await getById(id);
			setOrganization(response.data);
		}
	};

	const liberar = async () => {
		await putDropOrganization(organization);
		router.replace({
			pathname: '/organization',
			query: { selectedTab: 1, message: 'Organizacion liberada con exito' },
		});
	};

	const rechazar = async (message: string) => {
		await putStatusOrganization(organization.id, 'REJECTED', message);
		router.replace({
			pathname: '/organization',
			query: { selectedTab: 1, message: 'Organizacion rechazada con exito' },
		});
	};

	const enEspera = async (message: string) => {
		await putStatusOrganization(organization.id, 'ON_HOLD', message);
		router.replace({
			pathname: '/organization',
			query: {
				selectedTab: 1,
				message: 'Organizacion puesta en espera con exito',
			},
		});
	};

	const aceptar = async (message: string) => {
		await putStatusOrganization(organization.id, 'ACTIVE', message);
		router.replace({
			pathname: '/organization',
			query: { selectedTab: 1, message: 'Organizacion aceptada con exito' },
		});
	};

	const handleOpenDialog = (button: string) => {
		setSelectedButton(button); // Almacena el botón seleccionado
		setDialogOpen(true);
	};

	const handleCloseDialog = () => {
		setDialogOpen(false);
	};

	const handleSave = (message: string) => {
		if (selectedButton === 'Rechazar') {
			rechazar(message);
		} else if (selectedButton === 'Dejar en espera') {
			enEspera(message);
		} else if (selectedButton === 'Aceptar') {
			aceptar(message);
		}
	};

	const volver = () => {
		router.replace({
			pathname: '/organization',
			query: { selectedTab: 1 },
		});
	};

	function getFileElement(file: { url: string; name: string; id: string }) {
		const fileExtension = file.name.split('.').pop()?.toLowerCase();

		if (
			fileExtension === 'jpg' ||
			fileExtension === 'png' ||
			fileExtension === 'jpeg'
		) {
			return (
				<a href={file.url} target='_blank' rel='noopener noreferrer'>
					<ImageIcon sx={{ fontSize: 48 }} />
				</a>
			);
		} else if (fileExtension === 'pdf') {
			return (
				<a href={file.url} target='_blank' rel='noopener noreferrer'>
					<PictureAsPdfIcon sx={{ fontSize: 48 }} />
				</a>
			);
		} else {
			return (
				<a href={file.url} target='_blank' rel='noopener noreferrer'>
					<InsertDriveFileIcon sx={{ fontSize: 48 }} />
				</a>
			);
		}
	}

	return (
		<MainLayout>
			{!loading && (
				<BasicLayout title='Validación de alta de institución/organización'>
					{organization.legalName && (
						<Label
							text={`Nombre Legal: ${organization.legalName}`}
							variant='h6'
						/>
					)}
					{organization.address && (
						<Label text={`Dirección: ${organization.address}`} variant='h6' />
					)}
					{organization.cuit && (
						<Label text={`CUIT/CUIL: ${organization.cuit}`} variant='h6' />
					)}
					{organization.phone && (
						<Label text={`Teléfono: ${organization.phone}`} variant='h6' />
					)}
					{organization.owner && (
						<Label
							text={`Propietario: ${organization.owner.name
								? organization.owner.name
								: organization.owner.email
								}`}
							variant='h6'
						/>
					)}
					{organization.operators.length > 0 && (
						<Label
							text={`Operadores: ${organization.operators
								.map((s: { name: any; email: any }) =>
									s.name ? s.name : s.email
								)
								.join(', ')}`}
							variant='h6'
						/>
					)}
					{organization.principalCategory > 0 && (
						<Label
							text={`Categoria principal: ${organization.principalCategory.name}`}
							variant='h6'
						/>
					)}
					{organization.categories.length > 0 && (
						<Label
							text={`Categorías: ${organization.categories
								.map((s: { name: any }) => s.name)
								.join(', ')}`}
							variant='h6'
						/>
					)}
					{organization.supportingDocumentation.length > 0 && (
						<>
							<Label text={`Documentos de soporte:`} variant='h6' />
							<div
								style={{
									display: 'flex',
									alignItems: 'center',
									justifyContent: 'start',
									flexWrap: 'wrap',
									gap: '10px',
								}}
							>
								{organization.supportingDocumentation.map(
									(file: { url: string; name: string; id: string }) => (
										<div
											key={file.id}
											style={{ flex: '0 0 auto', maxWidth: '100%' }}
										>
											{getFileElement(file)}
										</div>
									)
								)}
							</div>
						</>
					)}
					<Box
						sx={{
							display: 'flex',
							alignItems: 'center',
							justifyContent: 'space-between',
							margin: 3,
							gap: '10px',
						}}
					>
						<Button variant='contained' onClick={liberar}>
							Liberar
						</Button>
						<Button
							variant='contained'
							onClick={() => handleOpenDialog('Rechazar')}
						>
							Rechazar
						</Button>
						<Button
							variant='contained'
							onClick={() => handleOpenDialog('Dejar en espera')}
						>
							En espera
						</Button>
						<Button
							variant='contained'
							onClick={() => handleOpenDialog('Aceptar')}
						>
							Aceptar
						</Button>
					</Box>
					<Button variant='outlined' onClick={volver}>
						Volver
					</Button>
				</BasicLayout>
			)}

			<Dialog
				text={selectedButton} // Pasa el botón seleccionado al componente
				dialogTitle={`${selectedButton} Institución`}
				onSave={handleSave}
				open={dialogOpen}
				onClose={handleCloseDialog}
			/>
		</MainLayout>
	);
};

export default RegistroInstitucion;
