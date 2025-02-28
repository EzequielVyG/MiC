import { Client } from 'pg';

require('dotenv').config();

const {
	DATABASE_HOST,
	DATABASE_PORT,
	DATABASE_NAME,
	DATABASE_USERNAME,
	DATABASE_PASSWORD,
} = process.env;

async function dropTables() {
	const client = new Client({
		host: DATABASE_HOST,
		database: DATABASE_NAME,
		user: DATABASE_USERNAME,
		password: DATABASE_PASSWORD,
		port: DATABASE_PORT,
	});

	const tableNames = [
		'user_accounts',
		'notifications',
		'translators',
		'event_categories',
		'event_photos',
		'event_participants',
		'events',
		'event_flyers',
		'place_accessibilities',
		'place_services',
		'accessibilities',
		'services',
		'place_categories',
		'place_photos',
		'place_schedules',
		'places',
		'days_of_weeks',
		'user_roles',
		'roles',
		'organization_users',
		'organization_categories',
		'organization_subcategories',
		'documents',
		'categories',
		'organizations',
		'users',
		'faq',
		'migrations',
		'password_tokens',
		'circuits',
		'circuit_places',
		'circuit_categories',
		'event_participants',
		'user_tokens',
		'user_preferences',
		'user_preferred_categories',
		'user_favorite_events',
	];

	try {
		await client.connect();

		for (const tableName of tableNames) {
			console.log("🚀 Drop table:", tableName)
			await client.query(`DROP TABLE IF EXISTS ${tableName} CASCADE`);
		}

	} catch (error) {
		console.error('Error dropping tables:', error);
	} finally {
		await client.end();
	}
}

dropTables();
