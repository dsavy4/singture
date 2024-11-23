import React from 'react';
import AuthForm from '../components/AuthForm';

const SignIn = () => {
    return <AuthForm isSignIn={true} />; // Pass true for sign in
};

export default SignIn;
