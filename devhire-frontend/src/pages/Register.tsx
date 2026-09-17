import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

function Register() {
    const navigate = useNavigate();

    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            await api.post("/auth/register", {
                name,
                email,
                password
            });

            alert("Registration successful! Please login.");
            navigate("/login");

        } catch (error: any) {
            console.error("Register error:", error);

            alert(
                error.response?.data?.message ||
                "Registration failed"
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ padding: "30px", maxWidth: "500px" }}>
            <h1>Create DevHire Account</h1>

            <form onSubmit={handleRegister}>

                <div>
                    <label>Name</label>
                    <br />
                    <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Enter your name"
                        required
                    />
                </div>

                <br />

                <div>
                    <label>Email</label>
                    <br />
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Enter email"
                        required
                    />
                </div>

                <br />

                <div>
                    <label>Password</label>
                    <br />
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Enter password"
                        required
                    />
                </div>

                <br />

                <button type="submit" disabled={loading}>
                    {loading ? "Creating Account..." : "Register"}
                </button>
            </form>

            <br />

            <button onClick={() => navigate("/login")}>
                Already have an account? Login
            </button>
        </div>
    );
}

export default Register;