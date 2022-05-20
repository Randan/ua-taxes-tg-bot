import mongoose, { CallbackError } from 'mongoose';
import { Message } from 'node-telegram-bot-api';
import bot from '../bot';
import { dbMongooseUri, handleError, lib, notifyAdmin } from '../utils';
import { Compliments } from '../schemas';
import { ICompliment } from '../interfaces';

const addCompliment = (msg: Message): void => {
  if (!msg.from) return;

  const { id } = msg.from;

  const compliment: string = msg.text?.replace('/add', '').trim() || '';

  mongoose.connect(dbMongooseUri);

  Compliments.findOne(
    { value: compliment },
    (err: CallbackError, doc: ICompliment): void => {
      if (err) {
        handleError(JSON.stringify(err));
        return;
      }

      if (doc) {
        bot.sendMessage(id, lib.complimentExists());
      } else {
        Compliments.create(
          { value: compliment },
          (err: CallbackError): void => {
            if (err) {
              handleError(JSON.stringify(err));
              return;
            }

            bot.sendMessage(id, lib.complimentAccepted());
            notifyAdmin(lib.complimentAcceptedNotify(msg, compliment));
          }
        );
      }
    }
  );
};

export default addCompliment;
