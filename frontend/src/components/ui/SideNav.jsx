import { useNavigate } from "react-router-dom";
import {
  IconBook,
  IconCompass,
  IconHome,
  IconMail,
  IconPencil,
  IconUsers,
} from "@tabler/icons-react";

const SideNav = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col  text-white font-poppins font-bold text-lg ">
      <div
        className="flex flex-row p-1 cursor-pointer"
        onClick={() => navigate("/")}
      >
        <IconHome stroke={2} size={32} />
        <h1 className="p-1">Home</h1>
      </div>
      <div
        className="flex flex-row p-1 cursor-pointer"
        onClick={() => navigate("/recommendation")}
      >
        <IconCompass stroke={2} size={32} />
        <h1 className="p-1">Discover</h1>
      </div>
      <div
        className="flex flex-row p-1 cursor-pointer"
        onClick={() => navigate("/library")}
      >
        <IconBook stroke={2} size={32} />
        <h1 className="p-1">My Library</h1>
      </div>
      <div
        className="flex flex-row p-1 cursor-pointer"
        onClick={() => navigate("/following")}
      >
        <IconUsers stroke={2} size={32} />
        <h1 className="p-1">Following</h1>
      </div>
      <div
        className="flex flex-row p-1 cursor-pointer"
        onClick={() => navigate("/bookclubs")}
      >
        <IconMail stroke={2} size={32} />
        <h1 className="p-1">Book Clubs</h1>
      </div>
      <div
        className="flex flex-row p-1 cursor-pointer"
        onClick={() => navigate("/reviews")}
      >
        <IconPencil stroke={2} size={32} />
        <h1 className="p-1">My Reviews</h1>
      </div>
    </div>
  );
};

export default SideNav;
