import React from 'react';
import styled from 'styled-components';

const Input = styled.input`
			outline: none;
			border: none;
`;

const Label = styled.label`
  display: block;
  margin-bottom: 5px;
`;

const ErrorMessage = styled.p`
  color: red;
  font-size: 0.8rem;
`;

const Parent = styled.p`
background: hsl(0deg 0% 100%);
		box-shadow: 0 0 2em hsl(231deg 62% 94%);
		padding: 1em;
		display: flex;
		flex-direction: column;
		gap: 0.5em;
		border-radius: 20px;
		color: hsl(0deg 0% 30%);`
  
const FormInput = ({ label, errorMessage, type, value, onChange, required, minLength, name, ...props }) => (
  <Parent>
    {label && <Label htmlFor={props.id}>{label}</Label>}
    <Input
      id={props.id}
      type={type}
      value={value}
      onChange={onChange}
      required={required}
      // minLength={minLength}
      {...props}
    />
    {/* {minLength && <small className='text-sm'>Minimum characters: {minLength}</small>} */}
    {errorMessage?.[name] && <ErrorMessage>{errorMessage?.[name]}</ErrorMessage>}
  </Parent>
);

export default FormInput;
