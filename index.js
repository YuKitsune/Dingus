import dotenv from 'dotenv';
import { purgeMissingChannels } from './db.js';
import setupBot from './bot.js';
import { setupReminderTimer } from './reminderTimer.js';
import { setupMetrics } from './metrics.js';

const main = async () => {

	console.log("Starting NecroBot.")

	// Load from .env file
	dotenv.config();

	// Remove reminders for any channels that no longer exist
	await purgeMissingChannels();

	// Todo: Pre-fill the cache

	setupMetrics();

	// Setup the bot
	const bot = setupBot();
	await bot.login(process.env.TOKEN);

	// Setup the reminder timer
	await setupReminderTimer(bot);
}

await main();
