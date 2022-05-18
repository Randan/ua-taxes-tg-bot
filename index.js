/* eslint-disable import/first */
import express from 'express';
import { appPort } from './utils/index.js';

const app = express();

app.get('/', (req, res) => {
  res.status(200).send('This is a Compliment Telegram Bot');
});

import './events/index.js';

app.listen(appPort, () => console.log(`Server works on ${appPort}`));

import './utils/cron.js';
