import React, { useState } from 'react';
import Alert from '../components/Alert';
import FormInput from '../components/FormInput';
import Button from '../components/Button';

import { BASE_URL } from '../constant/constant'
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Spinner } from 'react-bootstrap';

const Login = () => {
  const [phone_no, setPhoneNo] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const [errorMessage, setErrorMessage] = useState({});
  const navigate = useNavigate();

  
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
    } else if (fields.password.length < 5) {
      errors.password = 'Password must be at least 5 characters long.';
    }
    setErrorMessage(errors)
    return errors;
  };
  const addHours = (date, hours) => {
    const result = new Date(date);
    result.setTime(result.getTime() + hours * 60 * 60 * 1000);
    return result;
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

    setLoading(true);
    try {
      const response = await axios.post(`${BASE_URL}/accounts/login/`, {
        phone_no,
        password,
      });
      const data = await response.data;
      
      localStorage.setItem('userDetails',JSON.stringify(data))
      localStorage.setItem('userDetailsExpire',addHours(new Date(), 5))

      
      // Handle successful login (e.g., redirect or store token)
      Alert.success('Login successful!');
      navigate('/')
      // ...
    } catch (error) {
      
      const msg = error.response?.data;
      const k = msg && Object.values(msg)[0];
      Alert.error(k || "login failed");
    }
    setLoading(false);

  };

  return (
    <div style={{backgroundColor:'#dde4f4', minHeight: '100vh',  display: 'flex', 'alignItems':'center'}}>

    <div className="container pt-2">
    <div className="row justify-content-center">
      <div className="col-md-8 col-lg-4 col-sm-8 col-xs-6">
        <div className="card"  style={{backgroundColor:"#f0f7ff", borderRadius: '30px'}}>
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
        errorMessage={errorMessage}
        placeholder="+91xxxxxxxxx"
      />
      <FormInput
        label="Password"
        type="password"
        name="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
        minLength={8}
        errorMessage={errorMessage}
        placeholder="********"
      />
      <Button type="submit">      {loading ? <Spinner animation="border" />: 'Login'}
</Button>
    </form>
    <div className="text-end mt-2">
          <small onClick={()=>navigate('/register')} style={{'cursor':'pointer'}}>New user? Register</small>
        </div>
    </div>
        </div>
      </div>
    </div>
  </div>
  </div>

  );
};

export default Login;
