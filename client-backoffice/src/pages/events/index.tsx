import Alert from '@/components/Alert/Alert';
import Table from '@/components/Table/Table';
import React, { useEffect, useState } from 'react';


import EditIcon from '@mui/icons-material/Edit';

import LoadingSpinner from '@/components/Loading/Loading';
import Title from '@/components/Title/Title';
import { findAllEvents } from '@/features/Events/hooks/useGetAllEventsQuery';
import { hasPermission } from '@/hooks/useUserHasPermissionQuery';
import StaticLayout from '@/layouts/StaticLayout';
import { IconButton } from '@mui/material';
import { GridColDef, GridRenderCellParams } from '@mui/x-data-grid';
import moment from 'moment';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';

const EventPage: React.FC = () => {
    const { data: session } = useSession();
    const router = useRouter();
    const { message } = router.query;

    const [events, setEvents] = useState([]);

    const [showInfo, setShowInfo] = useState(false);
    const [showMessage, setShowMessage] = useState('');

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
        const response = await hasPermission(email, 'readAny', 'eventsRequest');
        if (response.statusCode === 500) {
            router.replace('/permissionDenied');
        }
        getData();
    };

    const getData = async () => {
        try {
            const response = await findAllEvents();
            const eventos = response.data.map(
                
                (s: {
                    id: any;
                    name: any;
                    place: any;
                    principalCategory: any;
                    startDate: any;
                    status:any;
                }) => {
                    return {
                        id:s.id,
                        name: s.name,
                        place: s.place.name,
                        startDate: moment(s.startDate)
                        .format('DD/MM/yyyy - HH:mm')
                        .concat('hs'),
                        status: s.status,
                    };
                }
            );
            setEvents(eventos);
        } catch (error) {
            console.log('🚀 ~ file: index.tsx:85 ~ getData ~ error:', error);
        }
    };

    const columnasEvents: GridColDef[] = [
        {
            field: 'name',
            headerName: 'Nombre',
            type: 'string',
            align: 'center',
            headerAlign: 'center',
        },
        {
            field: 'place',
            headerName: 'Lugar',
            type: 'string',
            align: 'center',
            headerAlign: 'center',
        },
        {
            field: 'startDate',
            headerName: 'Fecha de inicio',
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
                </>
            ),
        },
    ];

    const handleEditClick = (id: string) => {
        router.push(`/events/${id}`);
    };

    return (
        <StaticLayout>
            {isLoading ? (
        <LoadingSpinner />
        ) : (
                <>
                    <Title textTitle={'Eventos'} />
                    {showInfo && (
                        <Alert
                            label={showMessage}
                            severity='info'
                            onClose={() => {
                                setShowInfo(false);
                                router.replace("./events")
                            }}
                        />
                    )}
                    <br />
                    <Table columns={columnasEvents} data={events} showFilters={false} />
                </>
            )}
        </StaticLayout>
    );
};

export default EventPage;
