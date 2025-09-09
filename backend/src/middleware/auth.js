import jwt from "jsonwebtoken"


export const authMiddleware = (req, res, next) => {
    const authHeader = req.headers?.authorization;
    const token = authHeader?.startsWith("Bearer ") ? authHeader.split(" ")[1] : undefined;

    req.user = null;
    if (token) {
        try {
            const payload = jwt.verify(token, process.env.JWT_SECRET);
            req.user = payload;
        } catch (error) {
            req.user = null;
        }
    }
    if (next) {
        next();
    }
}