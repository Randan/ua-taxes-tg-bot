import mongoose from 'mongoose';
import { dbUsersCollection } from '../utils/index.js';

const { Schema } = mongoose;

const userSchema = new Schema({
  telegramId: String,
  firstName: String,
  lastName: String,
  userName: String
});

const Users = mongoose.model(dbUsersCollection, userSchema);

export default Users;
