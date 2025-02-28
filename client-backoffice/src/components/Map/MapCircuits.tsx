import React, { useEffect, useState } from "react";
import {
  GoogleMap,
  MarkerF,
  useLoadScript,
  // DirectionsRenderer,
} from "@react-google-maps/api";

import { Place } from "@/features/Places/place";

interface GoogleMapProps {
  places: Place[];
}

const containerStyle = {
  width: "100%",
  height: "100%",
};

const center = {
  lat: -42.767197,
  lng: -65.036468,
};

// Declaración global para TypeScript
declare global {
  interface Window {
    google: {
      maps: {
        DirectionsService: typeof google.maps.DirectionsService;
      };
    };
  }
}

const GenericMap: React.FC<GoogleMapProps> = ({ places = [] }) => {
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_APIKEY!, // Coloca aquí tu clave de API de Google Maps
  });

  const [map, setMap] = useState<google.maps.Map | null>(null);
  // const [directions, setDirections] =
  //   useState<google.maps.DirectionsResult | null>(null); // Estado para las direcciones

  useEffect(() => {
    if (map && places.length > 0) {
      map.panTo(places[places.length - 1].location!);
    }
    // if (map && places.length > 1) {
    // 	const directionsService = new window.google.maps.DirectionsService();

    // 	directionsService.route(
    // 		{
    // 			origin: places[places.length - 2].location!,
    // 			destination: places[places.length - 1].location!,
    // 			waypoints: places.slice(1, -1).map(place => ({ location: place.location! })), // Agrega puntos intermedios si los tienes
    // 			travelMode: google.maps.TravelMode.DRIVING, // Corrige el modo de viaje
    // 		},
    // 		(result, status) => {
    // 			if (status === 'OK') {
    // 				setDirections(result);
    // 				console.log("🚀 ~ file: MapCircuits.tsx:58 ~ useEffect ~ result:", result)
    // 			} else {
    // 				console.error(`Error al calcular direcciones: ${status}`);
    // 			}
    // 		}
    // 	);
    // }
  }, [map, places]);

  if (loadError) return <div>Error al cargar el mapa</div>;
  if (!isLoaded) return <div>Cargando...</div>;

  const handleMapLoad = (map: google.maps.Map) => {
    setMap(map);
    map.setOptions({
      minZoom: 3.5,
      maxZoom: 20,
    });
  };

  return (
    <GoogleMap
      mapContainerStyle={containerStyle}
      center={center}
      zoom={15}
      onLoad={handleMapLoad}
      options={{
        styles: [
          {
            featureType: "all",
            elementType: "labels.icon",
            stylers: [
              {
                visibility: "off",
              },
            ],
          },
          {
            featureType: "road",
            elementType: "labels",
            stylers: [
              {
                visibility: "on",
              },
            ],
          },
        ],
      }}
    >
      {places.map((place, index) => {
        return (
          <MarkerF
            key={index}
            position={place.location!}
            icon={{
              url: "/marker.png",
              scaledSize: new window.google.maps.Size(15, 27.5),
            }}
            title={place.name}
          />
        );
      })}
      {/* {directions && <DirectionsRenderer directions={directions} />} */}
    </GoogleMap>
  );
};

export default GenericMap;
