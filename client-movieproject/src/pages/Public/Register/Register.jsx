import React, { useState, useEffect } from 'react';
import './Register.css';
import cat from '../../../assets/cat.png';
import { useDebounce } from '../../../../src/hooks/useDebounce';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';

function Register() {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    firstName: '',
    middleName: '', 
    lastName: '',
    contactNo: '',
    role: '',
  });
  const [isFieldsDirty, setIsFieldsDirty] = useState(false);
  const [debounceState, setDebounceState] = useState(false);
  const [status, setStatus] = useState('idle');
  const [error, setError] = useState('');
  const userInputDebounce = useDebounce(formData, 2000);
  const navigate = useNavigate();

  const handleOnChange = (event) => {
    const { id, value } = event.target;
    setIsFieldsDirty(true);
    setDebounceState(false);
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  const handleRegister = async () => {
    const { email, password, firstName, lastName, contactNo, role } = formData;
    if (!email || !password || !firstName || !lastName || !contactNo || !role) {
      setIsFieldsDirty(true);
      return;
    }

    setStatus('loading');
    try {
      const response = await axios.post('/user/register', formData, {
        headers: { 'Access-Control-Allow-Origin': '*' },
      });
      alert('Account successfully created!');
      navigate('/');
      setStatus('idle');
    } catch (e) {
      setError(e.response?.data?.message || 'Something went wrong!');
      setStatus('idle');
    }
  };

  useEffect(() => {
    setDebounceState(true);
  }, [userInputDebounce]);

  return (
    <div className="signup-container">
      <h1>Create Account</h1>

      <div className="border-cat">
        <img src={cat} alt="" />
      </div>

      <div className="border">
        <form>
          <div className="wrapper">
            {['email', 'password', 'firstName', 'middleName', 'lastName', 'contactNo'].map((field, index) => (
              <div className="input-txt" key={field}>
                <input
                  id={field}
                  type={field === 'password' ? 'password' : 'text'}
                  value={formData[field]}
                  placeholder=" "
                  required={field !== 'middleName'}
                  onChange={handleOnChange}
                />
                <label htmlFor={field}>
                  {field === 'firstName'
                    ? 'First Name'
                    : field === 'middleName'
                    ? 'Middle Name'
                    : field === 'lastName'
                    ? 'Last Name'
                    : field === 'contactNo'
                    ? 'Contact Number'
                    : field.charAt(0).toUpperCase() + field.slice(1)}
                </label>
                {debounceState && isFieldsDirty && formData[field] === '' && field !== 'middleName' && (
                  <span className="errors">This field is required</span>
                )}
              </div>
            ))}

            <div className="input-txt">
              <select
                id="role"
                value={formData.role}
                required
                onChange={handleOnChange}
              >
                <option value="" disabled hidden></option>
                <option value="admin">Admin</option>
                <option value="user">User</option>
              </select>
              <label htmlFor="role">Role</label>
              {debounceState && isFieldsDirty && formData.role === '' && (
                <span className="errors">This field is required</span>
              )}
            </div>
          </div>

          <button
            type="button"
            onClick={handleRegister}
            disabled={status === 'loading'}
          >
            {status === 'idle' ? 'CREATE ACCOUNT' : 'LOADING'}
          </button>
          {error && <span className="errors">{error}</span>}
          <p>
            Already have an account?{' '}
            <Link to="/login">
                  <strong>Login</strong>
                </Link>
          </p>
        </form>
      </div>
    </div>
  );
}

export default Register;