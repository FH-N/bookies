import api from "../api";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ACCESS_TOKEN, REFRESH_TOKEN } from "../token";
import Line from "./ui/Line";
import Button from "./ui/Button";

const AuthForm = ({ route, method }) => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("User");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const navigate = useNavigate();

  function decodeToken(token) {
    const payloadBase64 = token.split('.')[1]; // Extract the payload part
    const decodedPayload = atob(payloadBase64); // Decode Base64 string
    return JSON.parse(decodedPayload); // Parse JSON payload
}

  useEffect(() => {
    if (success) {
      const timer = setTimeout(() => navigate("/login"), 2000);
      return () => clearTimeout(timer);
    }
  }, [success, navigate]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    console.log("submit");
    try {
      const res = await api.post(route, { username, password, email, role });
      console.log(res);
      if (method === "login") {
        localStorage.setItem(ACCESS_TOKEN, res.data.access);
        localStorage.setItem(REFRESH_TOKEN, res.data.refresh);

        const accessToken = res.data.access;
        if (accessToken) {
            const decodedToken = decodeToken(accessToken);
            if (decodedToken) {
              localStorage.setItem("user_id", decodedToken.user_id); // Adjust to match token payload
            }
        } else {
            setError("No access token found.");
        }
        
        navigate("/");
        window.location.reload();
      } else {
        setSuccess("Registration successful. Please login.");
      }
    } catch (error) {
      console.error(error);
      if (error.response) {
        switch (error.response.status) {
          case 401:
            setError("Invalid credentials.");
            break;
          case 400:
            setError("Username or email already exists.");
            break;
          default:
            setError("Something went wrong. Please try again.");
        }
      } else if (error.request) {
        setError("Network error. Please check your internet connection.");
      } else {
        setError("Something went wrong. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = () => {
    window.location.href = "http://localhost:8000/accounts/google/login/";
  };

  return (
    <div className="w-full h-full container">
      {loading && (
        <div className="loading-indicator">
          {error ? (
            <span className="text-red-500">{error}</span>
          ) : (
            <div className="spinner"></div>
          )}
        </div>
      )}
      {!loading && (
        <form
          onSubmit={handleSubmit}
          className="flex flex-col justify-center items-center rounded-xl bg-white text-deep-purple h-3/4 w-3/4"
        >
          <h2 className="font-poppins text-xl p-2 ">
            {method === "register" ? "Sign Up & Explore" : "Login & Explore"}
          </h2>
          <div className="flex flex-col items-center justify-center pb-4">
            <div className="flex flex-row justify-between items-center w-44">
              <h3
                className={`cursor-pointer ${
                  role === "User" ? "text-electric-indigo font-bold" : ""
                }`}
                onClick={() => setRole("User")}
              >
                Booker
              </h3>
              <h3
                className={`cursor-pointer ${
                  role === "Author" ? "text-electric-indigo font-bold" : ""
                }`}
                onClick={() => setRole("Author")}
              >
                Author
              </h3>
            </div>
            <Line className="border-deep-purple border-t-2 w-60 mx-auto" />
          </div>
          {error && <div className="text-red-500">{error}</div>}
          {success && <div className="text-green-500">{success}</div>}
          <div className="grid gap-4">
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              placeholder="username"
              className="border-2 border-electric-indigo rounded-full w-64 p-2 placeholder:text-electric-indigo placeholder:font-poppins placeholder:font-light"
            />
            {method === "register" && (
              <>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder="email"
                  className="border-2 border-electric-indigo rounded-full w-64 p-2 placeholder:text-electric-indigo placeholder:font-poppins placeholder:font-light"
                />
              </>
            )}

            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="password"
              className="border-2 border-electric-indigo rounded-full w-64 p-2 placeholder:text-electric-indigo placeholder:font-poppins placeholder:font-light"
            />

            <Button type="submit" disabled={loading}>
              {loading
                ? "Processing..."
                : method === "register"
                ? "Sign Up"
                : "Login"}
            </Button>

            <h1 className="flex items-center justify-center text-xl">Or</h1>
            <Button
              type="button"
              className="bg-pink-flower hover:bg-light-purple hover:text-white"
              onClick={handleGoogleLogin}
            >
              {/* <img src={google} alt="Google icon" className="google-icon" /> */}
              {method === "register"
                ? "Register with Google"
                : "Login with Google"}
            </Button>
            <Line className="border-deep-purple border-t-2 w-60 mx-auto" />
          </div>
          {method === "login" && (
            <p className="pt-2">
              Don't have an account?
              <span
                className="font-semibold p-1 text-deep-purple cursor-pointer"
                onClick={() => navigate("/register")}
              >
                Register
              </span>
            </p>
          )}
          {method === "register" && (
            <p className="toggle-text">
              Already have an account?
              <span
                className="font-semibold p-1 text-deep-purple cursor-pointer"
                onClick={() => navigate("/login")}
              >
                Login
              </span>
            </p>
          )}
        </form>
      )}
    </div>
  );
};

export default AuthForm;
