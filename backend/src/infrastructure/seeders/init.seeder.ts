import { DataSource } from 'typeorm';
import { runSeeders, Seeder } from 'typeorm-extension';

import CategorySeeder from './seeds/category.seed';
import RoleSeeder from './seeds/roles.seed';
import DayOfWeekSeeder from './seeds/days-of-week.seed';
import PlaceSeeder from './seeds/place.seed';
import ServiceSeeder from './seeds/service.seed';
import AccessibilitySeeder from './seeds/accessibility.seed';
import UserSeeder from './seeds/user.seed';
import FaqSeeder from './seeds/faq.seed';
import OrganizationsSeeder from './seeds/organizations.seed';
import CircuitSeeder from './seeds/circuit.seed';
import EventsSeeder from './seeds/events.seed';
import NotificationsSeeder from './seeds/notification.seed';

export default class InitSeeder implements Seeder {
	public async run(dataSource: DataSource): Promise<any> {
		await runSeeders(dataSource, {
			seeds: [
				RoleSeeder,
				CategorySeeder,
				UserSeeder,
				FaqSeeder,
				OrganizationsSeeder,
				DayOfWeekSeeder,
				ServiceSeeder,
				AccessibilitySeeder,
				PlaceSeeder,
				CircuitSeeder,
				EventsSeeder,
				NotificationsSeeder,
			],
		});
	}
}
