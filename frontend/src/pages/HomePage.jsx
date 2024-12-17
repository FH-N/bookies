import { IconSettings } from "@tabler/icons-react";
import Streak from "../components/Streak";
import SideNav from "../components/ui/SideNav";
import Line from "../components/ui/Line";

const HomePage = () => {
  return (
    <div className="container flex flex-row mt-8 text-white font-poppins">
      <div className="w-1/4 bg-blue-500">
        <SideNav />
      </div>
      <div className="w-2/4 bg-red-500 flex flex-col">
        <h1 className="text-3xl font-bold p-3">
          Welcome back&nbsp;
          <span className="text-3xl font-bold bg-gradient-to-b from-aqua-teal to-light-purple bg-clip-text text-transparent">
            Farida!
          </span>
        </h1>
        <Streak />
        <div className="flex flex-row justify-between items-center font-poppins font-bold mx-10 py-3">
          <div className="flex flex-col items-center">
            <h3>For you</h3>
            <Line className="border-deep-white border-t-2 w-20 mx-auto" />
          </div>
          <div className="flex flex-col items-center">
            <h3>Following</h3>
            <Line className="border-deep-white border-t-2 w-20 mx-auto" />
          </div>
          <div className="flex flex-col items-center">
            <h3>Author</h3>
            <Line className="border-deep-white border-t-2 w-20 mx-auto" />
          </div>
          <div className="flex flex-row">
            <IconSettings />
            <div className="flex flex-col items-center">
              <h3>Customize</h3>
              <Line className="border-deep-white border-t-2 w-20 mx-auto" />
            </div>
          </div>
        </div>
      </div>
      <div className="w-1/4 bg-yellow-300"></div>
    </div>
  );
};

export default HomePage;
