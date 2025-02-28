import { Seeder } from 'typeorm-extension';
import { DataSource } from 'typeorm';
import { Service } from '../../place/typeorm/model/service.entity';
import data = require("./json/services.json")


export default class ServiceSeeder implements Seeder {
    public async run(
        dataSource: DataSource,
    ): Promise<any> {
        console.log("Seeders Services...")
        const repository = dataSource.getRepository(Service);
        const services = repository.create(data);

        await repository.save(services);
    }
}