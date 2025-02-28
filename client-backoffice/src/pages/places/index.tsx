import Alert from '@/components/Alert/Alert';
import Table from '@/components/Table/Table';
import React, { useEffect, useState } from 'react';

import { deletePlace } from '@/features/Places/hooks/useDeletePlaceQuery';
import { findAll } from '@/features/Places/hooks/useFindAllQuery';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';

import Button from '@/components/Button/Button';
import DialogConfirm from '@/components/Dialog/DialogConfirm';
import LoadingSpinner from '@/components/Loading/Loading';
import Title from '@/components/Title/Title';
import { Place } from '@/features/Places/place';
import { hasPermission } from '@/hooks/useUserHasPermissionQuery';
import StaticLayout from '@/layouts/StaticLayout';
import { IconButton } from '@mui/material';
import { GridColDef, GridRenderCellParams } from '@mui/x-data-grid';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';

const PlacePage: React.FC = () => {
	const { data: session } = useSession();
	const router = useRouter();
	const { message } = router.query;

	const [places, setPlaces] = useState([]);

	const [showInfo, setShowInfo] = useState(false);
	const [showMessage, setShowMessage] = useState('');

	const [dialogOpen, setDialogOpen] = useState(false); // Rename modalOpen to dialogOpen
	const [idToDelete, setIdToDelete] = useState('');

	const [isLoading, setIsLoading] = useState(true);

	useEffect(() => {
		const fetchData = async () => {
			if (!session || new Date(session.expires) < new Date()) {
				router.replace({
					pathname: '/auth/signin',
					query: { expired: true },
				});
			} else {
				setIsLoading(true);

				if (session?.user?.email) {
					await checkUserPermission(session?.user?.email);
				}

				if (message) {
					setShowMessage(message as string);
					setShowInfo(true);
				}

			}
		};

		fetchData();
	}, [session, message]);

	const checkUserPermission = async (email: string) => {
		const response = await hasPermission(email, 'readAny', 'placesRequest');
		if (response.statusCode === 500) {
			router.replace('/permissionDenied');
		}
		await getData();
		setIsLoading(false);
	};

	const getData = async () => {
		try {
			const response = await findAll();

			const lugares = response.data.map(
				(s: {
					id: any;
					name: any;
					description: any;
					phone: any;
					domicile: any;
					principalCategory: any;
				}) => {
					return {
						id: s.id,
						name: s.name,
						description: s.description,
						phone: s.phone,
						domicile: s.domicile,
						principalCategory: s.principalCategory.name,
					};
				}
			);

			setPlaces(lugares);
		} catch (error) {
			console.log('🚀 ~ file: index.tsx:85 ~ getData ~ error:', error);
		}
	};

	const columnasPlaces: GridColDef[] = [
		{
			field: 'name',
			headerName: 'Nombre',
			type: 'string',
			align: 'center',
			headerAlign: 'center',
		},
		{
			field: 'principalCategory',
			headerName: 'Categoria principal',
			type: 'string',
			align: 'center',
			headerAlign: 'center',
		},
		{
			field: 'phone',
			headerName: 'Telefono',
			type: 'string',
			align: 'center',
			headerAlign: 'center',
		},
		{
			field: 'domicile',
			headerName: 'Domicilio',
			type: 'string',
			align: 'center',
			headerAlign: 'center',
		},
		{
			field: 'actions',
			headerName: 'Acciones',
			align: 'center',
			headerAlign: 'center',
			renderCell: (params: GridRenderCellParams) => (
				<>
					<IconButton
						onClick={() => {
							handleEditClick(params.row.id);
						}}
						color='secondary'
					>
						<EditIcon />
					</IconButton>
					<IconButton
						onClick={() => handleOpenDialog(params.row.id)}
						color='secondary'
					>
						<DeleteIcon />
					</IconButton>
				</>
			),
		},
	];

	const handleEditClick = (id: string) => {
		router.push(`/places/edit/${id}`);
	};

	const handleNewClick = () => {
		router.push(`/places/edit/new`);
	};

	const handleOpenDialog = (id: string) => {
		setIdToDelete(id);
		setDialogOpen(true);
	};

	const handleCloseDialog = () => {
		setDialogOpen(false);
	};

	const borrarPlace = async (id: string) => {
		try {
			const response = await deletePlace(id);
			setShowInfo(true);
			setShowMessage(response.message);

			setPlaces(places.filter((place: Place) => place.id !== id));
			handleCloseDialog();
		} catch (error) {
			console.error('Error al borrar el lugar:', error);
		}
	};

	// const fetchPlaceData = async () => {
	//   try {
	//     const somePlaces = await findAll();
	//     console.log(somePlaces.data)
	//     if (Array.isArray(somePlaces.data)) {
	//       const placeList = somePlaces.data.map((placeDato: Place, i: number) => (
	//         <div key={i}>
	//           <Card
	//             title={placeDato.name}
	//             content={placeDato.description}
	//             photoUrl={placeDato.photos.length > 0 ? placeDato.photos[0].photoUrl : "https://d500.epimg.net/cincodias/imagenes/2016/07/04/lifestyle/1467646262_522853_1467646344_noticia_normal.jpg"}
	//             id={placeDato.id}
	//             onClick={() => handleCardClick(placeDato.id!)} // Pasa el id directamente aquí
	//           />
	//         </div>
	//       ));
	//       setList(placeList);
	//     }
	//     setShowSplash(false);
	//   } catch (error) {
	//     console.error("Error fetching places:", error);
	//   }
	// }

	return (
		<StaticLayout>
			{isLoading ? (
				<LoadingSpinner />
			) : (
				<>
					<Title textTitle={'Lugares'} />
					<br />
					<DialogConfirm
						isOpen={dialogOpen}
						onClose={handleCloseDialog}
						onConfirm={() => borrarPlace(idToDelete)}
						title={'Confirmar eliminación'}
						message={`¿Está seguro que desea eliminar este lugar? \n Si el lugar estaba en algun circuito se eliminara del mismo`}
						cancelText={'Cancelar'}
						confirmText={'Eliminar'}
					/>
					<Button onClick={() => handleNewClick()}>Nuevo</Button>
					<br />
					{showInfo && (
						<Alert
							label={showMessage}
							severity='info'
							onClose={() => setShowInfo(false)}
						/>
					)}
					<br />
					<Table isDisableToolbarButton={false} columns={columnasPlaces} data={places} showFilters={false} />
				</>
			)}
		</StaticLayout>
	);
};

export default PlacePage;
