import {REST, Routes} from "discord.js";

const refreshCommands = async (clientId, token, commands) => {
    const rest = new REST({ version: '10' }).setToken(token);
    await rest.put(
        Routes.applicationCommands(clientId),
        { body: commands },
    );
}

export default refreshCommands;