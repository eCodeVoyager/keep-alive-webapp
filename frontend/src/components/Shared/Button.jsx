import { ChevronRight, Loader } from "lucide-react";

export const Button = ({
  children,
  type = "button",
  isLoading = false,
  fullWidth = false,
  className = "",
  icon = null,
  variant = "primary",
  size = "md",
  disabled = false,
  ...props
}) => {
  // Base classes shared by all button variants
  const baseClasses =
    "flex justify-center items-center border rounded-lg shadow-sm font-medium transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-opacity-50";

  // Size variations
  const sizeClasses = {
    sm: "py-2 px-3 text-sm",
    md: "py-3 px-4 text-md",
    lg: "py-4 px-6 text-lg",
  };

  // Variant styles
  const variantClasses = {
    primary:
      "bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 text-white focus:ring-green-400 border-transparent",
    secondary:
      "bg-gray-700 hover:bg-gray-600 text-white focus:ring-gray-500 border-gray-600",
    danger:
      "bg-red-500 hover:bg-red-600 text-white focus:ring-red-400 border-transparent",
    outline:
      "bg-transparent hover:bg-gray-700 text-gray-300 border-gray-600 focus:ring-gray-500",
  };

  // Disabled state
  const disabledClasses =
    isLoading || disabled ? "opacity-70 cursor-not-allowed" : "";

  // Combine all classes
  const classes = `
    ${baseClasses}
    ${sizeClasses[size]}
    ${variantClasses[variant]}
    ${fullWidth ? "w-full" : ""}
    ${disabledClasses}
    ${className}
  `;

  return (
    <button
      type={type}
      disabled={isLoading || disabled}
      className={classes}
      {...props}
    >
      {isLoading ? (
        <Loader className="h-5 w-5 animate-spin" />
      ) : (
        <>
          {icon && <span className="mr-2">{icon}</span>}
          {children}
          {!icon && variant === "primary" && !isLoading && (
            <ChevronRight className="h-5 w-5 ml-2" />
          )}
        </>
      )}
    </button>
  );
};

export default Button;
