const axios = require('axios');

// Reemplaza 'TU_CLAVE_DE_API' con tu clave de API de Google Cloud
const apiKey = '';

// Reemplaza 'TU_ID_DE_LUGAR' con el ID del lugar que deseas consultar
const placeId = 'ChIJD_5YO69KAr4R9TJX-owNL8g';

// URL de la API de Places de Google para obtener detalles del lugar
const apiUrl = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&fields=opening_hours&key=${apiKey}`;

axios.get(apiUrl)
    .then(response => {
        const result = response.data.result;
        if (result && result.opening_hours && result.opening_hours.periods) {
            const periods = result.opening_hours.periods;
            console.log('Horarios del lugar:');
            console.log(periods)
        } else {
            console.log('No se encontraron horarios para este lugar.');
        }
    })
    .catch(error => {
        console.error('Error al obtener los datos del lugar:', error);
    });
