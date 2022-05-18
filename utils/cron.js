import 'dotenv/config';
import cron from 'node-cron';
import { sendComplimentToAllUsers } from '../controllers/index.js';

const cronOptions = {
  scheduled: true,
  timezone: process.env.TIMEZONE
};

cron.schedule('0 10 * * *', () => {
  sendComplimentToAllUsers();
}, cronOptions);
