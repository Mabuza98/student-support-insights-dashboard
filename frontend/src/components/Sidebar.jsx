import { NavLink } from "react-router-dom";

export default function Sidebar() {
    const linkClass = ({ isActive }) =>
        `block px-4 py-3 rounded-lg mb-2 ${isActive
            ? "bg-blue-600 text-white"
            : "text-gray-700 hover:bg-gray-200"
        }`;

    return (
        <aside className="w-64 bg-grey shadow-lg p-5 min-h-screen">
            <h1 className="text-2xl font-bold mb-8">
                AI Insights
            </h1>

            <nav>
                <NavLink to="/" className={linkClass}>
                    Dashboard
                </NavLink>

                <NavLink to="/add-learner" className={linkClass}>
                    Add Learner
                </NavLink>

                <NavLink to="/learners" className={linkClass}>
                    Learners Table
                </NavLink>

                <NavLink to="/ethics" className={linkClass}>
                    Ethics & Privacy
                </NavLink>
            </nav>
        </aside>
    );
}