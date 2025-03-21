import { useEffect, useState } from "react";

// Tailwind default breakpoints
export const breakpoints = {
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  "2xl": 1536,
};

/**
 * Hook to detect the current breakpoint based on window width
 * @returns {Object} Current breakpoint information
 */
export const useBreakpoint = () => {
  const [breakpoint, setBreakpoint] = useState({
    sm: false,
    md: false,
    lg: false,
    xl: false,
    "2xl": false,
    current: "xs", // xs is default (below sm)
  });

  useEffect(() => {
    // Function to calculate breakpoint
    const calculateBreakpoint = () => {
      const width = window.innerWidth;
      const newBreakpoint = {
        sm: width >= breakpoints.sm,
        md: width >= breakpoints.md,
        lg: width >= breakpoints.lg,
        xl: width >= breakpoints.xl,
        "2xl": width >= breakpoints["2xl"],
        current: "xs",
      };

      // Determine current breakpoint
      if (width >= breakpoints["2xl"]) {
        newBreakpoint.current = "2xl";
      } else if (width >= breakpoints.xl) {
        newBreakpoint.current = "xl";
      } else if (width >= breakpoints.lg) {
        newBreakpoint.current = "lg";
      } else if (width >= breakpoints.md) {
        newBreakpoint.current = "md";
      } else if (width >= breakpoints.sm) {
        newBreakpoint.current = "sm";
      }

      setBreakpoint(newBreakpoint);
    };

    // Calculate on mount
    calculateBreakpoint();

    // Add resize listener
    window.addEventListener("resize", calculateBreakpoint);

    // Clean up
    return () => {
      window.removeEventListener("resize", calculateBreakpoint);
    };
  }, []);

  return breakpoint;
};

/**
 * Hook that detects if the current screen is mobile size
 * @returns {Boolean} True if screen width is less than md breakpoint
 */
export const useMobileDetect = () => {
  const breakpoint = useBreakpoint();
  return !breakpoint.md;
};

/**
 * Hook that provides window dimensions with debounce
 * @param {Number} debounceTime - Debounce time in ms
 * @returns {Object} Width and height of the window
 */
export const useWindowDimensions = (debounceTime = 250) => {
  const [dimensions, setDimensions] = useState({
    width: typeof window !== "undefined" ? window.innerWidth : 0,
    height: typeof window !== "undefined" ? window.innerHeight : 0,
  });

  useEffect(() => {
    let timeoutId;

    const handleResize = () => {
      clearTimeout(timeoutId);

      timeoutId = setTimeout(() => {
        setDimensions({
          width: window.innerWidth,
          height: window.innerHeight,
        });
      }, debounceTime);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      clearTimeout(timeoutId);
    };
  }, [debounceTime]);

  return dimensions;
};
