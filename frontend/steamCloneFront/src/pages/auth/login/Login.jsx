import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import "../styles/auth.scss";
import { useLoginMutation } from '../../../services/auth/authApi';

const Login = ({ onLoginSuccess }) => {
  const [formData, setFormData] = useState({
    identity: '',
    password: '',
    rememberMe: false
  });
  const [showPassword, setShowPassword] = useState(false);
  const [login, { isLoading }] = useLoginMutation();
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.identity.trim() || !formData.password) {
      alert('Please enter your login/email and password.');
      return;
    }

    try {
      const payload = { email: formData.identity, password: formData.password };
      const res = await login(payload).unwrap();
      const { accessToken, refreshToken } = res.payload || {};

      if (accessToken) localStorage.setItem('accessToken', accessToken);
      if (refreshToken) localStorage.setItem('refreshToken', refreshToken);

      if (typeof onLoginSuccess === 'function') onLoginSuccess(res.payload);
      navigate('/store');
    } catch (error) {
      let msg = 'Login failed. Please try again.';
      if (error?.data) {
        if (typeof error.data === 'string') msg = error.data;
        else if (error.data.message) msg = error.data.message;
        else if (error.data.errors) {
          const arr = Object.values(error.data.errors).flat();
          if (arr.length) msg = arr[0];
        }
      }
      alert(msg);
    }
  };

  return (
    <div className="flux-auth-container">
      <div className="flux-auth-box">
        <div className="flux-header">
          <h2>Welcome Back</h2>
        </div>

        <form onSubmit={handleSubmit} noValidate>
          <div className="flux-form-group">
            <div className="flux-input-wrapper">
              <input
                type="text"
                id="login-identity"
                name="identity"
                value={formData.identity}
                onChange={handleChange}
                required
                placeholder="Login or Email"
                autoComplete="username"
              />
            </div>
          </div>

          <div className="flux-form-group">
            <div className="flux-input-wrapper">
              <input
                type={showPassword ? "text" : "password"}
                id="login-password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                placeholder="Your password"
                autoComplete="current-password"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="toggle-password-visibility"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                <img src={showPassword ? '/authbc/eyeClosed.svg' : '/authbc/EyeOpen.svg'} alt="Toggle password visibility" />
              </button>
            </div>
          </div>

          <div className="flux-options-group">
            <div className="flux-checkbox-group">
              <input
                type="checkbox"
                id="login-remember"
                name="rememberMe"
                checked={formData.rememberMe}
                onChange={handleChange}
              />
              <label htmlFor="login-remember">Remember me</label>
            </div>
            <div className="flux-forgot-password-box">
              <Link to="/forgot-password" className="flux-link">Forgot password?</Link>
            </div>
          </div>

          <button
            type="submit"
            className="flux-continue-button"
            aria-label="Continue"
            disabled={isLoading}
          ></button>
        </form>

        <div className="flux-switch-form">
          New to Flux?{' '}
          <Link to="/register" className="flux-link">
            Create an account
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Login;