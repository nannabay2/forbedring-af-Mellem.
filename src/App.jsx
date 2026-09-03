import { Routes, Route, useLocation } from "react-router";
import { useEffect, useState } from "react";
import Navbar from "./components/Navbar";
import SlowLoader from "./components/SlowLoader";
import HomePage from "./pages/HomePage";
import AboutPage from "./pages/AboutPage";
import EventPage from "./pages/EventPage";
import RegistrationsPage from "./pages/RegistrationsPage";
import NotFoundPage from "./pages/NotFoundPage";

function ScrollToTop() {
  const location = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "instant" });
  }, [location.pathname]);

  return null;
}

export default function App() {
  const location = useLocation();
  const [showSlowLoader, setShowSlowLoader] = useState(
    typeof window !== "undefined" ? document.readyState !== "complete" : true,
  );

  useEffect(() => {
    const handlePageLoad = () => setShowSlowLoader(false);

    if (document.readyState === "complete") {
      setShowSlowLoader(false);
      return undefined;
    }

    const slowLoadTimer = window.setTimeout(() => {
      setShowSlowLoader(true);
    }, 1000);

    window.addEventListener("load", handlePageLoad);

    return () => {
      clearTimeout(slowLoadTimer);
      window.removeEventListener("load", handlePageLoad);
    };
  }, [location.pathname]);

  return (
    <>
      {showSlowLoader && <SlowLoader />}
      <ScrollToTop />
      <Navbar />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/events/:eventId" element={<EventPage />} />
        <Route path="/om" element={<AboutPage />} />
        <Route path="/tilmeldinger" element={<RegistrationsPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </>
  );
}
