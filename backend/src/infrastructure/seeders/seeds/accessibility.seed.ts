import { DataSource } from 'typeorm';
import { Seeder } from 'typeorm-extension';
import { Accessibility } from '../../place/typeorm/model/accesibility.entity';
import data = require("./json/accessibilities.json")


export default class AccessibilitySeeder implements Seeder {
    public async run(
        dataSource: DataSource,
    ): Promise<any> {
        console.log("Seeders Accessibilities...")
        const repository = dataSource.getRepository(Accessibility);
        const accessibilities = repository.create(data);

        await repository.save(accessibilities);
    }
}