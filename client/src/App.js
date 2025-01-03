import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom'; // Import Navigate for redirection
import { AuthProvider, useAuth } from './contexts/AuthContext'; // Import the AuthProvider and useAuth hook
import Header from './components/Header';
import BecomeASinger from './components/BecomeASinger';
import SignIn from './components/SignIn';
import Join from './components/Join';
import TermsOfService from './components/TermsOfService';
import Dashboard from './components/Dashboard';
import Profile from './components/Profile';
import Feedback from './components/Feedback';
import PrivacyPolicy from './components/PrivacyPolicy';
import Homepage from './components/Homepage';
import Footer from './components/Footer';
import ReferFriend from './components/ReferFriend';

const App = () => {
    return (
        <AuthProvider>
            <Router>
                <Header />
                <Routes>
                    <Route path="/" element={<Homepage />} />
                    <Route path="/become-a-singer" element={<BecomeASinger />} />
                    <Route path="/join" element={<Join />} />
                    <Route path="/terms-of-service" element={<TermsOfService />} />
                    <Route path="/privacy-policy" element={<PrivacyPolicy />} />
                    <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>}  />
                    <Route path="/feedback" element={<ProtectedRoute><Feedback /></ProtectedRoute>}  />
                    <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
                    <Route path="/referral" element={<ProtectedRoute><ReferFriend /></ProtectedRoute>} />
                    <Route 
                        path="/sign-in" 
                        element={<SignIn />} 
                    />
                    <Route 
                        path="*" 
                        element={<h2>404 - Page Not Found</h2>} // Fallback 404 Route
                    />
                </Routes>
                <Footer />
            </Router>
        </AuthProvider>
    );
};

// ProtectedRoute component for handling redirection
const ProtectedRoute = ({ children }) => {
    const { isAuthenticated } = useAuth(); // Check the authentication state from context

    if (!isAuthenticated) {
        // Redirect user to sign-in page if not authenticated
        return <Navigate to="/sign-in" replace />;
    }

    return children;
};

export default App;
