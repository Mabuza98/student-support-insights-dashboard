import { Routes, Route } from "react-router-dom";

import Sidebar from "./components/Sidebar";
import Dashboard from "./pages/Dashboard";
import AddLearner from "./pages/AddLearner";
import LearnersTable from "./pages/LearnersTable";
import Ethics from "./pages/Ethics";

export default function App() {
    return (
        <div className="flex min-h-screen bg-gray-100">
            <Sidebar />

            <main className="flex-1 p-6 overflow-y-auto">
                <Routes>
                    <Route path="/" element={<Dashboard />} />
                    <Route path="/add-learner" element={<AddLearner />} />
                    <Route path="/learners" element={<LearnersTable />} />
                    <Route path="/ethics" element={<Ethics />} />
                </Routes>
            </main>
        </div>
    );
}