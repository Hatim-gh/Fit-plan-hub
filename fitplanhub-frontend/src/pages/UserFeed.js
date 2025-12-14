import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { feedAPI } from '../services/api';

const UserFeed = () => {
  const [feed, setFeed] = useState({ followedTrainerPlans: [], purchasedPlans: [] });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchFeed();
  }, []);

  const fetchFeed = async () => {
    try {
      const response = await feedAPI.getUserFeed();
      setFeed(response.data);
    } catch (error) {
      console.error('Failed to fetch feed:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="container">Loading...</div>;
  }

  const allPlans = [
    ...feed.followedTrainerPlans.map(plan => ({ ...plan, type: 'followed' })),
    ...feed.purchasedPlans.map(plan => ({ ...plan, type: 'purchased' }))
  ];

  return (
    <div className="container">
      <h1 style={{ marginTop: '30px', marginBottom: '30px' }}>My Feed</h1>

      {allPlans.length === 0 ? (
        <div className="card">
          <p>Your feed is empty. Follow trainers or purchase plans to see them here!</p>
        </div>
      ) : (
        <>
          {feed.purchasedPlans.length > 0 && (
            <div style={{ marginBottom: '40px' }}>
              <h2 style={{ marginBottom: '20px' }}>My Purchased Plans</h2>
              <div className="plan-grid">
                {feed.purchasedPlans.map((plan) => (
                  <div key={plan._id} className="plan-card">
                    <span className="subscribed-badge">Purchased</span>
                    <h3>{plan.title}</h3>
                    <p className="trainer-name">Trainer: {plan.trainer?.name || 'Unknown'}</p>
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
            </div>
          )}

          {feed.followedTrainerPlans.length > 0 && (
            <div>
              <h2 style={{ marginBottom: '20px' }}>Plans from Followed Trainers</h2>
              <div className="plan-grid">
                {feed.followedTrainerPlans.map((plan) => (
                  <div key={plan._id} className="plan-card">
                    <h3>{plan.title}</h3>
                    <p className="trainer-name">Trainer: {plan.trainer?.name || 'Unknown'}</p>
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
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default UserFeed;

