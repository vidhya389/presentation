// LoginLayout.js
import React from 'react';
import Header from './Header';
import Footer from './Footer';

const LoginLayout = ({ children }) => {
  return (
    <>
      <Header />
      <main>{children}</main>
      <Footer />
    </>
  );
};

export default LoginLayout;