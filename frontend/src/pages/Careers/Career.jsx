import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const API_HOST = (import.meta.env.VITE_API_BASE_URL || "").replace(/\/$/, "");
const API_BASE_URL = `${API_HOST}/api/careers`;
const CAREERS_URL = `${window.location.origin}/careers`;

const Career = () => {
    const navigate = useNavigate();
    const [hoverId, setHoverId] = useState(null);
    const [jobs, setJobs] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchJobs = async () => {
            try {
                const response = await axios.get(`${API_BASE_URL}/jobs`);
                setJobs(response.data);
            } catch (error) {
                console.error("Error fetching jobs:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchJobs();
    }, []);

    // Mock data for right side cards
    const RIGHT_CARDS = [
        {
            title: "Perks & Benefits at skilledUp",
            points: [
                "Fast career growth opportunities",
                "Performance-based incentives",
                "Hands-on real-world exposure",
                "Learning-focused startup culture",
                "Leadership visibility & ownership",
            ],
        },
        {
            title: "Why Choose a Career at skilledUp?",
            points: [
                "Fast-growing EdTech startup with real impact",
                "Performance-driven growth & merit rewards",
                "Early leadership exposure & ownership",
                "Learning-focused, innovation-led culture",
                "Young, dynamic, and ambitious team",
            ],
        },
    ];

    return (
        <>
            {/* ===== FONT ===== */}
            <style>
                {`
          @import url('https://fonts.googleapis.com/css2?family=Open+Sans:wght@400;600;700;800&display=swap');
        `}
            </style>

            <div
                style={{
                    fontFamily:
                        '"Canva Sans","Open Sans","Inter","Poppins",Arial,sans-serif',
                    background: "#fefefe",
                    color: "#232833",
                }}
            >
                {/* ================= HERO ================= */}
                <section
                    style={{
                        height: "300px",
                        background: "#264f9b",
                        display: "flex",
                        alignItems: "center",
                    }}
                >
                    <div style={{ width: "92%", maxWidth: "1300px", margin: "auto" }}>
                        <h1 style={{ fontSize: "30px", fontWeight: 800, color: "#ffffff" }}>
                            Build the Future. Learn Every Day. Grow with skilledUp
                        </h1>
                        <p style={{ maxWidth: "650px", color: "#c6c8cc" }}>
                            We’re a fast-growing EdTech startup on a mission to upskill professionals.
                            Join us to create impactful products that transform careers.

                        </p>
                    </div>
                </section>

                {/* ================= CONTENT ================= */}
                <section style={{ padding: "20px 0" }}>
                    <div style={{ width: "92%", maxWidth: "1300px", margin: "auto" }}>
                        <h2 style={{ fontSize: "28px", fontWeight: 800, marginBottom: "32px" }}>
                            Current Openings
                        </h2>

                        <div style={{ display: "flex", gap: "32px", flexWrap: "wrap" }}>
                            {/* ================= LEFT JOB LIST ================= */}
                            <div style={{ flex: "1 1 auto" }}>
                                {loading ? (
                                    <p>Loading jobs...</p>
                                ) : jobs.length === 0 ? (
                                    <p>No current openings.</p>
                                ) : (
                                    jobs.map((job) => {
                                        const isHover = hoverId === job.id;
                                        // Map backend fields to UI expectation
                                        const workMode = (job.type || "").toUpperCase().includes("REMOTE") ? "Remote" : "Onsite";

                                        return (
                                            <div
                                                key={job.id}
                                                onMouseEnter={() => setHoverId(job.id)}
                                                onMouseLeave={() => setHoverId(null)}
                                                onClick={() => navigate(`/careers/jd/${job.id}`)}
                                                style={{
                                                    width: "100%",          // ✅ Responsive width
                                                    maxWidth: "720px",

                                                    background: "#ffffff",
                                                    borderRadius: "14px",
                                                    padding: "20px",
                                                    marginBottom: "24px",
                                                    cursor: "pointer",
                                                    border: isHover
                                                        ? "1px solid #264f9b"
                                                        : "1px solid #e5e7eb",
                                                    boxShadow: isHover
                                                        ? "0 8px 22px rgba(38,79,155,0.18)"
                                                        : "none",
                                                    transition: "0.25s ease",
                                                }}
                                            >
                                                <div style={{ fontSize: "18px", fontWeight: 700 }}>
                                                    {job.title}
                                                </div>

                                                <div
                                                    style={{
                                                        fontSize: "13px",
                                                        color: "#4e5666",
                                                        marginTop: "4px",
                                                    }}
                                                >
                                                    {/* Department not in DB yet, hiding or defaulting */}
                                                    {/* {job.department} • */} 📍 {job.location}
                                                </div>

                                                <p
                                                    style={{
                                                        fontSize: "14px",
                                                        color: "#818999",
                                                        marginTop: "8px",
                                                        display: "-webkit-box",
                                                        WebkitLineClamp: 2,
                                                        WebkitBoxOrient: "vertical",
                                                        overflow: "hidden"
                                                    }}
                                                >
                                                    {job.description}
                                                </p>

                                                <div
                                                    style={{
                                                        display: "flex",
                                                        flexWrap: "wrap",
                                                        gap: "10px",
                                                        marginTop: "12px",
                                                    }}
                                                >
                                                    {[
                                                        `Experience: ${job.experience}`,
                                                        `Employment: ${job.type}`,
                                                        `Work Mode: ${workMode}`,
                                                        `Salary: ${job.salary || "Not Disclosed"}`,
                                                    ].map((item) => (
                                                        <span
                                                            key={item}
                                                            style={{
                                                                fontSize: "11px",
                                                                padding: "6px 10px",
                                                                borderRadius: "20px",
                                                                background: "#f5f7fb",
                                                                color: "#4e5666",
                                                                border: "1px solid #e5e7eb",
                                                            }}
                                                        >
                                                            {item}
                                                        </span>
                                                    ))}
                                                </div>
                                            </div>
                                        );
                                    })
                                )}
                            </div>


                            {/* ================= RIGHT SIDE ================= */}
                            <div
                                style={{
                                    flex: "1 1 300px",

                                    display: "flex",
                                    flexDirection: "column",
                                    gap: "14px",
                                }}
                            >
                                {RIGHT_CARDS.map((card, index) => (
                                    <div
                                        key={index}
                                        style={{
                                            width: "100%",

                                            background: "#ffffff",
                                            borderRadius: "14px",
                                            border: "1px solid #e5e7eb",
                                            padding: "18px",
                                        }}
                                    >
                                        {/* CARD HEADING */}
                                        <div
                                            style={{
                                                fontSize: "15px",
                                                fontWeight: 700,
                                                color: "#264f9b",
                                                marginBottom: "10px",
                                            }}
                                        >
                                            {card.title}
                                        </div>

                                        {/* BULLET POINTS */}
                                        <ul
                                            style={{
                                                paddingLeft: "18px",
                                                margin: 0,
                                                listStyleType: "disc",
                                            }}
                                        >
                                            {card.points.map((point, i) => (
                                                <li
                                                    key={i}
                                                    style={{
                                                        fontSize: "13px",
                                                        color: "#4e5666",
                                                        marginBottom: "6px",
                                                        lineHeight: 1.5,
                                                    }}
                                                >
                                                    {point}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                ))}

                                {/* ================= SHARE CARD (ICONS ONLY – HORIZONTAL) ================= */}
                                <div
                                    style={{
                                        width: "100%",

                                        height: "120px",
                                        background: "#ffffff",
                                        borderRadius: "14px",
                                        border: "1px solid #e5e7eb",
                                        padding: "20px",
                                    }}
                                >
                                    <h3
                                        style={{
                                            fontSize: "16px",
                                            fontWeight: 700,
                                            marginBottom: "24px",
                                            textAlign: "center",
                                        }}
                                    >
                                        Share this job
                                    </h3>

                                    <div
                                        style={{
                                            display: "flex",
                                            justifyContent: "space-between",
                                            alignItems: "center",
                                            gap: "12px",
                                        }}
                                    >
                                        {[
                                            {
                                                name: "WhatsApp",
                                                icon: "https://static.vecteezy.com/system/resources/previews/024/398/617/non_2x/whatsapp-logo-icon-isolated-on-transparent-background-free-png.png",
                                                link: `https://api.whatsapp.com/send?text=${encodeURIComponent(
                                                    `Explore multiple job openings at skilledUp 🚀 👉 ${CAREERS_URL}`
                                                )}`,
                                            },

                                            // ✅ LinkedIn
                                            {
                                                name: "LinkedIn",
                                                icon: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/81/LinkedIn_icon.svg/2048px-LinkedIn_icon.svg.png",
                                                link: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(
                                                    CAREERS_URL
                                                )}`,
                                            },

                                            // ⚠️ Instagram (NO direct share possible)
                                            {
                                                name: "Instagram",
                                                icon: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a5/Instagram_icon.png/1200px-Instagram_icon.png",
                                                link: `https://www.instagram.com/direct/new/?text=${encodeURIComponent(
                                                    `Explore multiple job openings at skilledUp 🚀 👉 ${CAREERS_URL}`
                                                )}`,
                                            },

                                            // ✅ Facebook
                                            {
                                                name: "Facebook",
                                                icon: "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b8/2021_Facebook_icon.svg/1200px-2021_Facebook_icon.svg.png",
                                                link: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
                                                    CAREERS_URL
                                                )}`,
                                            },

                                            // ✅ Twitter / X
                                            {
                                                name: "X",
                                                icon: "https://assets.streamlinehq.com/image/private/w_300,h_300,ar_1/f_auto/v1/icons/all-icons/twitter-x-1fhy50xzcvkl246hf5ua4.png",
                                                link: `https://twitter.com/intent/tweet?text=${encodeURIComponent(
                                                    "We are hiring 🚀"
                                                )}&url=${encodeURIComponent(CAREERS_URL)}`,
                                            },
                                        ].map((item, i) => (
                                            <a
                                                key={i}
                                                href={item.link}
                                                target="_blank"
                                                rel="noreferrer"
                                                style={{
                                                    width: "44px",
                                                    height: "44px",
                                                    borderRadius: "10px",
                                                    border: "1px solid #e5e7eb",
                                                    display: "flex",
                                                    alignItems: "center",
                                                    justifyContent: "center",
                                                }}
                                            >
                                                <img
                                                    src={item.icon}
                                                    alt="social"
                                                    style={{ width: "22px", height: "22px" }}
                                                />
                                            </a>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
                {/* ================= OUR HIRING PROCESS ================= */}
                <section style={{ padding: "0 0 70px" }}> {/* 🔻 top padding removed */}
                    <div style={{ width: "92%", maxWidth: "1100px", margin: "auto" }}>
                        <h2
                            style={{
                                fontSize: "28px",
                                fontWeight: 800,
                                marginTop: "0",        // ✅ no top margin
                                marginBottom: "36px",
                            }}
                        >
                            Our Hiring Process
                        </h2>

                        <div style={{ position: "relative", paddingLeft: "44px" }}>
                            {/* VERTICAL LINE */}
                            <div
                                style={{
                                    position: "absolute",
                                    left: "20px",
                                    top: "0",
                                    bottom: "0",
                                    width: "2px",
                                    background: "#264f9b",
                                }}
                            />

                            {[
                                {
                                    title: "Apply & Shortlist",
                                    desc: "Apply online and get shortlisted based on role alignment.",
                                },
                                {
                                    title: "Initial Screening",
                                    desc: "A quick conversation to understand your skills, mindset, and interest.",
                                },
                                {
                                    title: "Skill Evaluation",
                                    desc: "Role-specific interview or practical assessment.",
                                },
                                {
                                    title: "Final Discussion",
                                    desc: "Alignment on culture, expectations, and growth opportunities.",
                                },
                                {
                                    title: "Offer & Onboarding",
                                    desc: "Receive your offer and begin your journey with skilledUp.",
                                },
                            ].map((step, index) => (
                                <div
                                    key={index}
                                    style={{
                                        display: "flex",
                                        alignItems: "flex-start", // ✅ KEY FIX
                                        gap: "20px",
                                        marginBottom: "26px",
                                        position: "relative",
                                    }}
                                >
                                    {/* NUMBER */}
                                    {/* NUMBER */}
                                    <div
                                        style={{
                                            minWidth: "32px",
                                            minHeight: "32px",
                                            width: "clamp(28px, 6vw, 40px)",
                                            height: "clamp(28px, 6vw, 40px)",
                                            borderRadius: "50%",
                                            background: "#264f9b",
                                            color: "#ffffff",
                                            fontWeight: 700,
                                            fontSize: "clamp(12px, 3vw, 16px)",
                                            display: "flex",
                                            alignItems: "center",
                                            justifyContent: "center",
                                            zIndex: 2,
                                            flexShrink: 0,
                                        }}
                                    >
                                        {index + 1}
                                    </div>

                                    {/* CARD */}
                                    <div
                                        style={{
                                            background: "#ffffff",
                                            borderRadius: "14px",
                                            border: "1px solid #e5e7eb",
                                            padding: "18px 20px",
                                            width: "100%",
                                        }}
                                    >
                                        <div
                                            style={{
                                                fontSize: "16px",
                                                fontWeight: 700,
                                                marginBottom: "6px",
                                            }}
                                        >
                                            {step.title}
                                        </div>
                                        <p
                                            style={{
                                                fontSize: "14px",
                                                color: "#4e5666",
                                                margin: 0,
                                                lineHeight: 1.5,
                                            }}
                                        >
                                            {step.desc}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* ================= OUR CULTURE & GROWTH ================= */}
                <section style={{ padding: "0 0 80px" }}> {/* 🔻 top padding removed */}
                    <div style={{ width: "92%", maxWidth: "1100px", margin: "auto" }}>
                        <h2
                            style={{
                                fontSize: "28px",
                                fontWeight: 800,
                                marginTop: "0",        // ✅ no top margin
                                marginBottom: "36px",
                                color: "#232833",
                            }}
                        >
                            Our Culture & Growth
                        </h2>

                        <div
                            style={{
                                display: "flex",
                                gap: "24px",
                                flexWrap: "wrap",
                            }}
                        >
                            {/* CARD 1 */}
                            <div
                                style={{
                                    flex: "1 1 300px",
                                    background: "#ffffff",
                                    borderRadius: "16px",
                                    border: "1px solid #e5e7eb",
                                    padding: "24px",
                                }}
                            >
                                <h3
                                    style={{
                                        fontSize: "18px",
                                        fontWeight: 700,
                                        marginBottom: "10px",
                                        color: "#264f9b",
                                        textAlign: "center",
                                    }}
                                >
                                    Technology Growth
                                </h3>
                                <p
                                    style={{
                                        fontSize: "14px",
                                        lineHeight: 1.6,
                                        color: "#4e5666",
                                        margin: 0,
                                        textAlign: "center",
                                    }}
                                >
                                    We build and scale with AI, cloud, and modern enterprise tech, always
                                    future-first.
                                </p>
                            </div>

                            {/* CARD 2 */}
                            <div
                                style={{
                                    flex: "1 1 300px",
                                    background: "#ffffff",
                                    borderRadius: "16px",
                                    border: "1px solid #e5e7eb",
                                    padding: "24px",
                                }}
                            >
                                <h3
                                    style={{
                                        fontSize: "18px",
                                        fontWeight: 700,
                                        marginBottom: "10px",
                                        color: "#264f9b",
                                        textAlign: "center",
                                    }}
                                >
                                    Skill Development
                                </h3>
                                <p
                                    style={{
                                        fontSize: "14px",
                                        lineHeight: 1.6,
                                        color: "#4e5666",
                                        margin: 0,
                                        textAlign: "center",
                                    }}
                                >
                                    Learning never stops. We upskill fast and grow stronger across every
                                    team.
                                </p>
                            </div>

                            {/* CARD 3 */}
                            <div
                                style={{
                                    flex: "1 1 300px",
                                    background: "#ffffff",
                                    borderRadius: "16px",
                                    border: "1px solid #e5e7eb",
                                    padding: "24px",
                                }}
                            >
                                <h3
                                    style={{
                                        fontSize: "18px",
                                        fontWeight: 700,
                                        marginBottom: "10px",
                                        color: "#264f9b",
                                        textAlign: "center",
                                    }}
                                >
                                    Collaboration
                                </h3>
                                <p
                                    style={{
                                        fontSize: "14px",
                                        lineHeight: 1.6,
                                        color: "#4e5666",
                                        margin: 0,
                                        textAlign: "center",
                                    }}
                                >
                                    Tech, Sales, Ops, and HR move as one to build, ship, and win together.
                                </p>
                            </div>
                        </div>
                    </div>
                </section>



            </div>
        </>
    );
};

export default Career;
