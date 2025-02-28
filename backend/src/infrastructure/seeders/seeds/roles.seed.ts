import { Seeder } from 'typeorm-extension';
import { DataSource } from 'typeorm';
import { Role } from '../../user/typeorm/model/role.entity';
import data = require("./json/roles.json")


export default class RoleSeeder implements Seeder {
    public async run(
        dataSource: DataSource,
    ): Promise<any> {
        console.log("Seeders Role...")
        const repository = dataSource.getRepository(Role);
        const roles = repository.create(data);

        await repository.save(roles);
    }
}