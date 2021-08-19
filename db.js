import { MongoClient } from 'mongodb';
import { metrics } from './metrics.js';

const host = process.env.DB_HOST;
const dbName = process.env.DB_NAME;
const uri = `mongodb://${host}/?retryWrites=true&writeConcern=majority`;

export const reminderCollection = "reminders";

// Todo: Implement a cache

export const usingDb = async (func, onError = async (_) => {}) => {

	const client = new MongoClient(uri);
	try {
		await client.connect();
		const database = client.db(dbName);
		await func(database);
	} catch(e) {
		await onError(e);
		console.log(`Error using DB: ${e}`);
	} finally {
		await client.close();
	}
}

export const addOrUpdateReminder = async (channelId, idleSeconds) => {
	await usingDb(async (db) => {
		console.log("Adding/updating reminder");
		const query = { channelId: channelId };
		const update = { $set: {channelId: channelId, idleSeconds: idleSeconds }};
		const options = { upsert: true };

		const result = await db.collection(reminderCollection).updateOne(query, update, options);

		if (result.modifiedCount === 0 && result.upsertedCount === 0) {
			console.log(`Tried to add reminder, but no reminders were added or modified`);
		} else {
			if (result.matchedCount === 1) {
				console.log("Found " + result.matchedCount + " reminder");
			}
			if (result.modifiedCount === 1) {
				console.log("Updated one reminder");
			}
			if (result.upsertedCount === 1) {
				metrics.reminderCounter.inc(1);
				console.log("Added one reminder");
			}
		}
	});
}

export const getAllReminders = async () => {

	let allReminders = [];
	await usingDb(async (db) => {
		const allRemindersCursor = await db.collection(reminderCollection).find();
		await allRemindersCursor.forEach((reminder) => allReminders.push(reminder));
	});

	return allReminders;
}

export const getReminderFor = async (channelId) => {
	let reminder = null;
	await usingDb(async (db) => {
		const query = { channelId: channelId };
		reminder = await db.collection(reminderCollection).findOne(query);
	});

	return reminder;
}

export const removeReminder = async (channelId) => {
	console.log("Removing reminder");
	await usingDb(async (db) => {
		const query = { channelId: channelId };
		const result = await db.collection(reminderCollection).deleteOne(query);
		if (result.deletedCount === 1) {
			metrics.reminderCounter.dec(1);
			console.log("One reminder deleted");
		} else {
			console.log("No reminders deleted");
		}
	});
}

export const purgeMissingChannels = async (bot) => {
	console.log("Purging unreachable channels");

	const reminders = getAllReminders();
	for (let i = 0; i < reminders.length; i++) {
		const reminder = reminders[i];
		const channel = await bot.channels.fetch(reminder.channelId);
		if (!channel || channel.deleted) {
			console.log(`Removing reminder for channel ${reminder.channelId} (couldn't be found or was deleted)`);
			await removeReminder(reminder.channelId);
		}
	}
}