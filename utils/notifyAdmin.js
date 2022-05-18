import bot from '../bot/index.js';
import { adminId } from '../utils/index.js';

const notifyAdmin = (message) => {
  adminId && bot.sendMessage(adminId, message);
};

export default notifyAdmin;
