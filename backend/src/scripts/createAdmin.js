
import "dotenv/config";
import mongoose from "mongoose";
import bcrypt from "bcrypt";
import process from "node:process";

import connectDB from "../db/index.js";
import User from "../models/User.models.js";

const createAdmin = async () => {
  try {
    const { ADMIN_NAME, ADMIN_EMAIL, ADMIN_PASSWORD } = process.env;

    if (!ADMIN_NAME || !ADMIN_EMAIL || !ADMIN_PASSWORD) {
      throw new Error("Please provide admin details in the .env file.");
    }

    await connectDB();

    const existingAdmin = await User.findOne({
      email: ADMIN_EMAIL.toLowerCase().trim()
    });

    if (existingAdmin) {
      if (existingAdmin.role === "admin") {
        console.log("Admin account already exists.");
        return;
      }

      throw new Error(
        "This email already belongs to a normal user. Choose a separate admin email."
      );
    }

    const hashedPassword = await bcrypt.hash(ADMIN_PASSWORD, 10);

    await User.create({
      name: ADMIN_NAME,
      email: ADMIN_EMAIL.toLowerCase().trim(),
      password: hashedPassword,
      role: "admin"
    });

    console.log("Admin account created successfully!");

  } catch (error) {
    console.error("Admin creation failed:", error.message);
    process.exitCode = 1;

  } finally {
    await mongoose.disconnect();
  }
};

createAdmin();
