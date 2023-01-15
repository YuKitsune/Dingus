import { ChatInputCommandInteraction, Guild, GuildEmoji, SlashCommandBuilder } from "discord.js";
import { setTarget, unsetTarget } from "../db";

export const targetCommandName = "target";
const userCommandName = "user";
const userOptionName = "user";
const randomCommandName = "random";
const emojiOptionName = "emoji";
const disableCommandName = "disable";

export const targetCommand = new SlashCommandBuilder()
	.setName(targetCommandName)
	.setDescription('Tells @Dingus be funny.')
	.addSubcommand(subcommand => 
		subcommand.setName(userCommandName)
			.setDescription('Target a particular user.')
			.addUserOption(option =>
				option.setName(userOptionName)
					.setDescription('The user to target.')
					.setRequired(true))
			.addStringOption(option => 
				option.setName(emojiOptionName)
					.setDescription("The emoji to react with.")
					.setRequired(true)))
	.addSubcommand(subcommand =>
		subcommand
			.setName(randomCommandName)
			.setDescription('Targets a random message, randomly.')
			.addStringOption(option => 
				option.setName(emojiOptionName)
					.setDescription("The emoji to react with.")
					.setRequired(true)))
	.addSubcommand(sumcommand =>
		sumcommand.setName(disableCommandName)
			.setDescription("Disables targeting."));

export const executeTargetCommand = async (interaction: ChatInputCommandInteraction): Promise<void> => {
	const subcommand = interaction.options.getSubcommand();
	switch (subcommand) {
		case userCommandName:
			await setTargetUser(interaction);
			break;
		case randomCommandName:
			await setRandomTarget(interaction);
			break;
		case disableCommandName:
			await disableTargeting(interaction);
			break;
		default:
			await interaction.reply("Huh?");
			break;
	}
}

const setTargetUser = async (interaction: ChatInputCommandInteraction): Promise<void> => {
	let targetUser = interaction.options.getUser(userOptionName, true);
	let targetEmoji = interaction.options.getString(emojiOptionName, true);

	if (!targetUser || !targetEmoji) {
		interaction.reply("💀 A user and emoji are required.");
		return;
	}

	await setTarget(interaction.guild, targetUser, targetEmoji);
	await interaction.reply(`😈 I'll always react to ${targetUser.username}'s messages with the ${targetEmoji} emoji.`)
}

const setRandomTarget = async (interaction: ChatInputCommandInteraction): Promise<void> => {
	let targetEmoji = interaction.options.getString(emojiOptionName, true);

	if (!targetEmoji) {
		interaction.reply("💀 An emoji is required.");
		return;
	}

	await setTarget(interaction.guild, "random", targetEmoji);
	await interaction.reply(`😈 I'll react to a random message with the :${targetEmoji}: emoji, randomly.`)
}

const disableTargeting = async (interaction: ChatInputCommandInteraction): Promise<void> => {
	await unsetTarget(interaction.guild);
	await interaction.reply("😔 No more targeting for now.")
}

export default targetCommand;