import React, { useState, useEffect, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import "../styles/auth.scss";
import { ShieldCheck } from 'lucide-react';

const Register = () => { 
  const [formData, setFormData] = useState({
    login: '',  
    nickname: '',  
    email: '',
    confirmEmail: '',
    country: 'Ukraine', 
    humanVerificationAnswer: '',  
    ageConfirmed: false,
    isHumanVerified: false
  });

  const [verificationQuestion, setVerificationQuestion] = useState({ question: '', answer: '' });
  const [isVerificationModalOpen, setIsVerificationModalOpen] = useState(false);
  const [modalAnimation, setModalAnimation] = useState('');  
  const navigate = useNavigate(); 

  const generateVerificationQuestion = useCallback(() => {
    const operations = ['+', '-', '*', '/'];
    const operation = operations[Math.floor(Math.random() * operations.length)];
    
    let num1, num2, questionText, answer;

    switch(operation) {
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
      case '*':  
        num1 = Math.floor(Math.random() * 8) + 2;
        num2 = Math.floor(Math.random() * 8) + 2;
        answer = num1 * num2;  
        questionText = `What is ${num1} * ${num2}?`;
        break;
      case '/':
        const result = Math.floor(Math.random() * 5) + 2;
        num2 = Math.floor(Math.random() * 5) + 2;
        num1 = result * num2;                                     
        answer = result;
        questionText = `What is ${num1} / ${num2}?`;
        break;
      default:  
        num1 = Math.floor(Math.random() * 10) + 1;
        num2 = Math.floor(Math.random() * 10) + 1;
        answer = num1 + num2;
        questionText = `What is ${num1} + ${num2}?`;
    }
    
    setVerificationQuestion({
      question: questionText,
      answer: answer.toString()
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
    
    setFormData(prevState => ({
      ...prevState,
      [name]: type === 'checkbox' ? checked : value
    }));
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
    setTimeout(() => {
      setIsVerificationModalOpen(false);
    }, 300);  
  };

  const handleVerifyHuman = () => {
    if (formData.humanVerificationAnswer === verificationQuestion.answer) {
      setFormData(prev => ({...prev, isHumanVerified: true}));
      alert('Human verification successful!');
      handleCloseVerificationModal();
    } else {
      alert('Incorrect answer. Please try again.');
      generateVerificationQuestion();  
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!formData.isHumanVerified) {
      alert('Please complete the human verification.');
      handleOpenVerificationModal();  
      return;
    }
    
    if (formData.email !== formData.confirmEmail) {
      alert('Email addresses do not match!');
      return;
    }

    if (!formData.login.trim()) {  
      alert('Please enter your login.');
      return;
    }

    if (!formData.nickname.trim()) {  
      alert('Please enter your nickname.');
      return;
    }
    
    if (!formData.ageConfirmed) {
      alert('You must confirm your age to continue!');
      return;
    }
    
    console.log('Form submitted for registration:', formData);
    alert('Account creation successful! (Check console for data)');
    navigate('/login'); 
  };

  const countries = [
    'Ukraine', 'United States', 'Canada', 'United Kingdom', 'Germany',
    'France', 'Poland', 'Australia', 'Japan', 'South Korea', 'Brazil',
    'Mexico', 'Spain', 'Italy', 'Netherlands', 'Sweden', 'Norway',
    'Finland', 'Denmark', 'Switzerland', 'Austria', 'Portugal', 'Other'
  ];

  return (
    <div className="app-register-container">
      <div className="app-register-box">
        <div className="login-app-logo">
          <ShieldCheck size={40} color="#66c0f4" strokeWidth={1.5} />
        </div>
        <h2>CREATE ACCOUNT</h2>
        <form onSubmit={handleSubmit}>
          <div className="app-form-group">
            <label htmlFor="register-login">Login</label>  
            <input
              type="text"
              id="register-login"  
              name="login"
              value={formData.login}
              onChange={handleChange}
              required
              placeholder="Choose your login"
            />
          </div>

          <div className="app-form-group">
            <label htmlFor="register-nickname">Nickname</label>
            <input
              type="text"
              id="register-nickname"  
              name="nickname"
              value={formData.nickname}
              onChange={handleChange}
              required
              placeholder="Please enter your nickname"
            />
          </div>

          <div className="app-form-group">
            <label htmlFor="register-email">Email Address</label>
            <input
              type="email"
              id="register-email"  
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>
          
          <div className="app-form-group">
            <label htmlFor="register-confirmEmail">Confirm Email Address</label>
            <input
              type="email"
              id="register-confirmEmail"  
              name="confirmEmail"
              value={formData.confirmEmail}
              onChange={handleChange}
              required
            />
          </div>
          
          <div className="app-form-group">
            <label htmlFor="register-country">Country of Residence</label>
            <select  
              id="register-country"  
              name="country"  
              value={formData.country}
              onChange={handleChange}
              className="app-select"
            >
              {countries.map(country => (
                <option key={country} value={country}>{country}</option>
              ))}
            </select>
          </div>
          
          <div className="app-form-group human-verification-status">
            <label>Human Verification</label>
            {formData.isHumanVerified ? (
              <div className="app-verified-message static">
                <span className="verified-icon">✓</span> Human verification complete
              </div>
            ) : (
              <button  
                type="button"  
                className="app-action-button"  
                onClick={handleOpenVerificationModal}
              >
                I'm not a robot - Click to verify
              </button>
            )}
          </div>
          
          <div className="app-checkbox-group">
            <label htmlFor="register-ageConfirmed">
              <input
                type="checkbox"
                id="register-ageConfirmed"  
                name="ageConfirmed"
                checked={formData.ageConfirmed}
                onChange={handleChange}
                required
              />
              <span>I confirm that I am 13 years of age or older and agree to the Subscriber Agreement and Privacy Policy.</span>
            </label>
          </div>
          
          <button type="submit" className="app-continue-button">Continue</button>
        </form>
        <div className="app-switch-form">
          Already have an account?{' '}
          {/* Заміна Link */}
          <Link to="/login" className="app-switch-form-button">
            Sign In
          </Link>
        </div>
      </div>

      {isVerificationModalOpen && (
        <div className={`modal-overlay ${modalAnimation}`}>
          <div className={`modal-content ${modalAnimation}`}>
            <h3>Human Verification</h3>
            <p>{verificationQuestion.question}</p>
            <input
              type="text"
              name="humanVerificationAnswer"
              value={formData.humanVerificationAnswer}
              onChange={handleChange}
              placeholder="Your answer"
              className="app-modal-input"
              autoFocus
            />
            <div className="modal-actions">
              <button  
                type="button"  
                className="app-action-button"
                onClick={handleVerifyHuman}
              >
                Submit Answer
              </button>
              <button  
                type="button"  
                className="app-cancel-button"
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