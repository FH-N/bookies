import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useAuthentication } from "./auth";

//Import Pages
import BookSearch from "./pages/SearchPage";
import BookInfo from "./components/BookInfo";
import RecommendationPage from "./pages/recommendation";
import NotFound from "./pages/NotFound";
import AuthPage from "./pages/AuthPage";
import NavBar from "./components/NavBar";
import RedirectGoogleAuth from "./components/GoogleRedirectHandler";
import ReviewForm from "./components/CreateReview";

const App = () => {
  const { isAuthorized } = useAuthentication();
  const ProtectedLogin = () => {
    return isAuthorized ? (
      <Navigate to="/" />
    ) : (
      <AuthPage initialMethod="login" />
    );
  };
  const ProtectedRegister = () => {
    return isAuthorized ? (
      <Navigate to="/" />
    ) : (
      <AuthPage initialMethod="register" />
    );
  };

  return (
    <Router>
      <NavBar />
      <div className="container mx-auto flex flex-col items-center justify-center">
        <h1 className="text-3xl font-bold underline text-blue-900">
          Home Page
        </h1>
        <Routes>
          <Route path="/login/callback" element={<RedirectGoogleAuth />} />
          <Route path="/login" element={<ProtectedLogin />} />
          <Route path="/register" element={<ProtectedRegister />} />
          <Route path="*" element={<NotFound />} />
          <Route path="/search" element={<BookSearch />} />
          <Route path="/book/:id" element={<BookInfo />} />
          <Route path="/review" element={<ReviewForm />} />
          <Route path="/" element={<RecommendationPage />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
