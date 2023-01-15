import * as client from "prom-client";
import express = require('express');

// Meh.
export let metrics;

const registerMetric = (reg: client.Registry, met: client.Metric<any>) => {
	reg.registerMetric(met);
	return met;
}

export const setupMetrics = () => {

	client.collectDefaultMetrics({ prefix: 'dingus_' });
	const registry = new client.Registry();
	metrics = {
		guildCounter: registerMetric(registry, new client.Gauge({
			name: 'bot_guild_count',
			help: 'The total number of guilds that the bot is a part of.'
		})),

		commandTimer: registerMetric(registry, new client.Histogram({
			name: 'bot_command_time',
			help: 'The amount of time it takes for a command to process.'
		}))
	};

	// Todo: Move port to env file
	const app = express();
	const port = 8080;

	app.get('/metrics', async (req, res) => {
		res.set('Content-Type', client.register.contentType)
		res.end(await registry.metrics())
	});

	app.listen(port, () => {
		console.log(`📈 Metrics available at http://localhost:${port}`)
	});
}
