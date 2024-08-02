import { useLocation, useNavigate } from 'react-router-dom';
import React, { useState, useEffect } from 'react';
import './cart.css';

const Cart = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [cart, setCart] = useState(location.state.cart);

  const handleQuantityChange = (product, newQuantity) => {
    const updatedCart = cart.map((item) => {
      if (item.product.id === product.id) {
        return { product, quantity: newQuantity };
      }
      return item;
    });
    setCart(updatedCart);
  };

  const handleCheckout = () => {
    navigate('/checkout1', { state: { cart, totalCost } });
  };

  const totalCost = cart.reduce((acc, item) => acc + item.product.cost * item.quantity, 0);

  return (
    <div className="cart-container">
      <h1 className="cart-title">Cart</h1>
      <ul className="cart-list">
        {cart.map((item) => (
          <li key={item.product.id} className="cart-item">
            <div className="cart-product-info">
              <span className="cart-product-name">{item.product.name}</span>
              <label htmlFor="quantity-input">Quantity:</label>
              <input
                id="quantity-input"
                type="number"
                value={item.quantity}
                onChange={(e) => handleQuantityChange(item.product, parseInt(e.target.value))}
                className="cart-quantity-input"
              />
            </div>
            <div className="cart-product-price">
              <span>${item.product.cost * item.quantity}</span>
            </div>
          </li>
        ))}
      </ul>

      <p className="cart-total">Total Cost: £{totalCost}</p>
            <button
              className="cart-checkout-btn"
              onClick={handleCheckout}
              aria-label="Proceed to checkout"
            >
              Checkout
            </button>
    </div>
  );
};

export default Cart;