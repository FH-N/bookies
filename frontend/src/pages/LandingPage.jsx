import AuthPage from "./AuthPage";

const LandingPage = ({ initialMethod }) => {
  return (
    <div className="container w-full h-min-screen mt-16">
      <div className="flex flex-row items-center justify-center">
        <div className="w-1/2 h-full text-white">
          <div className=" font-poppins font-bold text-6xl text-wrap p-3">
            <span className="text-aqua-teal">Discover</span>,
            <span className="text-lemon-lime"> Share</span>,
            <span className="text-pink-flower"> Celebrate</span> and Your Love
            for Books
          </div>
          <p className="font-roboto-mono font-medium text-2xl p-2">
            Connect with like-minded readers, explore personalized
            recommendations, and track your reading journey—all in one place.
          </p>
        </div>
        <div className="w-1/2 bg-yellow-400 h-full">
          <AuthPage initialMethod={initialMethod} />
          <h1>hi</h1>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;
