import { useNavigate } from "react-router-dom";

function RoleSelectPage() {
  const navigate = useNavigate();

  const handleRole = (role) => {
    if (role === "admin") {
      navigate("/admin-dashboard");
    } else if (role === "mechanic") {
      navigate("/mechanic-dashboard");
    }
  };

  return (
    <div className="RoleSelectPage">
      <div className="RoleSelectCard">
        <h1 className="RoleTitle">Select Your Role</h1>
        <p className="RoleSub">Choose how you want to continue</p>

        <div className="RoleOptions">
          <button className="RoleButton admin" onClick={() => handleRole("admin")}>
            <img src="/manager.png" alt="Admin Icon" className="RoleIcon" />
            Admin
          </button>

          <button className="RoleButton mechanic" onClick={() => handleRole("mechanic")}>
            <img src="/automobile-with-wrench.png" alt="Mechanic Icon" className="RoleIcon" />
            Mechanic
          </button>
        </div>
      </div>
    </div>
  );
}

export default RoleSelectPage;
