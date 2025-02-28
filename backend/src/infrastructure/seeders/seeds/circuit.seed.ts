import { Category } from 'src/infrastructure/category/typeorm/model/category.entity';
import { Circuit } from 'src/infrastructure/circuit/typeorm/model/circuit.entity';
import { Place } from 'src/infrastructure/place/typeorm/model/place.entity';
import { DataSource } from 'typeorm';
import { Seeder } from 'typeorm-extension';
import data = require('./json/circuits.json');

export default class CircuitSeeder implements Seeder {
	public async run(dataSource: DataSource): Promise<any> {
		console.log('Seeders Circuits...');
		const circuitRepository = dataSource.getRepository(Circuit);
		const categoryRepository = dataSource.getRepository(Category);
		const placeRepository = dataSource.getRepository(Place);

		const circuitsToInsert: Circuit[] = await Promise.all(
			data.map(async (aCircuit) => {
				const circuit = new Circuit(); // Crear una instancia de User
				circuit.name = aCircuit.name;
				circuit.description = aCircuit.description;

				if (aCircuit.principalCategory) {
					circuit.principalCategory = await categoryRepository.findOne({
						where: { name: aCircuit.principalCategory },
					});
				}
				circuit.places = await Promise.all(
					aCircuit.places.map(async (aPlace: any) => {
						return await placeRepository.findOne({
							where: { name: aPlace },
						});
					})
				);
				return circuit;
			})
		);

		const circuits = circuitRepository.create(circuitsToInsert);

		await circuitRepository.save(circuits);
	}
}
