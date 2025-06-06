// components/LogoutButton.js
import { useNavigate } from "react-router-dom";
import MDButton from "components/MDButton";

function LogoutButton() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token"); // Clear token
    navigate("/authentication/sign-in"); // Redirect to login
  };

  return (
    <MDButton color="error" onClick={handleLogout}>
      Logout
    </MDButton>
  );
}

export default LogoutButton;
