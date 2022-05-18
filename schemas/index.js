import mongoose from 'mongoose';
import { dbComplimentsCollection, dbUsersCollection } from '../utils/index.js';

const { Schema } = mongoose;

const complimentSchema = new Schema({
  value: String
});

const userSchema = new Schema({
  telegramId: String,
  firstName: String,
  lastName: String,
  userName: String
});

const Users = mongoose.model(dbUsersCollection, userSchema);
const Compliments = mongoose.model(dbComplimentsCollection, complimentSchema);

export { Users, Compliments };
