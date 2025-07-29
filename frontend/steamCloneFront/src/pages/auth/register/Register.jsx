import React, { useState, useEffect, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import "../styles/auth.scss";

const Register = () => {
    const [formData, setFormData] = useState({
        email: '',
        login: '',
        password: '',
        confirmPassword: '',
        humanVerificationAnswer: '',
        ageConfirmed: false,
        isHumanVerified: false
    });

    const [verificationQuestion, setVerificationQuestion] = useState({ question: '', answer: '' });
    const [isVerificationModalOpen, setIsVerificationModalOpen] = useState(false);
    const [modalAnimation, setModalAnimation] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const navigate = useNavigate();

    const generateVerificationQuestion = useCallback(() => {
        const num1 = Math.floor(Math.random() * 10) + 1;
        const num2 = Math.floor(Math.random() * 10) + 1;
        setVerificationQuestion({
            question: `What is ${num1} + ${num2}?`,
            answer: (num1 + num2).toString()
        });
        setFormData(prev => ({ ...prev, humanVerificationAnswer: '' }));
    }, []);

    useEffect(() => {
        if (isVerificationModalOpen && !verificationQuestion.question) {
            generateVerificationQuestion();
        }
    }, [isVerificationModalOpen, verificationQuestion.question, generateVerificationQuestion]);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prevState => ({ ...prevState, [name]: type === 'checkbox' ? checked : value }));
    };

    const handleOpenVerificationModal = () => {
        if (!formData.isHumanVerified) {
            generateVerificationQuestion();
            setModalAnimation('modal-enter');
            setIsVerificationModalOpen(true);
        }
    };

    const handleCloseVerificationModal = () => {
        setModalAnimation('modal-exit');
        setTimeout(() => setIsVerificationModalOpen(false), 300);
    };

    const handleVerifyHuman = () => {
        if (formData.humanVerificationAnswer.trim() === verificationQuestion.answer) {
            setFormData(prev => ({ ...prev, isHumanVerified: true }));
            handleCloseVerificationModal();
        } else {
            alert('Incorrect answer. Please try again.');
            generateVerificationQuestion();
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!formData.email.trim() || !/^\S+@\S+\.\S+$/.test(formData.email)) {
            return alert('Please enter a valid email address.');
        }
        if (!formData.login.trim()) {
            return alert('Please enter your desired login name.');
        }
        if (formData.password.length < 8) {
            return alert('Password must be at least 8 characters long.');
        }
        if (formData.password !== formData.confirmPassword) {
            return alert('Passwords do not match.');
        }
        if (!formData.isHumanVerified) {
            return alert('Please complete the human verification.');
        }
        if (!formData.ageConfirmed) {
            return alert('You must confirm you are 13 or older and agree to the terms.');
        }

        console.log('Form submitted for registration:', formData);
        alert('Account creation successful! (Check console for data)');
        navigate('/login');
    };

    return (
        <div className="flux-auth-container">
            <div className="flux-auth-box register">
                <div className="flux-header">
                    <h2>Create an Account</h2>
                </div>
                
                <form onSubmit={handleSubmit} noValidate>
                    <div className="flux-form-group">
                        <div className="flux-input-wrapper">
                            <input type="email" name="email" value={formData.email} onChange={handleChange} required placeholder="your.email@example.com" autoComplete="email" />
                        </div>
                    </div>
                    <div className="flux-form-group">
                        <div className="flux-input-wrapper">
                            <input type="text" name="login" value={formData.login} onChange={handleChange} required placeholder="Your unique login name" autoComplete="username" />
                        </div>
                    </div>
                    <div className="flux-form-group">
                        <div className="flux-input-wrapper">
                            <input type={showPassword ? "text" : "password"} name="password" value={formData.password} onChange={handleChange} required placeholder="Your password" autoComplete="new-password" />
                            <button type="button" onClick={() => setShowPassword(!showPassword)} className="toggle-password-visibility">
                                <img src={showPassword ? '/authbc/eyeClosed.svg' : '/authbc/EyeOpen.svg'} alt="Toggle password visibility" />
                            </button>
                        </div>
                    </div>
                    <div className="flux-form-group">
                        <div className="flux-input-wrapper">
                            <input type={showConfirmPassword ? "text" : "password"} name="confirmPassword" value={formData.confirmPassword} onChange={handleChange} required placeholder="Confirm password" autoComplete="new-password" />
                            <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="toggle-password-visibility">
                                <img src={showConfirmPassword ? '/authbc/eyeClosed.svg' : '/authbc/EyeOpen.svg'} alt="Toggle password visibility" />
                            </button>
                        </div>
                    </div>

                    <div className={`flux-captcha-box ${formData.isHumanVerified ? 'verified' : ''}`} onClick={handleOpenVerificationModal}>
                        <div className="flux-captcha-checkbox"></div>
                        <span className="flux-captcha-label">
                            {formData.isHumanVerified ? 'Verification Complete' : "I'm not a robot"}
                        </span>
                    </div>

                    <div className="flux-legal-text">
                        <input type="checkbox" id="ageConfirmed" name="ageConfirmed" checked={formData.ageConfirmed} onChange={handleChange} required />
                        <label htmlFor="ageConfirmed">
                            By pressing the button below you confirm that you're 13 years of age or older and agree to the terms of the Flux <Link to="/terms" className="flux-link">Subscriber Agreement</Link> and the <Link to="/privacy" className="flux-link">Privacy Policy</Link>.
                        </label>
                    </div>
                    
                    <button type="submit" className="flux-continue-button" aria-label="Continue"></button>
                </form>
                
                <div className="flux-switch-form">
                    Already have an account?
                    <Link to="/login" className="flux-link">
                        Sign In
                    </Link>
                </div>
            </div>

            {isVerificationModalOpen && (
                <div className={`flux-modal-overlay ${modalAnimation}`}>
                    <div className={`flux-modal-content ${modalAnimation}`}>
                        <h3>Human Verification</h3>
                        <p>{verificationQuestion.question}</p>
                        <input 
                            type="text" 
                            name="humanVerificationAnswer" 
                            value={formData.humanVerificationAnswer} 
                            onChange={handleChange} 
                            placeholder="Your answer" 
                            className="flux-modal-input" 
                            autoFocus 
                            onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                    e.preventDefault();
                                    handleVerifyHuman();
                                }
                            }}
                        />
                        <div className="flux-modal-actions">
                            <button 
                                type="button" 
                                className="flux-modal-verify-button" 
                                aria-label="Verify"
                                onClick={handleVerifyHuman}
                            ></button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Register;