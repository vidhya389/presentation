// CheckoutLayout.js
import React from 'react';
import CheckoutHeader from './CheckoutHeader';
import CheckoutFooter from './CheckoutFooter';

const CheckoutLayout = ({ children }) => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <CheckoutHeader>
        Ecommerce App
      </CheckoutHeader>
      <main>{children}</main>
      <CheckoutFooter style={{ marginTop: 'auto' }}>
        <p>&copy; 2024 Ecommerce App</p>
        <p>Contact us: <a href="mailto:support@example.com">support@example.com</a></p>
      </CheckoutFooter>
    </div>
  );
};

export default CheckoutLayout;