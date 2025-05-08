import mongoose from 'mongoose';

const MONGODB_URI = process.env.DATABASE_URL ?? '';

if (!MONGODB_URI) throw new Error('DATABASE_URL missing');

declare global {
    var mongooseConn: typeof mongoose | undefined;
}

export async function dbConnect() {
    if (!global.mongooseConn) {
        global.mongooseConn = await mongoose.connect(MONGODB_URI);
    }
    return global.mongooseConn;
}
