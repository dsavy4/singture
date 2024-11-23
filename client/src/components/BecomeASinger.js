// src/BecomeASinger.js
import React from 'react';
import '../styles/become-a-singer.css'; // Import CSS for the component

const BecomeASinger = () => {
    return (
        <div>
            <div style={{ height: '100px' }} /> {/* Empty space of 100px */}
            <div className="become-singer-container">
                <h1 className="header-title">Join our talented singer community</h1>
                <div className="how-it-works">
                    <h2>How it works</h2>
                    <div className="step">
                        <h3>1. Create a Gig</h3>
                        <p>
                            Sign up for free, set up your Gig, and offer your work to our global audience.
                        </p>
                    </div>
                    <div className="step">
                        <h3>2. Deliver great work</h3>
                        <p>
                            Get notified when you get an order and use our system to discuss details with customers.
                        </p>
                    </div>
                    <div className="step">
                        <h3>3. Get paid</h3>
                        <p>
                            Get paid on time, every time. Payment is available for withdrawal as soon as it clears.
                        </p>
                    </div>
                </div>
                <a href="/join" className="get-started-button">Get Started</a>
            </div>
        </div>
    );
};

export default BecomeASinger;
