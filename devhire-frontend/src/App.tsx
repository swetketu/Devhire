import { BrowserRouter, Routes, Route } from "react-router-dom";

import Navbar from "./components/Navbar";
import ProtectedRoute from "./components/ProtectedRoute";

import Login from "./pages/Login";
import Register from "./pages/Register";
import Jobs from "./pages/Jobs";

import CandidateDashboard from "./pages/CandidateDashboard";
import MyApplications from "./pages/MyApplications";
import ApplicationDetails from "./pages/ApplicationDetails";

import ResumeUpload from "./pages/ResumeUpload";
import MyResumes from "./pages/MyResumes";
import ResumeAnalysis from "./pages/ResumeAnalysis";

import RecruiterDashboard from "./pages/RecruiterDashboard";
import RecruiterJobs from "./pages/RecruiterJobs";
import RecruiterApplications from "./pages/RecruiterApplications";
import CreateJob from "./pages/CreateJob";
import EditJob from "./pages/EditJob";

import Notifications from "./pages/Notifications";


function App() {
    return (
        <BrowserRouter>

            <Navbar />

            <Routes>

                {/* Public Pages */}

                <Route
                    path="/"
                    element={<h1>Welcome to DevHire</h1>}
                />

                <Route
                    path="/login"
                    element={<Login />}
                />

                <Route
                    path="/register"
                    element={<Register />}
                />


                {/* Authenticated Pages */}

                <Route
                    path="/jobs"
                    element={
                        <ProtectedRoute>
                            <Jobs />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/candidate-dashboard"
                    element={
                        <ProtectedRoute>
                            <CandidateDashboard />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/my-applications"
                    element={
                        <ProtectedRoute>
                            <MyApplications />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/applications/:applicationId"
                    element={
                        <ProtectedRoute>
                            <ApplicationDetails />
                        </ProtectedRoute>
                    }
                />


                {/* Resume Pages */}

                <Route
                    path="/upload-resume"
                    element={
                        <ProtectedRoute>
                            <ResumeUpload />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/my-resumes"
                    element={
                        <ProtectedRoute>
                            <MyResumes />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/resumes/:resumeId/analyze"
                    element={
                        <ProtectedRoute>
                            <ResumeAnalysis />
                        </ProtectedRoute>
                    }
                />


                {/* Recruiter Pages */}

                <Route
                    path="/recruiter-dashboard"
                    element={
                        <ProtectedRoute>
                            <RecruiterDashboard />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/recruiter-jobs"
                    element={
                        <ProtectedRoute>
                            <RecruiterJobs />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/recruiter/jobs/:jobId/applications"
                    element={
                        <ProtectedRoute>
                            <RecruiterApplications />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/create-job"
                    element={
                        <ProtectedRoute>
                            <CreateJob />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/edit-job/:jobId"
                    element={
                        <ProtectedRoute>
                            <EditJob />
                        </ProtectedRoute>
                    }
                />


                {/* Notifications */}

                <Route
                    path="/notifications"
                    element={
                        <ProtectedRoute>
                            <Notifications />
                        </ProtectedRoute>
                    }
                />

            </Routes>

        </BrowserRouter>
    );
}

export default App;