import { Seeder } from 'typeorm-extension';
import { DataSource } from 'typeorm';
import { Faq } from '../../faq/typeorm/model/faq.entity';
import data = require("./json/faq.json")


export default class FaqSeeder implements Seeder {
    public async run(
        dataSource: DataSource,
    ): Promise<any> {
        console.log("Seeders Faq...")
        const repository = dataSource.getRepository(Faq);
        const faqs = repository.create(data);

        await repository.save(faqs);
    }
}