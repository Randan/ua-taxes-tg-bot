import mongoose, { CallbackError } from 'mongoose';
import { Message } from 'node-telegram-bot-api';
import bot from '../bot';
import { dbMongooseUri, handleError, lib, notifyAdmin } from '../utils';
import { Users } from '../schemas';
import { IUser } from '../interfaces';

const removeUser = (msg: Message): void => {
  if (!msg.from) return;
  const { id } = msg.from;

  mongoose.connect(dbMongooseUri);

  Users.findOneAndDelete({ telegramId: id }, (err: CallbackError, doc: IUser): void => {
    if (err) {
      handleError(JSON.stringify(err));
      return;
    }

    if (doc) {
      bot.sendMessage(
        id,
        lib.userRemoved(msg)
      );
      notifyAdmin(
        lib.userRemovedNotify(msg)
      );
    } else {
      bot.sendMessage(
        id,
        lib.userNotExists()
      );
    }
  });
};

export default removeUser;
