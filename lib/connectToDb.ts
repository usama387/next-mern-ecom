import mongoose from "mongoose";

// variable with type safety
let isConnected: boolean = false;

export const connectToDb = async (): Promise<void> => {
  mongoose.set("strictQuery", true);

  if (isConnected) {
    console.log("Mongodb is already connected");
    return;
  }

  try {
    await mongoose.connect(process.env.MONGODB_URL || "", {
      dbName: "CartConnect_Admin",
    });
    isConnected = true;
    console.log("Mongodb is connected");
  } catch (error) {
    console.log();
  }
};
