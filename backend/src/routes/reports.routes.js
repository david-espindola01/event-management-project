const { Router } = require('express');
const { getInterestReport } = require('../controllers/reports.controller');

const router = Router();

router.get('/interests', getInterestReport);

module.exports = router;