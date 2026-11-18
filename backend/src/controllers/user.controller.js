
import User from "../models/User.models.js";
import bcrypt from "bcrypt";

// ==========================================
// SESSION HELPERS
// ==========================================

// Regenerate session securely while preserving the other account.
const regenerateSession = (req, preservedData = {}) => {
    return new Promise((resolve, reject) => {
        req.session.regenerate((error) => {
            if (error) {
                return reject(error);
            }

            Object.assign(req.session, preservedData);

            req.session.save((saveError) => {
                if (saveError) {
                    return reject(saveError);
                }

                resolve();
            });
        });
    });
};

// Save session changes.
const saveSession = (req) => {
    return new Promise((resolve, reject) => {
        req.session.save((error) => {
            if (error) {
                return reject(error);
            }

            resolve();
        });
    });
};

// ==========================================
// USER REGISTRATION
// ==========================================

const UserRegister = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        if (!name || !email || !password) {
            return res.status(400).json({
                message: "Please fill all the fields"
            });
        }

        const normalizedEmail = email.toLowerCase().trim();

        const existingUser = await User.findOne({
            email: normalizedEmail
        });

        if (existingUser) {
            return res.status(409).json({
                message: "User already exists"
            });
        }

        const hashPassword = await bcrypt.hash(password, 10);

        const newUser = await User.create({
            name,
            email: normalizedEmail,
            password: hashPassword
        });

        return res.status(201).json({
            message: "User created successfully",
            user: {
                _id: newUser._id,
                name: newUser.name,
                email: newUser.email,
                role: newUser.role
            }
        });

    } catch (error) {
        console.error("User registration error:", error);

        return res.status(500).json({
            message: "Internal server error"
        });
    }
};

// ==========================================
// CUSTOMER LOGIN
// ==========================================

const UserLogin = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                message: "Please fill all the fields"
            });
        }

        const existingUser = await User.findOne({
            email: email.toLowerCase().trim()
        });

        if (!existingUser || existingUser.role !== "user") {
            return res.status(401).json({
                message: "Invalid email or password"
            });
        }

        const passwordCompared = await bcrypt.compare(
            password,
            existingUser.password
        );

        if (!passwordCompared) {
            return res.status(401).json({
                message: "Invalid email or password"
            });
        }

        // Preserve the admin identity before regenerating the session.
        const preservedData = {};

        if (req.session.adminUserId) {
            preservedData.adminUserId = req.session.adminUserId;
        }

        await regenerateSession(req, {
            ...preservedData,
            customerUserId: existingUser._id
        });

        return res.status(200).json({
            success: true,
            message: "Customer login successful"
        });

    } catch (error) {
        console.error("Customer login error:", error);

        return res.status(500).json({
            success: false,
            message: "Could not complete customer login"
        });
    }
};

// ==========================================
// ADMIN LOGIN
// ==========================================

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

        // Preserve the customer identity before regenerating the session.
        const preservedData = {};

        if (req.session.customerUserId) {
            preservedData.customerUserId = req.session.customerUserId;
        }

        await regenerateSession(req, {
            ...preservedData,
            adminUserId: admin._id
        });

        return res.status(200).json({
            success: true,
            message: "Admin login successful."
        });

    } catch (error) {
        console.error("Admin login error:", error);

        return res.status(500).json({
            success: false,
            message: "Could not complete admin login."
        });
    }
};

// ==========================================
// CUSTOMER: GET LOGGED-IN USER
// ==========================================

const UserMe = async (req, res) => {
    try {
        const customerId = req.session.customerUserId;

        if (!customerId) {
            return res.status(401).json({
                success: false,
                message: "Customer is not logged in"
            });
        }

        const user = await User.findOne({
            _id: customerId,
            role: "user"
        }).select("-password");

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "Customer not found"
            });
        }

        return res.status(200).json({
            success: true,
            message: "Customer is logged in",
            user
        });

    } catch (error) {
        console.error("Customer authentication error:", error);

        return res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
};

// ==========================================
// ADMIN: GET LOGGED-IN ADMIN
// ==========================================

const AdminMe = async (req, res) => {
    try {
        const adminId = req.session.adminUserId;

        if (!adminId) {
            return res.status(401).json({
                success: false,
                message: "Admin is not logged in"
            });
        }

        const admin = await User.findOne({
            _id: adminId,
            role: "admin"
        }).select("-password");

        if (!admin) {
            return res.status(404).json({
                success: false,
                message: "Admin not found"
            });
        }

        return res.status(200).json({
            success: true,
            message: "Admin is logged in",
            user: admin
        });

    } catch (error) {
        console.error("Admin authentication error:", error);

        return res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
};

// ==========================================
// CUSTOMER LOGOUT
// ==========================================

const UserLogout = async (req, res) => {
    try {
        if (req.session.customerUserId) {
            delete req.session.customerUserId;
        }

        // Keep the admin identity intact.
        await saveSession(req);

        return res.status(200).json({
            success: true,
            message: "Customer logout successful"
        });

    } catch (error) {
        console.error("Customer logout error:", error);

        return res.status(500).json({
            success: false,
            message: "Could not logout customer"
        });
    }
};

// ==========================================
// ADMIN LOGOUT
// ==========================================

const AdminLogout = async (req, res) => {
    try {
        if (req.session.adminUserId) {
            delete req.session.adminUserId;
        }

        // Keep the customer identity intact.
        await saveSession(req);

        return res.status(200).json({
            success: true,
            message: "Admin logout successful"
        });

    } catch (error) {
        console.error("Admin logout error:", error);

        return res.status(500).json({
            success: false,
            message: "Could not logout admin"
        });
    }
};

// ==========================================
// EXPORTS
// ==========================================

export {
    UserRegister,
    UserLogin,
    UserMe,
    UserLogout,
    AdminLogin,
    AdminMe,
    AdminLogout
};
