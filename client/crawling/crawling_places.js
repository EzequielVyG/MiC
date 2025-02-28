const axios = require('axios');
const fs = require('fs');
const crawledPlaces = require("./places_google.json")
let token = require("./token.json")
const seedCategories = require("../../backend/src/infrastructure/seeders/seeds/json/categorias.json")

const getPlacePrincipalCategory = require("./getPrincipal.js");
const mock_places = require("./mock-places.json")


const MAX_PLACES = 20;
let countRequest = 0
const IS_SOLICITUD_MOCKED = false

/* 
Programa para crawlear lugares de google maps. Setea un MAX_PLACES y obtiene los lugares.
- Basados en su cercania con Puerto Madryn y en si ya fueron o no crawleados.
- Obtiene hasta 20 lugares maximo (maximo de pagina de google) por ejecucion
- Se guardan en places_google.json. Y se recomienta ejecutar "cleanPlaces.js" para eliminar atributos innesesarios.
- Copiar el archivo "places_to_insert.json" y pegarlo en los seeders del backend.
- Ejecutar npm run seeders:up y encontrara los nuevos lugares en la base de datos.
 */
async function fetchData() {
    try {

        // Solicitud para buscar los lugares cercanos a madryn
        const params = {
            location: '-42.7692,-65.0385',
            radius: 5000,
            keyword: 'Point of interest',
            key: '',
        };

        // Prueba primero obtener lugares nuevos del mock (para ahorrar una request)
        const mocked_response = await findeNearbySearch(true, params, token.actual)
        let filteredPlaces = filterPlacesByCrawledPlacesAndMaxPlaces(mocked_response, MAX_PLACES)

        if ((!filteredPlaces || filteredPlaces.length === 0) && !IS_SOLICITUD_MOCKED) {

            const nearby_response = await findeNearbySearch(IS_SOLICITUD_MOCKED, params, token.actual)
            filteredPlaces = filterPlacesByCrawledPlacesAndMaxPlaces(nearby_response, MAX_PLACES)
        }

        // TODO: Si MAX_PLACES mayor a la cantidad de lugares a mapear, se podria llenar los cupos con los lugares de la siguiente pagina 

        if (filteredPlaces.length == 0) {
            console.log("No hay Lugares nuevos en esta pagina, pasando a la siguiente...")
            console.log("Segunda solicitud de nearby search..")
            const second_nearby_response = await findeNearbySearch(IS_SOLICITUD_MOCKED, params, token.next)

            filteredPlaces = filterPlacesByCrawledPlacesAndMaxPlaces(second_nearby_response, MAX_PLACES)

        } else {
            console.log("Todavia hay lugares de esta pagina no mapeados")

        }

        const placesToMap = []
        console.log(`Solicitando ${filteredPlaces.length} Lugares nuevos...`)
        for (const aPlace of filteredPlaces) {
            console.log("Solicitud detail de lugar.. ", aPlace.name)
            const details_response = await findPlaceDetail(IS_SOLICITUD_MOCKED, aPlace.place_id, params)

            if (details_response)
                placesToMap.push(details_response)
        }

        console.log("Mapeando Lugares...")
        const formattedResults = formatPlaces(placesToMap)


        console.log("Guardando ", formattedResults.length, " Lugares en JSON...")
        const newCrawledPlaces = crawledPlaces.concat(formattedResults)
        saveOnJSON(newCrawledPlaces, "./places_google.json")


        console.log("------------------")
        console.log(countRequest, " Request a google API")
        console.log("------------------")


    } catch (error) {
        console.error('Error:', error);
    }
}

function crawlMock() {
    const newPlaces = formatPlaces(mock_places)
    saveOnJSON(newPlaces, "./places_google.json")

}

function mapServicesToArray(place) {
    const servicesArray = [
        { name: "Retiros en la puerta", key: "curbside_pickup" },
        { name: "Entrega a domicilio", key: "delivery" },
        { name: "Comer en el lugar", key: "dine_in" },
        { name: "Reservable", key: "reservable" },
        { name: "Sirve cerveza", key: "serves_beer" },
        { name: "Sirve desayuno", key: "serves_breakfast" },
        { name: "Sirve brunch", key: "serves_brunch" },
        { name: "Sirve cena", key: "serves_dinner" },
        { name: "Sirve almuerzo", key: "serves_lunch" },
        { name: "Sirve comida vegetariana", key: "serves_vegetarian_food" },
        { name: "Sirve vino", key: "serves_wine" },
        { name: "Para llevar", key: "takeout" },
    ];

    const availableServices = servicesArray.filter(service => place[service.key] === true).map(service => ({ name: service.name }));

    return availableServices;
}

function mapAccessibilitiesToArray(place) {
    const accessibilitiesArray = [
        { name: "Entrada con acceso para silla de ruedas", key: "wheelchair_accessible_entrance" },
        // Agrega más accesibilidades aquí si es necesario
    ];

    const availableAccessibilities = accessibilitiesArray.filter(accessibility => place[accessibility.key] === true).map(accessibility => ({ name: accessibility.name }));

    return availableAccessibilities;
}

function mapCategoriesToArray(tipos) {
    const tipoACategoria = {
        "point_of_interest": "Lugares de interés",
        "cafe": "Cafeterías y bares de café",
        "travel_agency": "Eventos de turismo y viajes",
        "spa": "Tiendas de belleza y cuidado personal",
        "night_club": "Clubes nocturnos y discotecas",
        "meal_delivery": "Comida y restaurantes",
        "meal_takeaway": "Comida y restaurantes",
        "restaurant": "Comida y restaurantes",
        "hair_care": "Tiendas de belleza y cuidado personal",
        "electrician": "Tiendas de electrónica y tecnología",
        "drugstore": "Farmacias y droguerías",
        "accounting": "Bancos y cajeros automáticos",
        "bakery": "Panaderías",
        "bar": "Bares y pubs",
        "beauty_salon": "Tiendas de belleza y cuidado personal",
        "lodging": "Alojamiento",
        "bank": "Bancos y cajeros automáticos",
        "atm": "Bancos y cajeros automáticos",
        "book_store": "Tiendas de libros y artículos de papelería",
        "clothing_store": "Tiendas de ropa y moda",
        "convenience_store": "Supermercados y mercados de abastos",
        "supermarket": "Supermercados y mercados de abastos",
        "department_store": "Tiendas de muebles y decoración",
        "electronics_store": "Tiendas de electrónica y tecnología",
        "florist": "Tiendas de productos naturales y orgánicos",
        "furniture_store": "Tiendas de muebles y decoración",
        "hardware_store": "Tiendas de electrónica y tecnología",
        "home_goods_store": "Tiendas de muebles y decoración",
        "jewelry_store": "Tiendas de accesorios y complementos",
        "liquor_store": "Bares y pubs",
        "pet_store": "Tiendas de alimentos para mascotas",
        "pharmacy": "Farmacias y droguerías",
        "shoe_store": "Tiendas de calzado",
        "shopping_mall": "Centros comerciales",
        "store": "Compras",
        "library": "Bibliotecas y librerías",
        "primary_school": "Escuelas primarias y secundarias",
        "school": "Escuelas primarias y secundarias",
        "secondary_school": "Escuelas primarias y secundarias",
        "university": "Universidades y facultades",
        "amusement_park": "Parques de atracciones y temáticos",
        "art_gallery": "Galerías de arte y exposiciones",
        "bowling_alley": "Boleras y pistas de boliche",
        "casino": "Centros de juegos y recreativos",
        "movie_rental": "Cines",
        "stadium": "Estadios y arenas deportivas",
        "tourist_attraction": "Atracciones turísticas",
        "zoo": "Zoológicos y acuarios",
        "event": "Eventos",
        "movie_theater": "Cines",
        "theater": "Teatros y salas de espectáculos",
        "dentist": "Consultorios médicos y odontológicos",
        "doctor": "Hospitales y clínicas",
        "hospital": "Hospitales y clínicas",
        "physiotherapist": "Centros de rehabilitación y fisioterapia",
        "bus_station": "Paradas de autobús",
        "light_rail_station": "Estaciones de ferrocarril",
        "subway_station": "Estaciones de metro o subterráneo",
        "taxi_stand": "Estaciones de taxis",
        "train_station": "Estaciones de tren",
        "aquarium": "Zoológicos y acuarios",
        "museum": "Museos y galerías de arte",
        "campground": "Campings y áreas de autocaravanas",
        "park": "Parques y jardines",
        "rv_park": "Campings y áreas de autocaravanas",
        "cemetery": "Cementerios y lugares de entierro históricos",
        "church": "Iglesias y catedrales históricas",
        "courthouse": "Edificios y estructuras históricas",
        "hindu_temple": "Iglesias y catedrales históricas",
        "mosque": "Iglesias y catedrales históricas",
        "synagogue": "Iglesias y catedrales históricas",
        "bicycle_store": "Concesionarios de motocicletas y vehículos de dos ruedas",
        "car_dealer": "Tiendas de automóviles y repuestos",
        "car_rental": "Concesionarios de automóviles usados",
        "car_repair": "Talleres de reparación mecánica",
        "car_wash": "Estaciones de servicio con lavado de autos",
        "gas_station": "Gasolineras",
        "parking": "Estacionamientos",
        "gym": "Gimnasios y centros deportivos"
    }

    // Inicializa un array para almacenar las categorías encontradas
    const categorias = [];

    // Recorre la lista de tipos y busca las correspondientes categorías
    for (const tipo of tipos) {
        const categoria = tipoACategoria[tipo];
        if (categoria) {
            categorias.push(categoria);
        }
    }

    return categorias;
}

function getCategoriaPrincipal(tipos) {
    const categories = mapCategoriesToArray(tipos)
    return getPlacePrincipalCategory(categories, seedCategories.categorias)
}
function mapOpeningHoursArray(openingHoursArray) {
    const mappedSchedules = [];

    openingHoursArray.forEach(openingHours => {
        const dayOfWeekOpen = mapDayOfWeek(openingHours.open.day);
        const openingHourOpen = formatTime(openingHours.open.time);
        let dayOfWeekClose;
        let openingHourClose;
        console.log(openingHours)

        if (!openingHours.close || openingHourClose === "00:00") {
            mappedSchedules.push({
                dayOfWeek: dayOfWeekOpen,
                openingHour: openingHourOpen,
                closingHour: "23:59",
            });
        } else {
            dayOfWeekClose = mapDayOfWeek(openingHours.close.day);
            openingHourClose = formatTime(openingHours.close.time);
            if (dayOfWeekOpen.name === dayOfWeekClose.name) {
                mappedSchedules.push({
                    dayOfWeek: dayOfWeekOpen,
                    openingHour: openingHourOpen,
                    closingHour: openingHourClose,
                });
            } else {
                mappedSchedules.push({
                    dayOfWeek: dayOfWeekOpen,
                    openingHour: openingHourOpen,
                    closingHour: "23:59",
                });

                mappedSchedules.push({
                    dayOfWeek: dayOfWeekClose,
                    openingHour: "00:00",
                    closingHour: openingHourClose,
                });
            }
        }
    });

    return mappedSchedules;
}


function formatTime(time) {
    const hours = time.substring(0, 2);
    const minutes = time.substring(2);
    return `${hours}:${minutes}`;
}

function mapDayOfWeek(day) {
    const daysMap = {
        0: 'DOMINGO',
        1: 'LUNES',
        2: 'MARTES',
        3: 'MIERCOLES',
        4: 'JUEVES',
        5: 'VIERNES',
        6: 'SABADO',
    };

    return { name: daysMap[day] };
}



function formatPlaces(somePlaces) {
    return somePlaces.map(place => ({
        place_id: place.place_id,
        name: place.name,
        principalCategory: getCategoriaPrincipal(place.types),
        categories: mapCategoriesToArray(place.types),
        domicile: place.vicinity,
        location: {
            lat: place.geometry.location.lat,
            lng: place.geometry.location.lng,
        },
        schedules: place.opening_hours && place.opening_hours.periods ? mapOpeningHoursArray(place.opening_hours.periods) : [],
        services: mapServicesToArray(place), // Mapear servicios aquí
        accessibilities: mapAccessibilitiesToArray(place),
        phone: place.formatted_phone_number || null,
        url: place.website || null,
        organization: null,
        minors: null,
        description: null,
        note: null,
        photos_references: place.photos,
    }
    ));
}

function saveOnJSON(data, file) {
    const result = JSON.stringify(data, null, 2);
    fs.writeFileSync(file, result, 'utf-8');
}

function concatToMock(mockfile, data) {
    let prevData = require(mockfile)
    let newData = prevData.concat(data)
    const uniqueIds = [];
    newData = newData.filter(element => {
        const isDuplicate = uniqueIds.includes(element.place_id);

        if (!isDuplicate) {
            return true;
        }

        return false;
    });

    saveOnJSON(newData, mockfile)
}

function pushToMock(mockfile, data) {
    let prevData = require(mockfile)

    if (prevData.some((element) => element.place_id === data.place_id)) {
        return;
    }

    saveOnJSON(prevData.concat([data]), mockfile)
}

async function findeNearbySearch(isMock, params, token) {
    if (isMock) {
        console.log("Solicitud Nearby Mockeada...")
        return require("./mock-nearby-search.json")
    }

    const params_nearby = {
        ...params,
        pagetoken: token,
    };
    console.log("Solicitud Nearby a Google API...")
    const response = await axios.get('https://maps.googleapis.com/maps/api/place/nearbysearch/json', {
        params: params_nearby,
    });
    countRequest++
    concatToMock("./mock-nearby-search.json", response.data.results)

    token = { actual: token, next: response.data.next_page_token }
    saveOnJSON(token, "./token.json")
    return response.data.results
}

async function findPlaceDetail(isMock, id, params) {

    if (isMock) {
        console.log("Solicitud Detail Mockeada...")
        return require("./mock-places.json").find(aPlace => aPlace.place_id === id)
    }

    const params_detail = {
        ...params,
        place_id: id,
    };
    console.log("Solicitud Detail a Google API...")
    const response = await axios.get('https://maps.googleapis.com/maps/api/place/details/json', {
        params: params_detail,
    });
    countRequest++
    pushToMock("./mock-places.json", response.data.result)
    return response.data.result
}

function filterPlacesByCrawledPlacesAndMaxPlaces(somePlaces, MaxPlaces) {
    let response = somePlaces.filter(place => {
        // Verificar si el place_id o las coordenadas no coinciden con crawledPlaces
        return (
            !crawledPlaces.some(
                crawledPlace =>
                    crawledPlace.place_id === place.place_id ||
                    (crawledPlace.location.lat === place.geometry.location.lat &&
                        crawledPlace.location.lng === place.geometry.location.lng)
            )
        );
    });
    return response.slice(0, MaxPlaces);
}
fetchData();