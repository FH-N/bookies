import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuthentication } from "../../auth";
import DarkModeToggle from "./DarkMode";
import { IconUserCircle, IconBell } from "@tabler/icons-react";

function Navbar() {
  const { isAuthorized, logout } = useAuthentication();
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
  };

  // Handle form submission (search bar)
  const handleSearch = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      // Redirect to the search page with the search term
      navigate(`/search?query=${searchTerm}`);
    }
  };

  return (
    <div className="fixed top-0 w-full z-[999] bg-light-purple dark:bg-deep-purple">
      <div className="container flex items-center justify-between w-full h-16 px-4 font-medium font-poppins">
        {/* Left: Logo */}
        <Link to="/" className="font-bold text-white text-3xl">
          BOOKIES
        </Link>

        {/* Middle: Search Bar */}
        <div className="flex-1 mx-4 flex justify-center">
          <form onSubmit={handleSearch} className="w-full max-w-lg">
            <input
              type="text"
              placeholder="Search books..."
              className="w-full h-10 px-4 rounded-full text-black focus:outline-none"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)} // Update search term
            />
          </form>
        </div>

        {/* Right: Icons and Auth Links */}
        <div className="flex items-center space-x-4">
          <DarkModeToggle />
          {/* Only visible when logged in */}
          {isAuthorized && (
            <>
              <IconUserCircle
                stroke={2}
                className="text-white cursor-pointer"
              />
              <IconBell stroke={2} className="text-white cursor-pointer" />
            </>
          )}

          {/* Auth Links */}
          {isAuthorized ? (
            <Link onClick={handleLogout} to="/logout" className="text-white">
              Logout
            </Link>
          ) : (
            <>
              <Link to="/login" className="button-link-login text-white">
                Log In
              </Link>
              <Link to="/register" className="button-link text-white">
                Register
              </Link>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default Navbar;
