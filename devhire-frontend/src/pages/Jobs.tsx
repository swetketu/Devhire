import { useEffect, useState } from "react";
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

function Jobs() {

    const [jobs, setJobs] = useState<Job[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const [title, setTitle] = useState("");
    const [location, setLocation] = useState("");
    const [employmentType, setEmploymentType] = useState("");

    useEffect(() => {
        fetchJobs();
    }, []);

    const fetchJobs = async () => {
        setLoading(true);
        setError("");

        try {
            const response = await api.get("/jobs");
            setJobs(response.data);
        } catch (error) {
            console.error("Failed to fetch jobs:", error);
            setError("Failed to load jobs");
        } finally {
            setLoading(false);
        }
    };

    const searchJobs = async () => {

        setLoading(true);
        setError("");

        try {

            const params: any = {};

            if (title.trim()) {
                params.title = title;
            }

            if (location.trim()) {
                params.location = location;
            }

            if (employmentType) {
                params.employmentType = employmentType;
            }

            const response = await api.get("/jobs/search", {
                params
            });

            setJobs(response.data);

        } catch (error) {

            console.error("Search failed:", error);
            setError("Failed to search jobs");

        } finally {
            setLoading(false);
        }
    };

    const clearFilters = () => {
        setTitle("");
        setLocation("");
        setEmploymentType("");
        fetchJobs();
    };

    const applyForJob = async (jobId: number) => {

        try {

            await api.post(`/applications/jobs/${jobId}`);

            alert("Application submitted successfully!");

        } catch (error: any) {

            console.error(error);

            alert(
                error.response?.data?.message ||
                "Failed to apply for this job"
            );
        }
    };

    const saveJob = async (jobId: number) => {

        try {

            await api.post(`/jobs/${jobId}/save`);

            alert("Job saved successfully!");

        } catch (error: any) {

            console.error(error);

            alert(
                error.response?.data?.message ||
                "Failed to save job"
            );
        }
    };

    if (loading) {
        return (
            <div style={{ padding: "30px" }}>
                <h2>Loading jobs...</h2>
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

            <h1>Find Your Next Job</h1>

            <p>
                Discover opportunities and apply for your next career move.
            </p>

            {/* Search Section */}

            <div
                style={{
                    border: "1px solid #ddd",
                    padding: "20px",
                    borderRadius: "10px",
                    marginBottom: "30px"
                }}
            >

                <h2>Search Jobs</h2>

                <div
                    style={{
                        display: "grid",
                        gridTemplateColumns: "repeat(3, 1fr)",
                        gap: "15px"
                    }}
                >

                    <input
                        type="text"
                        placeholder="Job title e.g. Java Developer"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                    />

                    <input
                        type="text"
                        placeholder="Location e.g. Bangalore"
                        value={location}
                        onChange={(e) => setLocation(e.target.value)}
                    />

                    <select
                        value={employmentType}
                        onChange={(e) =>
                            setEmploymentType(e.target.value)
                        }
                    >
                        <option value="">
                            All Employment Types
                        </option>

                        <option value="FULL_TIME">
                            Full Time
                        </option>

                        <option value="PART_TIME">
                            Part Time
                        </option>

                        <option value="INTERNSHIP">
                            Internship
                        </option>

                        <option value="CONTRACT">
                            Contract
                        </option>

                    </select>

                </div>

                <br />

                <button onClick={searchJobs}>
                    Search Jobs
                </button>

                <button
                    onClick={clearFilters}
                    style={{ marginLeft: "10px" }}
                >
                    Clear
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


            {/* Jobs */}

            <h2>
                Available Jobs ({jobs.length})
            </h2>

            {jobs.length === 0 ? (

                <div
                    style={{
                        border: "1px solid #ddd",
                        padding: "30px",
                        borderRadius: "10px"
                    }}
                >
                    <h3>No jobs found</h3>
                    <p>
                        Try changing your search filters.
                    </p>
                </div>

            ) : (

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
                                padding: "25px",
                                borderRadius: "12px",
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
                                <strong>Skills:</strong>{" "}
                                {job.requiredSkills}
                            </p>

                            <p>
                                {job.description}
                            </p>

                            <div
                                style={{
                                    display: "flex",
                                    gap: "10px",
                                    marginTop: "20px"
                                }}
                            >

                                <button
                                    onClick={() =>
                                        applyForJob(job.id)
                                    }
                                >
                                    Apply Now
                                </button>

                                <button
                                    onClick={() =>
                                        saveJob(job.id)
                                    }
                                >
                                    Save Job
                                </button>

                            </div>

                        </div>

                    ))}

                </div>

            )}

        </div>
    );
}

export default Jobs;