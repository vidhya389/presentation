import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Cart from './Cart';
import './Product.css';
import choco1 from './images/choco1.png';
import choco2 from './images/choco2.png';
import choco3 from './images/choco3.png';

const Product = () => {
  const navigate = useNavigate();
  const [cart, setCart] = useState([]);
  const [products] = useState([
    {
      id: 1,
      name: 'Cake',
      cost: 20.99,
      image: choco1,
    },
    {
      id: 2,
      name: 'Sweets',
      cost: 9.99,
      image: choco2,
    },
    {
      id: 3,
      name: 'Beverages',
      cost: 12.99,
      image: choco3,
    },
  ]);

  const handleAddToCart = (product, quantity) => {
    const existingProduct = cart.find((item) => item.product.id === product.id);
    if (existingProduct) {
      existingProduct.quantity += quantity;
      setCart([...cart]);
    } else {
      setCart([...cart, { product, quantity: parseInt(quantity) }]);
    }
  };

  const handleQuantityChange = (product, event) => {
    handleAddToCart(product, event.target.value);
  };

  const handleViewCart = () => {
    navigate('/cart', { state: { cart } });
  };

  return (
    <div className="products">
      <h1>Products</h1>
      <ul>
        {products.map((product) => (
          <li key={product.id} className="product-item">
            <div className="product-image">
              <img src={product.image} alt={product.name} />
            </div>
            <div className="product-info">
              {product.name} - £{product.cost}
            </div>
            <div className="quantity-selector">
              <span id="quantity-label">Select quantity:</span>
                <select aria-labelledby="quantity-label" onChange={(e) => handleQuantityChange(product, e)}>
                  <option value="1">1</option>
                  <option value="2">2</option>
                  <option value="3">3</option>
                  <option value="4">4</option>
                  <option value="5">5</option>
              </select>
            </div>
            <button
              className="add-to-cart-btn"
              onClick={() => handleAddToCart(product, 1)} // Default quantity is 1
            >
              Add to Cart
            </button>
          </li>
        ))}
      </ul>
      <button className="view-cart-btn" onClick={handleViewCart}>
        View Cart
      </button>
    </div>
  );
};

export default Product;