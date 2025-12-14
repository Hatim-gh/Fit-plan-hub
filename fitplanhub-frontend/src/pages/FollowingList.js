import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { followAPI } from '../services/api';

const FollowingList = () => {
  const [following, setFollowing] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetchFollowing();
  }, []);

  const fetchFollowing = async () => {
    try {
      const response = await followAPI.getFollowing();
      setFollowing(response.data || []);
    } catch (error) {
      console.error('Failed to fetch following:', error);
      setMessage('Failed to load followed trainers');
    } finally {
      setLoading(false);
    }
  };

  const handleUnfollow = async (trainerId) => {
    try {
      await followAPI.unfollow(trainerId);
      setMessage('Unfollowed trainer successfully');
      // Remove from list immediately
      setFollowing(following.filter(t => (t._id || t).toString() !== trainerId.toString()));
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      setMessage(error.response?.data?.message || 'Failed to unfollow');
      setTimeout(() => setMessage(''), 3000);
    }
  };

  if (loading) {
    return <div className="container">Loading...</div>;
  }

  return (
    <div className="container">
      <h1 style={{ marginTop: '30px', marginBottom: '30px' }}>Trainers I Follow</h1>

      {message && (
        <div className={`alert ${message.includes('successfully') ? 'alert-success' : 'alert-error'}`}>
          {message}
        </div>
      )}

      {following.length === 0 ? (
        <div className="card">
          <h2>You're not following any trainers yet</h2>
          <p style={{ marginTop: '15px', color: '#666' }}>
            Start following trainers to see their plans in your feed!
          </p>
          <Link to="/" className="btn btn-primary" style={{ textDecoration: 'none', display: 'inline-block', marginTop: '20px' }}>
            Browse All Plans
          </Link>
        </div>
      ) : (
        <div className="plan-grid">
          {following.map((trainer) => {
            const trainerId = trainer._id || trainer;
            return (
              <div key={trainerId} className="plan-card">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '15px' }}>
                  <div style={{ flex: 1 }}>
                    <h3 style={{ marginBottom: '5px' }}>{trainer.name || 'Unknown Trainer'}</h3>
                    <p style={{ color: '#666', fontSize: '14px', margin: 0 }}>
                      {trainer.email || 'No email'}
                    </p>
                  </div>
                  <span className="subscribed-badge" style={{ fontSize: '12px' }}>
                    Following
                  </span>
                </div>
                
                <div style={{ display: 'flex', gap: '10px', marginTop: '15px' }}>
                  <Link 
                    to={`/trainer/${trainerId}`} 
                    className="btn btn-primary" 
                    style={{ textDecoration: 'none', display: 'inline-block', flex: 1, textAlign: 'center' }}
                  >
                    View Profile
                  </Link>
                  <button 
                    onClick={() => handleUnfollow(trainerId)}
                    className="btn btn-secondary"
                    style={{ flex: 1 }}
                  >
                    Unfollow
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default FollowingList;

