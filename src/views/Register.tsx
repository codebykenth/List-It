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
import { Link } from "react-router-dom";
import Input from "../components/Input";
import { authApiService } from "../api/Auth";
import { useState } from "react";
import type { FormEvent } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export default function Register() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    password_confirmation: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleRegister = async (e: FormEvent) => {
    setIsLoading(true);
    e.preventDefault();
    try {
      // Create a new FormData instance
      const data = new FormData();

      // Append all form fields to FormData
      Object.entries(formData).forEach(([key, value]) => {
        data.append(key, value);
      });

      const newUser = await authApiService.postData("/register", data);
      console.log("User registered successfully:", newUser);
    } catch (error: unknown) {
      console.error("Error registering user:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="sm:max-w-5xl md:max-w-7xl mx-auto p-3 md:px-40">
      <h1 className="text-center sm: text-2xl md:text-3xl">List It</h1>
      <form onSubmit={handleRegister} className="flex flex-col gap-2">
        <Input
          labelName="Name"
          inputName="name"
          inputType="text"
          inputValue={formData.name}
          onChange={handleChange}
        />
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
        <Input
          labelName="Confirm Password"
          inputName="password_confirmation"
          inputType="password"
          inputValue={formData.password_confirmation}
          onChange={handleChange}
        />

        <button
          type="submit"
          className="block text-center w-full bg-slate-700 text-white mt-4 p-2"
        >
          Signup
        </button>
      </form>
      <div>
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
    </div>
  );
}
