const express = require('express');
const db = require('../db');
const router = express.Router();
const fs = require('fs');
const { Parser } = require('json2csv');

/**
 * Create a new event
 */
router.post('/events', async (req, res) => {
    const { name, date, location, city, medical_focus_id, capacity, coordinator_id, fundraiser_id, detailed_info, status } = req.body;
    try {
        const result = await db.execute(
            'INSERT INTO Event (name, date, location, city, medical_focus_id, capacity, coordinator_id, fundraiser_id, detailed_info, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
            [name, date, location, city, medical_focus_id, capacity, coordinator_id, fundraiser_id, detailed_info, status]
        );
        res.status(201).json({ message: 'Event created', eventId: result[0].insertId });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

/**
 * Get all events (with optional filters)
 */
router.get('/events', async (req, res) => {
    const { name, city, fundraiser_id, coordinator_id, medical_focus_id, status } = req.query;
    let query = 'SELECT * FROM Event WHERE 1=1';
    let params = [];

    if (name) { query += ' AND name LIKE ?'; params.push(`%${name}%`); }
    if (city) { query += ' AND city = ?'; params.push(city); }
    if (fundraiser_id) { query += ' AND fundraiser_id = ?'; params.push(fundraiser_id); }
    if (coordinator_id) { query += ' AND coordinator_id = ?'; params.push(coordinator_id); }
    if (medical_focus_id) { query += ' AND medical_focus_id = ?'; params.push(medical_focus_id); }
    if (status) { query += ' AND status = ?'; params.push(status); }

    try {
        const [rows] = await db.execute(query, params);
        res.json(rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

/**
 * Get event by ID
 */
router.get('/events/:id', async (req, res) => {
    try {
        const [rows] = await db.execute('SELECT * FROM Event WHERE id = ?', [req.params.id]);
        if (rows.length === 0) return res.status(404).json({ message: 'Event not found' });
        res.json(rows[0]);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

/**
 * Update event
 */
router.put('/events/:id', async (req, res) => {
    const { name, date, location, city, medical_focus_id, capacity, coordinator_id, fundraiser_id, detailed_info, status } = req.body;
    try {
        await db.execute(
            'UPDATE Event SET name = ?, date = ?, location = ?, city = ?, medical_focus_id = ?, capacity = ?, coordinator_id = ?, fundraiser_id = ?, detailed_info = ?, status = ? WHERE id = ?',
            [name, date, location, city, medical_focus_id, capacity, coordinator_id, fundraiser_id, detailed_info, status, req.params.id]
        );
        res.json({ message: 'Event updated' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

/**
 * Delete event
 */
router.delete('/events/:id', async (req, res) => {
    try {
        await db.execute('DELETE FROM Event WHERE id = ?', [req.params.id]);
        res.json({ message: 'Event deleted' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

/**
 * Get coordinator name
 */
router.get('/events/:id/coordinator', async (req, res) => {
    try {
        const [rows] = await db.execute(
            'SELECT u.name FROM User u JOIN Event e ON u.id = e.coordinator_id WHERE e.id = ?',
            [req.params.id]
        );
        if (rows.length === 0) return res.status(404).json({ message: 'Coordinator not found' });
        res.json(rows[0]);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

/**
 * Change status based on donor count
 */
router.post('/events/:id/update-status', async (req, res) => {
    try {
        const [eventRows] = await db.execute('SELECT capacity FROM Event WHERE id = ?', [req.params.id]);
        const [donorRows] = await db.execute('SELECT COUNT(*) as count FROM Event_Donor WHERE event_id = ?', [req.params.id]);

        if (eventRows.length === 0) return res.status(404).json({ message: 'Event not found' });

        const capacity = eventRows[0].capacity;
        const donorCount = donorRows[0].count;

        let status = 'Not Started';
        if (donorCount >= capacity) status = 'Fully Invited';
        else if (donorCount > 0) status = 'In Process';

        await db.execute('UPDATE Event SET status = ? WHERE id = ?', [status, req.params.id]);
        res.json({ message: 'Status updated', status });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

/**
 * Generate donor list for an event (based on custom filters and prioritization)
 */
router.get('/events/:id/generate-donor-list', async (req, res) => {
    try {
        const [eventRows] = await db.execute('SELECT * FROM Event WHERE id = ?', [req.params.id]);
        if (eventRows.length === 0) return res.status(404).json({ message: 'Event not found' });
        const event = eventRows[0];

        const [donorRows] = await db.execute(`
            SELECT d.*, GROUP_CONCAT(dmf.medical_focus_id) AS medical_focuses
            FROM Donor d
            LEFT JOIN Donor_Medical_Focus dmf ON d.id = dmf.donor_id
            GROUP BY d.id
        `);

        let donorList = [];
        let originalData = [...donorRows];

        const focusMatch = (donor, eventFocus) => {
            return donor.medical_focuses && donor.medical_focuses.split(',').includes(eventFocus.toString());
        };

        const applyFilter = (filterFn) => {
            for (let i = 0; i < originalData.length; i++) {
                const donor = originalData[i];
                if (filterFn(donor)) {
                    donorList.push(donor);
                    originalData.splice(i, 1);
                    i--;
                    if (donorList.length >= event.capacity * 2) break;
                }
            }
        };

        applyFilter(d => d.city === event.city && d.engagement === 'Highly Engaged' && focusMatch(d, event.medical_focus_id));
        if (donorList.length < event.capacity * 2) applyFilter(d => d.city === event.city && d.engagement === 'Highly Engaged');
        if (donorList.length < event.capacity * 2) applyFilter(d => d.city === event.city && focusMatch(d, event.medical_focus_id));
        if (donorList.length < event.capacity * 2) applyFilter(d => d.engagement === 'Highly Engaged' && focusMatch(d, event.medical_focus_id));
        if (donorList.length < event.capacity * 2) applyFilter(d => d.city === event.city);
        if (donorList.length < event.capacity * 2) applyFilter(d => d.engagement === 'Highly Engaged');
        if (donorList.length < event.capacity * 2) applyFilter(d => focusMatch(d, event.medical_focus_id));

        while (donorList.length < event.capacity * 2 && originalData.length > 0) {
            const randomIndex = Math.floor(Math.random() * originalData.length);
            donorList.push(originalData[randomIndex]);
            originalData.splice(randomIndex, 1);
        }

        res.json({ final_list: donorList, original_data: originalData });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

/**
 * Add a donor to an event (move from original_data to final_list)
 */
router.post('/events/:id/add-donor', async (req, res) => {
    const { donor_id } = req.body;
    try {
        await db.execute('INSERT INTO Event_Donor (event_id, donor_id) VALUES (?, ?)', [req.params.id, donor_id]);
        res.json({ message: 'Donor added to event' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

/**
 * Remove a donor from an event (move back to original_data)
 */
router.post('/events/:id/remove-donor', async (req, res) => {
    const { donor_id } = req.body;
    try {
        await db.execute('DELETE FROM Event_Donor WHERE event_id = ? AND donor_id = ?', [req.params.id, donor_id]);
        res.json({ message: 'Donor removed from event' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

/**
 * Download donor list as CSV
 */
router.post('/events/:id/download-donors', async (req, res) => {
    const { donor_list } = req.body;
    try {
        const parser = new Parser();
        const csv = parser.parse(donor_list);
        const filePath = `./donor_list_event_${req.params.id}.csv`;
        fs.writeFileSync(filePath, csv);
        res.download(filePath);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;

/**
 * Save final donor list to Event_Donor table
 */
router.post('/events/:id/save-donor-list', async (req, res) => {
    const { final_list } = req.body; 
    const eventId = req.params.id;

    if (!Array.isArray(final_list)) {
        return res.status(400).json({ message: 'final_list must be an array of donor IDs' });
    }

    try {
        // Delete existing donors for this event
        await db.execute('DELETE FROM Event_Donor WHERE event_id = ?', [eventId]);

        // Insert all donors from final_list
        for (const donor of final_list) {
            await db.execute('INSERT INTO Event_Donor (event_id, donor_id) VALUES (?, ?)', [eventId, donor.id]);
        }

        res.json({ message: 'Final donor list saved successfully' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});