import React, { useState, useEffect, useCallback } from 'react';
import { useRegisterMutation } from "../../../services/auth/authApi";
import { Link, useNavigate } from 'react-router-dom';
import "../styles/auth.scss";
import { Mail, User, ShieldCheck, KeyRound, Eye, EyeOff, UserPlus, ArrowRight } from 'lucide-react';

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

const Register = () => {
    const [step, setStep] = useState(1);
    const [formData, setFormData] = useState({
        login: '',
        email: '',
        nickname: '',
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
    const [isSubmittingStep1, setIsSubmittingStep1] = useState(false);
    const [apiErrorStep1, setApiErrorStep1] = useState(null);

    const [register] = useRegisterMutation();
    const navigate = useNavigate();

    const generateVerificationQuestion = useCallback(() => {
        const operations = ['+', '-', '×'];
        const operation = operations[Math.floor(Math.random() * operations.length)];
        let num1, num2, questionText, answer;
        
        switch (operation) {
            case '+':
                num1 = Math.floor(Math.random() * 10) + 1;
                num2 = Math.floor(Math.random() * 10) + 1;
                answer = num1 + num2;
                questionText = `What is ${num1} + ${num2}?`;
                break;
            case '-':
                num2 = Math.floor(Math.random() * 9) + 1;
                num1 = num2 + Math.floor(Math.random() * 10) + 1;
                answer = num1 - num2;
                questionText = `What is ${num1} - ${num2}?`;
                break;
            case '×':
                num1 = Math.floor(Math.random() * 5) + 1;
                num2 = Math.floor(Math.random() * 5) + 1;
                answer = num1 * num2;
                questionText = `What is ${num1} × ${num2}?`;
                break;
            default:
                num1 = Math.floor(Math.random() * 10) + 1;
                num2 = Math.floor(Math.random() * 10) + 1;
                answer = num1 + num2;
                questionText = `What is ${num1} + ${num2}?`;
        }
        
        setVerificationQuestion({ question: questionText, answer: answer.toString() });
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
        if (formData.humanVerificationAnswer === verificationQuestion.answer) {
            setFormData(prev => ({ ...prev, isHumanVerified: true }));
            alert('Human verification successful!');
            handleCloseVerificationModal();
        } else {
            alert('Incorrect answer. Please try again.');
            generateVerificationQuestion();
        }
    };

    const handleNextStep = async (e) => {
        e.preventDefault();
        setApiErrorStep1(null);

        if (!formData.email.trim() || !/^\S+@\S+\.\S+$/.test(formData.email)) {
            setApiErrorStep1('Please enter a valid email address.');
            return;
        }
        if (!formData.login.trim()) {
            setApiErrorStep1('Please enter your desired login.');
            return;
        }
        if (!formData.isHumanVerified) {
            setApiErrorStep1('Please complete the human verification.');
            handleOpenVerificationModal();
            return;
        }

        setIsSubmittingStep1(true);
        console.log('Step 1 Data (for potential pre-validation by connector):', {
            email: formData.email,
            login: formData.login,
        });
        
        await new Promise(resolve => setTimeout(resolve, 800));
        
        setStep(2);
        setIsSubmittingStep1(false);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!formData.isHumanVerified) {
            alert('Please complete the human verification.');
            handleOpenVerificationModal();
            return;
        }
        if (!formData.nickname.trim()) { 
            alert('Please enter your nickname.'); 
            return; 
        }
        if (formData.password.length < 8) { 
            alert('Password must be at least 8 characters long.'); 
            return; 
        }
        if (formData.password !== formData.confirmPassword) { 
            alert('Passwords do not match.'); 
            return; 
        }
        if (!formData.ageConfirmed) { 
            alert('You must confirm you are 13 or older.'); 
            return; 
        }
        
        const registrationData = {
            email: formData.email,
            login: formData.login,
            nickname: formData.nickname,
            password: formData.password,
            confirmPassword: formData.confirmPassword
        };

        try {
            const response = await register(registrationData).unwrap();
            console.log('Registration success:', response);
            alert('Registration successful!');
            navigate('/login');
        } catch (error) {
            console.error("Registration error:", error);
            alert(error?.data?.message || 'Registration error');
        }
    };

    return (
        <div className="app-auth-container">
            {apiErrorStep1 && <Notification message={apiErrorStep1} type="error" duration={7000} onClose={() => setApiErrorStep1(null)} />}
            
            <div className="app-auth-box">
                <div className="auth-header">
                    <UserPlus size={40} />
                    <h2>{step === 1 ? 'Create Your Account' : 'Final Details'}</h2>
                    <p className="step-indicator">Step {step} of 2</p>
                </div>
                
                {step === 1 && (
                    <form onSubmit={handleNextStep} noValidate>
                        <div className="bubble-form-group">
                            <label htmlFor="register-email">Email Address</label>
                            <div className="bubble-input-wrapper">
                                <Mail />
                                <input 
                                    type="email" 
                                    id="register-email" 
                                    name="email" 
                                    value={formData.email} 
                                    onChange={handleChange} 
                                    required 
                                    placeholder="your.email@example.com" 
                                    autoComplete="email"
                                />
                            </div>
                        </div>
                        
                        <div className="bubble-form-group">
                            <label htmlFor="register-login">Login</label>
                            <div className="bubble-input-wrapper">
                                <User />
                                <input 
                                    type="text" 
                                    id="register-login" 
                                    name="login" 
                                    value={formData.login} 
                                    onChange={handleChange} 
                                    required 
                                    placeholder="Choose a unique login" 
                                    autoComplete="username"
                                />
                            </div>
                        </div>
                        
                        <div className="bubble-form-group">
                            <label>Human Verification</label>
                            {formData.isHumanVerified ? (
                                <div className="bubble-verified-message">
                                    <ShieldCheck size={20} /> Verification Complete
                                </div>
                            ) : (
                                <button 
                                    type="button" 
                                    className="bubble-action-button" 
                                    onClick={handleOpenVerificationModal}
                                >
                                    I'm not a robot
                                </button>
                            )}
                        </div>
                        
                        <button 
                            type="submit" 
                            className="bubble-continue-button" 
                            disabled={isSubmittingStep1 || !formData.isHumanVerified}
                        >
                            {isSubmittingStep1 ? 'Verifying...' : 'Continue'}
                            <ArrowRight size={20} />
                        </button>
                    </form>
                )}

                {step === 2 && (
                    <form onSubmit={handleSubmit} noValidate>
                        <div className="bubble-form-group">
                            <label htmlFor="register-nickname">Nickname</label>
                            <div className="bubble-input-wrapper">
                                <User />
                                <input 
                                    type="text" 
                                    id="register-nickname" 
                                    name="nickname" 
                                    value={formData.nickname} 
                                    onChange={handleChange} 
                                    required 
                                    placeholder="How you'll appear to others" 
                                    autoComplete="nickname"
                                />
                            </div>
                        </div>
                        
                        <div className="bubble-form-group">
                            <label htmlFor="register-password">Password</label>
                            <div className="bubble-input-wrapper bubble-password-input">
                                <KeyRound />
                                <input 
                                    type={showPassword ? "text" : "password"} 
                                    id="register-password" 
                                    name="password" 
                                    value={formData.password} 
                                    onChange={handleChange} 
                                    required 
                                    placeholder="Min. 8 characters" 
                                    autoComplete="new-password"
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
                        
                        <div className="bubble-form-group">
                            <label htmlFor="register-confirmPassword">Confirm Password</label>
                            <div className="bubble-input-wrapper bubble-password-input">
                                <KeyRound />
                                <input 
                                    type={showConfirmPassword ? "text" : "password"} 
                                    id="register-confirmPassword" 
                                    name="confirmPassword" 
                                    value={formData.confirmPassword} 
                                    onChange={handleChange} 
                                    required 
                                    placeholder="Re-enter password" 
                                    autoComplete="new-password"
                                />
                                <button 
                                    type="button" 
                                    onClick={() => setShowConfirmPassword(!showConfirmPassword)} 
                                    className="toggle-password-visibility"
                                    aria-label={showConfirmPassword ? "Hide password" : "Show password"}
                                >
                                    {showConfirmPassword ? <EyeOff /> : <Eye />}
                                </button>
                            </div>
                        </div>
                        
                        <div className="bubble-checkbox-group">
                            <input 
                                type="checkbox" 
                                id="register-ageConfirmed" 
                                name="ageConfirmed" 
                                checked={formData.ageConfirmed} 
                                onChange={handleChange} 
                                required 
                            />
                            <label htmlFor="register-ageConfirmed">
                                I am 13+ and agree to the <Link to="/terms" target="_blank" rel="noopener noreferrer">Subscriber Agreement</Link>.
                            </label>
                        </div>
                        
                        <button 
                            type="submit" 
                            className="bubble-continue-button"
                        >
                            Create Account
                        </button>
                    </form>
                )}
                
                <div className="bubble-switch-form">
                    {step === 1 ? 'Already have an account?' : 'Need to change email/login?'}
                    <Link 
                        to={step === 1 ? "/login" : '#'} 
                        onClick={step === 2 ? (e) => { e.preventDefault(); setStep(1); } : undefined} 
                        className="bubble-switch-form-button"
                    >
                        {step === 1 ? 'Sign In' : 'Go Back'}
                    </Link>
                </div>
            </div>

            {isVerificationModalOpen && (
                <div className={`bubble-modal-overlay ${modalAnimation}`}>
                    <div className={`bubble-modal-content ${modalAnimation}`}>
                        <h3>Human Verification</h3>
                        <p>{verificationQuestion.question}</p>
                        <input 
                            type="text" 
                            name="humanVerificationAnswer" 
                            value={formData.humanVerificationAnswer} 
                            onChange={handleChange} 
                            placeholder="Your answer" 
                            className="bubble-modal-input" 
                            autoFocus 
                        />
                        <div className="bubble-modal-actions">
                            <button 
                                type="button" 
                                className="bubble-continue-button" 
                                onClick={handleVerifyHuman}
                            >
                                Verify
                            </button>
                            <button 
                                type="button" 
                                className="bubble-cancel-button" 
                                onClick={handleCloseVerificationModal}
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Register;