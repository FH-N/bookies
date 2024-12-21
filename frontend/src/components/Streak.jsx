import { IconFlameFilled } from "@tabler/icons-react";
import Circle from "./ui/Circle";

const days = ["S", "M", "T", "W", "T", "F", "S"];

const Streak = ({ streakCount = 19, iconSize = 80 }) => {
  return (
    <div
      className={`container flex flex-col font-roboto-serif font-bold 
      bg-gradient-to-b from-lemon-lime via-pink-flower-lemon-lime to-pink-flower dark:from-aqua-teal dark:to-light-purple
      w-full rounded-2xl p-4 text-white`}
    >
      {/* Header with streak count */}
      <div className="flex flex-row items-center space-x-4">
        <IconFlameFilled
          className="text-pink-flower dark:text-electric-indigo"
          size={`${iconSize}px`}
        />
        <div className="flex flex-col">
          <h1 className="text-5xl">{streakCount}</h1>
          <h3 className="text-lg">day streak</h3>
        </div>
      </div>

      {/* Days of the week */}
      <div className="flex flex-row space-x-2 mt-4">
        {days.map((day, index) => (
          <div
            key={index}
            className="flex flex-col items-center justify-center p-2"
          >
            <Circle />
            <h1 className="text-lg text-white">{day}</h1>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Streak;
