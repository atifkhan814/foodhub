
import session from "express-session";
import MongoStore from "connect-mongo";
import process from "node:process";
import { DB_NAME } from "../constants.js";

const sessionMiddleware = session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,

    store: MongoStore.create({
        mongoUrl: `${process.env.MONGODB_URI}/${DB_NAME}`,
        collectionName: "sessions",
        ttl: 24 * 60 * 60
    }),

    cookie: {
        httpOnly: true,
        maxAge: 24 * 60 * 60 * 1000
    }
});

export default sessionMiddleware;
