import { getAllReminders, getReminderFor, removeReminder } from './db';
import { metrics } from './metrics';
import {Client, Snowflake, TextChannel} from "discord.js";

export let activeReminders = {};

export const setupReminderTimer = async (bot: Client) => {
	const reminders = await getAllReminders();

	console.log(`Resuming ${reminders.length} reminders`)
	for (let i = 0; i < reminders.length; i++) {
		const reminder = reminders[i];
		const channel = await bot.channels.fetch(reminder.channelId);
		const textChannel = channel as TextChannel;

		let lastActivityDate = new Date().getTime();
		const messages = await textChannel.messages.fetch({ limit: 1 });
		if (messages) {
			const lastMessage = messages.first();
			lastActivityDate = lastMessage.createdAt.getTime();
		}

		await addReminderTimerFromStartup(bot, reminder.channelId, reminder.idleSeconds, lastActivityDate);
	}
}

export const addReminderTimerFromStartup = async (bot: Client, channelId: Snowflake, idleSeconds: number, lastMessageTime: number) => {

	const lastMessageUnixTimeSeconds = Math.floor(lastMessageTime / 1000);
	const currentUnixTimeSeconds = Math.floor(new Date().getTime() / 1000);

	// If we're late, just necro the channel immediately
	// Todo: Maybe just delete the reminder?
	if (currentUnixTimeSeconds > lastMessageUnixTimeSeconds + idleSeconds) {
		console.log(`${currentUnixTimeSeconds - lastMessageUnixTimeSeconds + idleSeconds} seconds late for reminder in channel ${channelId}`)
		metrics.lateCounter.inc();
		await necro(bot, channelId, false);
		return;
	}

	// First timeout might be shorter than the normal
	// E.g. If the bot went offline, we could still necro the channel
	const firstTimeout = idleSeconds - (currentUnixTimeSeconds - lastMessageUnixTimeSeconds);
	activeReminders[channelId] = setTimeout(() => necro(bot, channelId, true), firstTimeout * 1000);
}

export const addOrUpdateReminderTimer = (bot: Client, channelId: Snowflake, idleSeconds: number) => {
	const existingTimeout = activeReminders[channelId];
	if (existingTimeout) {
		clearTimeout(existingTimeout);
	}

	activeReminders[channelId] = setTimeout(() => necro(bot, channelId, true), idleSeconds * 1000);
}

export const removeReminderTimer = (channelId: Snowflake) => {
	const reminderTimeout = activeReminders[channelId];
	if (reminderTimeout) {
		clearTimeout(reminderTimeout);
		delete activeReminders[channelId];
	}
}

const necro = async (bot: Client, channelId: Snowflake, setupTimerIfRequired: boolean) => {
	const channel = await bot.channels.fetch(channelId);
	const textChannel = channel as TextChannel;
	if (!channel || channel.deleted) {
		console.log(`Time to necro ${channelId} but it's gone`);
		await removeReminder(channelId);
		removeReminderTimer(channelId);
		return;
	}

	// Todo: Randomise responses
	await textChannel.send("Get necro'd.");

	// If we should still be necroing the channel, then set the timer again
	// Ideally the orcen command should stop the timer, but a race condition can occur where this func is running while
	// orcen is removing it, causing a leak
	if (!setupTimerIfRequired) return
	const reminder = await getReminderFor(channelId);

	if (!reminder) return;
	addOrUpdateReminderTimer(bot, channelId, reminder.idleSeconds);
}
