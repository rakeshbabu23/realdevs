import { useLayoutEffect, useState } from "react";

const useWindowResize = () => {
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const handleWidth = () => {
    setIsMobile(window.innerWidth < 768);
  };
  useLayoutEffect(() => {
    window.addEventListener("resize", handleWidth);
    return () => {
      window.removeEventListener("resize", handleWidth);
    };
  }, []);
  return {
    isMobile,
  };
};

export default useWindowResize;
