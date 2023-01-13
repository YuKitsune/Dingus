import {Db, MongoClient} from 'mongodb';
import {Guild, User} from "discord.js";

export const targetsCollection = "targets";

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
		await onError(e);
		console.log(`Error using DB: ${e}`);
	} finally {
		await client.close();
	}
}

export const setTarget = async (guild: Guild, user: User | "random" | null) => {
	console.log("Setting target");
	await usingDb(async (db) => {
		const query = { guildId: guild.id };

		const target = user == "random" ? "random" : user?.id ?? null;
		const update = { $set: {guildId: guild.id, target: target }};
		const options = { upsert: true };

		await db.collection(targetsCollection).updateOne(query, update, options);
	});
}

export const getTarget = async (guild: Guild) => {
	var result;
	await usingDb(async (db) => {
		const query = { guildId: guild.id };

		const dbResult = await db.collection(targetsCollection).findOne(query);
		result = dbResult?.target;
	});

	return result;
}