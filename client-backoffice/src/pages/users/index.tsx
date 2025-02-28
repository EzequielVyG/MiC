import Alert from '@/components/Alert/Alert';
import Table from '@/components/Table/Table';
import React, { useEffect, useState } from 'react';

import { deleteLogicUser } from '@/features/Users/hooks/useDeleteLogicUserQuery';
import { getUsers } from '@/features/Users/hooks/useGetUsersQuery';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';

import DialogConfirmDelete from '@/components/Dialog/DialogConfirmDelete';
import LoadingSpinner from '@/components/Loading/Loading';
import Title from '@/components/Title/Title';
import { Role } from '@/features/Roles/role';
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

	const [users, setUsers] = useState([]);

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
		const response = await hasPermission(email, 'readAny', 'users');
		if (response.statusCode === 500) {
			router.replace('/permissionDenied');
		}
		await getData();
		setIsLoading(false); 
	};

	const getData = async () => {
		try {
		  const response = await getUsers();
	  
		  const activeUsers: any = [];
		  const deletedUsers : any= [];
	  
		  response.data.forEach((s: any) => {
			const user = {
			  id: s.id,
			  password: s.password,
			  email: s.email,
			  status: s.status,
			  avatar: s.avatar,
			  name: s.name,
			  fechaNacimiento: s.fechaNacimiento,
			  roles: s.roles.map((role: Role) => role.name).join(' / '),
			};
	  
			if (user.status === 'DELETED') {
			  deletedUsers.push(user);
			} else {
			  activeUsers.push(user);
			}
		  });
	  
		  // Concatenar ambas listas para que los usuarios eliminados lógicamente estén al final
		  const users = activeUsers.concat(deletedUsers);
	  
		  setUsers(users);
		} catch (error) {
		  console.log('🚀 ~ file: index.tsx:85 ~ getData ~ error:', error);
		}
	  };

	const columnasUsers: GridColDef[] = [
		{
			field: 'name',
			headerName: 'Nombre',
			type: 'string',
			align: 'center',
			headerAlign: 'center',
		},
		{
			field: 'email',
			headerName: 'Email',
			type: 'string',
			align: 'center',
			headerAlign: 'center',
		},
		{
			field: 'roles',
			headerName: 'Roles',
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
				{params.row.status !== 'DELETED' && ( 
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
				)}
			  </>
			),
		  },	  
	];

	const handleEditClick = (id: string) => {
		router.push(`/users/edit/${id}`);
	};

	// const handleNewClick = () => {
	// 	router.push(`/organizations/edit/new`);
	// };

	const handleOpenDialog = (id: string) => {
		setIdToDelete(id);
		setDialogOpen(true);
	};

	const handleCloseDialog = () => {
		setDialogOpen(false);
	};

	const borrarUsuario = async (id: string) => {
		const response = await deleteLogicUser(id); 
		setShowInfo(true);
		setShowMessage(response.message);
		getData();
		handleCloseDialog();
	};

	return (
		<StaticLayout>
			{isLoading ? (
				<LoadingSpinner />
			) : (
				<>
					<Title textTitle={'Usuarios'} />
					<br />
					<DialogConfirmDelete
						isOpen={dialogOpen}
						onClose={handleCloseDialog}
						onConfirm={() => borrarUsuario(idToDelete)}
					/>
					{/* <Button onClick={() => handleNewClick()}>Nuevo</Button>
					<br /> */}
					{showInfo && (
						<Alert
							label={showMessage}
							severity='info'
							onClose={() => setShowInfo(false)}
						/>
					)}
					<br />
					<Table
						columns={columnasUsers}
						data={users}
						showFilters={false}
					/>
				</>
			)}
		</StaticLayout>
	);
};

export default OrganizationPage;
