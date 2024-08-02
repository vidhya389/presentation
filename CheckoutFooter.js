import styled from 'styled-components';

const Footer = styled('footer')`
  background-color: green; /* Blue background */
  color: #FFFFFF; /* White text color */
  padding: 1em;
  text-align: center;

  box-shadow: 0 -2px 4px rgba(0, 0, 0, 0.1); /* Box shadow for depth */

  a { /* Style the email address link */
    color: #FFFFFF; /* White text color */
    text-decoration: underline;
    &:hover {
      color: #CCCCCC; /* Light gray on hover */
    }
  }
`;

export default Footer;