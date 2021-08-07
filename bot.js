import { Client, Intents } from 'discord.js';
import setupCommands from './commands/setupCommands.js';
import allCommands from './commands/allCommands.js';
import { addOrUpdateReminder, getReminderFor } from './db.js';
import { addOrUpdateReminderTimer } from './reminderTimer.js';

const setupBot = () => {

	// Setup the client
	const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES] });

	client.once('ready', () => {
		console.log('NecroBot is ready!');
	});

	// Setup the slash commands when joining a guild
	// Message the owner if there are any issues
	client.on('guildCreate', async guild => {
		await setupCommands(guild, guild.owner)
	});

	client.on('messageCreate', async message => {

		// Ignore bots
		if (message.author.bot) return;

		// If the server owner asks the bot to refresh the commands, then the commands are setup again
		if (message.guild.ownerId === message.author.id &&
			message.mentions.has(client.user) &&
			message.content.toLowerCase().includes("refresh commands")) {
			const commandsSetup = await setupCommands(message.guild, message.author)
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
	client.on('interactionCreate', async interaction => {
		if (!interaction.isCommand()) return;

		for (let i = 0; i < allCommands.length; i++) {
			let command = allCommands[i];
			if (command.name === interaction.commandName) {
				await command.execute(interaction);
				return;
			}
		}
	});

	return client;
}

export default setupBot;