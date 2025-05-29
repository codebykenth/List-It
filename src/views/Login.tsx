import { Link } from "react-router-dom";
import Input from "../components/Input";

export default function Login() {
  function handleLogin() {}
  return (
    <div className="sm:max-w-5xl md:max-w-7xl mx-auto p-3 md:px-40">
      <h1 className="text-center sm: text-2xl md:text-3xl">List It</h1>
      <div className="flex flex-col gap-2">
        <Input labelName="Email" inputName="email" inputType="email" />
        <Input labelName="Password" inputName="password" inputType="password" />

        {/* <button
          type="submit"
          className="block text-center w-full bg-slate-700 text-white mt-4 p-2"
        >
          Login
        </button>
         */}

        <Link
          to="/"
          type="submit"
          className="block text-center w-full bg-slate-700 text-white mt-4 p-2"
        >
          Login
        </Link>
        <div>or</div>
        {/* Google */}
        <button
          type="submit"
          className="bg-slate-700 text-white block p-2 mt-4"
          onClick={handleLogin}
        >
          <div className="flex justify-center gap-4 items-center">
            <img
              src="../src/assets/7123025_logo_google_g_icon.png"
              alt="Facebook Logo"
              className="w-8 "
            />
            <span>Sign in with Google</span>
          </div>
        </button>
        {/* Facebook */}
        <button
          onClick={handleLogin}
          type="submit"
          className="bg-slate-700 text-white block p-2 mt-4"
        >
          <div className="flex justify-center gap-4 items-center">
            <img
              src="../src/assets/Facebook_Logo_Primary.png"
              alt="Facebook Logo"
              className="w-8"
            />
            <span>Sign in with Facebook</span>
          </div>
        </button>
      </div>
      <div>
        Don't have and account?{" "}
        <Link to="/signup" className="underline">
          Sign up here
        </Link>
      </div>
    </div>
  );
}
