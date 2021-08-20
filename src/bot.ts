import {Client, CommandInteraction, Guild, Intents, Message} from 'discord.js';
import setupCommands from './commands/setupCommands.js';
import allCommands from './commands/allCommands.js';
import { addOrUpdateReminder, getReminderFor, reminderCollection, usingDb } from './db.js';
import { addOrUpdateReminderTimer } from './reminderTimer.js';
import { metrics } from './metrics.js';
import { Db } from "mongodb";

const setupBot = (): Client => {

	// Setup the client
	const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES] });

	client.once('ready', async () => {

		console.log('Fixing up metrics');

		// Fixup metrics
		let initialGuildCount = client.guilds.cache.size;
		metrics.guildCounter.set(initialGuildCount);

		await usingDb(async (db: Db) => {
			const collection = db.collection(reminderCollection);
			let initialReminderCount = await collection.countDocuments();
			metrics.reminderCounter.set(initialReminderCount);
		})

		console.log('NecroBot is ready!');
	});

	// Setup the slash commands when joining a guild
	// Message the owner if there are any issues
	client.on('guildCreate', async (guild: Guild) => {
		console.log(`Joined guild ${guild.id}`)
		metrics.guildCounter.inc(1);
		const owner = await guild.members.fetch(guild.ownerId)
		await setupCommands(guild, owner);
	});

	client.on('guildDelete', async (guild: Guild) => {
		console.log(`Left guild ${guild.id}`)
		metrics.guildCounter.dec(1);
	});

	client.on('messageCreate', async (message: Message) => {

		// Ignore bots
		if (message.author.bot) return;

		// If the server owner asks the bot to refresh the commands, then the commands are setup again
		if (message.guild.ownerId === message.author.id &&
			message.mentions.has(client.user) &&
			message.content.toLowerCase().includes("refresh commands")) {
			console.log(`Server owner for guild ${message.guild.id} requested a commands refresh`)

			const author = await message.guild.members.fetch(message.author.id);
			const commandsSetup = await setupCommands(message.guild, author);
			if (commandsSetup) {
				await message.reply("Done!");
			}
		}

		// If this channel is set up with NecroBot, update the latest message time
		const channel = message.channel;
		const reminder = await getReminderFor(channel.id);
		if (reminder) {
			await addOrUpdateReminder(channel.id, reminder.idleSeconds);
			addOrUpdateReminderTimer(message.client, channel.id, reminder.idleSeconds);
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

export default setupBot;