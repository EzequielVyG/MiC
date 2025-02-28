/* eslint-disable @next/next/no-img-element */
import {
	GoogleMap,
	InfoWindowF,
	MarkerF,
	useLoadScript,
} from '@react-google-maps/api';
import React, { useEffect, useState } from 'react';

import { Event } from '@/features/Events/Event';
import { Place } from '@/features/Places/place';

import { Typography } from '@mui/material';
import MarkerIcon from './markerIcon';
import userMarkerIcon from './userMarkerIcon';

interface GoogleMapProps {
	places?: any[];
	events?: Event[];
}

const containerStyle = {
	width: '100%',
	height: '100%',
};

const center = {
	lat: -42.767197,
	lng: -65.036468,
};

const GenericMap: React.FC<
	GoogleMapProps & {
		selected: any;
		onMarkerClick: (place: Place | Event, index: number) => void;
		handleInfoWIndowClick: (place: any) => void;
		centerCardIndex: number | undefined;
		userLocation: { lat: number; lng: number } | null;
	}
> = ({
	places = [],
	selected,
	onMarkerClick,
	centerCardIndex,
	handleInfoWIndowClick,
	userLocation,
}) => {
	const { isLoaded, loadError } = useLoadScript({
		googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_APIKEY!, // Coloca aquí tu clave de API de Google Maps
	});
	const [infoWindow, setInfoWindow] = useState<{
		position: { lat: number; lng: number };
		isOpen: boolean;
	} | null>(null);

	const [map, setMap] = useState<google.maps.Map | null>(null); // Estado para el mapa
	// const [hoveredMarkerIndex, setHoveredMarkerIndex] = useState<number | null>(
	// 	null
	// );

	useEffect(() => {
		if (map && selected) {
			// position={place.location ? place.location : place.place?.location ?? null}
			map.panTo(
				selected.location ? selected.location : selected.place?.location ?? null
			);
		}
	}, [map, selected]);

	if (loadError) return <div>Error al cargar el mapa</div>;
	if (!isLoaded) return <div>Cargando...</div>;

	const handleMapLoad = (map: google.maps.Map) => {
		setMap(map);
		map.setOptions({
			minZoom: 3.5,
			maxZoom: 20,
		});
	};

	// const handleMarkerMouseOver = (index: number) => {
	// 	setHoveredMarkerIndex(index);
	// 	console.log(hoveredMarkerIndex, 'marker index hover');
	// };

	// const handleMarkerMouseOut = () => {
	// 	setHoveredMarkerIndex(null);
	// };

	const handleMarkerClick = (place: any, index: number) => {
		setInfoWindow({
			position: {
				lat: place.location! ? place.location.lat : place.place.location.lat,
				lng: place.location! ? place.location.lng : place.place.location.lng,
			},
			isOpen: true,
		});

		onMarkerClick(place, index);
	};

	const handleCloseInfoWindow = (place: any) => {
		setInfoWindow({
			position: {
				lat: place.location! ? place.location.lat : place.place.location.lat,
				lng: place.location! ? place.location.lng : place.place.location.lng,
			},
			isOpen: false,
		});
	};

	return (
		<GoogleMap
			mapContainerStyle={containerStyle}
			center={center}
			zoom={13.5}
			onLoad={handleMapLoad}
			options={{
				disableDefaultUI: true,
				styles: [
					{
						featureType: 'all',
						elementType: 'labels.icon',
						stylers: [
							{
								visibility: 'off',
							},
						],
					},
					{
						featureType: 'road',
						elementType: 'labels',
						stylers: [
							{
								visibility: 'on',
							},
						],
					},
				],
			}}
		>
			{/* Agrega un marcador para la ubicación del usuario */}
			{userLocation && (
				<MarkerF
					draggable
					position={userLocation}
					icon={{
						path: userMarkerIcon,
						fillColor: '#33cc33',
						fillOpacity: 1,
						strokeWeight: 0,
						rotation: 0,
						scale: 0.05,
						anchor: new google.maps.Point(280, 530),
					}}
					title='Mi ubicación' // Agrega un mensaje personalizado
				/>
			)}
			{places.length > 0 &&
				places.map((place, index) => {
					const isMarkerSelected = index === centerCardIndex;

					return (
						<MarkerF
							key={place.id + (isMarkerSelected ? '-selected' : '')} // Agrega "-selected" si el marcador está seleccionado
							// position={place.location!}
							position={
								place.location!
									? place.location
									: place.place
									? place.place.location
									: null
							}
							onClick={() => {
								handleMarkerClick(place, index);
							}}
							icon={{
								path: MarkerIcon,
								fillColor: isMarkerSelected
									? '#DF2E38'
									: // : place.principalCategory!.color,
									place.principalCategory?.color
									? place.principalCategory.color
									: '#984D98',
								fillOpacity: 1,
								strokeWeight: 0,
								rotation: 0,
								scale: 1.1,
								anchor: new google.maps.Point(12, 21),
							}}
							animation={
								isMarkerSelected
									? window.google.maps.Animation.BOUNCE
									: undefined
							}
						>
							{infoWindow?.isOpen &&
								isMarkerSelected &&
								window.innerWidth > 768 && (
									<InfoWindowF
										position={infoWindow.position}
										onCloseClick={() => handleCloseInfoWindow(place)}
									>
										<div
											style={{ maxWidth: '100px', cursor: 'pointer' }}
											onClick={() => handleInfoWIndowClick(place)}
										>
											<Typography
												id={'card_title'}
												variant='body1'
												color=''
												fontSize={11}
											>
												{place.name}
											</Typography>
											<img
												src={place.photos[0]?.photoUrl}
												alt={'image'}
												style={{ maxWidth: '100px', borderRadius: 10 }}
											/>
										</div>
									</InfoWindowF>
								)}
						</MarkerF>
					);
				})}
		</GoogleMap>
	);
};

export default GenericMap;
