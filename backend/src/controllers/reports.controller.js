const pool = require('../db/pool');

// GET /api/admin/reports/interests — interest ranking (RF-002.2)
const getInterestReport = async (req, res) => {
  try {
    const result = await pool.query(`SELECT * FROM v_interest_report`);
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: 'Failed to generate report' });
  }
};

module.exports = { getInterestReport };