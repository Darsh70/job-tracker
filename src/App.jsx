import { Link, Routes, Route } from "react-router-dom";
import JobTable from "./pages/JobTable";
import Analytics from "./pages/Analytics";
import './App.css'; 

function App() {
  return (
    <div>
      <header className="header">
        <Link to="/" className="titleLink">
        <h1 className="jobTrackerTitle">Job Tracker</h1>
        </Link>
        <nav className="nav">
          <Link to="/">Table</Link>
          <span className="separator">|</span>
          <Link to="/analytics">Analytics</Link>
        </nav>
      </header>

      <Routes>
        <Route path="/" element={<JobTable />} />
        <Route path="/analytics" element={<Analytics />} />
      </Routes>
    </div>
  );
}

export default App;
