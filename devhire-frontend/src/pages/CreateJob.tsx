import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

function CreateJob() {
    const navigate = useNavigate();

    const [title, setTitle] = useState("");
    const [company, setCompany] = useState("");
    const [location, setLocation] = useState("");
    const [description, setDescription] = useState("");
    const [salary, setSalary] = useState("");
    const [requiredSkills, setRequiredSkills] = useState("");
    const [employmentType, setEmploymentType] = useState("FULL_TIME");

    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        setLoading(true);

        try {
            await api.post("/jobs", {
                title,
                company,
                location,
                description,
                salary,
                requiredSkills,
                employmentType
            });

            alert("Job created successfully!");

            navigate("/recruiter-jobs");

        } catch (error: any) {
            console.error("Create job error:", error);

            if (error.response?.data?.message) {
                alert(error.response.data.message);
            } else {
                alert("Failed to create job");
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ padding: "30px", maxWidth: "700px" }}>
            <h1>Create Job</h1>

            <form onSubmit={handleSubmit}>

                <div>
                    <label>Job Title</label>
                    <br />
                    <input
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        placeholder="Java Developer"
                        required
                    />
                </div>

                <br />

                <div>
                    <label>Company</label>
                    <br />
                    <input
                        type="text"
                        value={company}
                        onChange={(e) => setCompany(e.target.value)}
                        placeholder="ABC Technologies"
                        required
                    />
                </div>

                <br />

                <div>
                    <label>Location</label>
                    <br />
                    <input
                        type="text"
                        value={location}
                        onChange={(e) => setLocation(e.target.value)}
                        placeholder="Bangalore"
                        required
                    />
                </div>

                <br />

                <div>
                    <label>Description</label>
                    <br />
                    <textarea
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        placeholder="Job description..."
                        rows={6}
                        required
                    />
                </div>

                <br />

                <div>
                    <label>Salary</label>
                    <br />
                    <input
                        type="text"
                        value={salary}
                        onChange={(e) => setSalary(e.target.value)}
                        placeholder="8-12 LPA"
                        required
                    />
                </div>

                <br />

                <div>
                    <label>Required Skills</label>
                    <br />
                    <input
                        type="text"
                        value={requiredSkills}
                        onChange={(e) => setRequiredSkills(e.target.value)}
                        placeholder="Java, Spring Boot, MySQL"
                        required
                    />
                </div>

                <br />

                <div>
                    <label>Employment Type</label>
                    <br />

                    <select
                        value={employmentType}
                        onChange={(e) =>
                            setEmploymentType(e.target.value)
                        }
                    >
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

                <button type="submit" disabled={loading}>
                    {loading ? "Creating..." : "Create Job"}
                </button>

            </form>
        </div>
    );
}

export default CreateJob;