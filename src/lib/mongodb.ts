import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI;

export const isDbConfigured = !!MONGODB_URI;

let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

async function dbConnect() {
  if (!isDbConfigured) {
    return null;
  }

  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
    };

    cached.promise = mongoose.connect(MONGODB_URI!, opts).then((mongoose) => {
      return mongoose;
    });
  }

  try {
    cached.conn = await cached.promise;
  } catch (e) {
    // If the connection fails, we reset the promise cache so that a new
    // connection attempt can be made on the next request.
    cached.promise = null;
    throw e;
  }
  
  return cached.conn;
}

export default dbConnect;
