import { useEffect, useState } from "react";
import SlowLoader from "./SlowLoader";

export default function AppLoader() {
  const [showSlowLoader, setShowSlowLoader] = useState(true);

  useEffect(() => {
    let showTimer;

    const hideLoader = () => {
      window.clearTimeout(showTimer);
      setShowSlowLoader(false);
    };

    if (document.readyState === "complete") {
      hideLoader();
      return undefined;
    }

    showTimer = window.setTimeout(() => {
      setShowSlowLoader(true);
    }, 500);

    window.addEventListener("load", hideLoader, { once: true });

    return () => {
      window.clearTimeout(showTimer);
      window.removeEventListener("load", hideLoader);
    };
  }, []);

  return showSlowLoader ? <SlowLoader /> : null;
}
