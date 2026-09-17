import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../services/api";

interface Resume {
    id: number;
    fileName: string;
    uploadedAt: string;
}

function MyResumes() {

    const [resumes, setResumes] =
        useState<Resume[]>([]);

    const [loading, setLoading] =
        useState(true);

    useEffect(() => {

        fetchResumes();

    }, []);

    const fetchResumes = async () => {

        try {

            const response =
                await api.get("/resumes/my");

            setResumes(response.data);

        } catch (error) {

            console.error(
                "Failed to load resumes:",
                error
            );

        } finally {

            setLoading(false);
        }
    };

    const deleteResume = async (resumeId: number) => {

        const confirmed = window.confirm(
            "Are you sure you want to delete this resume?"
        );

        if (!confirmed) {
            return;
        }

        try {

            await api.delete(`/resumes/${resumeId}`);

            alert("Resume deleted successfully!");

            fetchResumes();

        } catch (error: any) {

            console.error(error);

            alert(
                error.response?.data?.message ||
                "Failed to delete resume"
            );
        }
    };

    const downloadResume = async (resumeId: number) => {

        try {

            const response = await api.get(
                `/resumes/${resumeId}/download`,
                {
                    responseType: "blob"
                }
            );

            const url =
                window.URL.createObjectURL(
                    new Blob([response.data])
                );

            const link =
                document.createElement("a");

            link.href = url;

            link.setAttribute(
                "download",
                "resume.pdf"
            );

            document.body.appendChild(link);

            link.click();

            link.remove();

            window.URL.revokeObjectURL(url);

        } catch (error) {

            console.error(error);

            alert("Failed to download resume");
        }
    };

    if (loading) {
        return <h2>Loading resumes...</h2>;
    }

    return (
        <div style={{ padding: "30px" }}>

            <h1>My Resumes</h1>

            <Link to="/upload-resume">
                <button>
                    Upload New Resume
                </button>
            </Link>

            <br />
            <br />

            {resumes.length === 0 ? (

                <p>
                    No resumes uploaded yet.
                </p>

            ) : (

                resumes.map((resume) => (

                    <div
                        key={resume.id}
                        style={{
                            border: "1px solid #ddd",
                            padding: "20px",
                            marginBottom: "15px",
                            borderRadius: "8px"
                        }}
                    >

                        <button
                            onClick={() => deleteResume(resume.id)}
                            style={{ marginLeft: "10px" }}
                        >
                            Delete
                        </button>

                        <button
                            onClick={() => downloadResume(resume.id)}
                            style={{ marginLeft: "10px" }}
                        >
                            Download
                        </button>

                        <h3>
                            {resume.fileName}
                        </h3>

                        <p>
                            Uploaded:{" "}
                            {new Date(
                                resume.uploadedAt
                            ).toLocaleString()}
                        </p>

                        <Link
                            to={`/resumes/${resume.id}/analyze`}
                        >
                            Analyze Resume
                        </Link>

                    </div>

                ))
            )}

        </div>
    );
}

export default MyResumes;