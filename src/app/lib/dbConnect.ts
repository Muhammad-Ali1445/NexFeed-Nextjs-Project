import mongoose from "mongoose";

type connectionObject = {
  isConnected?: number;
};

const connection: connectionObject = {};

async function dbConnect() {
  if (connection.isConnected) {
    console.log("Db already Connected");
    return;
  }
  try {
    const db = await mongoose.connect(process.env.MONGODB || "");
    // console.log("Log Db", db);

    connection.isConnected = db.connections[0].readyState;
    // console.log("Log connections", db.connections);
    console.log("DB connected SuccessFullly");
  } catch (error) {
    console.log("Db connection Failed", error);
    process.exit(1);
  }
}

export default dbConnect;
