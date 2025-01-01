import { IconSettings } from "@tabler/icons-react";
import Streak from "../components/Streak";
import SideNav from "../components/ui/SideNav";
import Line from "../components/ui/Line";
import RecommendedCategory from "../components/RecommendedCategory";
import { useAuthentication } from "../auth";
import { useEffect, useState } from "react";

const HomePage = () => {
  const [currentUserData, setCurrentUserData] = useState(null);
  const token =
    localStorage.getItem("access") ||
    localStorage.getItem("google_access_token");

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const currentUser = await fetch(
          "http://127.0.0.1:8000/api/auth/user/",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!currentUser.ok) {
          throw new Error("Failed to fetch user data");
        }

        const currentUserData = await currentUser.json();
        setCurrentUserData(currentUserData);
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    if (token) {
      fetchUserData();
    }
  }, [token]);

  return (
    <div className="container min-h-screen flex flex-row mt-8 text-white font-poppins">
      {/* Side Navigation */}
      <div className="w-1/5 flex justify-center">
        <SideNav />
      </div>

      {/* Vertical Line */}
      <div className="border-r border-white h-96"></div>

      {/* Main Content */}
      <div className="w-3/5 px-12 flex flex-col">
        {/* Welcome Message */}
        <h1 className="text-4xl font-bold mb-6 tracking-wide px-8">
          Welcome back&nbsp;
          <span className="bg-gradient-to-b dark:from-aqua-teal dark:to-light-purple from-lemon-lime to-pink-flower from-45% dark bg-clip-text text-transparent">
            {currentUserData?.username || "User"}
          </span>
          !
        </h1>

        {/* Streak Component */}
        <Streak />

        {/* Navigation Options */}
        <div className="flex flex-row justify-between items-center font-bold my-6 space-x-4">
          {["For you", "Following", "Author"].map((option, index) => (
            <div key={index} className="flex flex-col items-center">
              <h3 className="text-lg">{option}</h3>
              <Line className="border-deep-white border-t-2 w-20 mt-2" />
            </div>
          ))}

          {/* Customize Option */}
          <div className="flex flex-row items-center space-x-2">
            <IconSettings size={24} />
            <div className="flex flex-col items-center">
              <h3 className="text-lg">Customize</h3>
              <Line className="border-deep-white border-t-2 w-20 mt-2" />
            </div>
          </div>
        </div>

        {/* Recommended Categories */}
        <div className="space-y-8">
          <RecommendedCategory searchTerm="Romance" />
          <RecommendedCategory searchTerm="Fantasy" />
        </div>
      </div>

      {/* Right Sidebar (Optional Content Area) */}
      <div className="w-1/5"></div>
    </div>
  );
};

export default HomePage;
