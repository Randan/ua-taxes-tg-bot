import mongoose from 'mongoose';
import bot from '../bot/index.js';
import { dbMongooseUri, handleError, notifyAdmin } from '../utils/index.js';
import { Compliments, Users } from '../schemas/index.js';

const sendCompliment = msg => {
  const { id, first_name, username } = msg.from;

  mongoose.connect(dbMongooseUri, { useNewUrlParser: true, useUnifiedTopology: true });

  Users.findOne({ telegramId: id }, (err, docs) => {
    if (err) {
      handleError(String(err));
      return;
    }

    if (docs) {
      Compliments.countDocuments({}, (err, count) => {
        if (err) {
          handleError(String(err));
          return;
        }

        const random = Math.floor(Math.random() * count);

        Compliments.findOne().skip(random).exec(
          (err, doc) => {
            if (err) {
              handleError(String(err));
              return;
            }

            bot.sendMessage(id, doc.value);
            notifyAdmin(`${first_name} (@${username}) отримaв(-ла) комплімент`);
          });
      });
    } else {
      bot.sendMessage(id, 'Ми з вами не знайомі. Давайте познайомимось. Напишіть /start');
    }
  });
};

export default sendCompliment;
