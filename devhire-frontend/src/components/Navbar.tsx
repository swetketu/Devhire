import { Link } from "react-router-dom";

function Navbar() {

    const token = localStorage.getItem("token");

    let role = "";

    if (token) {
        try {
            role = JSON.parse(
                atob(token.split(".")[1])
            ).role;
        } catch {}
    }

    return (
        <nav
            style={{
                padding: "15px",
                borderBottom: "1px solid #ddd",
                display: "flex",
                gap: "15px"
            }}
        >

            <Link to="/">DevHire</Link>

            {token && (
                <>
                    <Link to="/jobs">
                        Jobs
                    </Link>

                    <Link to="/notifications">
                        Notifications
                    </Link>
                </>
            )}

            {role === "CANDIDATE" && (
                <>
                    <Link to="/candidate-dashboard">
                        Dashboard
                    </Link>

                    <Link to="/my-applications">
                        Applications
                    </Link>

                    <Link to="/my-resumes">
                        Resumes
                    </Link>
                </>
            )}

            {role === "RECRUITER" && (
                <>
                    <Link to="/recruiter-dashboard">
                        Dashboard
                    </Link>

                    <Link to="/recruiter-jobs">
                        My Jobs
                    </Link>

                    <Link to="/create-job">
                        Create Job
                    </Link>
                </>
            )}

            {!token && (
                <>
                    <Link to="/login">
                        Login
                    </Link>

                    <Link to="/register">
                        Register
                    </Link>
                </>
            )}

            {token && (
                <button
                    onClick={() => {
                        localStorage.removeItem("token");
                        window.location.href="/login";
                    }}
                >
                    Logout
                </button>
            )}

        </nav>
    );
}

export default Navbar;