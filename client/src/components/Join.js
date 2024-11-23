import React, { useState } from 'react';
import AuthForm from '../components/AuthForm';

const Join = () => {
    const [error, setError] = useState("");

    const validatePassword = (password) => {
        const minLength = /.{8,}/;
        const upperCase = /[A-Z]/;
        const lowerCase = /[a-z]/;
        const number = /\d/;

        if (!minLength.test(password)) {
            return "Password must be at least 8 characters long.";
        }
        if (!upperCase.test(password)) {
            return "Password must contain at least one uppercase letter.";
        }
        if (!lowerCase.test(password)) {
            return "Password must contain at least one lowercase letter.";
        }
        if (!number.test(password)) {
            return "Password must contain at least one number.";
        }

        return "Password is valid.";
    };

    const handleEmailSubmit = ({ email, password }) => {
        const validationMessage = validatePassword(password);
        if (validationMessage !== "Password is valid.") {
            setError(validationMessage);
        } else {
            setError(""); // Clear any previous error
            console.log('Email:', email);
            console.log('Password:', password);
            // You can navigate to the next step or perform an API call here
        }
    };

    return (
        <div>
            <AuthForm isSignIn={false} onEmailSubmit={handleEmailSubmit} />
            {error && <div style={{ color: 'red' }}>{error}</div>}
        </div>
    );
};

export default Join;
