import mongoose from "mongoose";

// Add TypeScript interfaces for better type safety
interface DatabaseConnections {
  admin: mongoose.Connection;
  store: mongoose.Connection;
}

// Cache connections in global scope to survive Next.js hot reloads
const globalWithMongoose = global as typeof globalThis & {
  mongoConnections?: DatabaseConnections;
};

// Initialize connections exactly as you have them
const adminConnection = mongoose.createConnection(process.env.MONGODB_URI!, {
  dbName: "Borcelle_Admin"
});

const storeConnection = mongoose.createConnection(process.env.MONGODB_URI!, {
  dbName: "Borcelle_Store"
});

// Preserve your existing functions exactly
export const getDBConnection = (dbType: 'admin' | 'store' = 'admin') => {
  return dbType === 'admin' ? adminConnection : storeConnection;
};

// Enhanced connectToDB() with cache management
export const connectToDB = async () => {
  try {
    // Store connections in global cache
    globalWithMongoose.mongoConnections = {
      admin: adminConnection,
      store: storeConnection
    };

    await Promise.all([
      adminConnection.asPromise(),
      storeConnection.asPromise()
    ]);
    
    console.log(`Connected to both databases:
      - Admin: ${adminConnection.db?.databaseName || "undefined"}
      - Store: ${storeConnection.db?.databaseName ?? "undefined"}`);
      
    return { adminConnection, storeConnection };
  } catch (err) {
    console.error("Database connection error:", err);
    throw err;
  }
};

// New optional helper for connection health checks
export const checkConnectionHealth = () => ({
  admin: adminConnection.readyState === 1,
  store: storeConnection.readyState === 1
});
