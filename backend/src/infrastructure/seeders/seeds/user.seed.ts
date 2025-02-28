import { Role } from '../../user/typeorm/model/role.entity';
import { DataSource } from 'typeorm';
import { Seeder } from 'typeorm-extension';
import { User } from '../../user/typeorm/model/user.entity';
const bcrypt = require('bcrypt');
const normalizeEmail = require('normalize-email');
const saltRounds = 10;
import data = require('./json/users.json');
import { UserPreference } from '../../user/typeorm/model/user-preference.entity';
import { Category } from '../../category/typeorm/model/category.entity';

export default class UserSeeder implements Seeder {
	public async run(dataSource: DataSource): Promise<any> {
		console.log('Seeders User...');
		const userRepository = dataSource.getRepository(User);
		const roleRepository = dataSource.getRepository(Role);
		const preferenceRepository = dataSource.getRepository(UserPreference);
		const categoryRepository = dataSource.getRepository(Category);

		const ADMIN = await roleRepository.findOne({ where: { name: 'ADMIN' } });
		const CONSUMIDOR = await roleRepository.findOne({
			where: { name: 'CONSUMIDOR' },
		});
		const GESTION_MIC = await roleRepository.findOne({
			where: { name: 'GESTION_MIC' },
		});

		const rolesMap = {
			ADMIN: ADMIN,
			CONSUMIDOR: CONSUMIDOR,
			GESTION_MIC: GESTION_MIC,
		};

		const usersToInsert: User[] = await Promise.all(
			data.map(async (aUser) => {
				const user = new User(); // Crear una instancia de User

				user.name = aUser.name;
				user.email = normalizeEmail(aUser.email);
				user.password = await bcrypt.hash(aUser.password, saltRounds);
				user.status = aUser.status;
				user.roles = aUser.roles.map((aRole: string) => {
					return rolesMap[aRole];
				});
				user.preferences = new UserPreference();
				user.preferences.initialContext = aUser.preferences.initialContext;
				user.preferences.categories = await Promise.all(
					aUser.preferences.categories.map(async (aCategory: any) => {
						return await categoryRepository.findOne({
							where: { name: aCategory.name },
						});
					})
				);
				user.favoriteEvents = [];

				return user;
			})
		);

		const users = userRepository.create(usersToInsert);

		const savedUsers: User[] = await userRepository.save(users);

		for (const u of savedUsers) {
			u.preferences.user = { ...u, preferences: null };
			await preferenceRepository.save(u.preferences);
		}
	}
}
