import { LogTypes } from '../types/types.js';

const logHandler = (type: LogTypes, text: string): void => {
  console.log(`[${type}] ${text}`);
};

export default logHandler;
