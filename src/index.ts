import dotenv from 'dotenv';
import { purgeMissingChannels } from './db.js';
import setupBot from './bot.js';
import { setupReminderTimer } from './reminderTimer.js';
import { setupMetrics } from './metrics.js';

const main = async () => {

	console.log("Starting NecroBot")

	// Load from .env file
	dotenv.config();

	// Todo: Pre-fill the cache

	// Register prometheus metrics
	setupMetrics();

	// Setup the bot
	const bot = setupBot();
	await bot.login(process.env.TOKEN);

	// Remove reminders for any channels that are no longer reachable
	await purgeMissingChannels(bot);

	// Setup the reminder timer
	await setupReminderTimer(bot);
}

main().then(_ => {});
