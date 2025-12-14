import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { plansAPI, subscriptionAPI, followAPI } from '../services/api';
import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import PaymentModal from '../components/PaymentModal';

const PlanDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const [plan, setPlan] = useState(null);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [isFollowing, setIsFollowing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  const [showPaymentModal, setShowPaymentModal] = useState(false);

  useEffect(() => {
    fetchPlan();
    if (user) {
      checkSubscription();
      checkFollowing();
    }
  }, [id, user]);

  const checkFollowing = async () => {
    if (!plan || !plan.trainer) return;
    try {
      const response = await followAPI.getFollowing();
      const trainerId = plan.trainer._id || plan.trainer;
      const following = response.data || [];
      setIsFollowing(following.some(t => (t._id || t).toString() === trainerId.toString()));
    } catch (error) {
      console.error('Failed to check following status:', error);
    }
  };

  const handleFollow = async () => {
    if (!user) {
      navigate('/login');
      return;
    }

    if (!plan || !plan.trainer) return;

    const trainerId = plan.trainer._id || plan.trainer;
    
    try {
      if (isFollowing) {
        await followAPI.unfollow(trainerId);
        setMessage('Unfollowed trainer');
        setIsFollowing(false);
      } else {
        await followAPI.follow(trainerId);
        setMessage('Following trainer');
        setIsFollowing(true);
      }
    } catch (error) {
      setMessage(error.response?.data?.message || 'Operation failed');
    }
  };

  const fetchPlan = async () => {
    try {
      const response = await plansAPI.getById(id);
      setPlan(response.data);
      // Check following status after plan is loaded
      if (user && response.data) {
        setTimeout(() => checkFollowing(), 100);
      }
    } catch (error) {
      console.error('Failed to fetch plan:', error);
    } finally {
      setLoading(false);
    }
  };

  const checkSubscription = async () => {
    try {
      const response = await subscriptionAPI.checkSubscription(id);
      setIsSubscribed(response.data.isSubscribed);
    } catch (error) {
      console.error('Failed to check subscription:', error);
    }
  };

  const handleSubscribeClick = () => {
    if (!user) {
      // Store the plan ID to redirect back after login
      localStorage.setItem('redirectAfterLogin', `/plans/${id}`);
      navigate('/login');
      return;
    }
    // Show payment modal
    setShowPaymentModal(true);
  };

  const handlePaymentConfirm = async () => {
    try {
      await subscriptionAPI.subscribe(id);
      setMessage('Payment successful! You have been subscribed to this plan.');
      setIsSubscribed(true);
      setTimeout(() => {
        fetchPlan(); // Refresh to get full details
      }, 500);
    } catch (error) {
      setMessage(error.response?.data?.message || 'Subscription failed');
    }
  };

  if (loading) {
    return <div className="container">Loading...</div>;
  }

  if (!plan) {
    return <div className="container">Plan not found</div>;
  }

  const isPreview = !plan.description && !plan.duration && plan.title && plan.price && plan.trainer;

  return (
    <div className="container">
      <div style={{ maxWidth: '800px', margin: '30px auto' }}>
        <div className="card">
          {isPreview && <span className="preview-badge">Preview Only</span>}
          {isSubscribed && <span className="subscribed-badge">Subscribed</span>}

          <h1 style={{ marginBottom: '20px' }}>{plan.title}</h1>
          
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '10px' }}>
            <div>
              <p style={{ fontSize: '18px', color: '#666', margin: 0 }}>
                Trainer: <Link to={`/trainer/${plan.trainer?._id || plan.trainer}`} style={{ color: '#007bff', textDecoration: 'none' }}>
                  {plan.trainer?.name || plan.trainer}
                </Link>
              </p>
            </div>
            {user && user.role === 'USER' && plan.trainer && (plan.trainer._id || plan.trainer) !== user.id && (
              <button
                onClick={handleFollow}
                className={isFollowing ? 'btn btn-secondary' : 'btn btn-primary'}
                style={{ fontSize: '14px', padding: '8px 16px' }}
              >
                {isFollowing ? '✓ Following' : '+ Follow Trainer'}
              </button>
            )}
          </div>

          <p className="price" style={{ fontSize: '32px', marginBottom: '30px' }}>
            ${plan.price}
          </p>

          {isPreview ? (
            <div>
              <p style={{ color: '#666', marginBottom: '20px' }}>
                Subscribe to view full plan details including description and duration.
              </p>
              {user && !isSubscribed && (
                <button onClick={handleSubscribeClick} className="btn btn-success">
                  Subscribe Now
                </button>
              )}
              {!user && (
                <button 
                  onClick={() => {
                    // Store the plan ID to redirect back after login
                    localStorage.setItem('redirectAfterLogin', `/plans/${id}`);
                    navigate('/login');
                  }} 
                  className="btn btn-primary"
                >
                  Login to Subscribe
                </button>
              )}
            </div>
          ) : (
            <div>
              <h3 style={{ marginBottom: '10px' }}>Description</h3>
              <p style={{ marginBottom: '30px', lineHeight: '1.6' }}>
                {plan.description}
              </p>

              <h3 style={{ marginBottom: '10px' }}>Duration</h3>
              <p style={{ marginBottom: '30px', fontSize: '18px' }}>
                {plan.duration} days
              </p>

              {!isSubscribed && user && (
                <button onClick={handleSubscribeClick} className="btn btn-success">
                  Subscribe Now
                </button>
              )}

              {isSubscribed && (
                <div className="alert alert-success">
                  You have full access to this plan!
                </div>
              )}
            </div>
          )}

          {message && (
            <div className={`alert ${message.includes('Success') ? 'alert-success' : 'alert-error'}`} style={{ marginTop: '20px' }}>
              {message}
            </div>
          )}

          <div style={{ marginTop: '30px' }}>
            <button onClick={() => navigate(-1)} className="btn btn-secondary">
              Back
            </button>
          </div>
        </div>
      </div>

      <PaymentModal
        isOpen={showPaymentModal}
        onClose={() => setShowPaymentModal(false)}
        onConfirm={handlePaymentConfirm}
        plan={plan}
      />
    </div>
  );
};

export default PlanDetails;

