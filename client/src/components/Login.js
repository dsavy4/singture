import React from 'react';
import { FaGoogle } from 'react-icons/fa';
import { MdEmail } from 'react-icons/md'; 
import { FaApple } from 'react-icons/fa'; // Import Apple icon
import { FaFacebook } from 'react-icons/fa'; // Import Facebook icon
import '../styles/login.css'; 
import loginImage from '../assets/images/login.jpg'; 

const Login = () => {
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
                    <h1 className="login-title">Sign in to your account</h1>
                    <p className="join-message">
                        Don’t have an account? <span role="button" className="join-link">Join here</span>
                    </p>
                    <button className="login-button google-signin-button">
                        <span className="provider-icon" aria-hidden="true"><FaGoogle /></span>
                        <p>Google</p>
                    </button>
                    <button className="login-button email-signin-button">
                        <span className="provider-icon" aria-hidden="true"><MdEmail /></span>
                        <p>Email/Username</p>
                    </button>
                    
                    <strong className="login-or">OR</strong>
                    
                    <section className="flex-buttons">
                        <div className="button-container">
                            <button className="login-button apple-signin-button">
                                <span className="provider-icon" aria-hidden="true"><FaApple /></span>
                                <p>Apple</p>
                            </button>
                        </div>
                        <div className="button-container">
                            <button className="login-button facebook-signin-button">
                                <span className="provider-icon" aria-hidden="true"><FaFacebook /></span>
                                <p>Facebook</p>
                            </button>
                        </div>
                    </section>
                    <p className="login-disclaimer">
                        By joining, you agree to the Singture Terms of Service and to occasionally receive emails from us. 
                        Please read our <a href="/privacy-policy" className="privacy-link">Privacy Policy</a> to learn how we use your personal data.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Login;
