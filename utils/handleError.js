import { notifyAdmin } from './index.js';

const handleError = (message) => {
  console.log(message);
  notifyAdmin(message);
};

export default handleError;
