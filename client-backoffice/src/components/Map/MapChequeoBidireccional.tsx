import React, { useState, useEffect, useRef } from "react";
import { GoogleMap, LoadScript, Marker } from "@react-google-maps/api";

const initialMapCenter = {
  lat: -42.77060084356949,
  lng: -65.03446238782378,
};

const MapChequeoBidireccionalComponent: React.FC<{
  coordinates: { lat: number; lng: number } | null;
  onMapClick: (lat: number, lng: number) => void;
}> = ({ coordinates, onMapClick }) => {
  const [map, setMap] = useState<google.maps.Map | null>(null);
  const mapRef = useRef<google.maps.Map | null>(null);

  useEffect(() => {
    mapRef.current = map;
  }, [map]);

  useEffect(() => {
    if (coordinates && mapRef.current) {
      // Actualiza el centro del mapa con las nuevas coordenadas
      mapRef.current.panTo(coordinates);
    }
  }, [coordinates]);

  const handleMapClick = (event: google.maps.MapMouseEvent) => {
    const clickedLat = event.latLng!.lat();
    const clickedLng = event.latLng!.lng();

    // Llama a la función del padre para manejar el clic en el mapa
    onMapClick(clickedLat, clickedLng);
  };

  return (
    <LoadScript googleMapsApiKey={process.env.NEXT_PUBLIC_GOOGLE_APIKEY!}>
      <GoogleMap
        mapContainerStyle={{ width: "100%", height: "18%" }}
        center={coordinates || initialMapCenter}
        zoom={16}
        onClick={handleMapClick}
        onLoad={(map) => setMap(map)}
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
        {coordinates && <Marker position={coordinates} />}
      </GoogleMap>
    </LoadScript>
  );
};

export default MapChequeoBidireccionalComponent;
