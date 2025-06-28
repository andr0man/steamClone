import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import "../styles/auth.scss";
import { login } from '../../../services/authService';
import { ShieldCheck, User, KeyRound, LogIn, Eye, EyeOff } from 'lucide-react';

const Notification = ({ message, type, duration = 5000, onClose }) => {
    useEffect(() => {
        if (message && duration) {
            const timer = setTimeout(() => {
                if (onClose) onClose();
            }, duration);
            return () => clearTimeout(timer);
        }
    }, [message, duration, onClose]);

    if (!message) return null;

    return (
        <div className={`app-notification notification-${type}`}>
            {message}
            {onClose && <button onClick={onClose} className="close-notification">&times;</button>}
        </div>
    );
};

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

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!formData.identity.trim() || !formData.password) {
            alert('Please enter your login/email and password.');
            return;
        }

        try {

            const preparedData = {
                email: formData.identity, 
                password: formData.password
            };

            const response = await login(preparedData);
            const { accessToken, refreshToken } = response.payload;

            
            localStorage.setItem("accessToken", accessToken);
            localStorage.setItem("refreshToken", refreshToken);

            
            if (typeof onLoginSuccess === 'function') {
                onLoginSuccess(response.payload);
            }

            navigate('/store');
        } catch (error) {
            let errorMsg = 'Login failed. Please try again.';

            if (error.response && error.response.data) {
                const data = error.response.data;

                if (typeof data === 'string') {
                    errorMsg = data;

                } else if (data.message) {
                    errorMsg = data.message;

                } else if (data.errors) {
                    const errors = Object.values(data.errors).flat();
                    if (errors.length > 0) {
                        errorMsg = errors[0];
                    }
                }
            }

            alert(errorMsg);
            
        }
    };

    return (
        <div className="app-auth-container">
            <div className="app-auth-box">
                <div className="auth-header">
                    <ShieldCheck size={40} />
                    <h2>Welcome Back</h2>
                </div>
                
                <form onSubmit={handleSubmit} noValidate>
                    <div className="bubble-form-group">
                        <label htmlFor="login-identity">Login or Email</label>
                        <div className="bubble-input-wrapper">
                            <User />
                            <input
                                type="text"
                                id="login-identity"
                                name="identity"
                                value={formData.identity}
                                onChange={handleChange}
                                required
                                placeholder="Enter your login or email"
                                autoComplete="username"
                            />
                        </div>
                    </div>

                    <div className="bubble-form-group">
                        <label htmlFor="login-password">Password</label>
                         <div className="bubble-input-wrapper bubble-password-input">
                            <KeyRound />
                            <input
                                type={showPassword ? "text" : "password"}
                                id="login-password"
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                required
                                placeholder="Enter your password"
                                autoComplete="current-password"
                            />
                            <button 
                                type="button" 
                                onClick={() => setShowPassword(!showPassword)} 
                                className="toggle-password-visibility"
                                aria-label={showPassword ? "Hide password" : "Show password"}
                            >
                                {showPassword ? <EyeOff /> : <Eye />}
                            </button>
                        </div>
                    </div>

                    <div className="auth-options-group">
                        <div className="bubble-checkbox-group">
                             <input
                                type="checkbox"
                                id="login-remember"
                                name="rememberMe"
                                checked={formData.rememberMe}
                                onChange={handleChange}
                            />
                            <label htmlFor="login-remember">Remember me</label>
                        </div>
                        <Link to="/forgot-password" className="bubble-forgot-password">Forgot password?</Link>
                    </div>

                    <button type="submit" className="bubble-continue-button">
                        Sign In
                        <LogIn size={20} />
                    </button>
                </form>
                
                <div className="bubble-switch-form">
                    Don't have an account?{' '}
                    <Link to="/register" className="bubble-switch-form-button">
                        Create one
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default Login;