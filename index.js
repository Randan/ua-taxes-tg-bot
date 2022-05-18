/* eslint-disable import/first */
import express from 'express';
import { appPort, notifyAdmin } from './utils/index.js';

const app = express();

app.get('/', (req, res) => {
  res.status(200).send('This is a Compliment Telegram Bot');
});

import './events/index.js';

app.listen(appPort, () => {
  notifyAdmin('Вітаю, я прокинувся!');
  console.log(`Server works on ${appPort}`);
});

import './cron/index.js';
