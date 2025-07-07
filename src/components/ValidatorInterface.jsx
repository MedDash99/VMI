import { useState, useEffect } from 'react';
import apiService from '../utils/api';

const ValidatorInterface = () => {
  const [requests, setRequests] = useState([]);
  const [filteredRequests, setFilteredRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [filter, setFilter] = useState('All');
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [rejectComments, setRejectComments] = useState('');

  useEffect(() => {
    fetchAllRequests();
  }, []);

  useEffect(() => {
    applyFilter();
  }, [requests, filter]);

  const fetchAllRequests = async () => {
    try {
      setLoading(true);
      const data = await apiService.getAllRequests();
      setRequests(data);
    } catch (err) {
      setError('Failed to fetch requests');
      console.error('Error fetching requests:', err);
    } finally {
      setLoading(false);
    }
  };

  const applyFilter = () => {
    if (filter === 'All') {
      setFilteredRequests(requests);
    } else {
      setFilteredRequests(requests.filter(req => req.status === filter));
    }
  };

  const handleApprove = async (requestId) => {
    try {
      setError('');
      setSuccess('');
      await apiService.updateRequestStatus(requestId, 'Approved');
      setSuccess('Request approved successfully!');
      fetchAllRequests();
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to approve request');
    }
  };

  const handleRejectClick = (request) => {
    setSelectedRequest(request);
    setRejectComments('');
    setShowRejectModal(true);
  };

  const handleRejectConfirm = async () => {
    try {
      setError('');
      setSuccess('');
      await apiService.updateRequestStatus(
        selectedRequest.id, 
        'Rejected', 
        rejectComments
      );
      setSuccess('Request rejected successfully!');
      setShowRejectModal(false);
      setSelectedRequest(null);
      setRejectComments('');
      fetchAllRequests();
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to reject request');
    }
  };

  const handleRejectCancel = () => {
    setShowRejectModal(false);
    setSelectedRequest(null);
    setRejectComments('');
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

  const calculateDays = (startDate, endDate) => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const diffTime = Math.abs(end - start);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
    return diffDays;
  };

  return (
    <div className="interface-container">
      <h2>Vacation Requests Dashboard</h2>
      
      {error && <div className="error">{error}</div>}
      {success && <div className="success">{success}</div>}

      <div className="filters">
        <h3>Filter by Status:</h3>
        {['All', 'Pending', 'Approved', 'Rejected'].map(status => (
          <button
            key={status}
            className={`btn ${filter === status ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => setFilter(status)}
          >
            {status}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="loading">Loading requests...</div>
      ) : (
        <div className="requests-grid">
          {filteredRequests.length === 0 ? (
            <p>No requests found for the selected filter.</p>
          ) : (
            filteredRequests.map(request => (
              <div key={request.id} className="request-card">
                <div className="request-header">
                  <div>
                    <h4>{request.user_name}</h4>
                    <div className="request-dates">
                      {formatDate(request.start_date)} - {formatDate(request.end_date)}
                      <span style={{ marginLeft: '1rem', fontWeight: 'bold' }}>
                        ({calculateDays(request.start_date, request.end_date)} days)
                      </span>
                    </div>
                  </div>
                  <span className={getStatusClass(request.status)}>
                    {request.status}
                  </span>
                </div>
                
                {request.reason && (
                  <div className="request-reason">
                    <strong>Reason:</strong> {request.reason}
                  </div>
                )}
                
                {request.comments && (
                  <div className="request-comments">
                    <strong>Comments:</strong> {request.comments}
                  </div>
                )}
                
                <div className="request-meta">
                  <small>Submitted: {formatDate(request.created_at)}</small>
                </div>

                {request.status === 'Pending' && (
                  <div className="request-actions">
                    <button
                      className="btn btn-success"
                      onClick={() => handleApprove(request.id)}
                    >
                      Approve
                    </button>
                    <button
                      className="btn btn-danger"
                      onClick={() => handleRejectClick(request)}
                    >
                      Reject
                    </button>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      )}

      {/* Reject Modal */}
      {showRejectModal && (
        <div className="modal-overlay">
          <div className="modal">
            <h3>Reject Request</h3>
            <p>
              Are you sure you want to reject the vacation request from{' '}
              <strong>{selectedRequest?.user_name}</strong> for{' '}
              {formatDate(selectedRequest?.start_date)} - {formatDate(selectedRequest?.end_date)}?
            </p>
            
            <div className="form-group">
              <label htmlFor="rejectComments">Comments (optional):</label>
              <textarea
                id="rejectComments"
                value={rejectComments}
                onChange={(e) => setRejectComments(e.target.value)}
                rows="3"
                placeholder="Provide reason for rejection..."
              />
            </div>

            <div className="modal-actions">
              <button
                className="btn btn-secondary"
                onClick={handleRejectCancel}
              >
                Cancel
              </button>
              <button
                className="btn btn-danger"
                onClick={handleRejectConfirm}
              >
                Reject Request
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ValidatorInterface; 