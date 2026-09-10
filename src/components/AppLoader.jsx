import { useEffect, useState } from "react";
import SlowLoader from "./SlowLoader";

export default function AppLoader() {
  const [showSlowLoader, setShowSlowLoader] = useState(true);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setShowSlowLoader(false);
    }, 0);

    return () => window.clearTimeout(timer);
  }, []);

  if (!showSlowLoader) {
    return null;
  }

  return <SlowLoader />;
}
