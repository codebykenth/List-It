import { useState, useEffect } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { authApiService } from "../api/ApiService";

export default function AuthCallback() {
  const [loading, setLoading] = useState(true);
  const location = useLocation();
  const navigate = useNavigate();
  const { provider } = useParams();

  useEffect(() => {
    const handleCallback = async () => {
      try {
        // Dynamic provider handling
        const response = await authApiService.getData(
          `/auth/${provider}/callback${location.search}`
        );

        if (response.token) {
          localStorage.setItem("auth_token", response.token);
          setLoading(false);
          navigate("/");
        }
      } catch (error) {
        console.error(`${provider} auth callback error:`, error);
        setLoading(false);
        navigate("/login");
      }
    };

    if (provider) {
      handleCallback();
    }
  }, [location.search, navigate, provider]);

  if (loading) {
    return <div>Processing {provider} authentication...</div>;
  }

  return null;
}
