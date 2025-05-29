import { Link } from "react-router-dom";
import Input from "../components/Input";

export default function Register() {
  const handleRegister = () => {};
  return (
    <div className="sm:max-w-5xl md:max-w-7xl mx-auto p-3 md:px-40">
      <h1 className="text-center sm: text-2xl md:text-3xl">List It</h1>
      <div className="flex flex-col gap-2">
        <Input labelName="Name" inputName="name" inputType="text" />
        <Input labelName="Email" inputName="email" inputType="email" />
        <Input labelName="Password" inputName="password" inputType="password" />
        <Input
          labelName="Confirm Password"
          inputName="password_confirmation"
          inputType="password"
        />

        <button
          type="submit"
          className="block text-center w-full bg-slate-700 text-white mt-4 p-2"
          onClick={handleRegister}
        >
          Signup
        </button>
      </div>
      <div>
        Already have an account?{" "}
        <Link to="/login" className="underline">
          Login here
        </Link>
      </div>
    </div>
  );
}
