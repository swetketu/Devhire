import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

function ResumeUpload() {

    const [file, setFile] =
        useState<File | null>(null);

    const [uploading, setUploading] =
        useState(false);

    const navigate = useNavigate();

    const handleUpload = async () => {

        if (!file) {
            alert("Please select a PDF file");
            return;
        }

        const formData = new FormData();

        formData.append("file", file);

        setUploading(true);

        try {

            await api.post(
                "/resumes/upload",
                formData
            );

            alert("Resume uploaded successfully!");

            navigate("/my-resumes");

        } catch (error: any) {

            console.error(error);

            alert(
                error.response?.data?.message ||
                "Failed to upload resume"
            );

        } finally {

            setUploading(false);
        }
    };

    return (
        <div style={{ padding: "30px" }}>

            <h1>Upload Resume</h1>

            <input
                type="file"
                accept=".pdf"
                onChange={(e) => {

                    const selectedFile =
                        e.target.files?.[0];

                    if (selectedFile) {
                        setFile(selectedFile);
                    }

                }}
            />

            <br />
            <br />

            <button
                onClick={handleUpload}
                disabled={uploading}
            >
                {uploading
                    ? "Uploading..."
                    : "Upload Resume"}
            </button>

        </div>
    );
}

export default ResumeUpload;