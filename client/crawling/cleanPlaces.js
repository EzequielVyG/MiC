// Tu JSON de entrada
const jsonData = require("./places_google.json")
const fs = require('fs');

// Función para eliminar los atributos place_id y photos_references
function eliminarAtributos(objeto) {
    const { place_id, photos_references, ...resto } = objeto;
    return resto;
}

// Aplicar la función a cada objeto en el array
const nuevoArray = jsonData.map(eliminarAtributos);

// Imprimir el nuevo array sin los atributos

const result = JSON.stringify(nuevoArray, null, 2);
fs.writeFileSync("./places_to_insert.json", result, 'utf-8');