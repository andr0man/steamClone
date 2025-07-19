import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import "../styles/auth.scss";

const Login = ({ onLoginSuccess }) => {
    const [formData, setFormData] = useState({
        identity: '',
        password: '',
        rememberMe: false
    });
    const [showPassword, setShowPassword] = useState(false);
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
        console.log('Form submitted for login:', formData);
        if (typeof onLoginSuccess === 'function') {
            onLoginSuccess(formData);
        }
        // navigate('/store');
    };

    return (
        <div className="flux-auth-container">
            <div className="flux-auth-box">
                <div className="flux-header">
                    <h2>Welcome Back</h2>
                </div>
                
                <form onSubmit={handleSubmit} noValidate>
                    <div className="flux-form-group">
                        <label htmlFor="login-identity">Login or Email</label>
                        <div className="flux-input-wrapper">
                            <input
                                type="text"
                                id="login-identity"
                                name="identity"
                                value={formData.identity}
                                onChange={handleChange}
                                required
                                autoComplete="username"
                            />
                        </div>
                    </div>

                    <div className="flux-form-group">
                        <label htmlFor="login-password">Your password</label>
                         <div className="flux-input-wrapper">
                            <input
                                type={showPassword ? "text" : "password"}
                                id="login-password"
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                required
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

                    <button type="submit" className="flux-continue-button" aria-label="Continue"></button>
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