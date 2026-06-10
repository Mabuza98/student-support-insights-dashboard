import { useEffect, useState } from "react";
import API from "../api/api";
import toast from "react-hot-toast";

export default function LearnersTable() {
    const [learners, setLearners] = useState([]);
    const [provinceFilter, setProvinceFilter] = useState("");
    const [riskFilter, setRiskFilter] = useState("");
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedLearner, setSelectedLearner] = useState(null);
    const [deleteLearner, setDeleteLearner] = useState(null);

    const [isEditing, setIsEditing] = useState(false);
    const [editForm, setEditForm] = useState({
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

    useEffect(() => {
        loadLearners();
    }, []);

    const loadLearners = async () => {
        try {
            const res = await API.get("/learners");
            setLearners(res.data);
        } catch (err) {
            console.log(err);
            toast.error("Failed to load learners");
        }
    };

    const openLearnerModal = (learner) => {
        setSelectedLearner(learner);
        setIsEditing(false);

        setEditForm({
            learnerId: learner.learnerId || "",
            ageBand: learner.ageBand || "",
            province: learner.province || "",
            deviceAccess: learner.deviceAccess || "",
            internetAccess: learner.internetAccess || "",
            digitalConfidence: learner.digitalConfidence || "",
            programmingConfidence: learner.programmingConfidence || "",
            aiFamiliarity: learner.aiFamiliarity || "",
            employmentStatus: learner.employmentStatus || "",
            supportNeed: learner.supportNeed || "",
            attendanceRisk: learner.attendanceRisk || "",
            notes: learner.notes || ""
        });
    };

    const closeLearnerModal = () => {
        setSelectedLearner(null);
        setIsEditing(false);
    };

    const handleEditChange = (e) => {
        setEditForm({
            ...editForm,
            [e.target.name]: e.target.value
        });
    };

    const handleUpdateLearner = async (e) => {
        e.preventDefault();

        if (!selectedLearner) return;

        const learnerId = selectedLearner.id || selectedLearner._id;

        try {
            const payload = {
                id: learnerId,
                learnerId: editForm.learnerId.trim(),
                ageBand: editForm.ageBand,
                province: editForm.province,
                deviceAccess: editForm.deviceAccess,
                internetAccess: editForm.internetAccess,
                digitalConfidence: Number(editForm.digitalConfidence),
                programmingConfidence: Number(editForm.programmingConfidence),
                aiFamiliarity: Number(editForm.aiFamiliarity),
                employmentStatus: editForm.employmentStatus,
                supportNeed: editForm.supportNeed,
                attendanceRisk: editForm.attendanceRisk,
                notes: editForm.notes || ""
            };

            await API.put(`/learners/${learnerId}`, payload);

            toast.success("Learner updated successfully");

            setIsEditing(false);
            setSelectedLearner(null);

            loadLearners();

        } catch (err) {
            console.log(err);

            if (err.response) {
                toast.error(
                    typeof err.response.data === "string"
                        ? err.response.data
                        : JSON.stringify(err.response.data)
                );
            } else {
                toast.error("Failed to update learner");
            }
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

    const getRiskExplanation = (learner) => {
        const reasons = [];

        if (learner.internetAccess === "Limited") {
            reasons.push("Limited internet");
        }

        if (learner.deviceAccess === "Phone only") {
            reasons.push("Phone-only access");
        }

        if (learner.digitalConfidence <= 2) {
            reasons.push("Low digital confidence");
        }

        if (learner.attendanceRisk === "High") {
            reasons.push("High attendance risk");
        }

        return reasons.join(", ");
    };

    const handleDelete = async () => {
        if (!deleteLearner) return;

        try {
            await API.delete(
                `/learners/${deleteLearner.id || deleteLearner._id}`
            );

            toast.success("Learner deleted successfully");

            setDeleteLearner(null);
            loadLearners();

        } catch (err) {
            console.log(err);
            toast.error("Failed to delete learner");
        }
    };

    return (
        <div>
            <div className="mb-6">
                <h1 className="text-3xl font-bold">
                    Learners Table
                </h1>

                <p className="text-gray-600 mt-1">
                    View, search, filter and manage captured learner records.
                </p>
            </div>

            <div className="bg-white p-4 rounded shadow mb-6 grid grid-cols-3 gap-4">
                <input
                    type="text"
                    placeholder="Search Learner ID"
                    value={searchTerm}
                    onChange={(e) =>
                        setSearchTerm(e.target.value)
                    }
                    className="border p-2 rounded"
                />

                <select
                    value={provinceFilter}
                    onChange={(e) =>
                        setProvinceFilter(e.target.value)
                    }
                    className="border p-2 rounded"
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
                    className="border p-2 rounded"
                >
                    <option value="">All Risk Levels</option>
                    <option value="High">High</option>
                    <option value="Medium">Medium</option>
                    <option value="Low">Low</option>
                </select>
            </div>

            <div className="bg-white p-3 rounded shadow overflow-x-auto">
                <h2 className="text-base font-bold mb-2">
                    Learners
                </h2>

                {filteredLearners.length === 0 ? (
                    <div className="text-center py-10 text-gray-500">
                        No learners found.
                    </div>
                ) : (
                    <table className="w-full text-xs border-collapse">
                        <thead>
                            <tr className="bg-gray-200 text-left">
                                <th className="p-1 border">Learner ID</th>
                                <th className="p-1 border">Province</th>
                                <th className="p-1 border text-center">Score</th>
                                <th className="p-1 border text-center">Risk</th>
                                <th className="p-1 border">AI Explanation</th>
                                <th className="p-1 border text-center">Actions</th>
                            </tr>
                        </thead>

                        <tbody>
                            {filteredLearners.map((learner) => (
                                <tr
                                    key={learner.id || learner._id}
                                    className="hover:bg-gray-50"
                                >
                                    <td
                                        className="p-1 border cursor-pointer"
                                        onClick={() => openLearnerModal(learner)}
                                    >
                                        {learner.learnerId || learner.learner}
                                    </td>

                                    <td className="p-1 border">
                                        {learner.province}
                                    </td>

                                    <td className="p-1 border text-center">
                                        {learner.riskScore}
                                    </td>

                                    <td
                                        className={`p-1 border text-center font-semibold ${learner.riskLevel === "High"
                                            ? "text-red-600"
                                            : learner.riskLevel === "Medium"
                                                ? "text-yellow-600"
                                                : "text-green-600"
                                            }`}
                                    >
                                        {learner.riskLevel}
                                    </td>

                                    <td className="p-1 border text-[11px]">
                                        {getRiskExplanation(learner)}
                                    </td>

                                    <td className="p-1 border">
                                        <div className="flex gap-1 justify-center">
                                            <button
                                                onClick={() =>
                                                    openLearnerModal(learner)
                                                }
                                                className="bg-blue-500 text-white px-2 py-1 rounded text-[10px]"
                                            >
                                                View
                                            </button>

                                            <button
                                                onClick={() =>
                                                    setDeleteLearner(learner)
                                                }
                                                className="bg-red-500 text-white px-2 py-1 rounded text-[10px]"
                                            >
                                                Delete
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>

            {selectedLearner && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                    <div className="bg-white w-[90%] max-w-3xl rounded-xl shadow-2xl p-6 relative overflow-y-auto max-h-[90vh]">
                        <button
                            onClick={closeLearnerModal}
                            className="absolute top-4 right-4 bg-red-500 text-white px-3 py-1 rounded"
                        >
                            X
                        </button>

                        <div className="flex justify-between items-center mb-6 pr-12">
                            <h2 className="text-2xl font-bold">
                                {isEditing
                                    ? "Edit Learner"
                                    : "Learner Details"}
                            </h2>

                            {!isEditing && (
                                <button
                                    onClick={() => setIsEditing(true)}
                                    className="bg-blue-600 text-white px-4 py-2 rounded"
                                >
                                    Edit Learner
                                </button>
                            )}
                        </div>

                        {!isEditing ? (
                            <>
                                <div className="grid grid-cols-2 gap-4 text-sm">
                                    <div className="bg-gray-100 p-3 rounded">
                                        <p className="font-semibold">Learner ID</p>
                                        <p>{selectedLearner.learnerId}</p>
                                    </div>

                                    <div className="bg-gray-100 p-3 rounded">
                                        <p className="font-semibold">Province</p>
                                        <p>{selectedLearner.province}</p>
                                    </div>

                                    <div className="bg-gray-100 p-3 rounded">
                                        <p className="font-semibold">Age Band</p>
                                        <p>{selectedLearner.ageBand}</p>
                                    </div>

                                    <div className="bg-gray-100 p-3 rounded">
                                        <p className="font-semibold">Employment Status</p>
                                        <p>{selectedLearner.employmentStatus}</p>
                                    </div>

                                    <div className="bg-gray-100 p-3 rounded">
                                        <p className="font-semibold">Device Access</p>
                                        <p>{selectedLearner.deviceAccess}</p>
                                    </div>

                                    <div className="bg-gray-100 p-3 rounded">
                                        <p className="font-semibold">Internet Access</p>
                                        <p>{selectedLearner.internetAccess}</p>
                                    </div>

                                    <div className="bg-gray-100 p-3 rounded">
                                        <p className="font-semibold">Digital Confidence</p>
                                        <p>{selectedLearner.digitalConfidence}/5</p>
                                    </div>

                                    <div className="bg-gray-100 p-3 rounded">
                                        <p className="font-semibold">Programming Confidence</p>
                                        <p>{selectedLearner.programmingConfidence}/5</p>
                                    </div>

                                    <div className="bg-gray-100 p-3 rounded">
                                        <p className="font-semibold">AI Familiarity</p>
                                        <p>{selectedLearner.aiFamiliarity}/5</p>
                                    </div>

                                    <div className="bg-gray-100 p-3 rounded">
                                        <p className="font-semibold">Attendance Risk</p>
                                        <p>{selectedLearner.attendanceRisk}</p>
                                    </div>
                                </div>

                                <div className="mt-6 bg-red-50 border border-red-200 p-4 rounded">
                                    <h3 className="font-bold text-lg mb-2">
                                        AI Risk Analysis
                                    </h3>

                                    <p className="mb-2">
                                        <span className="font-semibold">
                                            Risk Level:
                                        </span>{" "}

                                        <span
                                            className={`px-3 py-1 rounded text-white text-sm ${selectedLearner.riskLevel === "High"
                                                ? "bg-red-500"
                                                : selectedLearner.riskLevel === "Medium"
                                                    ? "bg-yellow-500"
                                                    : "bg-green-500"
                                                }`}
                                        >
                                            {selectedLearner.riskLevel}
                                        </span>
                                    </p>

                                    <p className="mb-2">
                                        <span className="font-semibold">
                                            Risk Score:
                                        </span>{" "}
                                        {selectedLearner.riskScore}
                                    </p>

                                    <p>
                                        <span className="font-semibold">
                                            AI Explanation:
                                        </span>{" "}
                                        {getRiskExplanation(selectedLearner)}
                                    </p>
                                </div>

                                <div className="mt-6 bg-blue-50 border border-blue-200 p-4 rounded">
                                    <h3 className="font-bold text-lg mb-2">
                                        Support Needs
                                    </h3>

                                    <p>
                                        {selectedLearner.supportNeed}
                                    </p>
                                </div>

                                <div className="mt-6 bg-green-50 border border-green-200 p-4 rounded">
                                    <h3 className="font-bold text-lg mb-2">
                                        AI Recommendation
                                    </h3>

                                    <p>
                                        {selectedLearner.riskLevel === "High"
                                            ? "Immediate mentorship, academic intervention, and regular check-ins recommended."
                                            : selectedLearner.riskLevel === "Medium"
                                                ? "Monitor learner progress and provide additional learning support where needed."
                                                : "Learner currently appears stable with low support risk."
                                        }
                                    </p>
                                </div>

                                <div className="mt-6 bg-gray-50 border p-4 rounded">
                                    <h3 className="font-bold text-lg mb-2">
                                        Notes
                                    </h3>

                                    <p>
                                        {selectedLearner.notes || "No notes available."}
                                    </p>
                                </div>
                            </>
                        ) : (
                            <form
                                onSubmit={handleUpdateLearner}
                                className="grid grid-cols-2 gap-4"
                            >
                                <input
                                    type="text"
                                    name="learnerId"
                                    value={editForm.learnerId}
                                    onChange={handleEditChange}
                                    className="border p-2 rounded"
                                    required
                                />

                                <select
                                    name="ageBand"
                                    value={editForm.ageBand}
                                    onChange={handleEditChange}
                                    className="border p-2 rounded"
                                    required
                                >
                                    <option value="">Select Age Band</option>
                                    <option value="18-24">18-24</option>
                                    <option value="25-29">25-29</option>
                                    <option value="30-35">30-35</option>
                                </select>

                                <select
                                    name="province"
                                    value={editForm.province}
                                    onChange={handleEditChange}
                                    className="border p-2 rounded"
                                    required
                                >
                                    <option value="">Select Province</option>
                                    <option value="Western Cape">Western Cape</option>
                                    <option value="Gauteng">Gauteng</option>
                                    <option value="KZN">KZN</option>
                                </select>

                                <select
                                    name="deviceAccess"
                                    value={editForm.deviceAccess}
                                    onChange={handleEditChange}
                                    className="border p-2 rounded"
                                    required
                                >
                                    <option value="">Select Device Access</option>
                                    <option value="Laptop">Laptop</option>
                                    <option value="Shared laptop">Shared laptop</option>
                                    <option value="Phone only">Phone only</option>
                                </select>

                                <select
                                    name="internetAccess"
                                    value={editForm.internetAccess}
                                    onChange={handleEditChange}
                                    className="border p-2 rounded"
                                    required
                                >
                                    <option value="">Select Internet Access</option>
                                    <option value="Reliable">Reliable</option>
                                    <option value="Limited">Limited</option>
                                    <option value="None">None</option>
                                </select>

                                <select
                                    name="digitalConfidence"
                                    value={editForm.digitalConfidence}
                                    onChange={handleEditChange}
                                    className="border p-2 rounded"
                                    required
                                >
                                    <option value="">Digital Confidence</option>
                                    <option value="1">1</option>
                                    <option value="2">2</option>
                                    <option value="3">3</option>
                                    <option value="4">4</option>
                                    <option value="5">5</option>
                                </select>

                                <select
                                    name="programmingConfidence"
                                    value={editForm.programmingConfidence}
                                    onChange={handleEditChange}
                                    className="border p-2 rounded"
                                    required
                                >
                                    <option value="">Programming Confidence</option>
                                    <option value="1">1</option>
                                    <option value="2">2</option>
                                    <option value="3">3</option>
                                    <option value="4">4</option>
                                    <option value="5">5</option>
                                </select>

                                <select
                                    name="aiFamiliarity"
                                    value={editForm.aiFamiliarity}
                                    onChange={handleEditChange}
                                    className="border p-2 rounded"
                                    required
                                >
                                    <option value="">AI Familiarity</option>
                                    <option value="1">1</option>
                                    <option value="2">2</option>
                                    <option value="3">3</option>
                                    <option value="4">4</option>
                                    <option value="5">5</option>
                                </select>

                                <select
                                    name="employmentStatus"
                                    value={editForm.employmentStatus}
                                    onChange={handleEditChange}
                                    className="border p-2 rounded"
                                    required
                                >
                                    <option value="">Employment Status</option>
                                    <option value="Unemployed">Unemployed</option>
                                    <option value="Underemployed">Underemployed</option>
                                    <option value="Part-time">Part-time</option>
                                </select>

                                <select
                                    name="supportNeed"
                                    value={editForm.supportNeed}
                                    onChange={handleEditChange}
                                    className="border p-2 rounded"
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
                                    value={editForm.attendanceRisk}
                                    onChange={handleEditChange}
                                    className="border p-2 rounded"
                                    required
                                >
                                    <option value="">Attendance Risk</option>
                                    <option value="Low">Low</option>
                                    <option value="Medium">Medium</option>
                                    <option value="High">High</option>
                                </select>

                                <textarea
                                    name="notes"
                                    value={editForm.notes}
                                    onChange={handleEditChange}
                                    className="border p-2 rounded col-span-2"
                                    placeholder="Notes"
                                />

                                <div className="col-span-2 flex justify-end gap-3">
                                    <button
                                        type="button"
                                        onClick={() => setIsEditing(false)}
                                        className="bg-gray-400 text-white px-4 py-2 rounded"
                                    >
                                        Cancel
                                    </button>

                                    <button
                                        type="submit"
                                        className="bg-blue-600 text-white px-4 py-2 rounded"
                                    >
                                        Save Changes
                                    </button>
                                </div>
                            </form>
                        )}
                    </div>
                </div>
            )}

            {deleteLearner && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                    <div className="bg-white p-6 rounded-xl shadow-xl w-[90%] max-w-md">
                        <h2 className="text-xl font-bold mb-4 text-red-600">
                            Confirm Delete
                        </h2>

                        <p className="mb-6 text-gray-700">
                            Are you sure you want to delete learner:

                            <span className="font-semibold">
                                {" "}
                                {deleteLearner.learnerId}
                            </span>
                            ?
                        </p>

                        <div className="flex justify-end gap-3">
                            <button
                                onClick={() =>
                                    setDeleteLearner(null)
                                }
                                className="bg-gray-300 px-4 py-2 rounded"
                            >
                                Cancel
                            </button>

                            <button
                                onClick={handleDelete}
                                className="bg-red-600 text-white px-4 py-2 rounded"
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}