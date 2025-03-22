import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import '../css/LoginPage.css';

function Login() {
    // create variables to store form data
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState(null);
    // create a function to navigate to the home page
    const navigate = useNavigate();

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
            const response = await axios.post("http://localhost:3001/api/login", {email, password});
            console.log('Login successful:', response.data);
            navigate('/events');
        } catch (err) {
            console.error(err);
            alert(err.response?.data?.message || err.message); // ***
        }
    };

    return (
        <div className="login-container">
            <h2>Login</h2>
            <form onSubmit={handleSubmit}>
            <div className="input-group">
                    <label>Email:</label>
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        placeholder="Enter your email"
                    />
                </div>

                <div className="input-group">
                    <label>Password:</label>
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
    );
};

export default Login;