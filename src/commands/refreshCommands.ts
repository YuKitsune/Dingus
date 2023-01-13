import allCommands from './allCommands.js';
import {ApplicationCommand, ApplicationCommandData, Client} from "discord.js";

const refreshCommands = async (client: Client) => {

	console.log(`Refreshing commands`)

    const existingCommands = await client.application.commands.fetch();
    existingCommands.forEach(async function (existingCommand: ApplicationCommand) {
        if (!commandExists(existingCommand, allCommands)) {
            await client.application.commands.delete(existingCommand)
        }
    })

	await client.application.commands.set(allCommands);

	console.log(`Commands refreshed`)
}

const commandExists = (command: ApplicationCommand, allCommands: ApplicationCommandData[]) => {
    let exists = false;
    allCommands.forEach(function (cmd: ApplicationCommandData) {
        if (command.name == cmd.name) {
            exists = true;
        }
    })

    return exists;
}

export default refreshCommands;