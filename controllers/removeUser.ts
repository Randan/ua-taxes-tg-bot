import mongoose from 'mongoose';
import { Message } from 'node-telegram-bot-api';
import bot from '../bot';
import { dbMongooseUri, handleError, lib, notifyAdmin } from '../utils';
import { Users } from '../schemas';
import { IUser } from '../interfaces';

const removeUser = async (msg: Message): Promise<void> => {
  if (!msg.from) return;

  const { id } = msg.from;;

  try {
    mongoose.connect(dbMongooseUri);

    const removedUserResponse: IUser | null = await Users.findOneAndDelete({
      telegramId: id,
    });

    if (removedUserResponse) {
      bot.sendMessage(id, lib.userRemoved(msg));
      notifyAdmin(lib.userRemovedNotify(msg));
    } else {
      bot.sendMessage(id, lib.userNotExists());
    }
  } catch (err: unknown) {
    handleError(JSON.stringify(err));
  }
};

export default removeUser;
