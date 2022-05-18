import 'dotenv/config';

const appPort = process.env.PORT;
const dbUrl = process.env.DB_URL;
const dbComplimentsCollection = process.env.DB_COMPLIMENTS_COLLECTION;
const dbUsersCollection = process.env.DB_USERS_COLLECTION;
const timezone = process.env.TIMEZONE;
const adminId = process.env.ADMIN_TG_ID;

const dbMongooseUri = dbUrl + '?retryWrites=true&w=majority';

export { adminId, appPort, dbComplimentsCollection, dbMongooseUri, dbUrl, dbUsersCollection, timezone };
