import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

function Login() {

    const navigate = useNavigate();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const handleLogin = async (e: React.FormEvent) => {

        e.preventDefault();

        try {

            const response = await api.post("/auth/login", {
                email,
                password
            });

            localStorage.setItem("token", response.data);

            alert("Login successful");

            navigate("/jobs");

        } catch (error) {

            alert("Invalid email or password");

        }
    };

    return (
        <div>
            <h1>DevHire Login</h1>

            <form onSubmit={handleLogin}>

                <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />

                <br />

                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />

                <br />

                <button type="submit">
                    Login
                </button>

                <button onClick={() => navigate("/register")}>
                    Create an account
                </button>

            </form>
        </div>
    );
}

export default Login;