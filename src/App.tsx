import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./views/Login";
import Register from "./views/Register";
import Home from "./views/Home";
import RequireAuth from "./components/RequireAuth";
import AuthCallback from "./components/AuthCallback";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={
            <RequireAuth>
              <Home />
            </RequireAuth>
          }
        />
        {/* Add both routes to handle Google's redirect patterns */}
        <Route path="/auth/:provider" element={<AuthCallback />} />
        <Route path="/auth/:provider/callback" element={<AuthCallback />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Register />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;