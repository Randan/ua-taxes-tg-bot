import mongoose from 'mongoose';
import { Message } from 'node-telegram-bot-api';
import bot from '../bot';
import { dbMongooseUri, handleError, lib, notifyAdmin } from '../utils';
import { Users } from '../schemas';
import { IUser } from '../interfaces';

const addUser = async (msg: Message): Promise<void> => {
  if (!msg.from) return;

  const { id, first_name, last_name, username } = msg.from;

  const newUser: IUser = {
    telegramId: id,
    firstName: first_name,
    lastName: last_name,
    userName: username,
  };

  try {
    mongoose.connect(dbMongooseUri);

    const user: IUser | null = await Users.findOne({ telegramId: id });

    if (user) {
      bot.sendMessage(id, lib.userExists());
      return;
    }

    const userAddedResponse: IUser = await Users.create(newUser);

    if (userAddedResponse) {
      bot.sendMessage(id, lib.userAccepted(msg));
      notifyAdmin(lib.userAcceptedNotify(msg));
    }
  } catch (err: unknown) {
    handleError(JSON.stringify(err));
  }
};

export default addUser;
