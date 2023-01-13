import { ApplicationCommandData, CommandInteraction } from "discord.js";

export interface Executable {
    execute(interaction: CommandInteraction): Promise<void>;
}

export type Command = ApplicationCommandData & Executable;