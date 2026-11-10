
import express from "express";
import cors from "cors";
import foodRoutes from "./routes/food.routes.js";
import orderRoutes from "./routes/order.routes.js";
import userRoutes from "./routes/user.routes.js";

import sessionMiddleware from "./middlewares/session.middleware.js";

const app = express();

// Allow requests from our frontend
app.use(cors({
    origin: "http://localhost:5173",
    credentials: true
}));

// Parse incoming JSON data
app.use(express.json());

// Parse form data
app.use(express.urlencoded({ extended: true }));


app.use(sessionMiddleware);

app.use("/api/foods", foodRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/users", userRoutes);






// Test route
app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Restaurant backend is running!",
  });
});

export default app;
