import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaArrowLeft } from 'react-icons/fa';
import { MdEmail } from 'react-icons/md';
import { AiFillCheckCircle, AiFillCloseCircle } from 'react-icons/ai';
import { loginUser, registerUser } from "../services/authService"
import '../styles/login.css';
import loginImage from '../assets/images/login.jpg';
import { useAuth } from '../contexts/AuthContext';


const AuthForm = ({ isSignIn }) => {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [step, setStep] = useState(1);
    const [isPasswordVisible, setIsPasswordVisible] = useState(false);
    const [isSignUp, setIsSignUp] = useState(!isSignIn);
    const [error, setError] = useState(''); // Initialize error state here
    const [passwordValidations, setPasswordValidations] = useState({
        length: false,
        uppercase: false,
        lowercase: false,
        number: false,
    });
    const [showValidations, setShowValidations] = useState(false);
    const { login } = useAuth();

    const handleBack = () => {
        if (step === 1) {
            navigate('/login');
        } else {
            setStep(1);
        }
    };

    const validatePassword = (password) => {
        setPasswordValidations({
            length: password.length >= 8,
            uppercase: /[A-Z]/.test(password),
            lowercase: /[a-z]/.test(password),
            number: /[0-9]/.test(password),
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (step === 1) {
            setStep(2);
        } else {
            setShowValidations(true);
            if (!passwordValidations.length || !passwordValidations.uppercase || !passwordValidations.lowercase || !passwordValidations.number) {
                return;
            }

            if (isSignIn) {
                // Handle login
                await handleLogin(email, password);
            } else {
                // Handle registration
                await handleRegister(email, password);
            }
        }
    };

    const handleLogin = async (email, password) => {
        const { success, token, userInfo, error } = await loginUser(email, password);

        if (success) {
            await login({ token, userInfo });
            navigate('/dashboard');
        } else {
            setError(error); // Show error message
        }
    };

    const handleRegister = async (email, password) => {
        const { success, token, email: registeredEmail, error } = await registerUser(email, password);

        if (success) {
            await login({ token, email: registeredEmail });
            navigate('/dashboard');
        } else {
            setError(error); // Show error message
        }
    };

    const handleTogglePassword = () => {
        setIsPasswordVisible(!isPasswordVisible);
    };

    return (
        <div className="login-container">
            <div className="login-box">
                <div className="login-background">
                    <img src={loginImage} alt="Singing and Music" />
                    <div className="overlay-content">
                        <h1 className="overlay-title">Singture starts here</h1>
                        <div className="subheading"><span className="checkmark">✔️</span> High-quality custom songs</div>
                        <div className="subheading"><span className="checkmark">✔️</span> Access to professional singers</div>
                        <div className="subheading"><span className="checkmark">✔️</span> Fast turnaround on requests</div>
                    </div>
                </div>
                <div className="login-form-container">
                    {step === 2 && (
                        <button className="back-button" onClick={handleBack}>
                            <FaArrowLeft /> Back
                        </button>
                    )}

                    {step === 1 && (
                        <>
                            <h1 className="login-title">{isSignUp ? 'Create an Account' : 'Sign in to your account'}</h1>
                            {isSignUp && (
                                <p className="toggle-auth">
                                    Already have an account?  
                                    <span 
                                        role="button" 
                                        className="sign-in-link" 
                                        onClick={() => setIsSignUp(!isSignUp)} 
                                        tabIndex={0} 
                                        onKeyPress={(e) => e.key === 'Enter' && setIsSignUp(!isSignUp)}
                                    >
                                         Sign In
                                    </span>
                                </p>
                            )}
                            <button className="login-button email-signin-button" onClick={() => setStep(2)}>
                                <span className="provider-icon" aria-hidden="true"><MdEmail /></span>
                                <p>Email/Username</p>
                            </button>
                        </>
                    )}

                    {step === 2 && (
                        <form onSubmit={handleSubmit}>
                            <h4 className="continue-title">Continue with your email</h4>
                            <input 
                                type="email" 
                                placeholder="Email" 
                                value={email} 
                                onChange={(e) => setEmail(e.target.value)} 
                                required 
                            />
                            <div className="password-container">
                                <input 
                                    type={isPasswordVisible ? 'text' : 'password'} 
                                    placeholder="Password" 
                                    value={password} 
                                    onChange={(e) => {
                                        setPassword(e.target.value);
                                        validatePassword(e.target.value);
                                    }} 
                                    required 
                                />
                                <button 
                                    type="button" 
                                    className="toggle-password" 
                                    onClick={handleTogglePassword}
                                >
                                    {isPasswordVisible ? '🙈' : '👁️'}
                                </button>
                            </div>

                            {isSignUp && showValidations && (
                                <ul className="validation-list" style={{ listStyleType: 'none', padding: 0 }}>
                                    <li className="validation-item">
                                        {passwordValidations.length ? (
                                            <AiFillCheckCircle className="icon valid-icon" style={{ color: '#1dbf73' }} />
                                        ) : (
                                            <AiFillCloseCircle className="icon invalid-icon" style={{ color: 'gray' }} />
                                        )}
                                        <span style={{ color: passwordValidations.length ? '#1dbf73' : 'inherit', textDecoration: passwordValidations.length ? 'line-through' : 'none' }}>
                                            At least 8 characters
                                        </span>
                                    </li>
                                    <li className="validation-item">
                                        {passwordValidations.uppercase ? (
                                            <AiFillCheckCircle className="icon valid-icon" style={{ color: '#1dbf73' }} />
                                        ) : (
                                            <AiFillCloseCircle className="icon invalid-icon" style={{ color: 'gray' }} />
                                        )}
                                        <span style={{ color: passwordValidations.uppercase ? '#1dbf73' : 'inherit', textDecoration: passwordValidations.uppercase ? 'line-through' : 'none' }}>
                                            At least 1 uppercase letter
                                        </span>
                                    </li>
                                    <li className="validation-item">
                                        {passwordValidations.lowercase ? (
                                            <AiFillCheckCircle className="icon valid-icon" style={{ color: '#1dbf73' }} />
                                        ) : (
                                            <AiFillCloseCircle className="icon invalid-icon" style={{ color: 'gray' }} />
                                        )}
                                        <span style={{ color: passwordValidations.lowercase ? '#1dbf73' : 'inherit', textDecoration: passwordValidations.lowercase ? 'line-through' : 'none' }}>
                                            At least 1 lowercase letter
                                        </span>
                                    </li>
                                    <li className="validation-item">
                                        {passwordValidations.number ? (
                                            <AiFillCheckCircle className="icon valid-icon" style={{ color: '#1dbf73' }} />
                                        ) : (
                                            <AiFillCloseCircle className="icon invalid-icon" style={{ color: 'gray' }} />
                                        )}
                                        <span style={{ color: passwordValidations.number ? '#1dbf73' : 'inherit', textDecoration: passwordValidations.number ? 'line-through' : 'none' }}>
                                            At least 1 number
                                        </span>
                                    </li>
                                </ul>
                            )}
                            
                            {error && (
                                <div className="error-message">
                                    {error}
                                </div>
                            )}


                            <button type="submit" className="login-button">Continue</button>
                        </form>
                    )}

                    <p className="login-disclaimer">
                        By joining, you agree to the Singture <a href="/terms-of-service" className="privacy-link">Terms of Service</a> and to occasionally receive emails from us.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default AuthForm;