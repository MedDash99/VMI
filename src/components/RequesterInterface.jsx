import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import apiService from '../utils/api';

const RequesterInterface = ({ userId: propUserId }) => {
  const { id } = useParams();
  const userId = propUserId || id || '1';
  
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [formData, setFormData] = useState({
    start_date: '',
    end_date: '',
    reason: ''
  });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchUserRequests();
  }, [userId]);

  const fetchUserRequests = async () => {
    try {
      setLoading(true);
      const data = await apiService.getUserRequests(userId);
      setRequests(data);
    } catch (err) {
      setError('Failed to fetch your requests');
      console.error('Error fetching requests:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');
    setSuccess('');

    try {
      // Validate dates
      const startDate = new Date(formData.start_date);
      const endDate = new Date(formData.end_date);
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      if (startDate < today) {
        setError('Start date cannot be in the past');
        return;
      }

      if (endDate < startDate) {
        setError('End date must be after start date');
        return;
      }

      await apiService.submitRequest({
        user_id: userId,
        ...formData
      });

      setSuccess('Vacation request submitted successfully!');
      setFormData({
        first_name: '',
        last_name: '',
        start_date: '',
        end_date: '',
        reason: ''
      });
      
      // Refresh the requests list
      fetchUserRequests();
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to submit request');
    } finally {
      setSubmitting(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getStatusClass = (status) => {
    return `status-badge status-${status.toLowerCase()}`;
  };

  return (
    <div className="interface-container">
      <h2>Submit Vacation Request</h2>
      
      {error && <div className="error">{error}</div>}
      {success && <div className="success">{success}</div>}

      <div className="form-container">
        <form onSubmit={handleSubmit}>
          

          <div className="form-group">
            <label htmlFor="start_date">Start Date:</label>
            <input
              type="date"
              id="start_date"
              name="start_date"
              value={formData.start_date}
              onChange={handleInputChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="end_date">End Date:</label>
            <input
              type="date"
              id="end_date"
              name="end_date"
              value={formData.end_date}
              onChange={handleInputChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="reason">Reason (optional):</label>
            <textarea
              id="reason"
              name="reason"
              value={formData.reason}
              onChange={handleInputChange}
              rows="3"
              placeholder="Describe the reason for your vacation request..."
            />
          </div>

          <button 
            type="submit" 
            className="btn btn-primary"
            disabled={submitting}
          >
            {submitting ? 'Submitting...' : 'Submit Request'}
          </button>
        </form>
      </div>

      <h2>My Vacation Requests</h2>
      
      {loading ? (
        <div className="loading">Loading your requests...</div>
      ) : (
        <div className="requests-grid">
          {requests.length === 0 ? (
            <p>No vacation requests found. Submit your first request above!</p>
          ) : (
            requests.map(request => (
              <div key={request.id} className="request-card">
                <div className="request-header">
                  <div className="request-dates">
                    {formatDate(request.start_date)} - {formatDate(request.end_date)}
                  </div>
                  <span className={getStatusClass(request.status)}>
                    {request.status}
                  </span>
                </div>
                <div className="request-name">
                  <strong>Requested by:</strong> {request.user_name}
                </div>
                
                {request.reason && (
                  <div className="request-reason">
                    <strong>Reason:</strong> {request.reason}
                  </div>
                )}
                
                {request.comments && request.status === 'Rejected' && (
                  <div className="request-comments">
                    <strong>Comments:</strong> {request.comments}
                  </div>
                )}
                
                <div className="request-meta">
                  <small>Submitted: {formatDate(request.created_at)}</small>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default RequesterInterface; 