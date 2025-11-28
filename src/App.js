import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./Style.css";

import Login from "./Pages/Login"; 
import Register from "./Pages/Register";
import RoleSelectPage from "./Pages/RoleSelectPage";
import AdminDashboard from "./Pages/AdminDashboard";
import MechanicDashboard from "./Pages/MechanicDashboard";

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<RoleSelectPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/select-role" element={<RoleSelectPage />} />
          <Route path="/admin-dashboard" element={<AdminDashboard />} />
          <Route path="/mechanic-dashboard" element={<MechanicDashboard />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
