import { addOrUpdateReminder, getReminderFor, removeReminder } from '../db.js';
import { addOrUpdateReminderTimer, removeReminderTimer } from '../reminderTimer.js';

const orcenCommand = {
	name: 'orcen',
	description: 'Tells @NecroBot to stop pinging this channel.',
	async execute(interaction) {
		const { channelId } = interaction;

		if (await getReminderFor(channelId)) {
			await removeReminder(channelId);
			removeReminderTimer(channelId);
			await interaction.reply(`A'ight, I'll stop.`);
		} else {
			await interaction.reply(`A'ight, I'll stop. I wasn't necroing the channel anyway ¯\\_(ツ)_/¯`);
		}
	},
};

export default orcenCommand;