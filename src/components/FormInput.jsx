import React from 'react';
import styled from 'styled-components';

const Input = styled.input`
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 4px;
  width: 100%;
  margin-bottom: 10px;
  outline-style: none
`;

const Label = styled.label`
  display: block;
  margin-bottom: 5px;
`;

const ErrorMessage = styled.p`
  color: red;
  font-size: 0.8rem;
`;

const FormInput = ({ label, errorMessage, type, value, onChange, required, minLength, name, ...props }) => (
  <div>
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
    {minLength && <small className='text-sm'>Minimum characters: {minLength}</small>}
    {errorMessage?.[name] && <ErrorMessage>{errorMessage?.[name]}</ErrorMessage>}
  </div>
);

export default FormInput;
