import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

import Button from '@/components/Button/Button';
import CardEvent from '@/components/Card/CardEvent';
import BasicLayout from '@/layouts/BasicLayout';
import en from '@/locale/en';
import es from '@/locale/es';

import Alert from '@/components/Alert/Alert';
import TagEvent from '@/components/Tag/TagEvent';
import FilterPanel from '@/components/Filter/FilterPanel';
import LoadingSpinner from '@/components/Loading/Loading';
import { Event } from '@/features/Events/Event';
import { getByFilters } from '@/features/Events/hooks/useGetByFilterQuery';
import useMyEventsFilters from '@/features/Events/utils/useMyEventsFilters';
import useMyEventsOrganizationFilters from '@/features/Events/utils/useMyEventsOrganizationFilters';
import { findListEvent } from '@/features/Traslators/hooks/useFindListEvent';
import { Translator } from '@/features/Traslators/translator';
import moment from 'moment';
import { useSession } from 'next-auth/react';
import { getOrganizationsByUserEmail } from '@/features/Organizations/hooks/useGetByUserEmailQuery';

const MyEvents = () => {
	const router = useRouter();
	const { data: session } = useSession();
	const { locale } = router;
	const t: any = locale === 'en' ? en : es;
	const { message } = router.query;
	const [isLoading, setIsLoading] = useState(true);

	const [showInfo, setShowInfo] = useState(false);
	const [showMessage, setShowMessage] = useState('');

	const [listEvents, setListEvents] = useState<Event[]>([]);
	const [listOrganizations, setListOrganizations] = useState<string[]>([]);
	const { statusFilters, setStatusFilters } = useMyEventsFilters();
	const { orgFilters, setOrgFilters } = useMyEventsOrganizationFilters();

	const status = ['Vigentes', 'Borradores', 'Todos'];

	const initialSelectedOptions = {
		filter_statuses: statusFilters,
		filter_organizations: orgFilters,
	};

	const [listTranslators, setListTranslators] = useState<Translator[]>([]); // Asegura que list sea un arreglo vacío al inicio

	useEffect(() => {
		if (!session || new Date(session.expires) < new Date()) {
			router.replace({
				pathname: '/auth/signin',
				query: { expired: true },
			});
		} else {
			if (message) {
				setShowInfo(true);
				setShowMessage(message as string);
			}
			getDataFilters();
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	const getDataEvents = async (filterStatus: string[], filterOrg: string[]) => {
		try {
			if (session?.user?.email) {
				const response = await getByFilters(
					filterStatus,
					filterOrg
				);
				setListEvents(response.data);
				const someTranslators = await findListEvent(response.data);
				setListTranslators(someTranslators.data);
			}
		} catch (error) {
			console.error('Error fetching places:', error);
		}
		setIsLoading(false);
	};

	const getDataFilters = async () => {
		try {
			const response = await getOrganizationsByUserEmail(session?.user?.email);
			let orgs = response.data.map(
				(o: { legalName: any }) => o.legalName
			);
			setListOrganizations(orgs);

			if (orgFilters.length > 0) {
				orgs = orgFilters
			}
			setOrgFilters(orgs)

			let statuses
			if (statusFilters.length === 0) {
				statuses = ['Vigentes']
			} else {
				statuses = statusFilters
			}
			setStatusFilters(statuses)

			const estadosMapeados: string[] = [];
			statuses.forEach((estados: string) => {
				EventStatusMap[estados].forEach((status) => {
					if (!estadosMapeados.includes(status)) estadosMapeados.push(status);
				});
			});

			getDataEvents(estadosMapeados, orgs);
		} catch (error) {
			console.error('Error fetching places:', error);
		}
		setIsLoading(false);
	};

	const handleCardClick = (id: string) => {
		router.push(`/events/edit/${id}`);
	};

	const handleFilter = (f: any) => {
		// Verificar si filter_statuses y filter_organizations existen en filters
		const filter_statuses = f.filter_statuses || [];
		const filter_organizations = f.filter_organizations || [];

		const estadosMapeados: string[] = [];
		filter_statuses.forEach((estados: string) => {
			EventStatusMap[estados].forEach((status) => {
				if (!estadosMapeados.includes(status)) estadosMapeados.push(status);
			});
		});

		setStatusFilters(filter_statuses);

		setOrgFilters(filter_organizations);

		getDataEvents(estadosMapeados, filter_organizations);
	};

	const EventStatusMap: { [key: string]: string[] } = {
		Vigentes: ['VIGENTS'],
		Todos: ['CANCELED', 'DRAFT', 'SCHEDULED', 'PENDING'],
		Borradores: ['DRAFT'],
	};

	// Función para obtener la traducción del nombre del evento
	const getTranslatedEventName = (eventData: Event) => {
		if (!eventData || !listTranslators) {
			return ''; // Manejar caso sin datos
		}

		// Buscar la traducción en la lista de traductores
		const translation = listTranslators.find(
			(item) =>
				item.campo === 'name' &&
				item.idioma === locale &&
				item.identificador === eventData.id
		);

		// Si se encontró la traducción, devolverla; de lo contrario, usar el nombre predeterminado
		return translation ? translation.traduccion : eventData.name || '';
	};

	// Función para obtener la traducción del nombre del evento
	const getTranslatedEventDescription = (eventData: Event) => {
		if (!eventData || !listTranslators) {
			return ''; // Manejar caso sin datos
		}
		// Buscar la traducción en la lista de traductores
		const translation = listTranslators.find(
			(item) =>
				item.campo === 'description' &&
				item.idioma === locale &&
				item.identificador === eventData.id
		);

		// Si se encontró la traducción, devolverla; de lo contrario, usar el nombre predeterminado
		return translation ? translation.traduccion : eventData.description || '';
	};

	return (
		<>
			{isLoading ? (
				<LoadingSpinner />
			) : (
				<>
					<BasicLayout title={t['my_events']}>
						<div
							style={{
								flex: 1,
								display: 'flex',
								justifyContent: 'center',
								alignItems: 'center',
								flexDirection: 'column',
								textAlign: 'center',
							}}
						>
							{showInfo && (
								<Alert
									label={showMessage}
									severity='info'
									onClose={() => setShowInfo(false)}
								/>
							)}
						</div>
						<div
							style={{
								display: 'flex',
								alignItems: 'center',
								marginBottom: 10,
							}}
						>
							<Button
								label={t['new_event']}
								onClick={() => handleCardClick('new')}
							/>
							<FilterPanel
								sections={[
									{ title: 'filter_statuses', filters: status },
									{ title: 'filter_organizations', filters: listOrganizations },
								]}
								onFilterChange={handleFilter}
								initialSelectedOptions={initialSelectedOptions}
							/>
						</div>
						<br />
						<div style={{ marginBottom: 10 }}>
							<div style={{ display: 'inline-block', marginRight: 5 }}>
								<TagEvent text={`Estados: ${statusFilters.join(', ')}`} />
							</div>
							<div style={{ display: 'inline-block', marginRight: 5 }}>
								<TagEvent text={`Organizaciones: ${orgFilters.join(', ')}`} />
							</div>
						</div>
						{listEvents.map((event: Event, i: number) => (
							<div key={i}>
								<CardEvent
									title={getTranslatedEventName(event)}
									description={getTranslatedEventDescription(event)}
									status={t['estadosEvento'][event.status]}
									startDate={
										event.startDate
											? moment(event.startDate).isSame(moment(), 'day')
												? `Hoy ${moment(event.startDate).format('HH:mm')}`
												: moment(event.startDate).format('DD/MM/yyyy HH:mm')
											: ''
									}
									endDate={
										event.endDate
											? moment(event.endDate).isSame(moment(), 'day')
												? `Hoy ${moment(event.endDate).format('HH:mm')}`
												: moment(event.endDate).format('DD/MM/yyyy HH:mm')
											: ''
									}
									price={event.price === 'Gratuito' ? t['free'] : event.price}
									minors={
										event.minors === 'APTA TODO PUBLICO'
											? t['suitableForAllPublic']
											: event.minors
									}
									photoUrl={undefined}
									id={event.id}
									onClick={() => handleCardClick(event.id!)}
								/>
							</div>
						))}
					</BasicLayout>
				</>
			)}
		</>
	);
};

export default MyEvents;
