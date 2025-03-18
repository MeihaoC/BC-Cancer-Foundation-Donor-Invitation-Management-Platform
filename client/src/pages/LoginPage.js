import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function Login() {
    // create variables to store form data
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    // create a function to navigate to the home page
    const navigate = useNavigate();

    // create a function to handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault(); // ***

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
        <div>
            <h2>Login</h2>
            <form onSubmit={handleSubmit}>
                <label>Email:</label>
                <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />

                <label>Password:</label>
                <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />

                <button type="submit">Login</button>
            </form>
        </div>
    );
};

export default Login;