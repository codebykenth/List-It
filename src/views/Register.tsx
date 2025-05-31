// import { Link } from "react-router-dom";
// import Input from "../components/Input";
// import { authApiService } from "../api/Auth";

// export default function Register() {
//   const handleRegister = async (userData: FormData) => {
//     try {
//       const newUser = await authApiService.postData("/register", userData);
//       console.log("User registered successfully:", newUser);
//     } catch (error: unknown) {
//       console.error("Error registering user:", error);
//     }
//   };
//   return (
//     <div className="sm:max-w-5xl md:max-w-7xl mx-auto p-3 md:px-40">
//       <h1 className="text-center sm: text-2xl md:text-3xl">List It</h1>
//       <div className="flex flex-col gap-2">
//         <Input labelName="Name" inputName="name" inputType="text" />
//         <Input labelName="Email" inputName="email" inputType="email" />
//         <Input labelName="Password" inputName="password" inputType="password" />
//         <Input
//           labelName="Confirm Password"
//           inputName="password_confirmation"
//           inputType="password"
//         />

//         <button
//           type="submit"
//           className="block text-center w-full bg-slate-700 text-white mt-4 p-2"
//           onClick={handleRegister}
//         >
//           Signup
//         </button>
//       </div>
//       <div>
//         Already have an account?{" "}
//         <Link to="/login" className="underline">
//           Login here
//         </Link>
//       </div>
//     </div>
//   );
// }
import { Link, useNavigate } from "react-router-dom";
import NormalInput from "../components/NormalInput";
import { authApiService } from "../api/ApiService";
import { useState } from "react";
import type { FormEvent } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import FileInput from "@/components/FileInput";
import { Label } from "@/components/ui/label";

export default function Register() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    password_confirmation: "",
    profile_image: null as File | null,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleRegister = async (e: FormEvent) => {
    setIsLoading(true);
    setIsError(false);
    e.preventDefault();
    try {
      // Create a new FormData instance
      const data = new FormData();

      // Append all form fields to FormData
      data.append("name", formData.name);
      data.append("email", formData.email);
      data.append("password", formData.password);
      data.append("password_confirmation", formData.password_confirmation);
      if (formData.profile_image) {
        data.append("profile_image", formData.profile_image);
      }

      const newUser = await authApiService.postData("/register", data);

      setFormData({
        name: "",
        email: "",
        password: "",
        password_confirmation: "",
        profile_image: null,
      });
      console.log("User registered successfully:", newUser);
      setIsSuccess(true);
    } catch (error: unknown) {
      setIsError(true);
      console.error("Error registering user:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    console.log("Selected file:", file); // Debug log
    if (file) {
      setFormData((prevData) => ({
        ...prevData,
        profile_image: file,
      }));
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="sm:max-w-md w-full mx-auto p-6 space-y-8">
        <h1 className="text-center text-2xl md:text-3xl font-semibold">
          List It
        </h1>
        <form onSubmit={handleRegister} className="flex flex-col space-y-4">
          <NormalInput
            labelName="Name"
            inputName="name"
            inputType="text"
            inputValue={formData.name}
            onChange={handleChange}
            isRequired={true}
          />
          <NormalInput
            labelName="Email"
            inputName="email"
            inputType="email"
            inputValue={formData.email}
            onChange={handleChange}
            isRequired={true}
          />
          <div className="relative">
            <NormalInput
              labelName="Password"
              inputName="password"
              inputType={showPassword ? "text" : "password"}
              inputValue={formData.password}
              onChange={handleChange}
              isRequired={true}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-[31px] text-slate-600 hover:text-slate-900 cursor-pointer"
            >
              {showPassword ? (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-5 h-5"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88"
                  />
                </svg>
              ) : (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-5 h-5"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
              )}
            </button>
          </div>
          <div className="relative">
            <NormalInput
              labelName="Confirm Password"
              inputName="password_confirmation"
              inputType={showConfirmPassword ? "text" : "password"}
              inputValue={formData.password_confirmation}
              onChange={handleChange}
              isRequired={true}
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-3 top-[31px] text-slate-600 hover:text-slate-900 cursor-pointer"
            >
              {showConfirmPassword ? (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-5 h-5"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88"
                  />
                </svg>
              ) : (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-5 h-5"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
              )}
            </button>
          </div>
          <Label htmlFor="profile_image">Profile Image</Label>
          <FileInput
            id="profile_image"
            name="profile_image"
            // label="Choose a profile image"
            accept="image/*,.png,.jpg,.jpeg"
            onChange={handleFileChange}
          />

          <button
            type="submit"
            className="cursor-pointer block text-center w-full bg-slate-700 text-white mt-4 p-2"
          >
            Signup
          </button>
        </form>
        <div className="mt-4">
          Already have an account?{" "}
          <Link to="/login" className="underline">
            Login here
          </Link>
        </div>
        <Dialog open={isLoading} onOpenChange={setIsLoading}>
          <DialogContent className="sm:max-w-[425px]" showCloseButton={false}>
            <DialogHeader>
              <DialogTitle>Signing up...</DialogTitle>
              <DialogDescription className="flex flex-col items-center gap-4">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
                <p>Please wait while we process your account creation...</p>
              </DialogDescription>
            </DialogHeader>
          </DialogContent>
        </Dialog>

        <Dialog open={isError} onOpenChange={setIsError}>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle className="text-destructive">
                Sign up Failed
              </DialogTitle>
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
                <p>Sign up failed. Please fill up all fields.</p>
              </DialogDescription>
            </DialogHeader>
          </DialogContent>
        </Dialog>

        <Dialog open={isSuccess} onOpenChange={setIsSuccess}>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle className="text-green-600">
                Registration Successful!
              </DialogTitle>
              <DialogDescription className="flex flex-col items-center gap-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-8 w-8 text-green-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
                <p>Your account has been successfully created!</p>
                <button
                  onClick={() => navigate("/login")}
                  className="cursor-pointer bg-slate-700 text-white px-4 py-2 rounded-md hover:bg-slate-600 transition-colors"
                >
                  Proceed to Login
                </button>
              </DialogDescription>
            </DialogHeader>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
