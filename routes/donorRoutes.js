const express = require('express');
const db = require('../db'); 
const router = express.Router();

/**
 * Get All Donors for a Specific Event
 */
router.get('/event-donor/:eventId', async (req, res) => {
    const eventId = req.params.eventId;

    try {
        const [rows] = await db.execute(
            'SELECT d.* FROM Donor d JOIN Event_Donor ed ON d.id = ed.donor_id WHERE ed.event_id = ?',
            [eventId]
        );

        res.status(200).json(rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});


/**
 * Create a New Donor
 */
router.post('/donors', async (req, res) => {
    const { first_name, last_name, organization_name, pmm_id, smm_id, vmm_id, excluded, deceased, total_donation, city, subscription_events_in_person, engagement } = req.body;

    try {
        const result = await db.execute(
            'INSERT INTO Donor (first_name, last_name, organization_name, pmm_id, smm_id, vmm_id, excluded, deceased, total_donation, city, subscription_events_in_person, engagement) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
            [first_name, last_name, organization_name, pmm_id, smm_id, vmm_id, excluded, deceased, total_donation, city, subscription_events_in_person, engagement]
        );

        res.status(201).json({ message: 'Donor created successfully', donorId: result[0].insertId });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

/**
 * Get All Donors
 */
router.get('/donors', async (req, res) => {
    try {
        const [rows] = await db.execute('SELECT * FROM Donor');
        res.status(200).json(rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

/**
 * Get a Single Donor by ID
 */
router.get('/donors/:id', async (req, res) => {
    const donorId = req.params.id;

    try {
        const [rows] = await db.execute('SELECT * FROM Donor WHERE id = ?', [donorId]);

        if (rows.length === 0) return res.status(404).json({ message: 'Donor not found' });

        res.status(200).json(rows[0]);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

/**
 * Update a Donor
 */
router.put('/donors/:id', async (req, res) => {
    const donorId = req.params.id;
    const { first_name, last_name, organization_name, pmm_id, smm_id, vmm_id, excluded, deceased, total_donation, city, subscription_events_in_person, engagement } = req.body;

    try {
        const [result] = await db.execute(
            'UPDATE Donor SET first_name = ?, last_name = ?, organization_name = ?, pmm_id = ?, smm_id = ?, vmm_id = ?, excluded = ?, deceased = ?, total_donation = ?, city = ?, subscription_events_in_person = ?, engagement = ? WHERE id = ?',
            [first_name, last_name, organization_name, pmm_id, smm_id, vmm_id, excluded, deceased, total_donation, city, subscription_events_in_person, engagement, donorId]
        );

        if (result.affectedRows === 0) return res.status(404).json({ message: 'Donor not found' });

        res.status(200).json({ message: 'Donor updated successfully' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

/**
 * Delete a Donor
 */
router.delete('/donors/:id', async (req, res) => {
    const donorId = req.params.id;

    try {
        const [result] = await db.execute('DELETE FROM Donor WHERE id = ?', [donorId]);

        if (result.affectedRows === 0) return res.status(404).json({ message: 'Donor not found' });

        res.status(200).json({ message: 'Donor deleted successfully' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

/**
 * Search donors by name
 */
router.get('/donors/search', async (req, res) => {
    const { name } = req.query;

    if (!name) {
        return res.status(400).json({ message: 'Please provide a name to search.' });
    }

    try {
        const searchTerm = `%${name}%`;
        const [rows] = await db.execute(
            `SELECT * FROM Donor 
             WHERE first_name LIKE ? 
             OR last_name LIKE ?`,
            [searchTerm, searchTerm]
        );
        res.status(200).json(rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});