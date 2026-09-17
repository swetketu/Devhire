import { useState } from "react";
import { useParams } from "react-router-dom";
import api from "../services/api";

function ResumeAnalysis() {

    const { resumeId } = useParams();

    const [analysis, setAnalysis] =
        useState<any>(null);

    const [loading, setLoading] =
        useState(false);

    const analyzeResume = async () => {

        setLoading(true);

        try {

            const response =
                await api.post(
                    `/resumes/${resumeId}/analyze`
                );

            setAnalysis(response.data);

        } catch (error: any) {

            console.error(error);

            alert(
                error.response?.data?.message ||
                "Resume analysis failed"
            );

        } finally {

            setLoading(false);
        }
    };

    return (
        <div style={{ padding: "30px" }}>

            <h1>Resume Analysis</h1>

            <p>
                Resume ID: {resumeId}
            </p>

            <button
                onClick={analyzeResume}
                disabled={loading}
            >
                {loading
                    ? "Analyzing..."
                    : "Analyze Resume"}
            </button>

            {analysis && (

                <div
                    style={{
                        marginTop: "30px",
                        border: "1px solid #ddd",
                        padding: "20px",
                        borderRadius: "8px"
                    }}
                >

                    <h2>Analysis Result</h2>

                    <pre>
                        {JSON.stringify(
                            analysis,
                            null,
                            2
                        )}
                    </pre>

                </div>

            )}

        </div>
    );
}

export default ResumeAnalysis;