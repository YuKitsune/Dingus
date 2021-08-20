import allCommands from './allCommands.js';
import {Guild, GuildMember, User} from "discord.js";

const setupCommands = async (guild: Guild, contact: GuildMember) => {

	let errorResponse = null;
	try {
		const commandsResult = await guild?.commands.set(allCommands);
		if (!commandsResult) {
			errorResponse = "unknown error";
		}
	}
	catch (e) {
		errorResponse = e;
	}

	if (errorResponse) {
		console.error(`Failed to set up commands for guild ${guild.id}. Contacting user ${contact.id} (${contact.displayName}).`)
		await contact?.send(`Something went wrong when setting up the slash commands for ${guild.name}.\n\`${errorResponse}\``);
		return false;
	}

	return true;
}

export default setupCommands;