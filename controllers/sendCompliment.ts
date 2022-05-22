import mongoose from 'mongoose';
import { Message } from 'node-telegram-bot-api';
import bot from '../bot';
import { dbMongooseUri, handleError, lib, notifyAdmin } from '../utils';
import { Compliments, Users } from '../schemas';
import { ICompliment, IUser } from '../interfaces';

const sendCompliment = async (msg: Message): Promise<void> => {
  if (!msg.from) return;

  const { id } = msg.from;

  try {
    mongoose.connect(dbMongooseUri);

    const user: IUser | null = await Users.findOne({ telegramId: id });

    if (!user) {
      bot.sendMessage(id, lib.userNotExists());
      return;
    }

    const complimentsCount = await Compliments.countDocuments({});

    if (!complimentsCount) return;

    const random = Math.floor(Math.random() * complimentsCount);

    const compliment: ICompliment | null = await Compliments.findOne({}).skip(random);

    if (compliment) {
      bot.sendMessage(id, compliment.value);
      notifyAdmin(lib.userGotCompliment(msg));
    }
  } catch (err: unknown) {
    handleError(JSON.stringify(err));
  }
};

export default sendCompliment;
