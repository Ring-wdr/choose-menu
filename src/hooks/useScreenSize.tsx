import { useEffect, useState } from 'react';

type WindowScreen = {
  width: number;
  height: number;
};

function getCurrentDimension() {
  return {
    width: window.innerWidth,
    height: window.innerHeight,
  };
}

export const useScreenSize = () => {
  const [screenSize, setScreenSize] =
    useState<WindowScreen>(getCurrentDimension);
  useEffect(() => {
    const detectHeight = () => setScreenSize(getCurrentDimension);
    window.addEventListener('resize', detectHeight);
    return () => window.removeEventListener('resize', detectHeight);
  }, [screenSize]);
  return screenSize;
};
