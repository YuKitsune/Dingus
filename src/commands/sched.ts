import { ChatInputCommandInteraction, Guild, GuildEmoji, SlashCommandBuilder } from "discord.js";
import { setTarget, unsetTarget } from "../db";

export const schedCommandName = "sched";
export const messageOptionName = "message";
export const secondsOptionName = "seconds";

export const schedCommand = new SlashCommandBuilder()
	.setName(schedCommandName)
	.setDescription('Schedules a message.')
	.addStringOption(option =>
		option.setName(messageOptionName)
			.setDescription("The message to send.")
			.setRequired(true))
	.addNumberOption(option =>
		option.setName(secondsOptionName)
			.setDescription("The amount of seconds to wait before sending the message.")
			.setRequired(true));

export const executeSchedCommand = async (interaction: ChatInputCommandInteraction): Promise<void> => {
	let message = interaction.options.getString(messageOptionName, true);
	let seconds = interaction.options.getNumber(secondsOptionName, true);
	await interaction.reply("Heh, alright.");

	setTimeout(() => interaction.channel.send(message), 1000 * seconds);
}

export default schedCommand;