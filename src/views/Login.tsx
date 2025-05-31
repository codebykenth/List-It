import { Link, useNavigate } from "react-router-dom";
import FacebookLogo from "../assets/images/Facebook_Logo_Primary.png";
import GoogleLogo from "../assets/images/7123025_logo_google_g_icon.png";
import { useState, type FormEvent } from "react";
import { authApiService } from "../api/ApiService";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import NormalInput from "../components/NormalInput";

export default function Login() {
  // Placeholder for login handling logic
  // This function should handle the login logic, e.g., API calls
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleLogin = async (e: FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setIsError(false);
    try {
      // Create a new FormData instance
      const data = new FormData();

      // Append all form fields to FormData
      Object.entries(formData).forEach(([key, value]) => {
        data.append(key, value);
      });

      const newUser = await authApiService.postData("/login", data);
      console.log("User logged in successfully:", newUser);
      localStorage.setItem("auth_token", newUser.token);
      // Redirect to the home page or any other page after successful login
      navigate("/");
    } catch (error: unknown) {
      setIsError(true); // Show error dialog
      console.error("Error logging in user:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleProvider = async (provider: string) => {
    setIsLoading(true);
    setIsError(false); // Reset error state
    try {
      const response = await authApiService.getData(`/auth/${provider}`);
      if (response.url) {
        window.location.href = response.url;
      }
    } catch (error: unknown) {
      setIsError(true);
      console.error("Error logging in user:", error);
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <div className="sm:max-w-5xl md:max-w-7xl mx-auto p-3 md:px-40">
      <h1 className="text-center sm: text-2xl md:text-3xl">List It</h1>
      <div className="flex flex-col gap-2">
        <form onSubmit={handleLogin}>
          <NormalInput
            labelName="Email"
            inputName="email"
            inputType="email"
            inputValue={formData.email}
            onChange={handleChange}
            // isRequired={true}
          />
          <NormalInput
            labelName="Password"
            inputName="password"
            inputType="password"
            inputValue={formData.password}
            onChange={handleChange}
            // isRequired={true}
          />

          {/* <button
          type="submit"
          className="block text-center w-full bg-slate-700 text-white mt-4 p-2"
        >
          Login
        </button>
         */}

          <button
            type="submit"
            className="cursor-pointer block text-center w-full bg-slate-700 text-white mt-4 p-2"
          >
            Login
          </button>

          <div className="mt-4">
            Don't have and account?{" "}
            <Link to="/signup" className="underline">
              Sign up here
            </Link>
          </div>

          <div className="text-center mt-4">or</div>
          {/* Google */}
          <button
            type="button" // Changed from 'submit' to 'button'
            className="cursor-pointer bg-slate-700 text-white block p-2 mt-4 w-full"
            onClick={() => handleProvider("google")}
          >
            <div className="flex justify-center gap-4 items-center">
              <img src={GoogleLogo} alt="Google Logo" className="w-4" />
              <span>Sign in with Google</span>
            </div>
          </button>

          {/* Facebook */}
          <button
            type="button" // Changed from 'submit' to 'button'
            className="cursor-pointer bg-slate-700 text-white block p-2 mt-4 w-full"
            onClick={() => handleProvider("facebook")}
          >
            <div className="flex justify-center gap-4 items-center">
              <img src={FacebookLogo} alt="Facebook Logo" className="w-4" />
              <span>Sign in with Facebook</span>
            </div>
          </button>
        </form>{" "}
      </div>
      {/* <div className="mt-4">
        Don't have and account?{" "}
        <Link to="/signup" className="underline">
          Sign up here
        </Link>
      </div> */}

      <Dialog open={isLoading} onOpenChange={setIsLoading}>
        <DialogContent className="sm:max-w-[425px]" showCloseButton={false}>
          <DialogHeader>
            <DialogTitle>Logging in...</DialogTitle>
            <DialogDescription className="flex flex-col items-center gap-4">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
              <p>Please wait while we process your login...</p>
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>

      <Dialog open={isError} onOpenChange={setIsError}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle className="text-destructive">Login Failed</DialogTitle>
            <DialogDescription className="flex flex-col items-center gap-4">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-8 w-8 text-destructive"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <p>Login failed. Please check your credentials and try again.</p>
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </div>
  );
}
