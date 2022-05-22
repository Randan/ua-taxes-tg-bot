import 'dotenv/config';

const appPort: string = process.env.PORT || '';
const dbUrl: string = process.env.DB_URL || '';
const dbComplimentsCollection: string =
  process.env.DB_COMPLIMENTS_COLLECTION || '';
const dbUsersCollection: string = process.env.DB_USERS_COLLECTION || '';
const timezone: string = process.env.TIMEZONE || '';
const adminId: string = process.env.ADMIN_TG_ID || '';
const unsplashUri: string = process.env.UNSPLASH_URI || '';
const unsplashAppToken: string = process.env.UNSPLASH_APP_TOKEN || '';

const dbMongooseUri: string = dbUrl
  ? dbUrl + '?retryWrites=true&w=majority'
  : '';

export {
  adminId,
  appPort,
  dbComplimentsCollection,
  dbMongooseUri,
  dbUrl,
  dbUsersCollection,
  timezone,
  unsplashAppToken,
  unsplashUri,
};
