import {Client, CommandInteraction, Guild, Intents, Message} from 'discord.js';
import allCommands from './commands/allCommands.js';
import { getTarget } from './db.js';
import { metrics } from './metrics.js';
import refreshCommands from './commands/refreshCommands.js';

const setupBot = (): Client => {

	// Setup the client
	const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES] });

	client.once('ready', async () => {

		console.log('Fixing up metrics');
		let initialGuildCount = client.guilds.cache.size;
		metrics.guildCounter.set(initialGuildCount);

		await refreshCommands(client);

		console.log('Dingus is ready!');
	});

	// Setup the slash commands when joining a guild
	client.on('guildCreate', async (guild: Guild) => {
		console.log(`Joined guild ${guild.id}`)
		metrics.guildCounter.inc(1);
	});

	client.on('guildDelete', async (guild: Guild) => {
		console.log(`Left guild ${guild.id}`)
		metrics.guildCounter.dec(1);
	});

	client.on('messageCreate', async (message: Message) => {

		// Ignore bots
		if (message.author.bot)
			return;

		// Get reaction target
		let target = await getTarget(message.guild);
		let targetEmoji = "899614223938773073"
		if (target == "random" && genrateRandomNumber(0, 100) >= 50) {
			message.react(targetEmoji);
		} else if (target != null && message.author.id == target) {
			message.react(targetEmoji);
		}
	});

	// Handle any slash commands
	client.on('interactionCreate', async (interaction: CommandInteraction) => {
		if (!interaction.isCommand()) return;

		const end = metrics.commandTimer.startTimer()
		try {
			for (let i = 0; i < allCommands.length; i++) {
				let command = allCommands[i];
				if (command.name === interaction.commandName) {
					await command.execute(interaction);
					return;
				}
			}
		} finally {
			end();
		}
	});

	return client;
}

const genrateRandomNumber = (min: number, max: number) => {
	min = Math.ceil(min);
	max = Math.floor(max);
	return Math.floor(Math.random() * (max - min + 1)) + min; 
}

export default setupBot;