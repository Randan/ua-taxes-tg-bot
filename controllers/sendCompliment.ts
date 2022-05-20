import mongoose, { CallbackError } from 'mongoose';
import { Message } from 'node-telegram-bot-api';
import bot from '../bot';
import { dbMongooseUri, handleError, lib, notifyAdmin } from '../utils';
import { Compliments, Users } from '../schemas';
import { ICompliment, IUser } from '../interfaces';

const sendCompliment = (msg: Message): void => {
  if (!msg.from) return;

  const { id } = msg.from;

  mongoose.connect(dbMongooseUri);

  Users.findOne({ telegramId: id }, (err: CallbackError, docs: IUser): void => {
    if (err) {
      handleError(JSON.stringify(err));
      return;
    }

    if (docs) {
      Compliments.countDocuments({})
        .then((count: number): void => {
          const random = Math.floor(Math.random() * count);

          Compliments.findOne(
            {},
            (err: CallbackError, doc: ICompliment): void => {
              if (err) {
                handleError(JSON.stringify(err));
                return;
              }

              bot.sendMessage(id, doc.value);
              notifyAdmin(lib.userGotCompliment(msg));
            }
          ).skip(random);
        })
        .catch((err: CallbackError) => {
          handleError(JSON.stringify(err));
        });
    } else {
      bot.sendMessage(id, lib.userNotExists());
    }
  });
};

export default sendCompliment;
