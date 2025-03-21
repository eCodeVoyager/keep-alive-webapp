import React from "react";
import { motion } from "framer-motion";

const PageLayout = ({
  children,
  title,
  className = "",
  maxWidth = "4xl",
  animate = true,
  withPadding = true,
}) => {
  const maxWidthClasses = {
    sm: "max-w-sm",
    md: "max-w-md",
    lg: "max-w-lg",
    xl: "max-w-xl",
    "2xl": "max-w-2xl",
    "3xl": "max-w-3xl",
    "4xl": "max-w-4xl",
    "5xl": "max-w-5xl",
    "6xl": "max-w-6xl",
    "7xl": "max-w-7xl",
    full: "max-w-full",
  };

  const Wrapper = animate ? motion.div : "div";
  const animationProps = animate
    ? {
        initial: { opacity: 0 },
        animate: { opacity: 1 },
        transition: { duration: 0.3 },
      }
    : {};

  return (
    <Wrapper
      className={`
        w-full ${maxWidthClasses[maxWidth]} mx-auto 
        ${withPadding ? "px-4 sm:px-6 md:px-8" : ""} 
        ${className}
      `}
      {...animationProps}
    >
      {title && (
        <h1 className="text-2xl text-white font-bold mb-6 md:text-3xl">
          {title}
        </h1>
      )}
      {children}
    </Wrapper>
  );
};

export default PageLayout;
