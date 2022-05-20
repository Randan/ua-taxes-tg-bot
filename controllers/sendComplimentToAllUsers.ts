import mongoose, { CallbackError } from 'mongoose';
import bot from '../bot';
import { dbMongooseUri, handleError, lib, notifyAdmin } from '../utils';
import { Compliments, Users } from '../schemas';
import { ICompliment, IUser } from '../interfaces';

const sendComplimentToAllUsers = (): void => {
  mongoose.connect(dbMongooseUri);

  let complimentsCount: number = 0;

  Compliments.countDocuments({}, (err: CallbackError, count: number): void => {
    if (err) {
      handleError(JSON.stringify(err));
      return;
    }
    complimentsCount = count;
  });

  Users.find({}, (err: CallbackError, docs: IUser[]): void => {
    if (err) {
      handleError(JSON.stringify(err));
      return;
    }

    if (!complimentsCount) return;

    if (docs) {
      docs.forEach((user: IUser): void => {
        const random = Math.floor(Math.random() * complimentsCount);

        Compliments.findOne(
          {},
          (err: CallbackError, doc: ICompliment): void => {
            if (err) {
              handleError(JSON.stringify(err));
              return;
            }

            bot.sendMessage(user.telegramId, doc.value);
          }
        ).skip(random);
      });

      notifyAdmin(lib.allUsersGotCompliment());
    }
  });
};

export default sendComplimentToAllUsers;
