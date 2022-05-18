import mongoose from 'mongoose';
import { dbComplimentsCollection } from '../utils/index.js';

const { Schema } = mongoose;

const complimentSchema = new Schema({
  value: String
});

const Compliments = mongoose.model(dbComplimentsCollection, complimentSchema);

export default Compliments;
