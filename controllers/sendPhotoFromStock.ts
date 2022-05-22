import mongoose from 'mongoose';
import { AxiosResponse } from 'axios';
import { Message } from 'node-telegram-bot-api';
import bot from '../bot';
import { getPhoto } from '../api';
import { dbMongooseUri, handleError, lib } from '../utils';
import { Users } from '../schemas';
import { IUnsplashResponse, IUser } from '../interfaces';

const sendPhotoFromStock = async (
  msg: Message,
  query: string,
  caption: string
): Promise<void> => {
  if (!msg.from) return;

  const { id } = msg.from;

  try {
    mongoose.connect(dbMongooseUri);

    const user: IUser | null = await Users.findOne({ telegramId: id });

    if (!user) {
      bot.sendMessage(id, lib.userNotExists());
      return;
    }

    const photo: AxiosResponse<IUnsplashResponse> = await getPhoto(query);

    photo &&
      bot.sendPhoto(id, photo.data.urls.regular, {
        caption,
      });
  } catch (err: unknown) {
    handleError(JSON.stringify(err));
  }
};

export default sendPhotoFromStock;
