
const idleTimeOptionName = "idle-time";

// Todo: Add an expiry date/time limit
const necroCommand = {
	name: 'necro',
	description: 'Tells @NecroBot to ping this channel when it\'s been inactive for a specified amount of time.',
	options: [{
		name: idleTimeOptionName,
		type: 'INTEGER',
		description: 'The amount of hours before the bot will ping the channel.',
		required: true,
	}],
	async execute(interaction) {

		// Todo: If this channel has already been set up, then remove the info from the DB and stop the timer

		let idleTime = interaction.options.getInteger(idleTimeOptionName);

		if (idleTime <= 0) {
			await interaction.reply(`No.`);
			return;
		}

		// Todo: Store Guild, Channel/Thread and idle time in DB

		await interaction.reply(`A'ight, I'll ping this channel after ${idleTime} hours of inactivity.`);
	},
};

export default necroCommand;