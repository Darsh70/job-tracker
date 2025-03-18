import { Link, Routes, Route } from "react-router-dom";
import Table from "./pages/Table";


function App() {
  return (
    <div>
      <nav>
        <Link to="/">Table</Link>
      </nav>

      <Routes>
        <Route path="/" element={<Table />} />
      </Routes>
    </div>
  );
}

export default App;
