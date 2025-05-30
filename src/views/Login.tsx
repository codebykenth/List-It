import { Link, useNavigate } from "react-router-dom";
import Input from "../components/Input";
import FacebookLogo from "../assets/images/Facebook_Logo_Primary.png";
import GoogleLogo from "../assets/images/7123025_logo_google_g_icon.png";
import { useState, type FormEvent } from "react";
import { authApiService } from "../api/Auth";

export default function Login() {
  // Placeholder for login handling logic
  // This function should handle the login logic, e.g., API calls
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleLogin = async (e: FormEvent) => {
    e.preventDefault();

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
      console.error("Error logging in user:", error);
    }
  };

  const handleProvider = async (provider: string) => {
    try {
      const response = await authApiService.getData(`/auth/${provider}`);
      if (response.url) {
        window.location.href = response.url;
      }
    } catch (error: unknown) {
      console.error("Error logging in user:", error);
    }
  };
  return (
    <div className="sm:max-w-5xl md:max-w-7xl mx-auto p-3 md:px-40">
      <h1 className="text-center sm: text-2xl md:text-3xl">List It</h1>
      <div className="flex flex-col gap-2">
        <form onSubmit={handleLogin}>
          <Input
            labelName="Email"
            inputName="email"
            inputType="email"
            inputValue={formData.email}
            onChange={handleChange}
          />
          <Input
            labelName="Password"
            inputName="password"
            inputType="password"
            inputValue={formData.password}
            onChange={handleChange}
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
            className="block text-center w-full bg-slate-700 text-white mt-4 p-2"
          >
            Login
          </button>
          <div className="text-center mt-4">or</div>
          {/* Google */}
          <button
            type="button" // Changed from 'submit' to 'button'
            className="bg-slate-700 text-white block p-2 mt-4 w-full"
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
            className="bg-slate-700 text-white block p-2 mt-4 w-full"
            onClick={() => handleProvider("facebook")}
          >
            <div className="flex justify-center gap-4 items-center">
              <img src={FacebookLogo} alt="Facebook Logo" className="w-4" />
              <span>Sign in with Facebook</span>
            </div>
          </button>
        </form>{" "}
      </div>
      <div className="mt-4">
        Don't have and account?{" "}
        <Link to="/signup" className="underline">
          Sign up here
        </Link>
      </div>
    </div>
  );
}
