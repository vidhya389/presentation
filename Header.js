import React from 'react';
import logo from './images/logo.png';

const Header = () => {
  return (
    <header>
      <nav>
        <ul>
          <li><a href="#">Personal</a></li>
          <li><a href="#">Business</a></li>
          <li><a href="#">Private</a></li>
        </ul>
      </nav>
      <div className="logo">
        <img src={logo} alt="NatWest Logo" />
      </div>
    </header>
  );
};

export default Header;