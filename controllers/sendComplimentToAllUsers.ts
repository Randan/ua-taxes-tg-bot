import mongoose from 'mongoose';
import bot from '../bot';
import { dbMongooseUri, handleError, lib, notifyAdmin } from '../utils';
import { Compliments, Users } from '../schemas';
import { ICompliment, IUser } from '../interfaces';

const sendComplimentToAllUsers = async (): Promise<void> => {
  try {
    mongoose.connect(dbMongooseUri);

    const complimentsCount = await Compliments.countDocuments({});

    if (!complimentsCount) return;

    const random = Math.floor(Math.random() * complimentsCount);

    const compliment: ICompliment | null = await Compliments.findOne({}).skip(random);

    if (!compliment) return;

    const users: IUser[] | null = await Users.find({});

    if (!users || !users.length) return;

    users.forEach((user: IUser): void => {
      bot.sendMessage(user.telegramId, compliment.value);
    });

    notifyAdmin(lib.allUsersGotCompliment());
  } catch (err: unknown) {
    handleError(JSON.stringify(err));
  }
};

export default sendComplimentToAllUsers;
