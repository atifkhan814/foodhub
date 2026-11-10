
import session from "express-session";
import process from "node:process";


const sessionMiddleware = session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,

    cookie: {
        httpOnly: true,
        maxAge: 24 * 60 * 60 * 1000
    }
});

export default sessionMiddleware;
