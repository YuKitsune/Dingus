import { CommandInteraction } from "discord.js";
import { setTarget } from "../db";

const userOptionName = "user";
const randomOptionName = "random";

const targetCommand = {
	name: 'target',
	description: 'Tells @NecroBot be funny.',
	options: [{
		name: userOptionName,
		type: 'USER',
		description: 'The user to ping.',
		required: false,
	},
    {
		name: randomOptionName,
		type: 'BOOLEAN',
		description: 'Ping a random user, randomly.',
		required: false,
	}],
	async execute(interaction: CommandInteraction) {
		let targetUser = interaction.options.getUser(userOptionName, false);
        
		let randomUser = interaction.options.getBoolean(randomOptionName, false);

        if (targetUser) {
            setTarget(interaction.guild, targetUser);
            await interaction.reply(`I'll always react to ${targetUser.username}'s messages.`)
        } else if (randomUser) {
            setTarget(interaction.guild, "random");
            await interaction.reply("I'll react to a random message, randomly.")
        } else {
            await interaction.reply("Huh?")
        }
	},
};

export default targetCommand;