import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../styles/auth.scss";
import "./ForgotPassword.scss";
import { useLoginMutation } from "../../../services/auth/authApi";
import { useDispatch } from "react-redux";
import { setUser } from "../../../store/reduserSlises/userSlice";
import { userApi } from "../../../services/user/userApi";

const Login = () => {
  const dispatch = useDispatch();

  const [formData, setFormData] = useState({
    identity: "",
    password: "",
    rememberMe: false,
  });
  const [showPassword, setShowPassword] = useState(false);
  const [login, { isLoading }] = useLoginMutation();
  const navigate = useNavigate();

  const [isResetModalOpen, setResetModalOpen] = useState(false);
  const [seconds, setSeconds] = useState(60);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.identity.trim() || !formData.password) {
      alert("Please enter your login/email and password.");
      return;
    }

    try {
      const payload = { email: formData.identity, password: formData.password };
      const res = await login(payload).unwrap();
      const { accessToken, refreshToken } = res.payload || {};
      if (accessToken) localStorage.setItem("accessToken", accessToken);
      if (refreshToken) localStorage.setItem("refreshToken", refreshToken);

      // Після логіну — отримати профіль і оновити user
      dispatch(userApi.util.resetApiState());
      const profileRes = await dispatch(
        userApi.endpoints.getProfile.initiate()
      ).unwrap();
      if (profileRes.payload) {
        dispatch(setUser(profileRes.payload));
      }

      navigate("/store");
    } catch (error) {
      let msg = "Login failed. Please try again.";
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

  const openResetModal = (e) => {
    e.preventDefault();
    setResetModalOpen(true);
    setSeconds(60);
  };

  const handleResendLink = () => {
    if (seconds > 0) return;
    setSeconds(60);
  };

  useEffect(() => {
    if (!isResetModalOpen || seconds <= 0) return;
    const t = setInterval(() => setSeconds((s) => s - 1), 1000);
    return () => clearInterval(t);
  }, [isResetModalOpen, seconds]);

  useEffect(() => {
    const onKey = (e) => e.key === "Escape" && setResetModalOpen(false);
    if (isResetModalOpen) window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [isResetModalOpen]);

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
                placeholder="Nickname or Email"
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
              <a href="#" className="flux-link" onClick={openResetModal}>
                Forgot password?
              </a>
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
          New to Flux?{" "}
          <Link to="/register" className="flux-link">
            Create an account
          </Link>
        </div>
      </div>

      {isResetModalOpen && (
        <div
          className="flux-modal-overlay modal-enter"
          role="dialog"
          aria-modal="true"
          onClick={() => setResetModalOpen(false)}
        >
          <div
            className="flux-modal-content reset-sent-modal"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="flux-modal-close"
              aria-label="Close modal"
              onClick={() => setResetModalOpen(false)}
              type="button"
              title="Close"
            >
              ×
            </button>

            <h3>Password Reset Sent</h3>

            <p>
              A secure recovery link has been dispatched to your email. Please
              check your inbox (and spam folder) to begin restoring access to
              your Flux account.
            </p>

            <p className="flux-reset-hint">
              Didn’t get the message? You can request a new link in
              <span className="flux-countdown"> {seconds}</span> seconds.
            </p>

            <button
              type="button"
              className="flux-request-link-button"
              onClick={handleResendLink}
              disabled={seconds > 0}
              aria-label="Request a new link"
              title={seconds > 0 ? `Wait ${seconds}s` : "Request a new link"}
            >
              Request a new link
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Login;
