import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import "../styles/auth.scss";
import { useRegisterMutation } from '../../../services/auth/authApi';

const COUNTRIES = [
  { "id": 1, "name": "Afghanistan" },
  { "id": 2, "name": "Albania" },
  { "id": 3, "name": "Algeria" },
  { "id": 4, "name": "American Samoa" },
  { "id": 5, "name": "Andorra" },
  { "id": 6, "name": "Angola" },
  { "id": 7, "name": "Anguilla" },
  { "id": 8, "name": "Antarctica" },
  { "id": 9, "name": "Antigua and Barbuda" },
  { "id": 10, "name": "Argentina" },
  { "id": 11, "name": "Armenia" },
  { "id": 12, "name": "Aruba" },
  { "id": 13, "name": "Australia" },
  { "id": 14, "name": "Austria" },
  { "id": 15, "name": "Azerbaijan" },
  { "id": 16, "name": "Bahamas" },
  { "id": 17, "name": "Bahrain" },
  { "id": 18, "name": "Bangladesh" },
  { "id": 19, "name": "Barbados" },
  { "id": 20, "name": "Belarus" },
  { "id": 21, "name": "Belgium" },
  { "id": 22, "name": "Belize" },
  { "id": 23, "name": "Benin" },
  { "id": 24, "name": "Bermuda" },
  { "id": 25, "name": "Bhutan" },
  { "id": 26, "name": "Bolivia" },
  { "id": 27, "name": "Bonaire, Sint Eustatius and Saba" },
  { "id": 28, "name": "Bosnia and Herzegovina" },
  { "id": 29, "name": "Botswana" },
  { "id": 30, "name": "Bouvet Island" },
  { "id": 31, "name": "Brazil" },
  { "id": 32, "name": "British Indian Ocean Territory" },
  { "id": 33, "name": "Brunei Darussalam" },
  { "id": 34, "name": "Bulgaria" },
  { "id": 35, "name": "Burkina Faso" },
  { "id": 36, "name": "Burundi" },
  { "id": 37, "name": "Cambodia" },
  { "id": 38, "name": "Cameroon" },
  { "id": 39, "name": "Canada" },
  { "id": 40, "name": "Cape Verde" },
  { "id": 41, "name": "Cayman Islands" },
  { "id": 42, "name": "Central African Republic" },
  { "id": 43, "name": "Chad" },
  { "id": 44, "name": "Chile" },
  { "id": 45, "name": "China" },
  { "id": 46, "name": "Christmas Island" },
  { "id": 47, "name": "Cocos (Keeling) Islands" },
  { "id": 48, "name": "Colombia" },
  { "id": 49, "name": "Comoros" },
  { "id": 50, "name": "Congo" },
  { "id": 51, "name": "Congo" },
  { "id": 52, "name": "Cook Islands" },
  { "id": 53, "name": "Costa Rica" },
  { "id": 54, "name": "Croatia" },
  { "id": 55, "name": "Cuba" },
  { "id": 56, "name": "Curaçao" },
  { "id": 57, "name": "Cyprus" },
  { "id": 58, "name": "Czech Republic" },
  { "id": 59, "name": "Côte D'Ivoire" },
  { "id": 60, "name": "Denmark" },
  { "id": 61, "name": "Djibouti" },
  { "id": 62, "name": "Dominica" },
  { "id": 63, "name": "Dominican Republic" },
  { "id": 64, "name": "Ecuador" },
  { "id": 65, "name": "Egypt" },
  { "id": 66, "name": "El Salvador" },
  { "id": 67, "name": "Equatorial Guinea" },
  { "id": 68, "name": "Eritrea" },
  { "id": 69, "name": "Estonia" },
  { "id": 70, "name": "Ethiopia" },
  { "id": 71, "name": "Falkland Islands (Malvinas)" },
  { "id": 72, "name": "Faroe Islands" },
  { "id": 73, "name": "Fiji" },
  { "id": 74, "name": "Finland" },
  { "id": 75, "name": "France" },
  { "id": 76, "name": "French Guiana" },
  { "id": 77, "name": "French Polynesia" },
  { "id": 78, "name": "French Southern Territories" },
  { "id": 79, "name": "Gabon" },
  { "id": 80, "name": "Gambia" },
  { "id": 81, "name": "Georgia" },
  { "id": 82, "name": "Germany" },
  { "id": 83, "name": "Ghana" },
  { "id": 84, "name": "Gibraltar" },
  { "id": 85, "name": "Greece" },
  { "id": 86, "name": "Greenland" },
  { "id": 87, "name": "Grenada" },
  { "id": 88, "name": "Guadeloupe" },
  { "id": 89, "name": "Guam" },
  { "id": 90, "name": "Guatemala" },
  { "id": 91, "name": "Guernsey" },
  { "id": 92, "name": "Guinea" },
  { "id": 93, "name": "Guinea-Bissau" },
  { "id": 94, "name": "Guyana" },
  { "id": 95, "name": "Haiti" },
  { "id": 96, "name": "Heard Island and Mcdonald Islands" },
  { "id": 97, "name": "Honduras" },
  { "id": 98, "name": "Hong Kong" },
  { "id": 99, "name": "Hungary" },
  { "id": 100, "name": "Iceland" },
  { "id": 101, "name": "India" },
  { "id": 102, "name": "Indonesia" },
  { "id": 103, "name": "Iran" },
  { "id": 104, "name": "Iraq" },
  { "id": 105, "name": "Ireland" },
  { "id": 106, "name": "Isle of Man" },
  { "id": 107, "name": "Israel" },
  { "id": 108, "name": "Italy" },
  { "id": 109, "name": "Jamaica" },
  { "id": 110, "name": "Japan" },
  { "id": 111, "name": "Jersey" },
  { "id": 112, "name": "Jordan" },
  { "id": 113, "name": "Kazakhstan" },
  { "id": 114, "name": "Kenya" },
  { "id": 115, "name": "Kiribati" },
  { "id": 116, "name": "Kuwait" },
  { "id": 117, "name": "Kyrgyzstan" },
  { "id": 118, "name": "Lao People's Democratic Republic" },
  { "id": 119, "name": "Latvia" },
  { "id": 120, "name": "Lebanon" },
  { "id": 121, "name": "Lesotho" },
  { "id": 122, "name": "Liberia" },
  { "id": 123, "name": "Libya" },
  { "id": 124, "name": "Liechtenstein" },
  { "id": 125, "name": "Lithuania" },
  { "id": 126, "name": "Luxembourg" },
  { "id": 127, "name": "Macao" },
  { "id": 128, "name": "Macedonia" },
  { "id": 129, "name": "Madagascar" },
  { "id": 130, "name": "Malawi" },
  { "id": 131, "name": "Malaysia" },
  { "id": 132, "name": "Maldives" },
  { "id": 133, "name": "Mali" },
  { "id": 134, "name": "Malta" },
  { "id": 135, "name": "Marshall Islands" },
  { "id": 136, "name": "Martinique" },
  { "id": 137, "name": "Mauritania" },
  { "id": 138, "name": "Mauritius" },
  { "id": 139, "name": "Mayotte" },
  { "id": 140, "name": "Mexico" },
  { "id": 141, "name": "Micronesia" },
  { "id": 142, "name": "Moldova" },
  { "id": 143, "name": "Monaco" },
  { "id": 144, "name": "Mongolia" },
  { "id": 145, "name": "Montenegro" },
  { "id": 146, "name": "Montserrat" },
  { "id": 147, "name": "Morocco" },
  { "id": 148, "name": "Mozambique" },
  { "id": 149, "name": "Myanmar" },
  { "id": 150, "name": "Namibia" },
  { "id": 151, "name": "Nauru" },
  { "id": 152, "name": "Nepal" },
  { "id": 153, "name": "Netherlands" },
  { "id": 154, "name": "New Caledonia" },
  { "id": 155, "name": "New Zealand" },
  { "id": 156, "name": "Nicaragua" },
  { "id": 157, "name": "Niger" },
  { "id": 158, "name": "Nigeria" },
  { "id": 159, "name": "Niue" },
  { "id": 160, "name": "Norfolk Island" },
  { "id": 161, "name": "North Korea" },
  { "id": 162, "name": "Northern Mariana Islands" },
  { "id": 163, "name": "Norway" },
  { "id": 164, "name": "Oman" },
  { "id": 165, "name": "Pakistan" },
  { "id": 166, "name": "Palau" },
  { "id": 167, "name": "Palestinian Territory" },
  { "id": 168, "name": "Panama" },
  { "id": 169, "name": "Papua New Guinea" },
  { "id": 170, "name": "Paraguay" },
  { "id": 171, "name": "Peru" },
  { "id": 172, "name": "Philippines" },
  { "id": 173, "name": "Pitcairn" },
  { "id": 174, "name": "Poland" },
  { "id": 175, "name": "Portugal" },
  { "id": 176, "name": "Puerto Rico" },
  { "id": 177, "name": "Qatar" },
  { "id": 178, "name": "Romania" },
  { "id": 179, "name": "Russia" },
  { "id": 180, "name": "Rwanda" },
  { "id": 181, "name": "Réunion" },
  { "id": 182, "name": "Saint Barthélemy" },
  { "id": 183, "name": "Saint Helena, Ascension and Tristan Da Cunha" },
  { "id": 184, "name": "Saint Kitts and Nevis" },
  { "id": 185, "name": "Saint Lucia" },
  { "id": 186, "name": "Saint Martin (French Part)" },
  { "id": 187, "name": "Saint Pierre and Miquelon" },
  { "id": 188, "name": "Saint Vincent and The Grenadines" },
  { "id": 189, "name": "Samoa" },
  { "id": 190, "name": "San Marino" },
  { "id": 191, "name": "Sao Tome and Principe" },
  { "id": 192, "name": "Saudi Arabia" },
  { "id": 193, "name": "Senegal" },
  { "id": 194, "name": "Serbia" },
  { "id": 195, "name": "Seychelles" },
  { "id": 196, "name": "Sierra Leone" },
  { "id": 197, "name": "Singapore" },
  { "id": 198, "name": "Sint Maarten (Dutch Part)" },
  { "id": 199, "name": "Slovakia" },
  { "id": 200, "name": "Slovenia" },
  { "id": 201, "name": "Solomon Islands" },
  { "id": 202, "name": "Somalia" },
  { "id": 203, "name": "South Africa" },
  { "id": 204, "name": "South Georgia" },
  { "id": 205, "name": "South Korea" },
  { "id": 206, "name": "South Sudan" },
  { "id": 207, "name": "Spain" },
  { "id": 208, "name": "Sri Lanka" },
  { "id": 209, "name": "Sudan" },
  { "id": 210, "name": "Suriname" },
  { "id": 211, "name": "Svalbard and Jan Mayen" },
  { "id": 212, "name": "Swaziland" },
  { "id": 213, "name": "Sweden" },
  { "id": 214, "name": "Switzerland" },
  { "id": 215, "name": "Syrian Arab Republic" },
  { "id": 216, "name": "Taiwan" },
  { "id": 217, "name": "Tajikistan" },
  { "id": 218, "name": "Tanzania" },
  { "id": 219, "name": "Thailand" },
  { "id": 220, "name": "Timor-Leste" },
  { "id": 221, "name": "Togo" },
  { "id": 222, "name": "Tokelau" },
  { "id": 223, "name": "Tonga" },
  { "id": 224, "name": "Trinidad and Tobago" },
  { "id": 225, "name": "Tunisia" },
  { "id": 226, "name": "Turkey" },
  { "id": 227, "name": "Turkmenistan" },
  { "id": 228, "name": "Turks and Caicos Islands" },
  { "id": 229, "name": "Tuvalu" },
  { "id": 230, "name": "Uganda" },
  { "id": 231, "name": "Ukraine" },
  { "id": 232, "name": "United Arab Emirates" },
  { "id": 233, "name": "United Kingdom" },
  { "id": 234, "name": "United States" },
  { "id": 235, "name": "United States Minor Outlying Islands" },
  { "id": 236, "name": "Uruguay" },
  { "id": 237, "name": "Uzbekistan" },
  { "id": 238, "name": "Vanuatu" },
  { "id": 239, "name": "Vatican City" },
  { "id": 240, "name": "Venezuela" },
  { "id": 241, "name": "Viet Nam" },
  { "id": 242, "name": "Virgin Islands, British" },
  { "id": 243, "name": "Virgin Islands, U.S." },
  { "id": 244, "name": "Wallis and Futuna" },
  { "id": 245, "name": "Western Sahara" },
  { "id": 246, "name": "Yemen" },
  { "id": 247, "name": "Zambia" },
  { "id": 248, "name": "Zimbabwe" },
  { "id": 249, "name": "Åland Islands" }
];

const Register = () => {
  const [formData, setFormData] = useState({
    email: '',
    nickname: '',
    password: '',
    confirmPassword: '',
    humanVerificationAnswer: '',
    ageConfirmed: false,
    isHumanVerified: false,
    countryId: ''
  });

  const [countryInput, setCountryInput] = useState('');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const countryInputRef = useRef(null);

  const suggestions = useMemo(() => {
    const q = countryInput.trim().toLowerCase();
    const list = q ? COUNTRIES.filter(c => c.name.toLowerCase().includes(q)) : COUNTRIES;
    return list.slice(0, 5);
  }, [countryInput]);

  const [verificationQuestion, setVerificationQuestion] = useState({ question: '', answer: '' });
  const [isVerificationModalOpen, setIsVerificationModalOpen] = useState(false);
  const [modalAnimation, setModalAnimation] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [register, { isLoading }] = useRegisterMutation();
  const navigate = useNavigate();

  const generateVerificationQuestion = useCallback(() => {
    const n1 = Math.floor(Math.random() * 10) + 1;
    const n2 = Math.floor(Math.random() * 10) + 1;
    setVerificationQuestion({
      question: `What is ${n1} + ${n2}?`,
      answer: (n1 + n2).toString()
    });
    setFormData(prev => ({ ...prev, humanVerificationAnswer: '' }));
  }, []);

  useEffect(() => {
    if (isVerificationModalOpen && !verificationQuestion.question) generateVerificationQuestion();
  }, [isVerificationModalOpen, verificationQuestion.question, generateVerificationQuestion]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prevState => ({ ...prevState, [name]: type === 'checkbox' ? checked : value }));
  };

  const selectCountry = (country) => {
    setCountryInput(country.name);
    setFormData(prev => ({ ...prev, countryId: String(country.id) }));
    setIsDropdownOpen(false);
    setHighlightedIndex(-1);
  };

  const handleCountryInputChange = (e) => {
    const value = e.target.value;
    setCountryInput(value);
    setIsDropdownOpen(true);
    const exact = COUNTRIES.find(c => c.name.toLowerCase() === value.trim().toLowerCase());
    setFormData(prev => ({ ...prev, countryId: exact ? String(exact.id) : '' }));
  };

  const handleCountryInputFocus = () => {
    setIsDropdownOpen(true);
  };

  const handleCountryInputBlur = () => {
    setTimeout(() => setIsDropdownOpen(false), 120);
  };

  const handleCountryKeyDown = (e) => {
    if (!isDropdownOpen && (e.key === 'ArrowDown' || e.key === 'ArrowUp')) {
      setIsDropdownOpen(true);
      return;
    }
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setHighlightedIndex(prev => Math.min(prev + 1, suggestions.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setHighlightedIndex(prev => Math.max(prev - 1, 0));
    } else if (e.key === 'Enter') {
      if (isDropdownOpen && suggestions.length && highlightedIndex >= 0) {
        e.preventDefault();
        selectCountry(suggestions[highlightedIndex]);
      } else {
        const exact = COUNTRIES.find(c => c.name.toLowerCase() === countryInput.trim().toLowerCase());
        if (exact) selectCountry(exact);
      }
    } else if (e.key === 'Escape') {
      setIsDropdownOpen(false);
    }
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

  const handleSubmit = async (e) => {
    e.preventDefault();

    let selectedCountryId = formData.countryId;
    if (!selectedCountryId && countryInput.trim()) {
      const match = COUNTRIES.find(c => c.name.toLowerCase() === countryInput.trim().toLowerCase());
      if (match) selectedCountryId = String(match.id);
    }

    if (!selectedCountryId) {
      alert('Please select a valid country from the list.');
      return;
    }

    if (!formData.email.trim() || !/^\S+@\S+\.\S+$/.test(formData.email)) {
      alert('Please enter a valid email address.');
      return;
    }
    if (!formData.nickname.trim()) {
      alert('Please enter your desired nickname.');
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
    if (!formData.isHumanVerified) {
      alert('Please complete the human verification.');
      return;
    }
    if (!formData.ageConfirmed) {
      alert('You must confirm you are 13 or older and agree to the terms.');
      return;
    }

    try {
      const payload = {
        email: formData.email,
        nickname: formData.nickname,
        password: formData.password,
        confirmPassword: formData.confirmPassword,
        countryId: Number(selectedCountryId)
      };
      await register(payload).unwrap();
      alert('Account creation successful!');
      navigate('/login');
    } catch (error) {
      let msg = 'Registration error';
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
              <input type="text" name="nickname" value={formData.nickname} onChange={handleChange} required placeholder="Your unique nickname" autoComplete="username" />
            </div>
          </div>

          <div className="flux-form-group">
            <div className="flux-input-wrapper flux-combobox">
              <input
                ref={countryInputRef}
                type="text"
                name="country"
                value={countryInput}
                onChange={handleCountryInputChange}
                onFocus={handleCountryInputFocus}
                onBlur={handleCountryInputBlur}
                onKeyDown={handleCountryKeyDown}
                placeholder="Country"
                autoComplete="off"
                required
                aria-autocomplete="list"
                aria-expanded={isDropdownOpen}
                aria-controls="country-suggestions"
              />
              {isDropdownOpen && suggestions.length > 0 && (
                <ul id="country-suggestions" className="flux-suggestions">
                  {suggestions.map((c, idx) => (
                    <li
                      key={c.id}
                      className={`flux-suggestion-item ${idx === highlightedIndex ? 'highlighted' : ''}`}
                      onMouseDown={(e) => {
                        e.preventDefault();
                        selectCountry(c);
                      }}
                      onMouseEnter={() => setHighlightedIndex(idx)}
                    >
                      {c.name}
                    </li>
                  ))}
                </ul>
              )}
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

          <button type="submit" className="flux-continue-button" aria-label="Continue" disabled={isLoading}></button>
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