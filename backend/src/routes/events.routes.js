const { Router } = require('express');
const {
  getEvents, getEventById, getEventsAdmin,
  createEvent, updateEvent, deleteEvent, restoreEvent,
  registerInterest, removeInterest, getInterestStatus,
} = require('../controllers/events.controller');

const router = Router();

// Public
router.get('/',                         getEvents);
router.get('/admin/all',                getEventsAdmin);      // before /:id to avoid conflict
router.get('/:id',                      getEventById);
router.get('/:id/interest/status',      getInterestStatus);
router.post('/:id/interest',            registerInterest);
router.delete('/:id/interest',          removeInterest);

// Admin
router.post('/admin',                   createEvent);
router.put('/admin/:id',                updateEvent);
router.delete('/admin/:id',             deleteEvent);
router.patch('/admin/:id/restore',      restoreEvent);

module.exports = router;