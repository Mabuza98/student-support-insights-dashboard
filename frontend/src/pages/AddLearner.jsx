import { useState } from "react";
import API from "../api/api";
import Papa from "papaparse";
import toast from "react-hot-toast";

export default function AddLearner() {
    const [loading, setLoading] = useState(false);
    const [uploading, setUploading] = useState(false);

    const [formData, setFormData] = useState({
        learnerId: "",
        ageBand: "",
        province: "",
        deviceAccess: "",
        internetAccess: "",
        digitalConfidence: "",
        programmingConfidence: "",
        aiFamiliarity: "",
        employmentStatus: "",
        supportNeed: "",
        attendanceRisk: "",
        notes: ""
    });

    const cleanNumber = (value) => {
        const num = Number(value);
        return isNaN(num) ? 1 : num;
    };

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const resetForm = () => {
        setFormData({
            learnerId: "",
            ageBand: "",
            province: "",
            deviceAccess: "",
            internetAccess: "",
            digitalConfidence: "",
            programmingConfidence: "",
            aiFamiliarity: "",
            employmentStatus: "",
            supportNeed: "",
            attendanceRisk: "",
            notes: ""
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const payload = {
                learnerId: formData.learnerId.trim(),
                ageBand: formData.ageBand,
                province: formData.province,
                deviceAccess: formData.deviceAccess,
                internetAccess: formData.internetAccess,
                digitalConfidence: Number(formData.digitalConfidence),
                programmingConfidence: Number(formData.programmingConfidence),
                aiFamiliarity: Number(formData.aiFamiliarity),
                employmentStatus: formData.employmentStatus,
                supportNeed: formData.supportNeed,
                attendanceRisk: formData.attendanceRisk,
                notes: formData.notes || ""
            };

            await API.post("/learners", payload);

            toast.success("Learner added successfully");
            resetForm();

        } catch (err) {
            console.log(err);

            if (err.response) {
                toast.error(
                    typeof err.response.data === "string"
                        ? err.response.data
                        : JSON.stringify(err.response.data)
                );
            } else {
                toast.error("Failed to add learner");
            }
        } finally {
            setLoading(false);
        }
    };

    const handleFileUpload = (e) => {
        const file = e.target.files[0];

        if (!file) {
            toast.error("Please select a CSV file");
            return;
        }

        setUploading(true);

        Papa.parse(file, {
            header: true,
            skipEmptyLines: true,

            complete: async (results) => {
                try {
                    for (const learner of results.data) {
                        const cleanLearner = {
                            learnerId: learner.learnerId?.trim() || "",
                            ageBand: learner.ageBand?.trim() || "",
                            province: learner.province?.trim() || "",
                            deviceAccess: learner.deviceAccess?.trim() || "",
                            internetAccess: learner.internetAccess?.trim() || "",
                            digitalConfidence: cleanNumber(learner.digitalConfidence),
                            programmingConfidence: cleanNumber(learner.programmingConfidence),
                            aiFamiliarity: cleanNumber(learner.aiFamiliarity),
                            employmentStatus: learner.employmentStatus?.trim() || "",
                            supportNeed: learner.supportNeed?.trim() || "",
                            attendanceRisk: learner.attendanceRisk?.trim() || "",
                            notes: learner.notes?.trim() || ""
                        };

                        await API.post("/learners", cleanLearner);
                    }

                    toast.success("CSV uploaded successfully");
                    e.target.value = "";

                } catch (err) {
                    console.log("UPLOAD ERROR:", err);

                    if (err.response) {
                        toast.error(JSON.stringify(err.response.data));
                    } else {
                        toast.error("Upload failed");
                    }
                } finally {
                    setUploading(false);
                }
            },

            error: () => {
                setUploading(false);
                toast.error("Could not read CSV file");
            }
        });
    };

    return (
        <div className="max-w-7xl mx-auto">

            <div className="mb-4">
                <h1 className="text-2xl font-bold">
                    Add Learner
                </h1>

                <p className="text-sm text-gray-600 mt-1">
                    Capture a new learner manually or upload learner data using CSV.
                </p>
            </div>

            <div className="bg-white p-4 rounded-lg shadow mb-4">
                <h2 className="text-sm font-semibold mb-2">
                    Upload CSV File
                </h2>

                <input
                    type="file"
                    accept=".csv"
                    onChange={handleFileUpload}
                    disabled={uploading}
                    className="text-sm"
                />

                {uploading && (
                    <p className="text-xs text-gray-500 mt-2">
                        Uploading learners...
                    </p>
                )}
            </div>

            <div className="bg-white p-4 rounded-lg shadow">
                <h2 className="text-lg font-semibold mb-3">
                    Manual Learner Entry
                </h2>

                <form
                    onSubmit={handleSubmit}
                    className="grid grid-cols-1 md:grid-cols-2 gap-3"
                >
                    <input
                        type="text"
                        name="learnerId"
                        placeholder="Learner ID"
                        value={formData.learnerId}
                        onChange={handleChange}
                        className="border p-2 rounded text-sm"
                        required
                    />

                    <select
                        name="ageBand"
                        value={formData.ageBand}
                        onChange={handleChange}
                        className="border p-2 rounded text-sm"
                        required
                    >
                        <option value="">Select Age Band</option>
                        <option value="18-24">18-24</option>
                        <option value="25-29">25-29</option>
                        <option value="30-35">30-35</option>
                    </select>

                    <select
                        name="province"
                        value={formData.province}
                        onChange={handleChange}
                        className="border p-2 rounded text-sm"
                        required
                    >
                        <option value="">Select Province</option>
                        <option value="Western Cape">Western Cape</option>
                        <option value="Gauteng">Gauteng</option>
                        <option value="KZN">KZN</option>
                    </select>

                    <select
                        name="deviceAccess"
                        value={formData.deviceAccess}
                        onChange={handleChange}
                        className="border p-2 rounded text-sm"
                        required
                    >
                        <option value="">Select Device Access</option>
                        <option value="Laptop">Laptop</option>
                        <option value="Shared laptop">Shared laptop</option>
                        <option value="Phone only">Phone only</option>
                    </select>

                    <select
                        name="internetAccess"
                        value={formData.internetAccess}
                        onChange={handleChange}
                        className="border p-2 rounded text-sm"
                        required
                    >
                        <option value="">Select Internet Access</option>
                        <option value="Reliable">Reliable</option>
                        <option value="Limited">Limited</option>
                        <option value="None">None</option>
                    </select>

                    <select
                        name="digitalConfidence"
                        value={formData.digitalConfidence}
                        onChange={handleChange}
                        className="border p-2 rounded text-sm"
                        required
                    >
                        <option value="">Digital Confidence</option>
                        <option value="1">1 - Very Low</option>
                        <option value="2">2 - Low</option>
                        <option value="3">3 - Medium</option>
                        <option value="4">4 - High</option>
                        <option value="5">5 - Very High</option>
                    </select>

                    <select
                        name="programmingConfidence"
                        value={formData.programmingConfidence}
                        onChange={handleChange}
                        className="border p-2 rounded text-sm"
                        required
                    >
                        <option value="">Programming Confidence</option>
                        <option value="1">1 - Very Low</option>
                        <option value="2">2 - Low</option>
                        <option value="3">3 - Medium</option>
                        <option value="4">4 - High</option>
                        <option value="5">5 - Very High</option>
                    </select>

                    <select
                        name="aiFamiliarity"
                        value={formData.aiFamiliarity}
                        onChange={handleChange}
                        className="border p-2 rounded text-sm"
                        required
                    >
                        <option value="">AI Familiarity</option>
                        <option value="1">1 - Very Low</option>
                        <option value="2">2 - Low</option>
                        <option value="3">3 - Medium</option>
                        <option value="4">4 - High</option>
                        <option value="5">5 - Very High</option>
                    </select>

                    <select
                        name="employmentStatus"
                        value={formData.employmentStatus}
                        onChange={handleChange}
                        className="border p-2 rounded text-sm"
                        required
                    >
                        <option value="">Employment Status</option>
                        <option value="Unemployed">Unemployed</option>
                        <option value="Underemployed">Underemployed</option>
                        <option value="Part-time">Part-time</option>
                    </select>

                    <select
                        name="supportNeed"
                        value={formData.supportNeed}
                        onChange={handleChange}
                        className="border p-2 rounded text-sm"
                        required
                    >
                        <option value="">Support Need</option>
                        <option value="Transport">Transport</option>
                        <option value="Data">Data</option>
                        <option value="Academic Support">Academic Support</option>
                        <option value="Mentoring">Mentoring</option>
                    </select>

                    <select
                        name="attendanceRisk"
                        value={formData.attendanceRisk}
                        onChange={handleChange}
                        className="border p-2 rounded text-sm"
                        required
                    >
                        <option value="">Attendance Risk</option>
                        <option value="Low">Low</option>
                        <option value="Medium">Medium</option>
                        <option value="High">High</option>
                    </select>

                    <textarea
                        name="notes"
                        placeholder="Notes"
                        value={formData.notes}
                        onChange={handleChange}
                        className="border p-2 rounded text-sm md:col-span-2"
                    />

                    <button
                        type="submit"
                        disabled={loading}
                        className="bg-green-600 text-white py-2 px-4 rounded text-sm font-medium hover:bg-green-700 transition disabled:opacity-50"
                    >
                        {loading ? "Saving..." : "Add Learner"}
                    </button>
                </form>
            </div>
        </div>
    );
}