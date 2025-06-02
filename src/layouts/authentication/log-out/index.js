import { useNavigate } from "react-router-dom";
import MDButton from "components/MDButton";

function LogoutButton() {
  const navigate = useNavigate();

  const handleLogout = () => {
    // Remove token or any auth info
    localStorage.removeItem("token");
    // Redirect to login page
    navigate("/authentication/sign-in");
  };

  return (
    <MDButton color="error" onClick={handleLogout}>
      Logout
    </MDButton>
  );
}
export default LogoutButton;
