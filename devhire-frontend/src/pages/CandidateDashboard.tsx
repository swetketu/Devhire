import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

interface DashboardData {
    totalApplications: number;
    applied: number;
    underReview: number;
    shortlisted: number;
    interviews: number;
    offers: number;
    rejected: number;
    savedJobs: number;
    resumes: number;
}

import {
    PieChart,
    Pie,
    Cell,
    Tooltip,
    Legend
} from "recharts";

function CandidateDashboard() {

    const navigate = useNavigate();

    const [data, setData] = useState<DashboardData | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchDashboard();
    }, []);

    const fetchDashboard = async () => {
        try {

            const response = await api.get(
                "/dashboard/candidate"
            );

            setData(response.data);

        } catch (error) {

            console.error(
                "Failed to load dashboard:",
                error
            );

        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div style={{ padding: "30px" }}>
                <h2>Loading dashboard...</h2>
            </div>
        );
    }

    if (!data) {
        return (
            <div style={{ padding: "30px" }}>
                <h2>Unable to load dashboard</h2>

                <button onClick={fetchDashboard}>
                    Try Again
                </button>
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

            <div style={{ marginBottom: "30px" }}>

                <h1>Candidate Dashboard</h1>

                <p>
                    Track your job applications,
                    resumes and career progress.
                </p>

            </div>


            {/* Statistics */}

            <h2>Application Overview</h2>

            <div
                style={{
                    display: "grid",
                    gridTemplateColumns:
                        "repeat(auto-fit, minmax(180px, 1fr))",
                    gap: "20px",
                    marginBottom: "40px"
                }}
            >

                <StatCard
                    title="Total Applications"
                    value={data.totalApplications}
                />

                <StatCard
                    title="Applied"
                    value={data.applied}
                />

                <StatCard
                    title="Under Review"
                    value={data.underReview}
                />

                <StatCard
                    title="Shortlisted"
                    value={data.shortlisted}
                />

                <StatCard
                    title="Interviews"
                    value={data.interviews}
                />

                <StatCard
                    title="Offers"
                    value={data.offers}
                />

                <StatCard
                    title="Rejected"
                    value={data.rejected}
                />

            </div>

            <h2>Application Status</h2>

            <div style={{
                border: "1px solid #ddd",
                borderRadius: "10px",
                padding: "25px",
                marginBottom: "40px"
            }}>
                <PieChart width={400} height={300}>
                    <Pie
                        data={[
                            { name: "Applied", value: data.applied },
                            { name: "Under Review", value: data.underReview },
                            { name: "Shortlisted", value: data.shortlisted },
                            { name: "Interviews", value: data.interviews },
                            { name: "Offers", value: data.offers },
                            { name: "Rejected", value: data.rejected }
                        ]}
                        dataKey="value"
                        nameKey="name"
                        cx="50%"
                        cy="50%"
                        outerRadius={100}
                        label
                    >
                        <Cell />
                        <Cell />
                        <Cell />
                        <Cell />
                        <Cell />
                        <Cell />
                    </Pie>

                    <Tooltip />
                    <Legend />
                </PieChart>
            </div>


            {/* Other Statistics */}

            <h2>Career Resources</h2>

            <div
                style={{
                    display: "grid",
                    gridTemplateColumns:
                        "repeat(auto-fit, minmax(220px, 1fr))",
                    gap: "20px",
                    marginBottom: "40px"
                }}
            >

                <StatCard
                    title="Saved Jobs"
                    value={data.savedJobs}
                />

                <StatCard
                    title="Resumes"
                    value={data.resumes}
                />

            </div>


            {/* Quick Actions */}

            <h2>Quick Actions</h2>

            <div
                style={{
                    display: "flex",
                    gap: "15px",
                    flexWrap: "wrap",
                    marginBottom: "40px"
                }}
            >

                <button
                    onClick={() => navigate("/jobs")}
                >
                    Browse Jobs
                </button>

                <button
                    onClick={() =>
                        navigate("/my-applications")
                    }
                >
                    My Applications
                </button>

                <button
                    onClick={() =>
                        navigate("/my-resumes")
                    }
                >
                    My Resumes
                </button>

                <button
                    onClick={() =>
                        navigate("/upload-resume")
                    }
                >
                    Upload Resume
                </button>

                <button
                    onClick={() =>
                        navigate("/notifications")
                    }
                >
                    Notifications
                </button>

            </div>


            {/* Application Progress */}

            <h2>Application Progress</h2>

            <div
                style={{
                    border: "1px solid #ddd",
                    borderRadius: "10px",
                    padding: "25px"
                }}
            >

                <ProgressRow
                    label="Applied"
                    value={data.applied}
                />

                <ProgressRow
                    label="Under Review"
                    value={data.underReview}
                />

                <ProgressRow
                    label="Shortlisted"
                    value={data.shortlisted}
                />

                <ProgressRow
                    label="Interviews"
                    value={data.interviews}
                />

                <ProgressRow
                    label="Offers"
                    value={data.offers}
                />

                <ProgressRow
                    label="Rejected"
                    value={data.rejected}
                />

            </div>

        </div>
    );
}


/* Statistic Card */

function StatCard({
                      title,
                      value
                  }: {
    title: string;
    value: number;
}) {

    return (
        <div
            style={{
                border: "1px solid #ddd",
                borderRadius: "10px",
                padding: "20px",
                boxShadow:
                    "0 2px 8px rgba(0,0,0,0.08)"
            }}
        >

            <p
                style={{
                    margin: 0,
                    fontSize: "15px"
                }}
            >
                {title}
            </p>

            <h2
                style={{
                    fontSize: "32px",
                    margin: "10px 0 0"
                }}
            >
                {value}
            </h2>

        </div>
    );
}


/* Progress Row */

function ProgressRow({
                         label,
                         value
                     }: {
    label: string;
    value: number;
}) {

    return (
        <div style={{ marginBottom: "20px" }}>

            <div
                style={{
                    display: "flex",
                    justifyContent: "space-between"
                }}
            >
                <strong>{label}</strong>

                <span>{value}</span>
            </div>

            <div
                style={{
                    height: "8px",
                    background: "#eee",
                    borderRadius: "5px",
                    marginTop: "8px"
                }}
            >

                <div
                    style={{
                        height: "100%",
                        width: `${Math.min(value * 10, 100)}%`,
                        borderRadius: "5px"
                    }}
                />

            </div>

        </div>
    );
}

export default CandidateDashboard;