import React, { useState } from 'react';
import './PaymentModal.css';

const PaymentModal = ({ isOpen, onClose, onConfirm, plan }) => {
  const [paymentData, setPaymentData] = useState({
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    cardholderName: ''
  });
  const [processing, setProcessing] = useState(false);

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    // Format card number with spaces
    if (name === 'cardNumber') {
      const formatted = value.replace(/\s/g, '').replace(/(.{4})/g, '$1 ').trim();
      if (formatted.replace(/\s/g, '').length <= 16) {
        setPaymentData({ ...paymentData, [name]: formatted });
      }
      return;
    }
    
    // Format expiry date
    if (name === 'expiryDate') {
      const formatted = value.replace(/\D/g, '').replace(/(\d{2})(\d)/, '$1/$2');
      if (formatted.length <= 5) {
        setPaymentData({ ...paymentData, [name]: formatted });
      }
      return;
    }
    
    // CVV - only numbers, max 3 digits
    if (name === 'cvv') {
      if (value.length <= 3 && /^\d*$/.test(value)) {
        setPaymentData({ ...paymentData, [name]: value });
      }
      return;
    }
    
    setPaymentData({ ...paymentData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate form
    if (!paymentData.cardNumber || !paymentData.expiryDate || !paymentData.cvv || !paymentData.cardholderName) {
      alert('Please fill in all payment fields');
      return;
    }

    if (paymentData.cardNumber.replace(/\s/g, '').length < 16) {
      alert('Please enter a valid 16-digit card number');
      return;
    }

    setProcessing(true);
    
    // Simulate payment processing delay
    setTimeout(() => {
      setProcessing(false);
      onConfirm(); // Call the subscription function
      onClose();
    }, 2000);
  };

  return (
    <div className="payment-modal-overlay" onClick={onClose}>
      <div className="payment-modal" onClick={(e) => e.stopPropagation()}>
        <div className="payment-modal-header">
          <h2>Complete Payment</h2>
          <button className="close-btn" onClick={onClose}>×</button>
        </div>

        <div className="payment-modal-body">
          <div className="payment-summary">
            <h3>{plan?.title}</h3>
            <p className="trainer-name">Trainer: {plan?.trainer?.name || plan?.trainer}</p>
            <div className="price-display">
              <span className="price-label">Total Amount:</span>
              <span className="price-value">${plan?.price}</span>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="payment-form">
            <div className="form-group">
              <label>Cardholder Name</label>
              <input
                type="text"
                name="cardholderName"
                value={paymentData.cardholderName}
                onChange={handleChange}
                placeholder="John Doe"
                required
              />
            </div>

            <div className="form-group">
              <label>Card Number</label>
              <input
                type="text"
                name="cardNumber"
                value={paymentData.cardNumber}
                onChange={handleChange}
                placeholder="1234 5678 9012 3456"
                maxLength="19"
                required
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Expiry Date</label>
                <input
                  type="text"
                  name="expiryDate"
                  value={paymentData.expiryDate}
                  onChange={handleChange}
                  placeholder="MM/YY"
                  maxLength="5"
                  required
                />
              </div>

              <div className="form-group">
                <label>CVV</label>
                <input
                  type="text"
                  name="cvv"
                  value={paymentData.cvv}
                  onChange={handleChange}
                  placeholder="123"
                  maxLength="3"
                  required
                />
              </div>
            </div>

            <div className="payment-note">
              <p>🔒 This is a simulated payment. No real transaction will be processed.</p>
            </div>

            <div className="payment-actions">
              <button type="button" onClick={onClose} className="btn btn-secondary">
                Cancel
              </button>
              <button type="submit" className="btn btn-success" disabled={processing}>
                {processing ? 'Processing...' : `Pay $${plan?.price}`}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default PaymentModal;

