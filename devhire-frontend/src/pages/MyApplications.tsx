import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../services/api";
import ApplicationTimeline from "../components/ApplicationTimeline";

interface Job {
    id: number;
    title: string;
    company: string;
    location: string;
}

interface Application {
    id: number;
    job: Job;
    status: string;
    appliedAt: string;
}

function MyApplications() {

    const [applications, setApplications] =
        useState<Application[]>([]);

    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchApplications();
    }, []);

    const fetchApplications = async () => {

        try {

            const response =
                await api.get("/applications/my");

            setApplications(response.data);

        } catch (error) {

            console.error(
                "Failed to load applications:",
                error
            );

        } finally {

            setLoading(false);

        }
    };

    const getStatusLabel = (status: string) => {

        switch (status) {

            case "UNDER_REVIEW":
                return "Under Review";

            case "SHORTLISTED":
                return "Shortlisted";

            case "INTERVIEW":
                return "Interview";

            case "OFFER":
                return "Offer";

            case "REJECTED":
                return "Rejected";

            case "APPLIED":
                return "Applied";

            default:
                return status;
        }
    };

    if (loading) {
        return (
            <div style={{ padding: "30px" }}>
                <h2>Loading applications...</h2>
            </div>
        );
    }

    return (
        <div style={{
            padding: "30px",
            maxWidth: "1000px",
            margin: "0 auto"
        }}>

            <h1>My Applications</h1>

            <p>
                Track the progress of all your job applications.
            </p>

            {applications.length === 0 ? (

                <div style={{
                    border: "1px solid #ddd",
                    padding: "40px",
                    borderRadius: "10px",
                    textAlign: "center"
                }}>

                    <h2>No Applications Yet</h2>

                    <p>
                        Start applying for jobs to track
                        your applications here.
                    </p>

                    <Link to="/jobs">
                        <button>
                            Browse Jobs
                        </button>
                    </Link>

                </div>

            ) : (

                applications.map((application) => (

                    <div
                        key={application.id}
                        style={{
                            border: "1px solid #ddd",
                            padding: "25px",
                            marginBottom: "25px",
                            borderRadius: "12px",
                            boxShadow:
                                "0 2px 8px rgba(0,0,0,0.08)"
                        }}
                    >

                        <h2>
                            {application.job.title}
                        </h2>

                        <p>
                            <strong>Company:</strong>{" "}
                            {application.job.company}
                        </p>

                        <p>
                            <strong>Location:</strong>{" "}
                            {application.job.location}
                        </p>

                        <p>
                            <strong>Status:</strong>{" "}
                            {getStatusLabel(application.status)}
                        </p>

                        <p>
                            <strong>Applied:</strong>{" "}
                            {new Date(
                                application.appliedAt
                            ).toLocaleString()}
                        </p>

                        <ApplicationTimeline
                            status={application.status}
                        />

                        <br />

                        <Link
                            to={`/applications/${application.id}`}
                        >
                            <button>
                                View Application
                            </button>
                        </Link>

                    </div>

                ))

            )}

        </div>
    );
}

export default MyApplications;