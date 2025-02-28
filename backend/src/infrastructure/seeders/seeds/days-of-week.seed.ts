import { Seeder } from 'typeorm-extension';
import { DataSource } from 'typeorm';
import { DayOfWeek } from '../../place/typeorm/model/day-of-week.entity';
import data = require("./json/days-of-week.json")


export default class DayOfWeekSeeder implements Seeder {
    public async run(
        dataSource: DataSource,
    ): Promise<any> {
        console.log("Seeders Days of week...")
        const repository = dataSource.getRepository(DayOfWeek);
        const daysOfWeek = repository.create(data);

        await repository.save(daysOfWeek);
    }
}