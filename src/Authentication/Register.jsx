import React, { useState } from 'react';
import Alert from '../components/Alert';
import FormInput from '../components/FormInput';
import Button from '../components/Button';
import { BASE_URL } from '../constant/constant';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Spinner } from 'react-bootstrap';

const Registration = () => {
  // State for form fields and errors
  const [phone_no, setPhoneNo] = useState('');
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [errorMessage, setErrorMessage] = useState({});
  const [userRole, setUserRole] = useState(''); // Initial selected role
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);

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
  
    // Name validation (for registration)
    if (!fields.firstName || !fields.firstName.trim()) {
      errors.firstName = 'First name is required.';
    }
  
    if (!fields.lastName || !fields.lastName.trim()) {
      errors.lastName = 'Last name is required.';
    }

    if (!fields.userRole || !fields.userRole.trim()) {
      errors.userRole = 'User role name is required.';
    }
    console.log(fields);
    setErrorMessage(errors)
    return errors;
  };
  console.log(errorMessage);
  const handleRegistration = async (e) => {
    e.preventDefault(); // Prevent default form submission

    const fields = {
      phone_no,
      password,
      firstName,
      lastName,
      userRole
    };
    const errors = validateFields(fields);
    console.error(errors);

    if (Object.keys(errors).length > 0) 
      return
      // Display error messages
      // You can use Alert component or other methods to display errors to the user
    
    setLoading(true);

    try {
      const response = await axios.post(`${BASE_URL}/accounts/register/`, {
        phone_no,
        [userRole]: true,
        password,
        first_name: firstName,
        last_name: lastName,
      });

      // Handle successful registration (e.g., redirect or confirmation message)
      Alert.success('Registration successful!');
      navigate('/login');
      // ...
    } catch (error) {
      const msg = error.response?.data;
      const k = msg && Object.values(msg)[0];
      setErrorMessage(k[0] || 'Registration failed');
      Alert.error(errorMessage);
    }
    setLoading(false);

  };

  const handleRoleChange = (e) => {
    setUserRole(e.target.value);
  };

  return (
    <div style={{backgroundColor:'#dde4f4', minHeight: '100vh', display: 'flex', 'alignItems':'center'}}>

    <div className="container pt-2">
    <div className="row justify-content-center">
      <div className="col-md-8 col-lg-4 col-sm-8 col-xs-6">
        <div className="card" style={{backgroundColor:"#f0f7ff", borderRadius: '30px'}}>
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
      <FormInput
        label="First Name"
        type="text"
        name="firstName"
        value={firstName}
        onChange={(e) => setFirstName(e.target.value)}
        required
        errorMessage={errorMessage}
        placeholder="Enter your First Name"
      />
      <FormInput
        label="Last Name"
        type="text"
        name="lastName"
        value={lastName}
        onChange={(e) => setLastName(e.target.value)}
        required
        errorMessage={errorMessage}
        placeholder="Enter your Last Name"
      />
<select className="form-select mt-4" aria-label="Select user role" onChange={handleRoleChange} style={{borderRadius: '30px'}}>
<option value="" disabled selected={userRole === ''}>Choose role</option>
  <option value="tailor" selected={userRole === 'tailor'}>Tailor</option>
  <option value="stock_management" selected={userRole === 'stock_management'}>Stock Management</option>
  <option value="userLogin" selected={userRole === 'userLogin'}>User Login</option>
</select>
      {errorMessage?.userRole && <p className="error-message" style={{color: 'red',
  fontSize: '0.8rem', marginLeft:'8px'}}>{errorMessage?.userRole}</p>}
      <Button type="submit"> {loading ? <Spinner animation="border" />: 'Register'}</Button>
    </form>
    <div className="text-end mt-2">
          <small onClick={()=>navigate('/login')} style={{'cursor':'pointer'}}>Already a user? Login</small>
        </div>
    </div>
        </div>
      </div>
    </div>
  </div>
  </div>

  );
};

export default Registration;
