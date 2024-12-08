import SideNav from "../components/ui/SideNav";

const HomePage = () => {
  return (
    <div className="container flex flex-row mt-8 text-white font-poppins">
      <div className="w-1/4 bg-blue-500">
        <SideNav />
      </div>
      <div className="w-3/4 bg-red-500">
        <h1 className="text-3xl font-bold">Welcome back!</h1>
      </div>
    </div>
  );
};

export default HomePage;
