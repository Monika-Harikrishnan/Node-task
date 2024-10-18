const jwt = require('jsonwebtoken');
const InvalidatedToken = require('../models/invalidatedToken.model.js');
const secretKey = process.env.JWT_SECRET || 'moni_secret_key'; 

const verifyToken = async (req, res, next) => {
    const token = req.headers.authorization && req.headers.authorization.split(' ')[1];

    if (!token) {
        return res.status(401).json({
            message: "Authorization token required",
            data: []
        });
    }
    const invalidatedToken = await InvalidatedToken.findOne({ token });
    if (invalidatedToken) {
        return res.status(401).json({ message: "Token has been invalidated or expired", data: [] });
    }
    jwt.verify(token, secretKey, (err, decoded) => {
        if (err) {
            return res.status(401).json({
                message: "Invalid or expired token",
                data: []
            });
        }
        req.user = decoded;  
        next(); 
    });
};

module.exports = verifyToken;
    
