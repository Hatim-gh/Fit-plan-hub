import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { trainerAPI, followAPI } from '../services/api';
import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

const TrainerProfile = () => {
  const { trainerId } = useParams();
  const { user } = useContext(AuthContext);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetchProfile();
  }, [trainerId]);

  const fetchProfile = async () => {
    try {
      const response = await trainerAPI.getProfile(trainerId);
      setProfile(response.data);
    } catch (error) {
      console.error('Failed to fetch trainer profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFollow = async () => {
    try {
      if (profile.isFollowing) {
        await followAPI.unfollow(trainerId);
        setMessage('Unfollowed trainer');
      } else {
        await followAPI.follow(trainerId);
        setMessage('Following trainer');
      }
      fetchProfile();
    } catch (error) {
      setMessage(error.response?.data?.message || 'Operation failed');
    }
  };

  if (loading) {
    return <div className="container">Loading...</div>;
  }

  if (!profile) {
    return <div className="container">Trainer not found</div>;
  }

  return (
    <div className="container">
      <div style={{ maxWidth: '1000px', margin: '30px auto' }}>
        <div className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
            <div>
              <h1>{profile.trainer.name}</h1>
              <p style={{ color: '#666', marginTop: '5px' }}>{profile.trainer.email}</p>
            </div>
            {user && user.role === 'USER' && user.id !== trainerId && (
              <button
                onClick={handleFollow}
                className={profile.isFollowing ? 'btn btn-secondary' : 'btn btn-primary'}
              >
                {profile.isFollowing ? 'Unfollow' : 'Follow'}
              </button>
            )}
          </div>

          {message && (
            <div className={`alert ${message.includes('failed') ? 'alert-error' : 'alert-success'}`}>
              {message}
            </div>
          )}

          <h2 style={{ marginBottom: '20px' }}>Fitness Plans</h2>

          {profile.plans.length === 0 ? (
            <p>This trainer hasn't created any plans yet.</p>
          ) : (
            <div className="plan-grid">
              {profile.plans.map((plan) => (
                <div key={plan._id} className="plan-card">
                  <h3>{plan.title}</h3>
                  <p className="price">${plan.price}</p>
                  <p style={{ fontSize: '14px', color: '#666', marginBottom: '15px' }}>
                    Duration: {plan.duration} days
                  </p>
                  <Link to={`/plans/${plan._id}`} className="btn btn-primary" style={{ textDecoration: 'none', display: 'inline-block' }}>
                    View Details
                  </Link>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TrainerProfile;

