import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import "../styles/auth.scss";
import { ShieldCheck } from 'lucide-react';

const Login = ({ onLoginSuccess }) => { 
  const [formData, setFormData] = useState({
    identity: '',
    password: '',
    rememberMe: false
  });
  const navigate = useNavigate(); 

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.identity.trim()) {
      alert('Please enter your account name or email address.');
      return;
    }
    if (!formData.password) {
      alert('Please enter your password.');
      return;
    }
    console.log('Form submitted for login:', formData);
    
    onLoginSuccess(formData); 
    navigate('/store');
  };

  return (
    <div className="app-login-container">
      <div className="app-login-box">
        <div className="login-app-logo">
          <ShieldCheck size={40} color="#66c0f4" strokeWidth={1.5} />
        </div>
        <h2>SIGN IN</h2>
        <form onSubmit={handleSubmit}>
          <div className="login-form-group">
            <label htmlFor="login-identity">Account name or Email address</label>
            <input
              type="text"
              id="login-identity"
              name="identity"
              value={formData.identity}
              onChange={handleChange}
              required
              placeholder="Enter your login or email"
            />
          </div>
          
          <div className="login-form-group">
            <label htmlFor="login-password">Password</label>
            <input
              type="password"
              id="login-password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              placeholder="Enter your password"
            />
          </div>
          
          <div className="login-checkbox-group">
            <label htmlFor="login-remember">
              <input
                type="checkbox"
                id="login-remember"
                name="rememberMe"
                checked={formData.rememberMe}
                onChange={handleChange}
              />
              <span>Remember me</span>
            </label>
            {/* Замість <a> можна також використати <Link>, якщо це внутрішній маршрут */}
            <a href="#forgot" className="app-forgot-password">Forgot your password?</a>
          </div>
          
          <button type="submit" className="app-login-button">Sign In</button>
        </form>
        <div className="login-switch-form">
          Don't have an account?{' '}
          {/* Заміна Link */}
          <Link to="/register" className="login-switch-button">
            Create one
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Login;