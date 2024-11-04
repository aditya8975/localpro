const jwt = require('jsonwebtoken');
const dotenv=require('dotenv');
dotenv.config();
const authenticateToken = (req, res, next) => {
    const token = req.headers['authorization']?.split(' ')[1]; // Get token from the Authorization header
    if (!token) return res.sendStatus(401); // Unauthorized

    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) return res.sendStatus(403); // Forbidden
        req.user = user; // Attach user to the request
        next(); // Proceed to the next middleware/route handler
    });
};

module.exports = authenticateToken;
