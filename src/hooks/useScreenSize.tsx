import { useEffect, useState } from "react";

export const useScreenSize = () => {
  const [height, setHeight] = useState(window.innerHeight);
  const detectHeight = () => setHeight(window.innerHeight);
  useEffect(() => {
    window.addEventListener("resize", detectHeight);
    return () => window.removeEventListener("resize", detectHeight);
  }, [height]);
  return height;
};
