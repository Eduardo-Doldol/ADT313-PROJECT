import React, { useState, useRef, useCallback, useEffect } from 'react';
import './Login.css';
import char from '../../../assets/character.png';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useDebounce } from '../../../../src/hooks/useDebounce';
import { Link } from 'react-router-dom';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isFieldsDirty, setIsFieldsDirty] = useState(false);
  const emailRef = useRef();
  const passwordRef = useRef();
  const [isShowPassword, setIsShowPassword] = useState(false);
  const userInputDebounce = useDebounce({ email, password }, 2000);
  const [debounceState, setDebounceState] = useState(false);
  const [status, setStatus] = useState('idle');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleShowPassword = useCallback(() => {
    setIsShowPassword((prev) => !prev);
  }, []);

  const handleOnChange = (event, type) => {
    setDebounceState(false);
    setIsFieldsDirty(true);

    switch (type) {
      case 'email':
        setEmail(event.target.value);
        break;
      case 'password':
        setPassword(event.target.value);
        break;
      default:
        break;
    }
  };

  const handleLogin = async () => {
    const data = { email, password };
    setStatus('loading');

    try {
      const response = await axios.post('/user/login', data, {
        headers: { 'Access-Control-Allow-Origin': '*' },
      });
      localStorage.setItem('accessToken', response.data.access_token);
      navigate('/');
      setStatus('idle');
    } catch (e) {
      alert('Email or Password is Incorrect');
      setStatus('idle');
    }
  };

  useEffect(() => {
    setDebounceState(true);
  }, [userInputDebounce]);

  return (
    <div className="login-container">
      <h1>Log In</h1>

      <div className="border-char">
        <img src={char} alt="Character" />
      </div>

      <div className="border-login">
        <form>
          <div className="wrapper">
            <div className="input-box">
              <input
                id="email"
                type="text"
                placeholder=""
                value={email}
                onChange={(e) => handleOnChange(e, 'email')}
                required
                ref={emailRef}
              />
              <label>Email</label>
              {debounceState && isFieldsDirty && email === '' && (
                <span className="errors">This field is required</span>
              )}
            </div>

            <div className="input-box">
              <input
                id="password"
                type={isShowPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => handleOnChange(e, 'password')}
                placeholder=""
                required
                ref={passwordRef}
              />
              <label>Password</label>
              {debounceState && isFieldsDirty && password === '' && (
                <span className="errors">This field is required</span>
              )}
              <span
                className="toggle-password"
                onClick={handleShowPassword}
                role="button"
              >
                {isShowPassword ? 'HIDE' : 'SHOW'}
              </span>
            </div>

            <div className="btn-container">
              <button
                type="button"
                disabled={status === 'loading'}
                onClick={() => {
                  if (status === 'loading') return;
                  if (email && password) {
                    handleLogin();
                  } else {
                    setIsFieldsDirty(true);
                    if (email === '') emailRef.current.focus();
                    if (password === '') passwordRef.current.focus();
                  }
                }}
              >
                {status === 'idle' ? 'LOG IN' : 'LOADING'}
              </button>
              <p>
                No Account?{' '}
                <Link to="/register">
                  <strong>Register</strong>
                </Link>
              </p>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Login;
