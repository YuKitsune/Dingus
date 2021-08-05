import dotenv from 'dotenv';
import { Client, Intents } from 'discord.js';
import setupCommands from './setupCommands.js';
import allCommands from './commands/allCommands.js';

const main = async () => {

	// Load from .env file
	dotenv.config();

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

		// If the server owner asks the bot to reset, then the commands are setup again
		if (message.guild.ownerId === message.author.id &&
			message.mentions.has(client.user) &&
		    message.content.includes("reset")) {
			const commandsSetup = await setupCommands(message.guild, message.author)
			if (commandsSetup) {
				await message.reply("Done!");
			}
		}

		// Todo: If this channel is set up with NecroBot, reset the reminder timer
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
	})

	await client.login(process.env.TOKEN);
}

await main();