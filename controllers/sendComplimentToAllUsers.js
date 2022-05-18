import mongoose from 'mongoose';
import bot from '../bot/index.js';
import { dbMongooseUri, handleError, notifyAdmin } from '../utils/index.js';
import { Compliments, Users } from '../schemas/index.js';

const sendComplimentToAllUsers = () => {
  mongoose.connect(dbMongooseUri, { useNewUrlParser: true, useUnifiedTopology: true });

  let complimentsCount = null;

  Compliments.countDocuments({}, (err, count) => {
    if (err) {
      handleError(String(err));
      return;
    }
    complimentsCount = count;
  });

  Users.find({}, (err, docs) => {
    if (err) {
      handleError(String(err));
      return;
    }

    if (docs) {
      docs.forEach(user => {
        const random = Math.floor(Math.random() * complimentsCount);

        Compliments.findOne().skip(random).exec((err, doc) => {
          if (err) {
            handleError(String(err));
            return;
          }

          bot.sendMessage(user.telegramId, doc.value);
          notifyAdmin('Всі отримали компліменти');
        });
      });
    }
  });
};

export default sendComplimentToAllUsers;
