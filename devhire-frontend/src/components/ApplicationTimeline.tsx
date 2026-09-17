interface Props {
    status: string;
}

function ApplicationTimeline({ status }: Props) {

    const stages = [
        "APPLIED",
        "UNDER_REVIEW",
        "SHORTLISTED",
        "INTERVIEW",
        "OFFER"
    ];

    const rejected = status === "REJECTED";

    return (
        <div style={{ marginTop: "20px" }}>

            <h4>Application Progress</h4>

            {rejected ? (
                <div style={{
                    padding: "12px",
                    border: "2px solid red",
                    borderRadius: "8px"
                }}>
                    ❌ Application Rejected
                </div>
            ) : (
                <div style={{
                    display: "flex",
                    gap: "10px",
                    flexWrap: "wrap"
                }}>

                    {stages.map((stage) => {

                        const currentIndex =
                            stages.indexOf(status);

                        const stageIndex =
                            stages.indexOf(stage);

                        const completed =
                            stageIndex <= currentIndex;

                        return (
                            <div
                                key={stage}
                                style={{
                                    padding: "10px 14px",
                                    borderRadius: "20px",

                                    border: completed
                                        ? "2px solid green"
                                        : "1px solid #ccc",

                                    background: completed
                                        ? "#e8f5e9"
                                        : "#f5f5f5"
                                }}
                            >
                                {completed ? "✓ " : ""}
                                {stage.replace("_", " ")}
                            </div>
                        );
                    })}

                </div>
            )}

        </div>
    );
}

export default ApplicationTimeline;