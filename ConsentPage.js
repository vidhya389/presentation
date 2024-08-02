import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { AuthContext } from './AuthContext';
import { useContext } from 'react';

const ConsentPage = () => {
  const navigate = useNavigate();
  const { totalCost } = useLocation().state;
  const { updateIsAuthenticated, updateHasConsented } = useContext(AuthContext);

  const handleSubmit = (e) => {
    e.preventDefault();
    updateIsAuthenticated(true);
    updateHasConsented(true); // Update hasConsented state to true
    navigate('/checkout', { state: { totalCost }});
    // Navigate to /checkout
  };

  return (
    <div className="consent-container">
      <h2>Consent</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <input type="checkbox" id="consent-checkbox"  required />
          <label htmlFor="consent-checkbox">
            I agree to the terms and conditions and consent to the processing of
            my account.
          </label>
        </div>
        <button type="submit">Continue</button>
      </form>
    </div>
  );
};

export default ConsentPage;