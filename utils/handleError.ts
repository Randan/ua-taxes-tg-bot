import { notifyAdmin } from './';

const handleError = (message: string): void => {
  console.log(message);
  notifyAdmin(message);
};

export default handleError;
