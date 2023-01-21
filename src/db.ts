import {Db, MongoClient} from 'mongodb';
import {EmojiResolvable, Guild, GuildEmoji, User} from "discord.js";

export const targetsCollection = "targets";

export type Target = string | "random";

// Todo: Implement a cache

type dbFunc = (db: Db) => Promise<void>;
type errorHandlerFunc = (err: Error) => Promise<void>;

export const usingDb = async (func: dbFunc, onError: errorHandlerFunc = async (_) => {}) => {
	const client = new MongoClient(process.env.DB_URI);
	try {
		await client.connect();
		const database = client.db();
		await func(database);
	} catch(e) {
		console.error("Database error:", e)
		await onError(e);
	} finally {
		await client.close();
	}
}

export const setTarget = async (guild: Guild, user: User | "random", emoji: string) => {
	await usingDb(async (db) => {
		const query = { guildId: guild.id };

		const target = user == "random" ? "random" : user?.id ?? null;
		const update = { $set: {guildId: guild.id, target: target, emoji: emoji }};
		const options = { upsert: true };

		await db.collection(targetsCollection).updateOne(query, update, options);
	});
}

export const getTarget = async (guild: Guild): Promise<{target: Target, emoji: string} | null> => {
	let result = null;
	await usingDb(async (db) => {
		const query = { guildId: guild.id };

		const dbResult = await db.collection(targetsCollection).findOne(query);
		result = { target: dbResult?.target, emoji: dbResult?.emoji };
	});

	return result;
}

export const unsetTarget = async (guild: Guild) => {
	await usingDb(async (db) => {
		const query = { guildId: guild.id };
		await db.collection(targetsCollection).deleteOne(query);
	});
}
