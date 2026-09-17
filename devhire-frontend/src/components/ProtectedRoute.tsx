import { Navigate } from "react-router-dom";

interface ProtectedRouteProps {
    children: React.ReactNode;
    allowedRole?: string;
}

function ProtectedRoute({
                            children,
                            allowedRole
                        }: ProtectedRouteProps) {

    const token = localStorage.getItem("token");

    if (!token) {
        return <Navigate to="/login" replace />;
    }

    let role: string | null = null;

    try {
        const payload = JSON.parse(
            atob(token.split(".")[1])
        );

        role = payload.role;
    } catch (error) {
        localStorage.removeItem("token");
        return <Navigate to="/login" replace />;
    }

    if (allowedRole && role !== allowedRole) {
        if (role === "CANDIDATE") {
            return <Navigate to="/candidate-dashboard" replace />;
        }

        if (role === "RECRUITER") {
            return <Navigate to="/recruiter-dashboard" replace />;
        }

        return <Navigate to="/login" replace />;
    }

    return children;
}

export default ProtectedRoute;