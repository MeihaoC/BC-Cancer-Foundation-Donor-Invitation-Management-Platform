const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
require('dotenv').config();

// Load JWT secret from environment variables
const JWT_SECRET = process.env.JWT_SECRET || 'secret';

/**
 * Middleware to authenticate and verify JWT token
 */
const authenticateToken = (req, res, next) => {
    const token = req.header('Authorization')?.split(' ')[1]; // Extract token from header
    if (!token) return res.status(403).json({ message: 'Access Denied' });

    jwt.verify(token, JWT_SECRET, (err, user) => {
        if (err) return res.status(403).json({ message: 'Invalid Token' });
        req.user = user; // Attach user payload to request object
        next();
    });
};

/**
 * Function to hash passwords before storing in DB
 */
const hashPassword = async (password) => {
    const salt = await bcrypt.genSalt(10);
    return await bcrypt.hash(password, salt);
};

/**
 * Function to compare entered password with stored hashed password
 */
const comparePassword = async (enteredPassword, storedPassword) => {
    return await bcrypt.compare(enteredPassword, storedPassword);
};

/**
 * Function to generate JWT token for authentication
 */
const generateToken = (user) => {
    return jwt.sign(
        { id: user.id, name: user.name, email: user.email },
        JWT_SECRET,
    );
};

module.exports = {
    authenticateToken,
    hashPassword,
    comparePassword,
    generateToken
};
