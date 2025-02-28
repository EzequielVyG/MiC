import Alert from '@/components/Alert/Alert';
import Table from '@/components/Table/Table';
import React, { useEffect, useState } from 'react';

import { deleteSolicitud } from '@/features/Organizations/hooks/useDeleteQuery';
import { getAllOrganizations } from '@/features/Organizations/hooks/useGetAllQuery';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';

import Button from '@/components/Button/Button';
import DialogConfirmDelete from '@/components/Dialog/DialogConfirmDelete';
import LoadingSpinner from '@/components/Loading/Loading';
import Title from '@/components/Title/Title';
import { Organization } from '@/features/Organizations/organization';
import { hasPermission } from '@/hooks/useUserHasPermissionQuery';
import StaticLayout from '@/layouts/StaticLayout';
import { IconButton } from '@mui/material';
import { GridColDef, GridRenderCellParams } from '@mui/x-data-grid';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';

const OrganizationPage: React.FC = () => {
	const { data: session } = useSession();
	const router = useRouter();
	const { message } = router.query;

	const [organizations, setOrganizations] = useState([]);

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
		const response = await hasPermission(
			email,
			'readAny',
			'lveOrganizations'
		);
		if (response.statusCode === 500) {
			router.replace('/permissionDenied');
		}
		await getData();
		setIsLoading(false);
	};

	const getData = async () => {
		try {
			const response = await getAllOrganizations();

			const organizaciones = response.data.map(
				(s: {
					id: any;
					legalName: any;
					address: any;
					cuit: any;
					categories: any;
					principalCategory: any;
					phone: any;
					owner: any;
					operators: any;
					supportingDocumentation: any;
					status: any;
				}) => {
					return {
						id: s.id,
						legalName: s.legalName,
						address: s.address,
						cuit: s.cuit,
						categories: s.categories,
						principalCategory: s.principalCategory,
						phone: s.phone,
						owner: s.owner,
						operators: s.operators,
						supportingDocumentation: s.supportingDocumentation,
						status: s.status,
					};
				}
			);
			setOrganizations(organizaciones);
		} catch (error) {
			console.log('🚀 ~ file: index.tsx:85 ~ getData ~ error:', error);
		}
	};

	const columnasOrganizations: GridColDef[] = [
		{
			field: 'legalName',
			headerName: 'Nombre',
			type: 'string',
			align: 'center',
			headerAlign: 'center',
		},
		{
			field: 'cuit',
			headerName: 'Cuit',
			type: 'string',
			align: 'center',
			headerAlign: 'center',
		},
		{
			field: 'status',
			headerName: 'Estado',
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
		router.push(`/organizations/edit/${id}`);
	};

	const handleNewClick = () => {
		router.push(`/organizations/edit/new`);
	};

	const handleOpenDialog = (id: string) => {
		setIdToDelete(id);
		setDialogOpen(true);
	};

	const handleCloseDialog = () => {
		setDialogOpen(false);
	};

	const borrarOrganization = async (id: string) => {
		const response = await deleteSolicitud(id);
		setShowInfo(true);
		setShowMessage(response.message);
		setOrganizations(
			organizations.filter(
				(organization: Organization) => organization.id !== id
			)
		);
		handleCloseDialog();
	};

	return (
		<StaticLayout>
			{isLoading ? (
				<LoadingSpinner />
			) : (
				<>
					<Title textTitle={'Organizaciones'} />
					<br />
					<DialogConfirmDelete
						isOpen={dialogOpen}
						onClose={handleCloseDialog}
						onConfirm={() => borrarOrganization(idToDelete)}
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
					<Table
						columns={columnasOrganizations}
						data={organizations}
						showFilters={false}
						isDisableToolbarButton={false}
					/>
				</>
			)}
		</StaticLayout>
	);
};

export default OrganizationPage;
