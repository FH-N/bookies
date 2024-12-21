import AuthPage from "./AuthPage";

const LandingPage = ({ initialMethod }) => {
  return (
    <div className="w-full h-full flex flex-col">
      <div className="flex flex-row h-full">
        <div className="w-1/2 text-white flex flex-col items-center justify-center px-20">
          <div className="font-poppins font-extrabold text-6xl text-wrap p-3 leading-snug">
            <span className="text-aqua-teal">Discover</span>,
            <span className="text-lemon-lime"> Share</span>,
            <span className="text-pink-flower"> Celebrate</span> and Your Love
            for Books
          </div>
          <p className="font-roboto-mono font-medium text-2xl p-2 leading-10">
            Connect with like-minded readers, explore personalized
            recommendations, and track your reading journey—all in one place.
          </p>
        </div>
        <div className="w-1/2 flex items-center justify-center p-3 bg-landing-page bg-cover bg-center min-h-[calc(100vh-4rem)]">
          <div className="w-full max-w-md">
            <AuthPage initialMethod={initialMethod} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;
