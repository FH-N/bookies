import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useAuthentication } from "./auth";

//Import Pages
import BookSearch from "./pages/SearchPage";
import RecommendationPage from "./pages/RecommendationPage";
import NotFound from "./pages/NotFound";
import AuthPage from "./pages/AuthPage";
import NavBar from "./components/ui/Navbar";
import RedirectGoogleAuth from "./components/GoogleRedirectHandler";
import LandingPage from "./pages/LandingPage";
import HomePage from "./pages/HomePage";
import BookDetailsPage from "./pages/BookDetailsPage";

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
      <div className="w-screen min-h-screen bg-gradient-to-b from-deep-purple to-light-purple pt-16">
        <Routes>
          <Route path="/login/callback" element={<RedirectGoogleAuth />} />
          <Route path="/login" element={<ProtectedLogin />} />
          <Route path="/register" element={<ProtectedRegister />} />
          <Route path="*" element={<NotFound />} />
          <Route path="/search" element={<BookSearch />} />
          <Route path="/book/:id" element={<BookDetailsPage />} />
          <Route path="/" element={<ConditionalHome />} />
          <Route path="/recommendation" element={<RecommendationPage />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
