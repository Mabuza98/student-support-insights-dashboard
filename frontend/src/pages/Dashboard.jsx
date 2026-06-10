import { useEffect, useState } from "react";
import API from "../api/api";
import Papa from "papaparse";
import jsPDF from "jspdf";

import {
    PieChart,
    Pie,
    Cell,
    BarChart,
    Bar,
    XAxis,
    YAxis,
    Tooltip,
    ResponsiveContainer,
    Legend,
} from "recharts";

export default function Dashboard() {
    const [learners, setLearners] = useState([]);

    const [provinceFilter, setProvinceFilter] = useState("");
    const [riskFilter, setRiskFilter] = useState("");
    const [searchTerm, setSearchTerm] = useState("");

    useEffect(() => {
        loadLearners();
    }, []);

    const loadLearners = async () => {
        try {
            const res = await API.get("/learners");
            setLearners(res.data);
        } catch (err) {
            console.log(err);
        }
    };

    const filteredLearners = learners.filter((learner) => {
        const matchesProvince =
            provinceFilter === "" ||
            learner.province === provinceFilter;

        const matchesRisk =
            riskFilter === "" ||
            learner.riskLevel === riskFilter;

        const matchesSearch =
            (learner.learnerId || learner.learner || "")
                .toLowerCase()
                .includes(searchTerm.toLowerCase());

        return matchesProvince && matchesRisk && matchesSearch;
    });

    const totalLearners = filteredLearners.length;

    const highRisk = filteredLearners.filter(
        l => l.riskLevel === "High"
    ).length;

    const mediumRisk = filteredLearners.filter(
        l => l.riskLevel === "Medium"
    ).length;

    const lowRisk = filteredLearners.filter(
        l => l.riskLevel === "Low"
    ).length;

    const missingProvince = filteredLearners.filter(
        l => !l.province || l.province.trim() === ""
    ).length;

    const invalidDigitalConfidence = filteredLearners.filter(
        l =>
            Number(l.digitalConfidence) < 1 ||
            Number(l.digitalConfidence) > 5 ||
            isNaN(Number(l.digitalConfidence))
    ).length;

    const duplicateLearners =
        filteredLearners.length -
        new Set(
            filteredLearners.map(
                l => (l.learnerId || l.learner || "").trim()
            )
        ).size;

    const riskData = [
        { name: "High", value: highRisk },
        { name: "Medium", value: mediumRisk },
        { name: "Low", value: lowRisk },
    ];

    const provinceData = Object.entries(
        filteredLearners.reduce((acc, learner) => {
            if (!learner.province || learner.province.trim() === "") {
                return acc;
            }

            acc[learner.province] =
                (acc[learner.province] || 0) + 1;

            return acc;
        }, {})
    ).map(([name, value]) => ({ name, value }));

    const deviceData = Object.entries(
        filteredLearners.reduce((acc, l) => {
            if (!l.deviceAccess || l.deviceAccess.trim() === "") {
                return acc;
            }

            acc[l.deviceAccess] =
                (acc[l.deviceAccess] || 0) + 1;

            return acc;
        }, {})
    ).map(([name, value]) => ({ name, value }));

    const COLORS = [
        "#ef4444",
        "#facc15",
        "#22c55e"
    ];

    const phoneOnlyCount = filteredLearners.filter(
        l => l.deviceAccess === "Phone only"
    ).length;

    const laptopCount = filteredLearners.filter(
        l => l.deviceAccess === "Laptop"
    ).length;

    const sharedLaptopCount = filteredLearners.filter(
        l => l.deviceAccess === "Shared laptop"
    ).length;

    const limitedInternetCount = filteredLearners.filter(
        l => l.internetAccess === "Limited"
    ).length;

    const lowDigitalConfidenceCount = filteredLearners.filter(
        l => Number(l.digitalConfidence) <= 2
    ).length;

    const highAttendanceRiskCount = filteredLearners.filter(
        l => l.attendanceRisk === "High"
    ).length;

    const insights = [
        `${highRisk} high-risk learner(s) require support.`,
        `${phoneOnlyCount} learner(s) rely on phone-only access.`,
        `${limitedInternetCount} learner(s) have limited internet.`,
        `${lowDigitalConfidenceCount} learner(s) have low digital confidence.`,
        `${highAttendanceRiskCount} learner(s) have high attendance risk.`,
    ];

    const recommendations = [];

    if (highRisk >= 3) {
        recommendations.push(
            "Provide mentorship and academic support for high-risk learners."
        );
    }

    if (limitedInternetCount >= 3) {
        recommendations.push(
            "Provide mobile data support for learners with limited internet."
        );
    }

    if (phoneOnlyCount >= 3) {
        recommendations.push(
            "Ensure learning platforms are mobile-friendly."
        );
    }

    if (lowDigitalConfidenceCount >= 3) {
        recommendations.push(
            "Provide beginner-friendly digital skills sessions."
        );
    }

    if (highAttendanceRiskCount >= 3) {
        recommendations.push(
            "Follow up with high-attendance-risk learners early."
        );
    }

    const aiAdvice = [];

    if (highRisk > 0) {
        aiAdvice.push(
            `${highRisk} learner(s) should receive weekly check-ins, mentoring, and academic support.`
        );
    }

    if (phoneOnlyCount > 0) {
        aiAdvice.push(
            `${phoneOnlyCount} learner(s) need mobile-friendly learning materials.`
        );
    }

    if (laptopCount > 0) {
        aiAdvice.push(
            `${laptopCount} learner(s) have laptop access and can handle coding/project tasks more easily.`
        );
    }

    if (sharedLaptopCount > 0) {
        aiAdvice.push(
            `${sharedLaptopCount} learner(s) need flexible deadlines or scheduled lab access.`
        );
    }

    if (limitedInternetCount > 0) {
        aiAdvice.push(
            `${limitedInternetCount} learner(s) may need data support or offline resources.`
        );
    }

    if (lowDigitalConfidenceCount > 0) {
        aiAdvice.push(
            `${lowDigitalConfidenceCount} learner(s) need beginner digital skills support.`
        );
    }

    if (highAttendanceRiskCount > 0) {
        aiAdvice.push(
            `${highAttendanceRiskCount} learner(s) need early attendance follow-up.`
        );
    }

    if (aiAdvice.length === 0) {
        aiAdvice.push(
            "No urgent risks detected. Continue regular monitoring."
        );
    }

    const resetFilters = () => {
        setProvinceFilter("");
        setRiskFilter("");
        setSearchTerm("");
    };

    const exportPDF = () => {
        try {
            const doc = new jsPDF();

            doc.setFont("helvetica", "bold");
            doc.setFontSize(20);
            doc.text("Student Support Insights Report", 20, 20);

            doc.setFont("helvetica", "normal");
            doc.setFontSize(11);
            doc.text(`Generated: ${new Date().toLocaleDateString()}`, 20, 30);

            doc.setFont("helvetica", "bold");
            doc.setFontSize(16);
            doc.text("Filtered Summary", 20, 50);

            doc.setFont("helvetica", "normal");
            doc.setFontSize(12);
            doc.text(`Total Learners: ${totalLearners}`, 25, 65);
            doc.text(`High Risk Learners: ${highRisk}`, 25, 75);
            doc.text(`Medium Risk Learners: ${mediumRisk}`, 25, 85);
            doc.text(`Low Risk Learners: ${lowRisk}`, 25, 95);

            doc.setFont("helvetica", "bold");
            doc.setFontSize(16);
            doc.text("Data Quality", 20, 115);

            doc.setFont("helvetica", "normal");
            doc.setFontSize(12);
            doc.text(`Missing Provinces: ${missingProvince}`, 25, 130);
            doc.text(`Invalid Confidence Scores: ${invalidDigitalConfidence}`, 25, 140);
            doc.text(`Duplicate Learners: ${duplicateLearners}`, 25, 150);

            doc.setFont("helvetica", "bold");
            doc.setFontSize(16);
            doc.text("AI Insights", 20, 170);

            doc.setFont("helvetica", "normal");
            doc.setFontSize(12);

            let insightY = 185;

            insights.forEach((insight) => {
                doc.text(`• ${insight}`, 25, insightY);
                insightY += 10;
            });

            doc.setFont("helvetica", "bold");
            doc.setFontSize(16);
            doc.text("Recommendations", 20, insightY + 15);

            doc.setFont("helvetica", "normal");
            doc.setFontSize(12);

            let recY = insightY + 30;

            if (recommendations.length > 0) {
                recommendations.forEach((rec) => {
                    doc.text(`• ${rec}`, 25, recY);
                    recY += 10;
                });
            } else {
                doc.text("• No major recommendations currently.", 25, recY);
                recY += 10;
            }

            if (recY > 240) {
                doc.addPage();
                recY = 25;
            }

            doc.setFont("helvetica", "bold");
            doc.setFontSize(16);
            doc.text("AI Support Advice", 20, recY + 15);

            doc.setFont("helvetica", "normal");
            doc.setFontSize(12);

            let adviceY = recY + 30;

            aiAdvice.forEach((advice) => {
                if (adviceY > 270) {
                    doc.addPage();
                    adviceY = 25;
                }

                const splitAdvice = doc.splitTextToSize(`• ${advice}`, 160);

                doc.text(splitAdvice, 25, adviceY);

                adviceY += splitAdvice.length * 7 + 5;
            });

            doc.setFontSize(10);
            doc.text(
                "AI-Enabled Student Support Insights Tool",
                20,
                285
            );

            doc.save("student-support-insights-report.pdf");

        } catch (error) {
            console.log(error);
            alert("PDF export failed");
        }
    };

    const exportCSV = () => {
        const csv = Papa.unparse(filteredLearners);

        const blob = new Blob([csv], {
            type: "text/csv;charset=utf-8;"
        });

        const url = URL.createObjectURL(blob);

        const link = document.createElement("a");

        link.href = url;

        link.setAttribute(
            "download",
            "filtered-learners-data.csv"
        );

        document.body.appendChild(link);

        link.click();

        document.body.removeChild(link);
    };

    return (
        <div className="bg-gray-100 min-h-screen text-sm">

            {/* HEADER */}

            <div className="flex justify-between items-center mb-3">

                <div>
                    <h1 className="text-2xl font-bold">
                        Dashboard Overview
                    </h1>

                    <p className="text-gray-600 text-xs mt-1">
                        Analytics, risk indicators, data quality and programme recommendations.
                    </p>
                </div>

                <div className="flex gap-2">

                    <button
                        onClick={exportPDF}
                        className="bg-red-600 text-white px-3 py-2 rounded shadow hover:bg-red-700 text-xs"
                    >
                        Export PDF
                    </button>

                    <button
                        onClick={exportCSV}
                        className="bg-green-600 text-white px-3 py-2 rounded shadow hover:bg-green-700 text-xs"
                    >
                        Export CSV
                    </button>

                </div>
            </div>

            {/* DASHBOARD FILTERS */}

            <div className="bg-white p-3 rounded shadow mb-3">

                <div className="flex justify-between items-center mb-2">
                    <h2 className="font-bold">
                        View Insights By
                    </h2>

                    <button
                        onClick={resetFilters}
                        className="bg-gray-200 text-gray-700 px-3 py-1 rounded hover:bg-gray-300 text-xs"
                    >
                        Reset
                    </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-2">

                    <input
                        type="text"
                        placeholder="Search Learner ID"
                        value={searchTerm}
                        onChange={(e) =>
                            setSearchTerm(e.target.value)
                        }
                        className="border p-2 rounded text-xs"
                    />

                    <select
                        value={provinceFilter}
                        onChange={(e) =>
                            setProvinceFilter(e.target.value)
                        }
                        className="border p-2 rounded text-xs"
                    >
                        <option value="">All Provinces</option>

                        {[...new Set(
                            learners
                                .map(l => l.province)
                                .filter(Boolean)
                        )].map((province) => (

                            <option
                                key={province}
                                value={province}
                            >
                                {province}
                            </option>
                        ))}
                    </select>

                    <select
                        value={riskFilter}
                        onChange={(e) =>
                            setRiskFilter(e.target.value)
                        }
                        className="border p-2 rounded text-xs"
                    >
                        <option value="">All Risk Levels</option>
                        <option value="High">High</option>
                        <option value="Medium">Medium</option>
                        <option value="Low">Low</option>
                    </select>

                </div>

            </div>

            {/* SUMMARY + QUALITY CARDS */}

            <div className="grid grid-cols-2 md:grid-cols-7 gap-3 mb-3">

                <div className="bg-white p-3 rounded shadow">
                    <h2 className="text-gray-600 text-xs">
                        Learners
                    </h2>

                    <p className="text-2xl font-bold">
                        {totalLearners}
                    </p>
                </div>

                <div className="bg-red-100 p-3 rounded shadow">
                    <h2 className="text-red-700 font-semibold text-xs">
                        High
                    </h2>

                    <p className="text-2xl font-bold">
                        {highRisk}
                    </p>
                </div>

                <div className="bg-yellow-100 p-3 rounded shadow">
                    <h2 className="text-yellow-700 font-semibold text-xs">
                        Medium
                    </h2>

                    <p className="text-2xl font-bold">
                        {mediumRisk}
                    </p>
                </div>

                <div className="bg-green-100 p-3 rounded shadow">
                    <h2 className="text-green-700 font-semibold text-xs">
                        Low
                    </h2>

                    <p className="text-2xl font-bold">
                        {lowRisk}
                    </p>
                </div>

                <div className="bg-white p-3 rounded shadow border-l-4 border-red-500">
                    <h2 className="font-semibold text-gray-800 text-[10px] leading-tight">
                        Missing Provinces
                    </h2>

                    <p className="text-2xl font-bold mt-1">
                        {missingProvince}
                    </p>
                </div>

                <div className="bg-white p-3 rounded shadow border-l-4 border-yellow-500">
                    <h2 className="font-semibold text-gray-800 text-[10px] leading-tight">
                        Invalid Scores
                    </h2>

                    <p className="text-2xl font-bold mt-1">
                        {invalidDigitalConfidence}
                    </p>
                </div>

                <div className="bg-white p-3 rounded shadow border-l-4 border-blue-500">
                    <h2 className="font-semibold text-gray-800 text-[10px] leading-tight">
                        Duplicate Learners
                    </h2>

                    <p className="text-2xl font-bold mt-1">
                        {duplicateLearners}
                    </p>
                </div>

            </div>

            {/* VISUALISATIONS */}

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-3 mb-3">

                <div className="bg-white p-3 rounded shadow h-[260px]">

                    <h2 className="font-bold mb-1">
                        Risk Distribution
                    </h2>

                    <ResponsiveContainer width="100%" height="90%">

                        <PieChart>

                            <Pie
                                data={riskData}
                                dataKey="value"
                                nameKey="name"
                                outerRadius={70}
                                label
                            >

                                {riskData.map((entry, index) => (

                                    <Cell
                                        key={`risk-${index}`}
                                        fill={COLORS[index % COLORS.length]}
                                    />
                                ))}

                            </Pie>

                            <Tooltip />
                            <Legend />

                        </PieChart>

                    </ResponsiveContainer>

                </div>

                <div className="bg-white p-3 rounded shadow h-[260px]">

                    <h2 className="font-bold mb-1">
                        Learners by Province
                    </h2>

                    <ResponsiveContainer width="100%" height="90%">

                        <BarChart data={provinceData}>

                            <XAxis
                                dataKey="name"
                                tick={{ fontSize: 10 }}
                            />

                            <YAxis tick={{ fontSize: 10 }} />
                            <Tooltip />

                            <Bar
                                dataKey="value"
                                name="Learners"
                                fill="#3b82f6"
                                radius={[5, 5, 0, 0]}
                            />

                        </BarChart>

                    </ResponsiveContainer>

                </div>

                <div className="bg-white p-3 rounded shadow h-[260px]">

                    <h2 className="font-bold mb-1">
                        Device Access
                    </h2>

                    <ResponsiveContainer width="100%" height="90%">

                        <BarChart data={deviceData}>

                            <XAxis
                                dataKey="name"
                                interval={0}
                                angle={-20}
                                textAnchor="end"
                                height={45}
                                tick={{ fontSize: 10 }}
                            />

                            <YAxis tick={{ fontSize: 10 }} />
                            <Tooltip />

                            <Bar
                                dataKey="value"
                                name="Learners"
                                fill="#8b5cf6"
                                radius={[5, 5, 0, 0]}
                            />

                        </BarChart>

                    </ResponsiveContainer>

                </div>

            </div>

            {/* AI SECTIONS */}

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-3">

                <div className="bg-white p-4 rounded shadow h-[190px] overflow-y-auto">

                    <h2 className="font-bold mb-2">
                        AI Insights
                    </h2>

                    <ul className="list-disc pl-5 text-gray-700 text-xs space-y-1">

                        {insights.map((insight, index) => (

                            <li key={index}>
                                {insight}
                            </li>
                        ))}

                    </ul>

                </div>

                <div className="bg-white p-4 rounded shadow h-[190px] overflow-y-auto">

                    <h2 className="font-bold mb-2">
                        AI Recommendations
                    </h2>

                    <ul className="list-disc pl-5 space-y-1 text-gray-700 text-xs">

                        {recommendations.length > 0 ? (

                            recommendations.map((rec, index) => (

                                <li key={index}>{rec}</li>
                            ))

                        ) : (

                            <li>No major recommendations currently.</li>
                        )}

                    </ul>

                </div>

                <div className="bg-white p-4 rounded shadow h-[190px] overflow-y-auto">

                    <h2 className="font-bold mb-2">
                        AI Support Advice
                    </h2>

                    <p className="text-[11px] text-gray-500 mb-2">
                        Generated from current dashboard data.
                    </p>

                    <ul className="list-disc pl-5 space-y-1 text-gray-700 text-xs">

                        {aiAdvice.map((advice, index) => (

                            <li key={index}>
                                {advice}
                            </li>
                        ))}

                    </ul>

                </div>

            </div>

        </div>
    );
}