import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import '../css/LoginPage.css';
import Topbar from "../components/Topbar";

function Login() {
    // create variables to store form data
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState(null);
    // create a function to navigate to the home page
    const navigate = useNavigate();

    // Check if user is already logged in
    useEffect(() => {
        const token = localStorage.getItem('token');
        const user = localStorage.getItem('user');
        
        if (token && user) {
            // Check if token is expired
            try {
                const tokenData = JSON.parse(atob(token.split('.')[1]));
                const currentTime = Date.now() / 1000;
                
                if (tokenData.exp > currentTime) {
                    // Token is valid, redirect to events
                    navigate('/events');
                } else {
                    // Token is expired, clear storage
                    localStorage.removeItem('token');
                    localStorage.removeItem('user');
                }
            } catch (error) {
                // Invalid token, clear storage
                localStorage.removeItem('token');
                localStorage.removeItem('user');
            }
        }
    }, [navigate]);

    // create a function to handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault(); // ***

        // clear previous errors
        setError(null);

        // check if email and password are empty
        if (!email || !password) {
            setError("Both email and password are required.");
            return;
        }

        try {
            const response = await axios.post(`${process.env.REACT_APP_API_URL}/api/login`, {email, password});
            console.log('Login successful:', response.data);

            localStorage.setItem('token', response.data.token); // store token
            localStorage.setItem('user', JSON.stringify(response.data.user)); // store user info
            
            navigate('/events');
        } catch (err) {
            console.error(err);
            alert(err.response?.data?.message || err.message); // ***
        }
    };

    return (
        <div className="app-container">
            <Topbar />
            <div className="content">
                <div className="login-container">
                    <h2>Login</h2>
                    <form onSubmit={handleSubmit}>
                    <div className="input-group">
                            <label>
                                Email:
                                <span className="required-star">*</span>
                            </label>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                placeholder="Enter your email"
                            />
                        </div>

                        <div className="input-group">
                            <label>
                                Password:
                                <span className="required-star">*</span>
                            </label>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                placeholder="Enter your password"
                            />
                        </div>
                        {error && <p className="error-message">{error}</p>}

                        <button type="submit">Login</button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Login;
