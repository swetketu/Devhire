import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../services/api";

interface Candidate {
    id: number;
    name: string;
    email: string;
}

interface Application {
    id: number;
    candidate: Candidate;
    status: string;
    appliedAt: string;
}

function RecruiterApplications() {

    const { jobId } = useParams();
    const navigate = useNavigate();

    const [applications, setApplications] =
        useState<Application[]>([]);

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        if (jobId) {
            fetchApplications();
        }
    }, [jobId]);

    const fetchApplications = async () => {

        setLoading(true);
        setError("");

        try {

            const response = await api.get(
                `/applications/job/${jobId}`
            );

            setApplications(response.data);

        } catch (error) {

            console.error(
                "Failed to load applications:",
                error
            );

            setError(
                "Failed to load candidate applications"
            );

        } finally {

            setLoading(false);

        }
    };


    const updateStatus = async (
        applicationId: number,
        status: string
    ) => {

        try {

            await api.put(
                `/applications/${applicationId}/status`,
                null,
                {
                    params: {
                        status: status
                    }
                }
            );

            alert(
                `Application marked as ${status}`
            );

            fetchApplications();

        } catch (error: any) {

            console.error(error);

            alert(
                error.response?.data?.message ||
                "Failed to update application"
            );
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
        <div
            style={{
                padding: "30px",
                maxWidth: "1200px",
                margin: "0 auto"
            }}
        >

            {/* Header */}

            <div
                style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBottom: "30px"
                }}
            >

                <div>

                    <h1>Job Applications</h1>

                    <p>
                        Review candidates and manage
                        their application status.
                    </p>

                    <strong>
                        Job ID: {jobId}
                    </strong>

                </div>

                <button
                    onClick={() =>
                        navigate("/recruiter-jobs")
                    }
                >
                    Back to My Jobs
                </button>

            </div>


            {/* Error */}

            {error && (

                <div
                    style={{
                        border: "1px solid #ddd",
                        borderRadius: "10px",
                        padding: "20px",
                        marginBottom: "20px"
                    }}
                >

                    <p>{error}</p>

                    <button onClick={fetchApplications}>
                        Try Again
                    </button>

                </div>

            )}


            {/* Empty */}

            {!error &&
                applications.length === 0 && (

                    <div
                        style={{
                            border: "1px solid #ddd",
                            borderRadius: "10px",
                            padding: "40px",
                            textAlign: "center"
                        }}
                    >

                        <h2>No Applications Yet</h2>

                        <p>
                            No candidates have applied
                            for this job yet.
                        </p>

                    </div>

                )}


            {/* Applications */}

            {applications.length > 0 && (

                <div
                    style={{
                        display: "grid",
                        gridTemplateColumns:
                            "repeat(auto-fit, minmax(350px, 1fr))",
                        gap: "20px"
                    }}
                >

                    {applications.map(
                        (application) => (

                            <div
                                key={application.id}
                                style={{
                                    border: "1px solid #ddd",
                                    borderRadius: "12px",
                                    padding: "25px",
                                    boxShadow:
                                        "0 2px 8px rgba(0,0,0,0.08)"
                                }}
                            >

                                {/* Candidate */}

                                <h2>
                                    {application.candidate.name}
                                </h2>

                                <p>
                                    <strong>
                                        Email:
                                    </strong>{" "}
                                    {application.candidate.email}
                                </p>

                                <p>
                                    <strong>
                                        Applied:
                                    </strong>{" "}
                                    {new Date(
                                        application.appliedAt
                                    ).toLocaleString()}
                                </p>


                                {/* Status */}

                                <div
                                    style={{
                                        marginTop: "15px",
                                        marginBottom: "20px"
                                    }}
                                >

                                    <strong>
                                        Status:
                                    </strong>

                                    <span
                                        style={{
                                            marginLeft: "10px",
                                            padding: "6px 12px",
                                            border: "1px solid #ddd",
                                            borderRadius: "20px"
                                        }}
                                    >
                                        {getStatusLabel(
                                            application.status
                                        )}
                                    </span>

                                </div>


                                {/* Actions */}

                                <h3>
                                    Update Status
                                </h3>

                                <div
                                    style={{
                                        display: "flex",
                                        gap: "10px",
                                        flexWrap: "wrap"
                                    }}
                                >

                                    <button
                                        onClick={() =>
                                            updateStatus(
                                                application.id,
                                                "UNDER_REVIEW"
                                            )
                                        }
                                    >
                                        Review
                                    </button>

                                    <button
                                        onClick={() =>
                                            updateStatus(
                                                application.id,
                                                "SHORTLISTED"
                                            )
                                        }
                                    >
                                        Shortlist
                                    </button>

                                    <button
                                        onClick={() =>
                                            updateStatus(
                                                application.id,
                                                "INTERVIEW"
                                            )
                                        }
                                    >
                                        Interview
                                    </button>

                                    <button
                                        onClick={() =>
                                            updateStatus(
                                                application.id,
                                                "OFFER"
                                            )
                                        }
                                    >
                                        Offer
                                    </button>

                                    <button
                                        onClick={() =>
                                            updateStatus(
                                                application.id,
                                                "REJECTED"
                                            )
                                        }
                                    >
                                        Reject
                                    </button>

                                </div>

                            </div>

                        )
                    )}

                </div>

            )}

        </div>
    );
}

export default RecruiterApplications;