import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../services/api";

interface Application {
    id: number;
    status: string;
    appliedAt: string;
    job: {
        id: number;
        title: string;
        company: string;
        location: string;
        description: string;
        salary: string;
        requiredSkills: string;
        employmentType: string;
    };
}

function ApplicationDetails() {

    const { applicationId } = useParams();

    const [application, setApplication] =
        useState<Application | null>(null);

    const [loading, setLoading] = useState(true);

    useEffect(() => {

        fetchApplication();

    }, [applicationId]);

    const fetchApplication = async () => {

        try {

            const response =
                await api.get(
                    `/applications/${applicationId}`
                );

            setApplication(response.data);

        } catch (error) {

            console.error(
                "Failed to load application:",
                error
            );

        } finally {

            setLoading(false);
        }
    };

    if (loading) {
        return <h2>Loading application...</h2>;
    }

    if (!application) {
        return <h2>Application not found</h2>;
    }

    return (
        <div style={{ padding: "30px" }}>

            <h1>Application Details</h1>

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
                <strong>Employment:</strong>{" "}
                {application.job.employmentType}
            </p>

            <p>
                <strong>Salary:</strong>{" "}
                {application.job.salary}
            </p>

            <p>
                <strong>Required Skills:</strong>{" "}
                {application.job.requiredSkills}
            </p>

            <p>
                <strong>Status:</strong>{" "}
                {application.status}
            </p>

            <p>
                <strong>Applied At:</strong>{" "}
                {new Date(
                    application.appliedAt
                ).toLocaleString()}
            </p>

            <h3>Job Description</h3>

            <p>
                {application.job.description}
            </p>

        </div>
    );
}

export default ApplicationDetails;