import mongoose from "mongoose";

// Import all models so Mongoose registers them and auto-creates collections
import "../models/User";
import "../models/Product";
import "../models/Category";
import "../models/Order";
import "../models/Cart";
import "../models/Wishlist";
import "../models/Review";
import "../models/Address";

const connectDB = async (): Promise<void> => {
  try {
    // autoCreate: true  → creates collections automatically if they don't exist
    // autoIndex: true   → builds indexes defined in schemas automatically
    const conn = await mongoose.connect(process.env.MONGO_URI as string, {
      autoCreate: true,
      autoIndex: true,
      serverSelectionTimeoutMS: 10000, // Timeout after 10s instead of 30s
      socketTimeoutMS: 45000,
    });

    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);

    // Ensure all registered model collections exist (no-op if already present)
    const modelNames = mongoose.modelNames();
    await Promise.all(
      modelNames.map(async (modelName) => {
        await mongoose.model(modelName).createCollection().catch(() => {
          // Collection already exists — ignore the error
        });
        console.log(`📦 Collection ready: ${mongoose.model(modelName).collection.name}`);
      })
    );

    console.log(`🗄️  Database "${conn.connection.name}" is ready`);
  } catch (error) {
    console.error(`❌ MongoDB Connection Error: ${(error as Error).message}`);
    process.exit(1);
  }
};

export default connectDB;
