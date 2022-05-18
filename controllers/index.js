import 'dotenv/config';
import mongoose from 'mongoose';
import { adminId, bot, dbMongooseUri } from '../utils/index.js';
import { Compliments, Users } from '../schemas/index.js';

const notifyAdmin = (message) => {
  adminId && bot.sendMessage(adminId, message);
};

const handleError = (message) => {
  console.log(message);
  notifyAdmin(message);
};

const help = msg => {
  const { id, first_name } = msg.from;

  bot.sendMessage(
    id,
    `Вітаю, ${first_name}! Мене звати ComplimentBot.\n` +
    '\n' +
    '@heWhoMustSendYouComplimentsBot\n' +
    '\n' +
    'Якщо хочеш - я буду відправляти тобі компліменти.\n' +
    '\n' +
    '/help - Допомога.\n' +
    '/start - Дозволь мені говорити тобі приємне.\n' +
    '/stop - Скажи мені "Па-па".\n' +
    '/compliment - Якщо хочешь комплімент прямо тут і зараз.'
  );

  notifyAdmin(`${id} ${first_name} попросив про допомогу`);
};

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
        notifyAdmin(`${id} ${first_name} більше хоче отримувати компліменти`);
      });
    } else {
      bot.sendMessage(id, 'Ми з вами не знайомі. Давайте познайомимось. Напишіть /start');
    }
  });
};

const sendCompliment = msg => {
  const { id, first_name } = msg.from;

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
            notifyAdmin(`${id} ${first_name} отримaв(-ла) комплімент`);
          });
      });
    } else {
      bot.sendMessage(id, 'Ми з вами не знайомі. Давайте познайомимось. Напишіть /start');
    }
  });
};

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

export { addUser, help, removeUser, sendCompliment, sendComplimentToAllUsers };
