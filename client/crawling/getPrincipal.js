const json = require("../../backend/src/infrastructure/seeders/seeds/json/categorias.json")

let categorias = json.categorias;

// Le paso el JSON con todas las categorias, y un array de los nombres de las categorías del place.
// Todas las otras funciones son auxiliares, la unica que deberiamos usar es getPlacePrincipalCategory
console.log(
	getPlacePrincipalCategory(
		[
			'Atracciones turísticas', 'Lugares de interés'
		],
		categorias
	)
);

/*
	Devuelve la categoría principal de un place dada sus categorias.
	Si tiene una sola categoría principal, devuelve esa.
	Si no, devuelve la categoría principal con más subcategorías presentes en el place.
*/

function getPlacePrincipalCategory(someCategories, categoriesJson) {
	let cantPrincipales = 0;
	let categoriaPrincipal;
	for (let category of someCategories) {
		if (isPrincipalCategory(category, categoriesJson)) {
			cantPrincipales++;
			if (cantPrincipales > 1) {
				break;
			}
			categoriaPrincipal = category;
		}
	}

	if (cantPrincipales == 1) {
		return categoriaPrincipal;
	}

	const principales = new Map();
	let count;
	for (const category of categoriesJson) {
		count = 0;
		for (const c of someCategories) {
			if (getPrincipalCategory(c, categoriesJson) == category.nombre) {
				count++;
			}
		}
		principales.set(category.nombre, count);
	}

	return [...principales.entries()].reduce((a, e) => (e[1] > a[1] ? e : a))[0];
}

function isPrincipalCategory(name, categories) {
	for (const category of categories) {
		if (category.nombre == name) {
			return true;
		}
	}
	return false;
}

function getPrincipalCategory(name, categories) {
	for (const c of categories) {
		if (isSubcategoryOf(c, name, c.subcategorias)) {
			return c.nombre;
		}
	}
	return null;
}

function isSubcategoryOf(father, name, subcategories) {
	if (father.nombre === name) return true;
	if (subcategories.length == 0) return false;
	for (const c of subcategories) {
		if (isSubcategoryOf(c, name, c.subcategorias)) {
			return true;
		}
	}
	return false;
}

module.exports = getPlacePrincipalCategory;