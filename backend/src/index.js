
import "dotenv/config";
import process from "node:process";
import connectDB from "./db/index.js";
import app from "./app.js";

const PORT = process.env.PORT || 8000;

try {
  await connectDB();

  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });

} catch (error) {
  console.error("Application startup failed:", error.message);
  process.exit(1);
}
