import React, { useState } from 'react';
import Alert from '../components/Alert';
import FormInput from '../components/FormInput';
import Button from '../components/Button';

import { BASE_URL } from '../constant/constant'
import axios from 'axios';

const Login = () => {
  const [phone_no, setPhoneNo] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState({});

  
  const validateFields = (fields) => {
    const errors = {};
    setErrorMessage({})
  
    // Phone number validation
    if (!fields.phone_no || !fields.phone_no.trim()) {
      errors.phone_no = 'Phone number is required.';
    } else if (!/^\d{10}$/.test(fields.phone_no)) {
      errors.phone_no = 'Invalid phone number. Please enter 10 digits.';
    }
  
    // Password validation
    if (!fields.password || !fields.password.trim()) {
      errors.password = 'Password is required.';
    } else if (fields.password.length < 8) {
      errors.password = 'Password must be at least 8 characters long.';
    }
  
    // Username validation (for registration)
    if (fields.userLogin && fields.userLogin.length < 5) {
      errors.userLogin = 'Username must be at least 5 characters long.';
    }
  
    // Name validation (for registration)
    if (fields.firstName && !fields.firstName.trim()) {
      errors.firstName = 'First name is required.';
    }
  
    if (fields.lastName && !fields.lastName.trim()) {
      errors.lastName = 'Last name is required.';
    }
  
    setErrorMessage(errors)
    return errors;
  };

  const handleLogin = async (e) => {
    e.preventDefault(); // Prevent default form submission

    const fields = {
      phone_no,
      password,
    };

    const errors = validateFields(fields);

    if (Object.keys(errors).length > 0) {
      return;
    }

    try {
      const response = await axios.post(`${BASE_URL}/accounts/login/`, {
        phone_no,
        password,
      });
      const data = await response.data;
      localStorage.setItem('userDetails',JSON.stringify(data))

      // Handle successful login (e.g., redirect or store token)
      Alert.success('Login successful!');
      // ...
    } catch (error) {
      setErrorMessage(error.response.data.message || 'Login failed');
      Alert.error(errorMessage);
    }
  };

  return (
    <div className="container mt-4">
    <div className="row justify-content-center">
      <div className="col-md-6 col-sm-8">
        <div className="card">
          <div className="card-body">
            <h5 className="card-title text-center mb-3">Login</h5>
          
    <form onSubmit={handleLogin}>
       <FormInput
        label="Phone Number"
        type="tel"
        name="phone_no"
        value={phone_no}
        onChange={(e) => setPhoneNo(e.target.value)}
        required
      />
      <FormInput
        label="Password"
        type="password"
        name="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
        minLength={8}
      />
      <Button type="submit">Login</Button>
    </form>
    </div>
        </div>
      </div>
    </div>
  </div>
  );
};

export default Login;
