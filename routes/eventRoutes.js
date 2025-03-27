const express = require('express');
const router = express.Router();
const eventController = require('../controllers/eventController');

router.post('/login', eventController.login);
router.get('/events', eventController.getEvents);
router.get('/events/search', eventController.searchEvents);
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
router.get('/events/medical-focuses', eventController.getMedicalFocusNames);
router.get('/events/users', eventController.getUserNames);
router.get('/events/cities', eventController.getEventCities);
router.delete('/events/:eventId', eventController.deleteEvent);

module.exports = router;
