import React, { useState, useEffect, useCallback } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../styles/auth.scss";
import { useRegisterMutation } from "../../../services/auth/authApi";
import { useGetAllCountrysQuery } from "../../../services/country/countryApi";
import Select from "react-select";
import { countrySelectStyles } from "../register/Register";

const RegisterManager = () => {
  const {
    data: { payload: countries } = { payload: [] },
    isLoading: isLoadingCountries,
  } = useGetAllCountrysQuery();

  const [formData, setFormData] = useState({
    email: "",
    nickname: "",
    password: "",
    confirmPassword: "",
    humanVerificationAnswer: "",
    ageConfirmed: false,
    isHumanVerified: false,
    countryId: "",
  });

  // country select state
  const [selectedCountry, setSelectedCountry] = useState(null);

  const [verificationQuestion, setVerificationQuestion] = useState({
    question: "",
    answer: "",
  });
  const [isVerificationModalOpen, setIsVerificationModalOpen] = useState(false);
  const [modalAnimation, setModalAnimation] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [register, { isLoading }] = useRegisterMutation();
  const navigate = useNavigate();

  const generateVerificationQuestion = useCallback(() => {
    const n1 = Math.floor(Math.random() * 10) + 1;
    const n2 = Math.floor(Math.random() * 10) + 1;
    setVerificationQuestion({
      question: `What is ${n1} + ${n2}?`,
      answer: (n1 + n2).toString(),
    });
    setFormData((prev) => ({ ...prev, humanVerificationAnswer: "" }));
  }, []);

  useEffect(() => {
    if (isVerificationModalOpen && !verificationQuestion.question)
      generateVerificationQuestion();
  }, [
    isVerificationModalOpen,
    verificationQuestion.question,
    generateVerificationQuestion,
  ]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleOpenVerificationModal = () => {
    if (!formData.isHumanVerified) {
      generateVerificationQuestion();
      setModalAnimation("modal-enter");
      setIsVerificationModalOpen(true);
    }
  };

  const handleCloseVerificationModal = () => {
    setModalAnimation("modal-exit");
    setTimeout(() => setIsVerificationModalOpen(false), 300);
  };

  const handleVerifyHuman = () => {
    if (
      formData.humanVerificationAnswer.trim() === verificationQuestion.answer
    ) {
      setFormData((prev) => ({ ...prev, isHumanVerified: true }));
      handleCloseVerificationModal();
    } else {
      alert("Incorrect answer. Please try again.");
      generateVerificationQuestion();
    }
  };

  const handleCountrySelect = (option) => {
    setSelectedCountry(option);
    setFormData((prev) => ({
      ...prev,
      countryId: option ? String(option.value) : "",
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    let selectedCountryId = formData.countryId;
    if (!selectedCountryId && selectedCountry) {
      selectedCountryId = String(selectedCountry.value);
    }
    if (!selectedCountryId) {
      alert("Please select a valid country from the list.");
      return;
    }

    if (!formData.email.trim() || !/^\S+@\S+\.\S+$/.test(formData.email)) {
      alert("Please enter a valid email address.");
      return;
    }
    if (!formData.nickname.trim()) {
      alert("Please enter your desired nickname.");
      return;
    }
    if (formData.password.length < 8) {
      alert("Password must be at least 8 characters long.");
      return;
    }
    if (formData.password !== formData.confirmPassword) {
      alert("Passwords do not match.");
      return;
    }
    if (!formData.isHumanVerified) {
      alert("Please complete the human verification.");
      return;
    }
    if (!formData.ageConfirmed) {
      alert("You must confirm you are 13 or older and agree to the terms.");
      return;
    }

    try {
      const payload = {
        email: formData.email,
        nickname: formData.nickname,
        password: formData.password,
        confirmPassword: formData.confirmPassword,
        countryId: Number(selectedCountryId),
        isManager: true,
      };
      await register(payload).unwrap();
      alert("Account creation successful!");
      navigate("/login");
    } catch (error) {
      let msg = "Registration error";
      if (error?.data) {
        if (typeof error.data === "string") msg = error.data;
        else if (error.data.message) msg = error.data.message;
        else if (error.data.errors) {
          const arr = Object.values(error.data.errors).flat();
          if (arr.length) msg = arr[0];
        }
      }
      alert(msg);
    }
  };

  if (isLoadingCountries) {
    return (
      <div className="flux-auth-container">
        <div className="flux-auth-box register">
          <div className="flux-header">
            <h2>Loading countries...</h2>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flux-auth-container">
      <div className="flux-auth-box register">
        <div className="flux-header">
          <h2>Create an Account as Game Manager</h2>
        </div>

        <form onSubmit={handleSubmit} noValidate>
          <div className="flux-form-group">
            <div className="flux-input-wrapper">
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                placeholder="your.email@example.com"
                autoComplete="email"
              />
            </div>
          </div>

          <div className="flux-form-group">
            <div className="flux-input-wrapper">
              <input
                type="text"
                name="nickname"
                value={formData.nickname}
                onChange={handleChange}
                required
                placeholder="Your unique nickname"
                autoComplete="username"
              />
            </div>
          </div>

          <div className="flux-form-group">
            <div className="flux-input-wrapper">
              <Select
                name="countryId"
                options={countries.map((c) => ({ value: c.id, label: c.name }))}
                value={selectedCountry}
                onChange={handleCountrySelect}
                styles={countrySelectStyles}
                placeholder="Select your country"
                isLoading={isLoadingCountries}
                isClearable
                required
              />
            </div>
          </div>

          <div className="flux-form-group">
            <div className="flux-input-wrapper">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                placeholder="Your password"
                autoComplete="new-password"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="toggle-password-visibility"
              >
                <img
                  src={
                    showPassword
                      ? "/authbc/eyeClosed.svg"
                      : "/authbc/EyeOpen.svg"
                  }
                  alt="Toggle password visibility"
                />
              </button>
            </div>
          </div>

          <div className="flux-form-group">
            <div className="flux-input-wrapper">
              <input
                type={showConfirmPassword ? "text" : "password"}
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
                placeholder="Confirm password"
                autoComplete="new-password"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="toggle-password-visibility"
              >
                <img
                  src={
                    showConfirmPassword
                      ? "/authbc/eyeClosed.svg"
                      : "/authbc/EyeOpen.svg"
                  }
                  alt="Toggle password visibility"
                />
              </button>
            </div>
          </div>

          <div
            className={`flux-captcha-box ${
              formData.isHumanVerified ? "verified" : ""
            }`}
            onClick={handleOpenVerificationModal}
          >
            <div className="flux-captcha-checkbox"></div>
            <span className="flux-captcha-label">
              {formData.isHumanVerified
                ? "Verification Complete"
                : "I'm not a robot"}
            </span>
          </div>

          <div className="flux-legal-text">
            <input
              type="checkbox"
              id="ageConfirmed"
              name="ageConfirmed"
              checked={formData.ageConfirmed}
              onChange={handleChange}
              required
            />
            <label htmlFor="ageConfirmed">
              By pressing the button below you confirm that you are at least 13 years old, agree to the{" "}
              <Link to="/terms" className="flux-link">
                Subscriber Agreement
              </Link>{" "}
              and the{" "}
              <Link to="/privacy" className="flux-link">
                Privacy Policy
              </Link>
              . As a Game Manager, you also agree to comply with all applicable laws and regulations, and acknowledge that your account may be subject to additional review and requirements.
            </label>
          </div>

          <button
            type="submit"
            className="flux-continue-button"
            aria-label="Continue"
            disabled={isLoading}
          ></button>
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
                if (e.key === "Enter") {
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

export default RegisterManager;
