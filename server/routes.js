const express = require('express');
const router = express.Router();
const db = require('./db');

// Submit Request: POST /api/requests
router.post('/requests', async (req, res) => {
  try {
    const { user_id, start_date, end_date, reason } = req.body;
    
    // Input validation
    if (!user_id || !start_date || !end_date) {
      return res.status(400).json({ error: 'user_id, start_date, and end_date are required' });
    }
    
    if (new Date(end_date) < new Date(start_date)) {
      return res.status(400).json({ error: 'End date must be after start date' });
    }
    
    const result = await db.query(
      'INSERT INTO vacation_requests (user_id, start_date, end_date, reason) VALUES ($1, $2, $3, $4) RETURNING *',
      [user_id, start_date, end_date, reason]
    );
    
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Error creating request:', error);
    res.status(500).json({ error: 'Failed to create request' });
  }
});

// Get All Requests (Validator): GET /api/requests
router.get('/requests', async (req, res) => {
  try {
    const { status } = req.query;
    
    let query = `
      SELECT vr.id, vr.user_id, u.name as user_name, vr.start_date, vr.end_date, vr.reason, vr.status, vr.comments, vr.created_at 
      FROM vacation_requests vr 
      JOIN users u ON vr.user_id = u.id
    `;
    let params = [];
    
    if (status) {
      query += ' WHERE vr.status = $1';
      params.push(status);
    }
    
    query += ' ORDER BY vr.created_at DESC';
    
    const result = await db.query(query, params);
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching requests:', error);
    res.status(500).json({ error: 'Failed to fetch requests' });
  }
});

// Get User's Requests (Requester): GET /api/requests/user/:userId
router.get('/requests/user/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    
    const result = await db.query(
      'SELECT vr.id, vr.user_id, u.name as user_name, vr.start_date, vr.end_date, vr.reason, vr.status, vr.comments, vr.created_at FROM vacation_requests vr JOIN users u ON vr.user_id = u.id WHERE vr.user_id = $1 ORDER BY vr.created_at DESC',
      [userId]
    );
    
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching user requests:', error);
    res.status(500).json({ error: 'Failed to fetch user requests' });
  }
});

// Update Request Status (Validator): PUT /api/requests/:id/status
router.put('/requests/:id/status', async (req, res) => {
  try {
    const { id } = req.params;
    const { status, comments } = req.body;
    
    if (!status || !['Approved', 'Rejected', 'Pending'].includes(status)) {
      return res.status(400).json({ error: 'Valid status is required' });
    }
    
    const result = await db.query(
      'UPDATE vacation_requests SET status = $1, comments = $2 WHERE id = $3 RETURNING *',
      [status, comments || null, id]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Request not found' });
    }
    
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error updating request status:', error);
    res.status(500).json({ error: 'Failed to update request status' });
  }
});

// Get all users: GET /api/users
router.get('/users', async (req, res) => {
  try {
    const result = await db.query('SELECT * FROM users ORDER BY name');
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ error: 'Failed to fetch users' });
  }
});

module.exports = router; 