import Alert from '@/components/Alert/Alert';
import Table from '@/components/Table/Table';
import React, { useEffect, useState } from 'react';

import { deleteCircuit } from '@/features/Circuits/hooks/useDeleteCircuitQuery';
import { findAllCircuits } from '@/features/Circuits/hooks/useFindAllCircuitsQuery';

import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';

import Button from '@/components/Button/Button';
import DialogConfirmDelete from '@/components/Dialog/DialogConfirmDelete';
import LoadingSpinner from '@/components/Loading/Loading';
import Title from '@/components/Title/Title';
import { Circuit } from '@/features/Circuits/circuit';
import { hasPermission } from '@/hooks/useUserHasPermissionQuery';
import StaticLayout from '@/layouts/StaticLayout';
import { IconButton } from '@mui/material';
import { GridColDef, GridRenderCellParams } from '@mui/x-data-grid';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';

const CircuitPage: React.FC = () => {
    const { data: session } = useSession();
    const router = useRouter();
    const { message } = router.query;

    const [circuits, setCircuits] = useState([]);

    const [showInfo, setShowInfo] = useState(false);
    const [showMessage, setShowMessage] = useState('');

    const [dialogOpen, setDialogOpen] = useState(false);
    const [idToDelete, setIdToDelete] = useState('');

    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
          if (!session || new Date(session.expires) < new Date()) {
            router.replace({
              pathname: "/auth/signin",
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
            await getData();
            setIsLoading(false);
          }
        };
    
        fetchData();
      }, [session, message]);

    const checkUserPermission = async (email: string) => {
        const response = await hasPermission(email, 'readAny', 'circuitsRequest');
        if (response.statusCode === 500) {
            router.replace('/permissionDenied');
        }
        getData();
    };

    const getData = async () => {
        try {
            const response = await findAllCircuits();

            const circuitos = response.data.map(
                (s: {
                    id: any;
                    name: any;
                    description: any;
                    principalCategory: any;
                    places: any;
                }) => {
                    return {
                        id: s.id,
                        name: s.name,
                        description: s.description,
                        principalCategory: s.principalCategory.name,
                        places: s.places.length,
                    };
                }
            );

            setCircuits(circuitos);
        } catch (error) {
            console.log('🚀 ~ file: index.tsx:85 ~ getData ~ error:', error);
        }
    };

    const columnasCircuits: GridColDef[] = [
        {
            field: 'name',
            headerName: 'Nombre',
            type: 'string',
            align: 'center',
            headerAlign: 'center',
        },
        {
            field: 'description',
            headerName: 'Descripción',
            type: 'string',
            align: 'center',
            headerAlign: 'center',
        },
        {
            field: 'principalCategory',
            headerName: 'Categoría',
            type: 'string',
            align: 'center',
            headerAlign: 'center',
        },
        {
            field: 'places',
            headerName: 'Nro de lugares',
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
        router.push(`/circuits/${id}`);
    };

    const handleNewClick = () => {
        router.push(`/circuits/new`);
    };

    const handleOpenDialog = (id: string) => {
        setIdToDelete(id);
        setDialogOpen(true);
    };

    const handleCloseDialog = () => {
        setDialogOpen(false);
    };

    const borrarCircuit = async (id: string) => {
        const response = await deleteCircuit(id);
        setCircuits(circuits.filter((circuit: Circuit) => circuit.id !== id));
        setShowMessage(response.message);
        setShowInfo(true);
        handleCloseDialog();
    };

    return (
        <StaticLayout>
            {isLoading ? (
        <LoadingSpinner />
        ) : (
                <>
                    <Title textTitle={'Circuitos'} />
                    <br />
                    <DialogConfirmDelete
                        isOpen={dialogOpen}
                        onClose={handleCloseDialog}
                        onConfirm={() => borrarCircuit(idToDelete)}
                    />
                    <Button onClick={() => handleNewClick()}>Nuevo</Button>
                    <br />
                    {showInfo && (
                        <Alert
                            label={showMessage}
                            severity='info'
                            onClose={() => {
                                setShowInfo(false);
                                router.replace("./circuits")
                            }}
                        />
                    )}
                    <br />
                    <Table columns={columnasCircuits} data={circuits} showFilters={false} />
                </>
            )}
        </StaticLayout>
    );
};

export default CircuitPage;
