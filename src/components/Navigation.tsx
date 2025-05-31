import { Link } from "react-router-dom";
import { authApiService } from "../api/ApiService";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

function Navigation() {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const handleLogout = async () => {
    setIsLoading(true);
    // Placeholder for logout handling logic
    // This function should handle the logout logic, e.g., clearing tokens
    try {
      const res = await authApiService.postData("/logout", {});

      console.log("User logged out successfully", res);
      localStorage.removeItem("auth_token");
      navigate("/login");
    } catch (error: unknown) {
      console.error("Error logging out user:", error);
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <div>
      <nav>
        <div className="flex justify-between w-full bg-slate-700 text-white p-4">
          <Link to="/" className="text-2xl font-bold">
            Task It
          </Link>
          <button onClick={handleLogout} className="cursor-pointer">
            Logout
          </button>
        </div>
      </nav>
      <Dialog open={isLoading} onOpenChange={setIsLoading}>
        <DialogContent className="sm:max-w-[425px]" showCloseButton={false}>
          <DialogHeader>
            <DialogTitle>Logging out...</DialogTitle>
            <DialogDescription className="flex flex-col items-center gap-4">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
              <p>Please wait while we process your logout...</p>
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default Navigation;
