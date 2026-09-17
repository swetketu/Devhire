import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend
} from "recharts";

interface RecruiterDashboardData {
    totalJobs: number;
    totalApplications: number;
    shortlisted: number;
    interviews: number;
    offers: number;
}

function RecruiterDashboard() {

    const navigate = useNavigate();

    const [data, setData] =
        useState<RecruiterDashboardData | null>(null);

    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchDashboard();
    }, []);

    const fetchDashboard = async () => {

        try {

            const response = await api.get(
                "/dashboard/recruiter"
            );

            setData(response.data);

        } catch (error) {

            console.error(
                "Failed to load recruiter dashboard:",
                error
            );

        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div style={{ padding: "30px" }}>
                <h2>Loading recruiter dashboard...</h2>
            </div>
        );
    }

    if (!data) {
        return (
            <div style={{ padding: "30px" }}>
                <h2>Unable to load recruiter dashboard</h2>

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

                <h1>Recruiter Dashboard</h1>

                <p>
                    Manage your jobs and track candidate
                    applications.
                </p>

            </div>


            {/* Statistics */}

            <h2>Recruitment Overview</h2>

            <div
                style={{
                    display: "grid",
                    gridTemplateColumns:
                        "repeat(auto-fit, minmax(200px, 1fr))",
                    gap: "20px",
                    marginBottom: "40px"
                }}
            >

                <StatCard
                    title="Total Jobs"
                    value={data.totalJobs}
                />

                <StatCard
                    title="Applications"
                    value={data.totalApplications}
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

            </div>

            <h2>Recruitment Statistics</h2>

            <div style={{
                border: "1px solid #ddd",
                borderRadius: "10px",
                padding: "25px",
                marginBottom: "40px"
            }}>
                <BarChart
                    width={600}
                    height={300}
                    data={[
                        {
                            name: "Applications",
                            value: data.totalApplications
                        },
                        {
                            name: "Shortlisted",
                            value: data.shortlisted
                        },
                        {
                            name: "Interviews",
                            value: data.interviews
                        },
                        {
                            name: "Offers",
                            value: data.offers
                        }
                    ]}
                >
                    <CartesianGrid strokeDasharray="3 3" />

                    <XAxis dataKey="name" />

                    <YAxis />

                    <Tooltip />

                    <Legend />

                    <Bar
                        dataKey="value"
                        name="Candidates"
                    />
                </BarChart>
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
                    onClick={() =>
                        navigate("/create-job")
                    }
                >
                    Create New Job
                </button>

                <button
                    onClick={() =>
                        navigate("/recruiter-jobs")
                    }
                >
                    Manage My Jobs
                </button>

                <button
                    onClick={() =>
                        navigate("/notifications")
                    }
                >
                    Notifications
                </button>

            </div>


            {/* Recruitment Funnel */}

            <h2>Recruitment Funnel</h2>

            <div
                style={{
                    border: "1px solid #ddd",
                    borderRadius: "10px",
                    padding: "25px",
                    marginBottom: "40px"
                }}
            >

                <FunnelRow
                    label="Applications"
                    value={data.totalApplications}
                />

                <FunnelRow
                    label="Shortlisted"
                    value={data.shortlisted}
                />

                <FunnelRow
                    label="Interviews"
                    value={data.interviews}
                />

                <FunnelRow
                    label="Offers"
                    value={data.offers}
                />

            </div>


            {/* Information */}

            <h2>Manage Your Recruitment</h2>

            <div
                style={{
                    display: "grid",
                    gridTemplateColumns:
                        "repeat(auto-fit, minmax(250px, 1fr))",
                    gap: "20px"
                }}
            >

                <ActionCard
                    title="Job Management"
                    description="Create, edit and delete your job postings."
                    buttonText="View My Jobs"
                    onClick={() =>
                        navigate("/recruiter-jobs")
                    }
                />

                <ActionCard
                    title="Create Job"
                    description="Publish a new opportunity for candidates."
                    buttonText="Create Job"
                    onClick={() =>
                        navigate("/create-job")
                    }
                />

                <ActionCard
                    title="Notifications"
                    description="View updates related to your recruitment activity."
                    buttonText="View Notifications"
                    onClick={() =>
                        navigate("/notifications")
                    }
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


/* Recruitment Funnel */

function FunnelRow({
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
                    justifyContent: "space-between",
                    marginBottom: "8px"
                }}
            >

                <strong>{label}</strong>

                <span>{value}</span>

            </div>

            <div
                style={{
                    height: "8px",
                    background: "#eee",
                    borderRadius: "5px"
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


/* Action Card */

function ActionCard({
                        title,
                        description,
                        buttonText,
                        onClick
                    }: {
    title: string;
    description: string;
    buttonText: string;
    onClick: () => void;
}) {

    return (
        <div
            style={{
                border: "1px solid #ddd",
                borderRadius: "10px",
                padding: "25px",
                boxShadow:
                    "0 2px 8px rgba(0,0,0,0.08)"
            }}
        >

            <h3>{title}</h3>

            <p>{description}</p>

            <button onClick={onClick}>
                {buttonText}
            </button>

        </div>
    );
}

export default RecruiterDashboard;