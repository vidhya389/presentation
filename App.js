import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import LoginPage from './LoginPage';
import ConsentPage from './ConsentPage';
import Header from './Header';
import Footer from './Footer';
import Checkout from './Checkout';
import Checkout1 from './Checkout1';
import CheckoutLayout from './CheckoutLayout';
import { AuthProvider } from './AuthContext';
import LoginLayout from './LoginLayout';// Import AuthProvider
import Product from './Product';
import Cart from './Cart';

function App() {
  return (
    <AuthProvider> {/* Wrap your app with AuthProvider */}
      <BrowserRouter>

        <Routes>
          <Route path="/" element={
                                                <CheckoutLayout>
                                                  <Product />
                                                </CheckoutLayout>
                                              }/>
                    <Route path="/cart" element={
                                                          <CheckoutLayout>
                                                            <Cart />
                                                          </CheckoutLayout>
                                                        }/>
          <Route path="/checkout1" element={
                                               <CheckoutLayout>
                                                 <Checkout1 />
                                               </CheckoutLayout>
                                             }
                                             />
          <Route path="/login" element={
                                      <LoginLayout>
                                        <LoginPage />
                                      </LoginLayout>
                                    }/>
          <Route path="/consent" element={
                                             <LoginLayout>
                                               <ConsentPage />
                                             </LoginLayout>
                                           } />
          <Route path="/checkout" element={
                                               <CheckoutLayout>
                                                 <Checkout />
                                               </CheckoutLayout>
                                             }
                                             />
        </Routes>

      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;