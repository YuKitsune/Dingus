import { getReminderFor, removeReminder } from '../db.js';
import { removeReminderTimer } from '../reminderTimer.js';
import {CommandInteraction} from "discord.js";

const orcenCommand = {
	name: 'orcen',
	description: 'Tells @NecroBot to stop pinging this channel.',
	async execute(interaction: CommandInteraction) {
		const { channelId } = interaction;

		if (await getReminderFor(channelId)) {
			await removeReminder(channelId);
			removeReminderTimer(channelId);
			await interaction.reply(`A'ight, I'll stop.`);
			return;
		}

		await interaction.reply(`A'ight, I'll stop. I wasn't necroing the channel anyway ¯\\_(ツ)_/¯`);
	},
};

export default orcenCommand;