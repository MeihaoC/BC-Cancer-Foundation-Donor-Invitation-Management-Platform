const express = require('express');
const db = require('../db');
const { authenticateToken, comparePassword, generateToken } = require('../middleware/auth'); 

const router = express.Router();

/**
 * User Login
 */
router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        // Get user by email
        const [userRows] = await db.execute('SELECT * FROM User WHERE email = ?', [email]);
        if (userRows.length === 0) {
            return res.status(400).json({ message: 'User not found' });
        }

        const user = userRows[0];

        // Compare password
        const isMatch = await comparePassword(password, user.password);
        if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

        // Generate JWT token
        const token = generateToken(user);

        res.status(200).json({ message: 'Login successful', token });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

/**
 * Get All Users
 */
router.get('/users', authenticateToken, async (req, res) => {
    try {
        const [rows] = await db.execute('SELECT id, name, email FROM User');
        res.status(200).json(rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

/**
 * Get User By ID
 */
router.get('/users/:id', authenticateToken, async (req, res) => {
    const userId = req.params.id;

    try {
        const [rows] = await db.execute('SELECT id, name, email FROM User WHERE id = ?', [userId]);
        if (rows.length === 0) return res.status(404).json({ message: 'User not found' });
        res.status(200).json(rows[0]);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

/**
 * Update User
 */
router.put('/users/:id', authenticateToken, async (req, res) => {
    const userId = req.params.id;
    const { name, email, password } = req.body;

    try {
        const hashedPassword = await hashPassword(password);

        const [result] = await db.execute(
            'UPDATE User SET name = ?, email = ?, password = ? WHERE id = ?',
            [name, email, hashedPassword, userId]
        );

        if (result.affectedRows === 0) return res.status(404).json({ message: 'User not found' });

        res.status(200).json({ message: 'User updated successfully' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

/**
 * Delete User
 */
router.delete('/users/:id', authenticateToken, async (req, res) => {
    const userId = req.params.id;

    try {
        const [result] = await db.execute('DELETE FROM User WHERE id = ?', [userId]);

        if (result.affectedRows === 0) return res.status(404).json({ message: 'User not found' });

        res.status(200).json({ message: 'User deleted successfully' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
