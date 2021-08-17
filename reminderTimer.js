import { getAllReminders, getReminderFor, removeReminder } from './db.js';
import { metrics } from './metrics.js';

export let activeReminders = {};

export const setupReminderTimer = async (bot) => {
	console.log("Resuming existing reminders.");
	const reminders = await getAllReminders();

	for (let i = 0; i < reminders.length; i++) {
		const reminder = reminders[i];
		const channel = await bot.channels.fetch(reminder.channelId);

		let lastActivityDate = new Date().getTime();
		const messages = await channel.messages.fetch({ limit: 1 });
		if (messages) {
			const lastMessage = messages.first();
			lastActivityDate = lastMessage.createdAt.getTime();
		}

		await addReminderTimerFromStartup(bot, reminder.channelId, reminder.idleSeconds, lastActivityDate);
	}
}

export const addReminderTimerFromStartup = async (bot, channelId, idleSeconds, lastMessageTime) => {

	const lastMessageUnixTimeSeconds = Math.floor(lastMessageTime / 1000);
	const currentUnixTimeSeconds = Math.floor(new Date().getTime() / 1000);

	// If we're late, just necro the channel immediately
	// Todo: Maybe just delete the reminder?
	if (currentUnixTimeSeconds > lastMessageUnixTimeSeconds + idleSeconds) {
		metrics.lateCounter.inc();
		await necro(bot, channelId, idleSeconds);
		return;
	}

	// First timeout might be shorter than the normal
	// E.g. If the bot went offline, we could still necro the channel
	const firstTimeout = idleSeconds - (currentUnixTimeSeconds - lastMessageUnixTimeSeconds);
	activeReminders[channelId] = setTimeout(() => necro(bot, channelId, true), firstTimeout * 1000);
}

export const addOrUpdateReminderTimer = (bot, channelId, idleSeconds) => {
	const existingTimeout = activeReminders[channelId];
	if (existingTimeout) {
		clearTimeout(existingTimeout);
	}

	activeReminders[channelId] = setTimeout(() => necro(bot, channelId, true), idleSeconds * 1000);
}

export const removeReminderTimer = (channelId) => {
	const reminderTimeout = activeReminders[channelId];
	if (reminderTimeout) {
		clearTimeout(reminderTimeout);
		delete activeReminders[channelId];
	}
}

const necro = async (bot, channelId, setupTimerIfRequired) => {
	const channel = await bot.channels.fetch(channelId);
	if (!channel || channel.deleted) {
		console.log(`Time to necro ${channelId} but it's gone...`);
		await removeReminder(channelId);
		removeReminderTimer(channelId);
		return;
	}

	await channel.send("Get necro'd.");

	// If we should still be necroing the channel, then set the timer again
	// Ideally the orcen command should stop the timer, but a race condition can occur where this func is running while
	// orcen is removing it, causing a leak
	if (!setupTimerIfRequired) return
	const reminder = await getReminderFor(channelId);

	if (!reminder) return;
	addOrUpdateReminderTimer(bot, channelId, reminder.idleSeconds);
}
