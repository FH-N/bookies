import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useAuthentication } from "./auth";

//Import Pages
import BookSearch from "./pages/SearchPage";
import BookInfo from "./components/BookInfo";
import RecommendationPage from "./pages/RecommendationPage";
import NotFound from "./pages/NotFound";
import AuthPage from "./pages/AuthPage";
import NavBar from "./components/ui/Navbar";
import RedirectGoogleAuth from "./components/GoogleRedirectHandler";
import ReviewForm from "./components/CreateReview";
import LandingPage from "./pages/LandingPage";
import HomePage from "./pages/HomePage";
import BookClubList from "./components/BookClubList";
import CreateClub from "./components/CreateClub";
import BookClubDetails from "./components/BookClubDetails";

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
      <div className="w-full min-h-[calc(100vh-4rem)] bg-gradient-to-b from-light-purple via-light-purple-pink-flower to-pink-flower from-45%  dark:from-deep-purple dark:via-deep-purple-light-purple dark:to-light-purple pt-16">
        <Routes>
          <Route path="/login/callback" element={<RedirectGoogleAuth />} />
          <Route path="/login" element={<ProtectedLogin />} />
          <Route path="/register" element={<ProtectedRegister />} />
          <Route path="*" element={<NotFound />} />
          <Route path="/search" element={<BookSearch />} />
          <Route path="/book/:id" element={<BookInfo />} />
          <Route path="/review" element={<ReviewForm />} />
          <Route path="/" element={<ConditionalHome />} />
          <Route path="/recommendation" element={<RecommendationPage />} />
          <Route path="/bookclubs" element={<BookClubList />} />
          <Route path="/bookclub/:id" element={<BookClubDetails />} />
          <Route path="/createclub" element={<CreateClub />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
