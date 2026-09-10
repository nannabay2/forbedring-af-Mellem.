import { useEffect, useRef } from "react";
import lottie from "lottie-web";
import animationData from "../assets/ellipse-1.json";

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
      animationData,
      rendererSettings: {
        preserveAspectRatio: "xMidYMid meet",
      },
    });

    return () => animation.destroy();
  }, []);

  return (
    <div
      className="slow-loader-overlay"
      role="status"
      aria-live="polite"
      aria-label="Indlæser siden"
    >
      <div className="slow-loader-animation" ref={containerRef} />
    </div>
  );
}
