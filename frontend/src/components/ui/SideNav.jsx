import {
  IconBook,
  IconHome,
  IconMail,
  IconPencil,
  IconUsers,
} from "@tabler/icons-react";

const SideNav = () => {
  return (
    <div className="flex flex-col  text-white font-poppins font-bold text-lg cursor-pointer">
      <div className="flex flex-row p-1">
        <IconHome stroke={2} size={32} />
        <h1 className="p-1">Home</h1>
      </div>
      <div className="flex flex-row p-1">
        <IconBook stroke={2} size={32} />
        <h1 className="p-1">My Library</h1>
      </div>
      <div className="flex flex-row p-1">
        <IconUsers stroke={2} size={32} />
        <h1 className="p-1">Following</h1>
      </div>
      <div className="flex flex-row p-1">
        <IconMail stroke={2} size={32} />
        <h1 className="p-1">Book Clubs</h1>
      </div>
      <div className="flex flex-row p-1">
        <IconPencil stroke={2} size={32} />
        <h1 className="p-1">My Reviews</h1>
      </div>
    </div>
  );
};

export default SideNav;
