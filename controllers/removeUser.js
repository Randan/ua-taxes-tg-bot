import mongoose from 'mongoose';
import bot from '../bot/index.js';
import { dbMongooseUri, handleError, notifyAdmin } from '../utils/index.js';
import { Users } from '../schemas/index.js';

const removeUser = msg => {
  const { id, first_name } = msg.from;

  mongoose.connect(dbMongooseUri, { useNewUrlParser: true, useUnifiedTopology: true });

  Users.findOne({ telegramId: id }, (err, docs) => {
    if (err) {
      handleError(String(err));
      return;
    }

    if (docs) {
      Users.deleteOne({ telegramId: id }, (err, doc) => {
        if (err) {
          handleError(String(err));
          return;
        }

        bot.sendMessage(id, `Ну що, ${first_name}! Будемо досвіданькатись? Мені було добре з тобою, приходь ще =)`);
        notifyAdmin(`${id} ${first_name} більше не хоче отримувати компліменти`);
      });
    } else {
      bot.sendMessage(id, 'Ми з вами не знайомі. Давайте познайомимось. Напишіть /start');
    }
  });
};

export default removeUser;
