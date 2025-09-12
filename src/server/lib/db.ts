import mongoose from 'mongoose';

declare global {
  // eslint-disable-next-line no-unused-vars
  var _mongoose: { conn?: typeof mongoose; promise?: Promise<typeof mongoose> };
}

const globalAny: any = global;

export async function connectDb() {
  const MONGO_URI = process.env.MONGO_URI;

  if (!MONGO_URI) {
    throw new Error('MONGO_URI not set');
  }

  if (globalAny._mongoose?.conn) return globalAny._mongoose.conn;
  if (!globalAny._mongoose) globalAny._mongoose = {};

  if (!globalAny._mongoose.promise) {
    globalAny._mongoose.promise = mongoose.connect(MONGO_URI).then((m) => m);
  }
  globalAny._mongoose.conn = await globalAny._mongoose.promise;
  return globalAny._mongoose.conn;
}
