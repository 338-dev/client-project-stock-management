import React, { useState } from 'react';
import Alert from '../components/Alert';
import FormInput from '../components/FormInput';
import Button from '../components/Button';
import { BASE_URL } from '../constant/constant';
import axios from 'axios';

const Registration = () => {
  // State for form fields and errors
  const [phone_no, setPhoneNo] = useState('');
  const [userLogin, setUserLogin] = useState('');
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
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
  
  const handleRegistration = async (e) => {
    e.preventDefault(); // Prevent default form submission

    const fields = {
      phone_no,
      password,
      firstName,
      lastName,
      // ... other fields (if applicable)
    };
    const errors = validateFields(fields);

    if (Object.keys(errors).length > 0) 
      return
      // Display error messages
      console.error(errors);
      // You can use Alert component or other methods to display errors to the user
    
    try {
      const response = await axios.post(`${BASE_URL}/accounts/register/`, {
        phone_no,
        userLogin,
        password,
        first_name: firstName,
        last_name: lastName,
      });

      // Handle successful registration (e.g., redirect or confirmation message)
      Alert.success('Registration successful!');
      // ...
    } catch (error) {
      setErrorMessage(error.response.data.message || 'Registration failed');
      Alert.error(errorMessage);
    }
  };

  return (
    <div className="container mt-4">
    <div className="row justify-content-center">
      <div className="col-md-6 col-sm-8">
        <div className="card">
          <div className="card-body">
            <h5 className="card-title text-center mb-3">Register</h5>
          
    <form onSubmit={handleRegistration}>
    <FormInput
        label="Phone Number"
        type="tel"
        name="phone_no"
        value={phone_no}
        onChange={(e) => setPhoneNo(e.target.value)}
        required
      />
      <FormInput
        label="Username"
        type="text"
        name="userLogin"
        value={userLogin}
        onChange={(e) => setUserLogin(e.target.value)}
        required
        minLength={5}
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
      <FormInput
        label="First Name"
        type="text"
        name="firstName"
        value={firstName}
        onChange={(e) => setFirstName(e.target.value)}
        required
      />
      <FormInput
        label="Last Name"
        type="text"
        name="lastName"
        value={lastName}
        onChange={(e) => setLastName(e.target.value)}
        required
      />
      {/* {errorMessage && <p className="error-message">{errorMessage}</p>} */}
      <Button type="submit">Register</Button>
    </form>
    </div>
        </div>
      </div>
    </div>
  </div>
  );
};

export default Registration;
