import React from 'react';
import styled from 'styled-components';

const ButtonC = styled.button`
  padding: 10px 20px;
  border: none;
  border-radius: 4px;
  background-color: #333;
  color: white;
  cursor: pointer;

  &:hover {
    background-color: #222;
  }
`;

const Button = ({ children, type, ...props }) => (
  <ButtonC type={type} {...props}>
    {children}
  </ButtonC>
);

export default Button;
