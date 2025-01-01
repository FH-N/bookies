import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useAuthentication } from "./auth";

//Import Pages
import BookSearch from "./pages/SearchPage";
import RecommendationPage from "./pages/RecommendationPage";
import NotFound from "./pages/NotFound";
import NavBar from "./components/ui/Navbar";
import RedirectGoogleAuth from "./components/GoogleRedirectHandler";
import LandingPage from "./pages/LandingPage";
import HomePage from "./pages/HomePage";
import BookClubList from "./pages/ClubsPage";
import CreateClub from "./components/CreateClub";
import BookClubDetails from "./components/BookClubDetails";
import UserProfilePage from "./pages/UserProfilePage";
import AllUserListPage from "./pages/AllUserListPage";
import MyFollowingsPage from "./pages/MyFollowings";
import MyFollowersPage from "./pages/MyFollowersPage";
import BookDetailsPage from "./pages/BookDetailsPage";
import Bookshelf from "./components/BookShelf";

const App = () => {
  const { isAuthorized } = useAuthentication();

  const ConditionalHome = () => {
    return isAuthorized ? (
      <HomePage />
    ) : (
      <LandingPage initialMethod="register" />
    );
  };

  const ProtectedLogin = () => {
    return isAuthorized ? (
      <Navigate to="/" />
    ) : (
      <LandingPage initialMethod="login" />
    );
  };
  const ProtectedRegister = () => {
    return isAuthorized ? (
      <Navigate to="/" />
    ) : (
      <LandingPage initialMethod="register" />
    );
  };

  return (
    <Router>
      <NavBar />
      <div className="w-full min-h-[calc(100vh-4rem)] bg-gradient-to-b from-light-purple via-light-purple-pink-flower to-pink-flower from-40%  dark:from-deep-purple dark:via-deep-purple-light-purple dark:to-light-purple pt-16">
        <Routes>
          <Route path="/login/callback" element={<RedirectGoogleAuth />} />
          <Route path="/login" element={<ProtectedLogin />} />
          <Route path="/register" element={<ProtectedRegister />} />
          <Route path="*" element={<NotFound />} />
          <Route path="/search" element={<BookSearch />} />
          <Route path="/book/:id" element={<BookDetailsPage />} />
          <Route path="/" element={<ConditionalHome />} />
          <Route path="/recommendation" element={<RecommendationPage />} />
          <Route path="/bookclubs" element={<BookClubList />} />
          <Route path="/bookclubs/:id" element={<BookClubDetails />} />
          <Route path="/createclub" element={<CreateClub />} />
          <Route path="/profile" element={<UserProfilePage />} />
          <Route path="/allusers" element={<AllUserListPage />} />
          <Route path="/myfollowings" element={<MyFollowingsPage />} />
          <Route path="/myfollowers" element={<MyFollowersPage />} />
          <Route path="/library" element={<Bookshelf />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
