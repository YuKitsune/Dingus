import { addOrUpdateReminder } from '../db.js';
import { addOrUpdateReminderTimer } from '../reminderTimer.js';

const idleTimeOptionName = "idle-time";
const unitOptionName = "unit";

const necroCommand = {
	name: 'necro',
	description: 'Tells @NecroBot to ping this channel when it\'s been inactive for a specified amount of time.',
	options: [{
		name: idleTimeOptionName,
		type: 'INTEGER',
		description: 'The amount of hours before the bot will ping the channel.',
		required: true,
	},
	{
		name: unitOptionName,
		type: 'INTEGER',
		description: 'The unit to use',
		required: true,
		choices: [
			{
				name: 'Seconds',
				value: 1,
			},
			{
				name: 'Minutes',
				value: 60,
			},
			{
				name: 'Hours',
				value: 3600
			},
			{
				name: 'Days',
				value: 86400
			},
		],
	}],
	async execute(interaction) {
		const { channelId } = interaction;

		let idleTime = interaction.options.getInteger(idleTimeOptionName, true);
		if (!idleTime || idleTime <= 0) {
			await interaction.reply(`No can do... One or more please.`);
			return;
		}

		let unit = interaction.options.getInteger(unitOptionName, true);
		let idleSeconds = idleTime * unit;

		await addOrUpdateReminder(channelId, idleSeconds);
		addOrUpdateReminderTimer(interaction.client, channelId, idleSeconds);
		await interaction.reply(`A'ight, I'll ping this channel after ${intervalMessage(idleTime, unit)}.`);
	},
};

export default necroCommand;

const intervalMessage = (idleTime, unitMultiplier) => {
	let unit;
	switch (unitMultiplier) {
	case 1:
		unit = "second";
		break;
	case 60:
		unit = "minute";
		break;
	case 3600:
		unit = "hour";
		break;
	case 86400:
		unit = "day";
		break;
	}

	let plural = idleTime > 1 ? "s" : "";

	return `${idleTime} ${unit}${plural}`;
}