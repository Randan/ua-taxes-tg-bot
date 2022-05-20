import mongoose from 'mongoose';
import bot from '../bot/index.js';
import { dbMongooseUri, handleError, notifyAdmin } from '../utils/index.js';
import { Users } from '../schemas/index.js';

const addUser = msg => {
  const { id, first_name, last_name, username } = msg.from;

  const user = {
    telegramId: id,
    firstName: first_name,
    lastName: last_name,
    userName: username
  };

  mongoose.connect(dbMongooseUri, { useNewUrlParser: true, useUnifiedTopology: true });

  Users.findOne({ telegramId: id }, (err, docs) => {
    if (err) {
      handleError(String(err));
      return;
    }

    if (docs) {
      bot.sendMessage(user.telegramId, 'Так я і так відправляю тобі компліменти. Тобі мало? Звернись до розробника!');
      notifyAdmin(`${id} ${first_name} ${last_name} ${username} теж хоче отримувати компліменти`);
    } else {
      Users.create(user, (err, doc) => {
        if (err) {
          handleError(String(err));
          return;
        }

        bot.sendMessage(user.telegramId, `Вітаю, ${user.firstName}! Тепер я буду відправляти тобі компліменти =)`);
      });
    }
  });
};

export default addUser;
