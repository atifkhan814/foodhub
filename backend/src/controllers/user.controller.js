import User from "../models/User.models.js";
import bcrypt from "bcrypt";

const UserRegister = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        if (!name || !email || !password) {
            return res.status(400).json({ message: "Please fill all the fields" });
        }

        const exitingUser = await User.findOne({ email: email });

        if (exitingUser) {
            return res.status(409).json({ message: "User already exists" });
        }

        const hashPassword = await bcrypt.hash(password, 10);

        const newUser = await User.create({
            name,
            email,
            password: hashPassword
        });

        return res.status(201).json({
            message: "User created successfully",
            user: newUser
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Internal server error" });
    }
};


const UserLogin = async (req, res) => {

    try {

        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ message: "Please fill all the fields" });
        }

        const existingUser = await User.findOne({ email: email });

        if (!existingUser) {
            return res.status(404).json({ message: "User not found" });
        }

        const passwordCompared = await bcrypt.compare(password, existingUser.password);

        if (!passwordCompared) {
            return res.status(401).json({ message: "password not matched try Again" });
        }

        req.session.userId = existingUser._id;

        return res.status(200).json({
            message: "Login successful"
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Internal server error" });
    }

};


// NEW FUNCTION ADDED
const UserMe = async (req, res) => {

    try {

        if (!req.session.userId) {
            return res.status(401).json({
                message: "Not logged in"
            });
        }

        const user = await User.findById(req.session.userId).select("-password");

        if (!user) {
            return res.status(404).json({
                message: "User not found"
            });
        }

        return res.status(200).json({
            message: "User is logged in",
            user
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({
            message: "Internal server error"
        });
    }

};
const UserLogout = async (req , res)=>{
    try {
        req.session.destroy((error) => {
            if (error) {
                console.error(error);
                return res.status(500).json({
                    message: "Internal server error"
                });
            }

            res.clearCookie("connect.sid");
            return res.status(200).json({
                message: "Logout successful"
            });
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            message: "Internal server error"
        });
    }
};

const AdminLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Please provide email and password."
      });
    }

    const admin = await User.findOne({
      email: email.toLowerCase().trim()
    });

    if (!admin || admin.role !== "admin") {
      return res.status(401).json({
        success: false,
        message: "Invalid admin credentials."
      });
    }

    const passwordMatched = await bcrypt.compare(
      password,
      admin.password
    );

    if (!passwordMatched) {
      return res.status(401).json({
        success: false,
        message: "Invalid admin credentials."
      });
    }

    req.session.userId = admin._id;

    return res.status(200).json({
      success: true,
      message: "Admin login successful."
    });

  } catch (error) {
    console.error("Admin login error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal server error."
    });
  }
};

export { UserRegister, UserLogin, UserMe, UserLogout, AdminLogin };