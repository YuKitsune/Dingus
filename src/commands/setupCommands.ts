import allCommands from './allCommands.js';
import {Guild} from "discord.js";

const setupCommands = async (guild: Guild) => {
	console.log(`Setting commands for guild ${guild.id}`)
	guild.commands.set(allCommands)
		.then(console.log)
		.catch(console.error);
}

export default setupCommands;