import { LogTypes } from '../types/types.js';

const logHandler = (type: LogTypes, text: string) => {
  console.log(`[${type}] ${text}`);
};

export default logHandler;
