import { useLayoutEffect } from "react";
import { useLocation } from "react-router-dom";

const ScrollToTop = () => {
  const { pathname } = useLocation();

  useLayoutEffect(() => {
    // React Router scroll restore ko override karne ke liye
    window.scrollTo({ top: 0, left: 0, behavior: "auto" });

    // extra safety (Router ke baad bhi top force)
    setTimeout(() => {
      window.scrollTo({ top: 0, left: 0, behavior: "auto" });
    }, 0);
  }, [pathname]);

  return null;
};

export default ScrollToTop;
