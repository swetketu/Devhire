import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../services/api";

function EditJob() {
    const { jobId } = useParams();
    const navigate = useNavigate();

    const [job, setJob] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchJob();
    }, [jobId]);

    const fetchJob = async () => {
        try {
            const response = await api.get(`/jobs/${jobId}`);
            setJob(response.data);
        } catch (error) {
            console.error("Failed to load job:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (
        e: React.ChangeEvent<
            HTMLInputElement | HTMLTextAreaElement
        >
    ) => {
        setJob({
            ...job,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (
        e: React.FormEvent
    ) => {
        e.preventDefault();

        try {
            await api.put(`/jobs/${jobId}`, job);

            alert("Job updated successfully!");

            navigate("/recruiter-jobs");

        } catch (error: any) {
            console.error(error);

            alert(
                error.response?.data?.message ||
                "Failed to update job"
            );
        }
    };

    if (loading) {
        return <h2>Loading job...</h2>;
    }

    if (!job) {
        return <h2>Job not found</h2>;
    }

    return (
        <div style={{ padding: "30px" }}>

            <h1>Edit Job</h1>

            <form onSubmit={handleSubmit}>

                <input
                    name="title"
                    value={job.title}
                    onChange={handleChange}
                    placeholder="Job Title"
                    required
                />

                <br /><br />

                <input
                    name="company"
                    value={job.company}
                    onChange={handleChange}
                    placeholder="Company"
                    required
                />

                <br /><br />

                <input
                    name="location"
                    value={job.location}
                    onChange={handleChange}
                    placeholder="Location"
                    required
                />

                <br /><br />

                <textarea
                    name="description"
                    value={job.description}
                    onChange={handleChange}
                    placeholder="Description"
                    rows={6}
                    required
                />

                <br /><br />

                <input
                    name="salary"
                    value={job.salary}
                    onChange={handleChange}
                    placeholder="Salary"
                    required
                />

                <br /><br />

                <input
                    name="requiredSkills"
                    value={job.requiredSkills}
                    onChange={handleChange}
                    placeholder="Required Skills"
                    required
                />

                <br /><br />

                <input
                    name="employmentType"
                    value={job.employmentType}
                    onChange={handleChange}
                    placeholder="Employment Type"
                    required
                />

                <br /><br />

                <button type="submit">
                    Update Job
                </button>

            </form>

        </div>
    );
}

export default EditJob;