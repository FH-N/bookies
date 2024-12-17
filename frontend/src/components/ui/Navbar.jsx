import { Link } from "react-router-dom";
import { useAuthentication } from "../../auth";
import DarkModeToggle from "./DarkMode";
import { IconUserCircle, IconBell } from "@tabler/icons-react";

function Navbar() {
  const { isAuthorized, logout } = useAuthentication();

  const handleLogout = () => {
    logout();
  };

  return (
    <div className="fixed top-0 w-full z-[999]">
      <div className="container flex items-center justify-between w-full h-16 px-4 font-medium bg-transparent font-poppins">
        <h1 className="font-bold text-white text-3xl font-poppins">BOOKIES</h1>
        {/* <DarkModeToggle /> */}
        <ul className="navbar-menu-right">
          {isAuthorized ? (
            <li>
              {/* <IconUserCircle stroke={2} />
            <IconBell stroke={2} /> */}
              <Link onClick={handleLogout} to="/logout" className="text-white">
                Logout
              </Link>
            </li>
          ) : (
            <>
              <li>
                <Link to="/login" className="button-link-login">
                  Log In
                </Link>
              </li>
              <li>
                <Link to="/register" className="button-link">
                  Register
                </Link>
              </li>
            </>
          )}
        </ul>
      </div>
    </div>
  );
}
export default Navbar;
