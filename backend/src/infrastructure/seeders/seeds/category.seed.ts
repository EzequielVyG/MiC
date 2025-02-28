import { DataSource } from 'typeorm';
import { Seeder } from 'typeorm-extension';
import { Category } from '../../category/typeorm/model/category.entity';
import data = require('./json/categorias.json');

export default class CategorySeeder implements Seeder {
	public async run(dataSource: DataSource): Promise<any> {
		console.log('Seeders Category...');
		const repository = dataSource.getRepository(Category);

		// Función recursiva para crear las categorías y subcategorías
		const createCategories = async (
			grupo: any,
			parent: any,
			subcategorias: any[]
		) => {
			for (const category of subcategorias) {
				const newCategory = repository.create({
					group: grupo.grupo,
					name: category.categoria,
					father: parent,
					color: category.color,
				});

				await repository.save(newCategory);
			

				if (category.subcategorias.length > 0) {
					await createCategories(grupo, newCategory, category.subcategorias);
				}
			}
		};

		// Iniciar la creación de categorías y subcategorías desde el archivo JSON

		for (const grupo of data.grupos) {
			await createCategories(grupo, null, grupo.subcategorias);
		}
	}
}
