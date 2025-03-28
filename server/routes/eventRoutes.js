const express = require('express');
const router = express.Router();
const eventController = require('../controllers/eventController');

router.post('/login', eventController.login); // Done
router.get('/events', eventController.getEvents); // Done
router.get('/events/search', eventController.searchEvents); // Done
router.post('/events', eventController.createEvent); // Done
router.get('/events/:eventId/suggest-donors', eventController.suggestDonors); // Done
router.post('/events/:eventId/donors/add', eventController.addDonorTemp); // Done
router.post('/events/:eventId/donors/remove', eventController.removeDonorTemp); // Done
router.post('/events/:eventId/donors/save', eventController.saveDonorList); // Done
router.post('/events/:eventId/donors/cancel', eventController.cancelDonorEdits); // Done
router.get('/events/:eventId/donors/search', eventController.searchDonorByName); // Done
router.get('/events/:eventId/donors/export', eventController.exportDonorsCSV); // Done
router.get('/events/:eventId/details', eventController.getEventDetails); // Done
router.get('/events/:eventId/donors', eventController.getDonorListForEvent); // Done
router.get('/events/medical-focuses', eventController.getMedicalFocusNames);
router.get('/events/users', eventController.getUserNames); // Done
router.get('/events/cities', eventController.getEventCities); // Done
router.delete('/events/:eventId', eventController.deleteEvent); // Done

module.exports = router;
