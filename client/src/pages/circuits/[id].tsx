import Card from '@/components/Card/Card';
import Loading from '@/components/Loading/Loading';
import TagCategory from '@/components/Tag/TagCategory';
import { findById } from '@/features/Circuits/hooks/useFindById';
import { Place } from '@/features/Places/place';
import BasicLayout from '@/layouts/BasicLayout';
import MainLayout from '@/layouts/MainLayout';
import MapIcon from '@mui/icons-material/Map';
import { IconButton } from '@mui/material';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';

const CardList: React.FC = () => {
	const [list, setList] = useState<Place[]>([]);
	const router = useRouter();
	const { id } = router.query;

	const [isLoading, setIsLoading] = useState(true);
	const [circuit, setCircuit] = useState<any | null>(null);

	useEffect(() => {
		async function fetchPlaceData() {
			try {
				const aCircuit = (await findById(id as string))!.data;
				setList(aCircuit.places);
				setCircuit(circuit);
			} catch (error) {
				console.error('Error fetching places:', error);
			}
		}
		setIsLoading(true);
		fetchPlaceData();
		setIsLoading(false);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	const handleCardClick = (id: string) => {
		router.push(`/places/${id}`);
	};

	const handleTalkClick = (phone: string) => {
		window.location.href = `tel:${phone}`;
	};

	const handleShareClick = (placeData: Place) => {
		if (navigator.share) {
			navigator
				.share({
					title: placeData.name,
					text: placeData.description,
					url: window.location.href,
				})
				.then(() => console.log('Contenido compartido exitosamente'))
				.catch((error) => console.error('Error al compartir:', error));
		} else {
			console.log(
				'La función de compartir no está disponible en este navegador.'
			);
			// Aquí podrías implementar tu propia lógica de compartir en caso de que la API no esté disponible
		}
	};

	const handleIconButtonClick = () => {
		// Usa history.push para navegar a la página /places
		router.push('/home');
	};

	return (
		<MainLayout>
			{isLoading ? (
				<Loading />
			) : (
				<BasicLayout title={circuit.name}>
					<TagCategory text='CATEGORY' />
					<div
						style={{
							margin: 10,
							width: '95vw',
							flexDirection: 'row',
							display: 'flex',
						}}
					>
						{/* <div style={{ width: "90vw" }}>
				  <Input
					id="search"
					field={{
					  name: "¿Qué buscas?",
					  onChange: (e) => console.log(e.target.value),
					  label: "¿Qué buscas?",
					}}
				  />
				</div> */}
						<div style={{ width: '90vw' }}></div>
						<IconButton
							sx={{
								backgroundColor: 'white',
								borderRadius: '50%',
								margin: '0.2rem',
								'&:hover': {
									backgroundColor: 'white',
								},
								width: '5vw',
								height: '50px',
								display: 'flex',
								alignItems: 'center',
								justifyContent: 'center',
								marginLeft: '12px',
							}}
							size='large'
							onClick={handleIconButtonClick}
						>
							<MapIcon style={{ color: '#8EA2A5' }} />
						</IconButton>
					</div>

					<div>
						{list.map((placeData: Place, i: number) => (
							<div key={i}>
								<Card
									title={placeData.name || ''}
									description={placeData.description}
									photoUrl={
										placeData.photos!.length > 0
											? placeData.photos![0].photoUrl
											: 'https://static.vecteezy.com/system/resources/previews/004/141/669/original/no-photo-or-blank-image-icon-loading-images-or-missing-image-mark-image-not-available-or-image-coming-soon-sign-simple-nature-silhouette-in-frame-isolated-illustration-vector.jpg'
									}
									id={placeData.id}
									onClickTalk={() => handleTalkClick(placeData.phone)}
									onClick={() => handleCardClick(placeData.id!)}
									onClickShare={() => handleShareClick(placeData)}
								/>
							</div>
						))}
					</div>
				</BasicLayout>
			)}
		</MainLayout>
	);
};

export default CardList;
