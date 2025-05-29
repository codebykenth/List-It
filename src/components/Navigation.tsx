import { Link } from "react-router-dom";

function Navigation() {
  return (
    <div>
      <nav>
        <div className="flex justify-between w-full bg-slate-700 text-white p-4">
          <Link to="/">Task It</Link>
          <Link to="/login">Logout</Link>
        </div>
      </nav>
    </div>
  );
}

export default Navigation;
