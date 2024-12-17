import { IconFlameFilled } from "@tabler/icons-react";
import Circle from "./ui/Circle";

const Streak = () => {
  return (
    <div className="container flex flex-col font-roboto-serif font-bold bg-gradient-to-b from-aqua-teal to-light-purple w-min rounded-2xl">
      <div className="flex flex-row">
        <IconFlameFilled className="text-electric-indigo " size="80px" />
        <div className="flex flex-col">
          <h1 className="text-5xl ">19</h1>
          <h3 className="text-lg">day streak</h3>
        </div>
      </div>
      <div className="flex flex-row">
        <div className="flex flex-col items-center justify-center p-2">
          <Circle />
          <h1 className=" text-lg">S</h1>
        </div>
        <div className="flex flex-col items-center justify-center p-2">
          <Circle />
          <h1 className=" text-lg">M</h1>
        </div>
        <div className="flex flex-col items-center justify-center p-2">
          <Circle />
          <h1 className=" text-lg">T</h1>
        </div>
        <div className="flex flex-col items-center justify-center p-2">
          <Circle />
          <h1 className=" text-lg">W</h1>
        </div>
        <div className="flex flex-col items-center justify-center p-2">
          <Circle />
          <h1 className=" text-lg">T</h1>
        </div>
        <div className="flex flex-col items-center justify-center p-2">
          <Circle />
          <h1 className=" text-lg">F</h1>
        </div>
        <div className="flex flex-col items-center justify-center p-2">
          <Circle />
          <h1 className=" text-lg">S</h1>
        </div>
      </div>
    </div>
  );
};

export default Streak;
