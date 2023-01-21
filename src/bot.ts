import {Client, Events, GatewayIntentBits, Guild, Interaction, Message} from 'discord.js';
import allCommands from './commands/allCommands.js';
import { getTarget } from './db.js';
import { metrics } from './metrics.js';
import refreshCommands from './commands/refreshCommands.js';
import { CommandFailedEvent } from 'mongodb';
import { executeTargetCommand, targetCommandName } from './commands/target.js';
import schedCommand, { executeSchedCommand, schedCommandName } from './commands/sched.js';

const setupBot = (): Client => {

	// Setup the client
	const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages] });

	client.once(Events.ClientReady, async () => {

		console.log('📈 Fixing up metrics');
		let initialGuildCount = client.guilds.cache.size;
		metrics.guildCounter.set(initialGuildCount);

		console.log('♻️ Refreshing commands');
		const clientId = process.env.CLIENT_ID;
		const token = process.env.TOKEN;
		await refreshCommands(clientId, token, allCommands);

		console.log('✅ Dingus is ready!');

		const inviteLink = "https://discord.com/api/oauth2/authorize?client_id=872312568105037834&permissions=2147601472&scope=bot%20applications.commands";
		console.log(`🔗 Invite link: ${inviteLink}`);
	});

	client.on(Events.GuildCreate, async (guild: Guild) => {
		console.log(`🏃 Joined guild ${guild.id}`)
		metrics.guildCounter.inc(1);
	});

	client.on(Events.GuildDelete, async (guild: Guild) => {
		console.log(`🏃 Left guild ${guild.id}`)
		metrics.guildCounter.dec(1);
	});

	client.on(Events.MessageCreate, async (message: Message) => {

		// Ignore bots
		if (message.author.bot)
			return;

		// Get reaction target
		let targetRes = await getTarget(message.guild);
		if (targetRes) {
			let {target, emoji} = targetRes;
			if (target == "random" && genrateRandomNumber(0, 100) >= 50) {
				message.react(emoji);
			} else if (target != null && message.author.id == target) {
				message.react(emoji);
			}
		}
	});

	client.on(Events.InteractionCreate, async (interaction: Interaction) => {
		if (!interaction.isChatInputCommand())
			return;

		await time(async () => {
			switch (interaction.commandName) {
				case targetCommandName:
					await executeTargetCommand(interaction);
					break;
				case schedCommandName:
					await executeSchedCommand(interaction);
					break;
			}
		})
	});

	return client;
}

const genrateRandomNumber = (min: number, max: number) => {
	min = Math.ceil(min);
	max = Math.floor(max);
	return Math.floor(Math.random() * (max - min + 1)) + min; 
}

const time = async (fn: () => Promise<void>) => {
	const end = metrics.commandTimer.startTimer()
	try {
		await fn();
	} finally {
		end();
	}
}

export default setupBot;