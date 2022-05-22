import bot from '../bot';
import { adminId } from './';

const notifyAdmin = (message: string): void => {
  adminId && bot.sendMessage(adminId, message);
};

export default notifyAdmin;
