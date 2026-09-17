import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

interface Job {
    id: number;
    title: string;
    company: string;
    location: string;
    description: string;
    salary: string;
    requiredSkills: string;
    employmentType: string;
}

function RecruiterJobs() {

    const navigate = useNavigate();

    const [jobs, setJobs] = useState<Job[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        fetchJobs();
    }, []);

    const fetchJobs = async () => {

        setLoading(true);
        setError("");

        try {

            const response = await api.get("/jobs/my");

            setJobs(response.data);

        } catch (error) {

            console.error(
                "Failed to load jobs:",
                error
            );

            setError("Failed to load your jobs");

        } finally {

            setLoading(false);

        }
    };


    const deleteJob = async (jobId: number) => {

        const confirmed = window.confirm(
            "Are you sure you want to delete this job?"
        );

        if (!confirmed) {
            return;
        }

        try {

            await api.delete(`/jobs/${jobId}`);

            alert("Job deleted successfully!");

            fetchJobs();

        } catch (error: any) {

            console.error(error);

            alert(
                error.response?.data?.message ||
                "Failed to delete job"
            );
        }
    };


    if (loading) {

        return (
            <div style={{ padding: "30px" }}>
                <h2>Loading your jobs...</h2>
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

                    <h1>My Jobs</h1>

                    <p>
                        Manage your job postings and
                        review candidates.
                    </p>

                </div>

                <button
                    onClick={() =>
                        navigate("/create-job")
                    }
                >
                    + Create Job
                </button>

            </div>


            {/* Error */}

            {error && (

                <div>

                    <p>{error}</p>

                    <button onClick={fetchJobs}>
                        Try Again
                    </button>

                </div>

            )}


            {/* Empty State */}

            {!error && jobs.length === 0 && (

                <div
                    style={{
                        border: "1px solid #ddd",
                        borderRadius: "10px",
                        padding: "40px",
                        textAlign: "center"
                    }}
                >

                    <h2>No Jobs Yet</h2>

                    <p>
                        You haven't created any job postings.
                    </p>

                    <button
                        onClick={() =>
                            navigate("/create-job")
                        }
                    >
                        Create Your First Job
                    </button>

                </div>

            )}


            {/* Job List */}

            {jobs.length > 0 && (

                <div
                    style={{
                        display: "grid",
                        gridTemplateColumns:
                            "repeat(auto-fit, minmax(350px, 1fr))",
                        gap: "20px"
                    }}
                >

                    {jobs.map((job) => (

                        <div
                            key={job.id}
                            style={{
                                border: "1px solid #ddd",
                                borderRadius: "12px",
                                padding: "25px",
                                boxShadow:
                                    "0 2px 8px rgba(0,0,0,0.08)"
                            }}
                        >

                            <h2>{job.title}</h2>

                            <h3>{job.company}</h3>

                            <p>
                                📍 {job.location}
                            </p>

                            <p>
                                💼 {job.employmentType}
                            </p>

                            <p>
                                💰 {job.salary}
                            </p>

                            <p>
                                <strong>
                                    Required Skills:
                                </strong>{" "}
                                {job.requiredSkills}
                            </p>

                            <p>
                                {job.description}
                            </p>


                            {/* Actions */}

                            <div
                                style={{
                                    display: "flex",
                                    gap: "10px",
                                    flexWrap: "wrap",
                                    marginTop: "20px"
                                }}
                            >

                                <button
                                    onClick={() =>
                                        navigate(
                                            `/edit-job/${job.id}`
                                        )
                                    }
                                >
                                    Edit
                                </button>


                                <button
                                    onClick={() =>
                                        navigate(
                                            `/recruiter/jobs/${job.id}/applications`
                                        )
                                    }
                                >
                                    View Applications
                                </button>


                                <button
                                    onClick={() =>
                                        deleteJob(job.id)
                                    }
                                >
                                    Delete
                                </button>

                            </div>

                        </div>

                    ))}

                </div>

            )}

        </div>
    );
}

export default RecruiterJobs;