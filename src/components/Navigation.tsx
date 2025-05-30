import { Link } from "react-router-dom";
import { authApiService } from "../api/Auth";
import { useNavigate } from "react-router-dom";
function Navigation() {
  const navigate = useNavigate();
  const handleLogout = async () => {
    // Placeholder for logout handling logic
    // This function should handle the logout logic, e.g., clearing tokens
    try {
      const res = await authApiService.postData("/logout", {});

      console.log("User logged out successfully", res);
      localStorage.removeItem("auth_token");
      navigate("/login");
    } catch (error: unknown) {
      console.error("Error logging out user:", error);
    }
  };
  return (
    <div>
      <nav>
        <div className="flex justify-between w-full bg-slate-700 text-white p-4">
          <Link to="/">Task It</Link>
          <button onClick={handleLogout} className="cursor-pointer">
            Logout
          </button>
        </div>
      </nav>
    </div>
  );
}

export default Navigation;
