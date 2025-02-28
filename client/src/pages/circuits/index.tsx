import MyCard from '@/components/Card/CircuitCard';
import Loading from '@/components/Loading/Loading';
import { Circuit } from '@/features/Circuits/circuit';
import { findAllCircuits } from '@/features/Circuits/hooks/useFindAllCircuits';
import useSelectedCircuit from '@/hooks/useSelectedCircuit';
import MainLayout from '@/layouts/MainLayout';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import ReactGA from 'react-ga4';

// ... (importaciones y código anterior)

const CardList: React.FC = () => {
	const [list, setList] = useState<Circuit[]>([]);
	const router = useRouter();

	const [isLoading, setIsLoading] = useState(true);

	const { setSelectedCircuit } = useSelectedCircuit();

	async function fetchCircuitsData() {
		try {
			const someCircuits = await findAllCircuits();

			setList(someCircuits.data);
		} catch (error) {
			console.error('Error fetching circuits:', error);
		}
	}

	useEffect(() => {
		setIsLoading(true);
		ReactGA.send({
			hitType: 'pageview',
			page: '/circuits',
			title: 'Visita a listado de circuitos',
		});
		fetchCircuitsData();
		setIsLoading(false);
	}, []);

	/*   useEffect(() => {
    async function fetchCategories() {
      try {
        const categories = await findAllCategories();
        setCategoryOptions(categories.data);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    }
    setIsLoading(true);
    fetchCategories();
    fetchCircuitsData();
    setIsLoading(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [categorySeleccionada]); */

	const handleCardClick = (circuit: Circuit) => {
		setSelectedCircuit(circuit);
		router.push({
			pathname: '/home/circuits',
		});
	};

	const handleShareClick = (circuitData: Circuit) => {
		if (navigator.share) {
		  navigator
			.share({
			  title: circuitData.name,
			  text: circuitData.description,
			  url: window.location.origin + `/home/circuits`,
			})
			.then(() => console.log('Contenido compartido exitosamente'))
			.catch((error) => console.error('Error al compartir:', error));
		} else {
		  console.log('La función de compartir no está disponible en este navegador. ' +  window.location.origin + `/home/circuits`);
		}
	  };
	  

	return (
		<MainLayout>
			{isLoading ? (
				<Loading />
			) : (
				<>
					<div
						style={{
							margin: 10,
							width: '95vw',
							flexDirection: 'row',
							display: 'flex',
						}}
					></div>

					<div>
						{list.map((circuitData: Circuit, i: number) => (
							<div key={i}>
								<MyCard
									title={circuitData.name || ''}
									description={circuitData.description}
									category={circuitData.principalCategory.name}
									color={circuitData.principalCategory.color}
									cantPlaces={circuitData.places.length}
									images={
										circuitData.places && circuitData.places.length > 0
											? circuitData.places.map((place) => {
													if (place.photos && place.photos.length > 0) {
														return place.photos[0].photoUrl;
													} else {
														return 'https://static.vecteezy.com/system/resources/previews/004/141/669/original/no-photo-or-blank-image-icon-loading-images-or-missing-image-mark-image-not-available-or-image-coming-soon-sign-simple-nature-silhouette-in-frame-isolated-illustration-vector.jpg';
													}
											  })
											: [
													'https://static.vecteezy.com/system/resources/previews/004/141/669/original/no-photo-or-blank-image-icon-loading-images-or-missing-image-mark-image-not-available-or-image-coming-soon-sign-simple-nature-silhouette-in-frame-isolated-illustration-vector.jpg',
											  ]
									}
									id={circuitData.id}
									onClick={() => handleCardClick(circuitData)}
									onClickShare={function (): void {
										handleShareClick(circuitData);
									}}
								/>
							</div>
						))}
					</div>
				</>
			)}
		</MainLayout>
	);
};

export default CardList;
