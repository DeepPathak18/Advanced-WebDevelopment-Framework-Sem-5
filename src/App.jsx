import { Suspense, useEffect, useState } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import Header from "./components/Header";
import NavBar from "./components/Navbar.jsx";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import Landing from "./pages/Landing";
import UserHome from "./pages/UserHome";
import NotFound from "./pages/NotFound";
import PageLoader from "./components/PageLoader";
import { clearToken, getMe, getToken } from "./api";
import { lazyWithDelay } from "./utils/lazyWithDelay";

// Keep the first-screen content and shared layout static; only route pages are split.
const Projects = lazyWithDelay(() => import("./pages/Projects"));
const Tasks = lazyWithDelay(() => import("./pages/Tasks"));
const Contact = lazyWithDelay(() => import("./pages/Contact"));
const Login = lazyWithDelay(() => import("./pages/Login"));
const Register = lazyWithDelay(() => import("./pages/Register"));

function ProtectedRoute({ isAuthenticated, children }) {
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return children;
}

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(Boolean(getToken()));
  const [userEmail, setUserEmail] = useState("");

  useEffect(() => {
    if (!isAuthenticated) {
      setUserEmail("");
      return;
    }

    getMe()
      .then((user) => setUserEmail(user.email || ""))
      .catch(() => {
        clearToken();
        setIsAuthenticated(false);
        setUserEmail("");
      });
  }, [isAuthenticated]);

  const handleLoginSuccess = (user) => {
    setUserEmail(user?.email || "");
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    clearToken();
    setIsAuthenticated(false);
    setUserEmail("");
  };

  return (
    <div className="app-shell">
      <Header name="Deep Pathak" />
      <NavBar
        isAuthenticated={isAuthenticated}
        userEmail={userEmail}
        onLogout={handleLogout}
      />
      <main>
        <Suspense fallback={<PageLoader />}>
          <Routes>
            <Route
              path="/"
              element={isAuthenticated ? <Navigate to="/home" replace /> : <Landing />}
            />
            <Route path="/login" element={<Login onLoginSuccess={handleLoginSuccess} />} />
            <Route path="/register" element={<Register />} />
            <Route
              path="/home"
              element={
                <ProtectedRoute isAuthenticated={isAuthenticated}>
                  <UserHome userEmail={userEmail} />
                </ProtectedRoute>
              }
            />
            <Route
              path="/portfolio"
              element={
                <ProtectedRoute isAuthenticated={isAuthenticated}>
                  <Home />
                </ProtectedRoute>
              }
            />
            <Route
              path="/projects"
              element={
                <ProtectedRoute isAuthenticated={isAuthenticated}>
                  <Tasks />
                </ProtectedRoute>
              }
            />
            <Route
              path="/github"
              element={
                <ProtectedRoute isAuthenticated={isAuthenticated}>
                  <Projects />
                </ProtectedRoute>
              }
            />
            <Route
              path="/tasks"
              element={
                <ProtectedRoute isAuthenticated={isAuthenticated}>
                  <Tasks />
                </ProtectedRoute>
              }
            />
            <Route
              path="/contact"
              element={
                <ProtectedRoute isAuthenticated={isAuthenticated}>
                  <Contact />
                </ProtectedRoute>
              }
            />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
      </main>
      <Footer />
    </div>
  );
}

export default App;