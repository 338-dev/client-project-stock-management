import React from 'react';
import styled from 'styled-components';

const ButtonC = styled.button`
  // padding: 10px 20px;
  // border: none;
  // border-radius: 4px;
  // background-color: #333;
  // color: white;
  // cursor: pointer;

  // &:hover {
  //   background-color: #222;
  // }
  padding: 1em;
		background: hsl(233deg 36% 38%);
		color: hsl(0 0 100);
		border: none;
		border-radius: 30px;
		font-weight: 600;
    width: 100%;
    margin-top: 15px
`;

const Button = ({ children, type, ...props }) => (
  <ButtonC type={type} {...props}>
    {children}
  </ButtonC>
);

export default Button;
