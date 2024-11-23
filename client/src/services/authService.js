import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL; 

// Login function
export const loginUser = async (email, password) => {
    try {
        const response = await axios.post(`${API_URL}/users/login`, {
            email,
            password,
        });

        if (response.data.status === 1) { // Success
            return { success: true, token: response.data.token, userInfo: response.data };
        } else {
            return { success: false, error: 'Login failed. Please check your credentials.' };
        }
    } catch (error) {
        console.error('Login failed:', error);
        return { success: false, error: 'Login failed. Please check your credentials and try again.' };
    }
};

// Register function
export const registerUser = async (email, password) => {
    try {
        const response = await axios.post(`${API_URL}/users/register`, {
            email,
            password,
        });

        if (response.data.status === 1 || response.data.status === 2) { // Success
            return { success: true, token: response.data.token, email };
        } else {
            return { success: false, error: 'Registration failed. Please try again.' };
        }
    } catch (error) {
        console.error('Registration failed:', error);
        return { success: false, error: 'Registration failed. Please try again.' };
    }
};
