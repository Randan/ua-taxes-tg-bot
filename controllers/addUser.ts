import mongoose, { CallbackError } from 'mongoose';
import { Message } from 'node-telegram-bot-api';
import bot from '../bot';
import { dbMongooseUri, handleError, lib, notifyAdmin } from '../utils';
import { Users } from '../schemas';
import { IUser } from '../interfaces';

const addUser = (msg: Message): void => {
  if (!msg.from) return;

  const { id, first_name, last_name, username } = msg.from;

  const user: IUser = {
    telegramId: id,
    firstName: first_name,
    lastName: last_name,
    userName: username
  };

  mongoose.connect(dbMongooseUri);

  Users.findOne({ telegramId: id }, (err: CallbackError, doc: IUser): void => {
    if (err) {
      handleError(JSON.stringify(err));
      return;
    }

    if (doc) {
      bot.sendMessage(user.telegramId, lib.userExists);
    } else {
      Users.create(user, (err, doc) => {
        if (err) {
          handleError(JSON.stringify(err));
          return;
        }

        bot.sendMessage(user.telegramId, lib.userAccepted(msg));
        notifyAdmin(
          lib.userAcceptedNotify(msg)
        );
      });
    }
  });
};

export default addUser;
