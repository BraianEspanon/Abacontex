import dotenv from 'dotenv';
import path from 'path';

dotenv.config({
  path: path.resolve(__dirname, '../.env'),
});

console.log('CONFIG DATABASE_URL =', process.env.DATABASE_URL);

export default {
  schema: 'prisma/schema.prisma',
  migrations: {
    path: 'prisma/migrations',
    seed: 'node ./node_modules/ts-node/dist/bin.js prisma/seed.ts',
  },
  datasource: {
    url: process.env.DATABASE_URL,
  },
};
