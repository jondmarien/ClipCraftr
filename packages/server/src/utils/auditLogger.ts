import '../../../shared/src/utils/loadEnv';
import { createLogger, transports, format } from 'winston';
// @ts-ignore
import 'winston-mongodb';

const { combine, timestamp, json } = format;

console.log('[auditLogger] MONGODB_URI:', process.env.MONGODB_URI);
const auditLogger = createLogger({
  level: 'info',
  format: combine(timestamp(), json()),
  transports: [
    new transports.Console(),
    // Uncomment below after installing winston-mongodb:
    new transports.MongoDB({
      db: process.env.MONGODB_URI || '',
      options: {},
      collection: 'logs',
      tryReconnect: true,
      metaKey: 'details',
    }),
  ],
});

export default auditLogger;

// To use MongoDB logging, install winston-mongodb:
// pnpm add winston-mongodb
