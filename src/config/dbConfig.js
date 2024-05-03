const mongoose = require("mongoose");
mongoose.set("strictQuery", true);

async function connectToDatabase() {
  try {
    if (process.env.ATLAS_URI) {
      await mongoose.connect(process.env.ATLAS_URI, {
        dbName: "chatApp",
      });
    } else {
      throw Error();
    }

    console.log("Database connection successful");
  } catch (error) {
    console.error("Database connection failed:", error);
  }
}

connectToDatabase();
