import dotenv = require("dotenv");
import setupBot from './bot.js';
import { setupMetrics } from './metrics.js';

const main = async () => {

	console.log("Starting Dingus")

	// Load from .env file
	dotenv.config();

	// Register prometheus metrics
	setupMetrics();

	// Setup the bot
	const bot = setupBot();
	await bot.login(process.env.TOKEN);
}

main().then(_ => {});
