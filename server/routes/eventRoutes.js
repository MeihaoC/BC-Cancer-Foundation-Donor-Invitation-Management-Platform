const express = require('express');
const router = express.Router();
const eventController = require('../controllers/eventController');
const { authenticateToken } = require('../middleware/auth');

// Apply authentication middleware to all event routes
router.use(authenticateToken);

// Static routes (no parameters) - must come BEFORE parameterized routes
router.get('/events', eventController.getEvents); 
router.get('/events/search', eventController.searchEvents);
router.get('/events/medical-focuses', eventController.getMedicalFocusNames);
router.get('/events/users', eventController.getUserNames);
router.get('/events/cities', eventController.getEventCities);

// Parameterized routes (with :eventId) - must come AFTER static routes
router.post('/events', eventController.createEvent);
router.get('/events/:eventId/suggest-donors', eventController.suggestDonors);
router.post('/events/:eventId/donors/add', eventController.addDonorTemp);
router.post('/events/:eventId/donors/remove', eventController.removeDonorTemp); 
router.post('/events/:eventId/donors/save', eventController.saveDonorList); 
router.post('/events/:eventId/donors/cancel', eventController.cancelDonorEdits);
router.get('/events/:eventId/donors/search', eventController.searchDonorByName);
router.get('/events/:eventId/donors/export', eventController.exportDonorsCSV); 
router.get('/events/:eventId/details', eventController.getEventDetails);
router.get('/events/:eventId/donors', eventController.getDonorListForEvent);
router.delete('/events/:eventId', eventController.deleteEvent);
router.put('/events/:eventId', eventController.updateEvent);

module.exports = router;
