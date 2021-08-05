import allCommands from './commands/allCommands.js';

const setupCommands = async (guild, contact) => {

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
		await contact?.send(`Oi, something went wrong when setting up the commands for ${guild.name}. \`${errorResponse}\``);
		return false;
	}

	return true;
}

export default setupCommands;