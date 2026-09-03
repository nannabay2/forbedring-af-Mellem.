import { useEffect, useRef } from "react";
import lottie from "lottie-web";
import slowLoaderAnimation from "../assets/slow-loader.json";

export default function SlowLoader() {
  const containerRef = useRef(null);

  useEffect(() => {
    if (!containerRef.current) {
      return undefined;
    }

    const animation = lottie.loadAnimation({
      container: containerRef.current,
      renderer: "svg",
      loop: true,
      autoplay: true,
      animationData: slowLoaderAnimation,
    });

    return () => {
      animation.destroy();
    };
  }, []);

  return (
    <div className="slow-loader-overlay" aria-live="polite" aria-busy="true">
      <div
        className="slow-loader"
        ref={containerRef}
        aria-label="Indlæser siden"
      />
    </div>
  );
}
