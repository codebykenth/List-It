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
          <NormalInput
            labelName="Password"
            inputName="password"
            inputType="password"
            inputValue={formData.password}
            onChange={handleChange}
            isRequired={true}
          />
          <NormalInput
            labelName="Confirm Password"
            inputName="password_confirmation"
            inputType="password"
            inputValue={formData.password_confirmation}
            onChange={handleChange}
            isRequired={true}
          />
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
