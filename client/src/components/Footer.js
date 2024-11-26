import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/footer.css'; // Ensure this file is correctly linked
import logo from '../assets/images/logo_text.png'; // Ensure logo path is correct

const Footer = () => {
    return (
        <footer className="footer">
            <div className="footer-content">
                {/* Logo Section */}
                <div className="footer-logo">
                    <img src={logo} alt="Logo" className="logo-img" />
                    <p>Connect through music, unleash your creativity</p>
                </div>

                {/* Links Section */}
                <div className="footer-links">
                    <h4>Explore</h4>
                    <ul>
                        <li><Link to="/terms-of-service">Terms of Service</Link></li>
                        <li><Link to="/privacy-policy">Privacy Policy</Link></li>
                        <li><Link to="/about">About Us</Link></li>
                        <li><Link to="/contact">Contact</Link></li>
                    </ul>
                </div>

                {/* Social Media Section */}
                <div className="footer-social">
                    <h4>Connect with Us</h4>
                    <div className="social-icons">
                        <a href="https://www.facebook.com" target="_blank" rel="noopener noreferrer">
                            <i className="fab fa-facebook-f"></i>
                        </a>
                        <a href="https://www.twitter.com" target="_blank" rel="noopener noreferrer">
                            <i className="fab fa-twitter"></i>
                        </a>
                        <a href="https://www.instagram.com" target="_blank" rel="noopener noreferrer">
                            <i className="fab fa-instagram"></i>
                        </a>
                        <a href="https://www.linkedin.com" target="_blank" rel="noopener noreferrer">
                            <i className="fab fa-linkedin-in"></i>
                        </a>
                        {/* YouTube Link */}
                        <a href="https://www.youtube.com/@singture/videos" target="_blank" rel="noopener noreferrer">
                            <i className="fab fa-youtube"></i>
                        </a>
                    </div>
                </div>
            </div>

            <div className="footer-bottom">
                <p>&copy; {new Date().getFullYear()} Singture. All rights reserved.</p>
            </div>
        </footer>
    );
};

export default Footer;
