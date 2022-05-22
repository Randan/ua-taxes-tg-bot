import mongoose from 'mongoose';
import { Message } from 'node-telegram-bot-api';
import bot from '../bot';
import { dbMongooseUri, handleError, lib, notifyAdmin } from '../utils';
import { Compliments } from '../schemas';
import { ICompliment } from '../interfaces';

const addCompliment = async (msg: Message): Promise<void> => {
  if (!msg.from) return;

  const { id } = msg.from;

  const complimentText: string = msg.text?.replace('/add', '').trim() || '';

  try {
    mongoose.connect(dbMongooseUri);

    const compliment: ICompliment | null = await Compliments.findOne({
      value: complimentText,
    });

    if (compliment) {
      bot.sendMessage(id, lib.complimentExists());
      return;
    }

    const addedComplimentResponse: ICompliment = await Compliments.create({
      value: complimentText,
    });

    if (addedComplimentResponse) {
      bot.sendMessage(id, lib.complimentAccepted());
      notifyAdmin(lib.complimentAcceptedNotify(msg, complimentText));
    }
  } catch (err: unknown) {
    handleError(JSON.stringify(err));
  }
};

export default addCompliment;
