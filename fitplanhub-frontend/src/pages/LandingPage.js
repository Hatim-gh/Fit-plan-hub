import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { plansAPI, followAPI } from '../services/api';
import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

const LandingPage = () => {
  const [plans, setPlans] = useState([]);
  const [following, setFollowing] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useContext(AuthContext);

  useEffect(() => {
    fetchPlans();
    if (user && user.role === 'USER') {
      fetchFollowing();
    }
  }, [user]);

  const fetchPlans = async () => {
    try {
      const response = await plansAPI.getAll();
      setPlans(response.data);
    } catch (error) {
      console.error('Failed to fetch plans:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchFollowing = async () => {
    try {
      const response = await followAPI.getFollowing();
      setFollowing(response.data || []);
    } catch (error) {
      console.error('Failed to fetch following:', error);
    }
  };

  const handleFollow = async (trainerId, e) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!user) {
      return;
    }

    const isFollowingTrainer = following.some(t => (t._id || t).toString() === trainerId.toString());

    try {
      if (isFollowingTrainer) {
        await followAPI.unfollow(trainerId);
      } else {
        await followAPI.follow(trainerId);
      }
      fetchFollowing();
    } catch (error) {
      console.error('Follow/unfollow failed:', error);
    }
  };

  const isFollowingTrainer = (trainerId) => {
    return following.some(t => (t._id || t).toString() === trainerId.toString());
  };

  if (loading) {
    return <div className="container">Loading...</div>;
  }

  return (
    <div className="container">
      <div style={{ textAlign: 'center', marginBottom: '40px', marginTop: '40px' }}>
        <h1>Welcome to FitPlanHub</h1>
        <p style={{ fontSize: '18px', color: '#666', marginTop: '10px' }}>
          Discover fitness plans from certified trainers
        </p>
      </div>

      {plans.length === 0 ? (
        <div className="card">
          <p>No fitness plans available yet.</p>
        </div>
      ) : (
        <div className="plan-grid">
          {plans.map((plan) => {
            const trainerId = plan.trainer?._id || plan.trainer;
            const followingTrainer = user && user.role === 'USER' && isFollowingTrainer(trainerId);
            
            return (
              <div key={plan._id} className="plan-card">
                <h3>{plan.title}</h3>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                  <p className="trainer-name" style={{ margin: 0 }}>
                    Trainer: <Link to={`/trainer/${trainerId}`} style={{ color: '#007bff', textDecoration: 'none' }}>
                      {plan.trainer?.name || 'Unknown'}
                    </Link>
                  </p>
                  {user && user.role === 'USER' && trainerId && trainerId !== user.id && (
                    <button
                      onClick={(e) => handleFollow(trainerId, e)}
                      className={followingTrainer ? 'btn btn-secondary' : 'btn btn-primary'}
                      style={{ fontSize: '12px', padding: '5px 10px' }}
                    >
                      {followingTrainer ? '✓ Following' : '+ Follow'}
                    </button>
                  )}
                </div>
                <p className="price">${plan.price}</p>
                <p style={{ fontSize: '14px', color: '#666', marginBottom: '15px' }}>
                  Duration: {plan.duration} days
                </p>
                <Link to={`/plans/${plan._id}`} className="btn btn-primary" style={{ textDecoration: 'none', display: 'inline-block' }}>
                  View Details
                </Link>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default LandingPage;

