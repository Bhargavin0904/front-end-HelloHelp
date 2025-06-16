// components/LogoutButton.js
import { useNavigate } from "react-router-dom";
import MDButton from "components/MDButton";

function LogoutButton() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/authentication/sign-in");
  };

  return (
    <MDButton color="error" onClick={handleLogout}>
      Logout
    </MDButton>
  );
}

export default LogoutButton;
