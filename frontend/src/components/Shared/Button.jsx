import { ChevronRight, Loader } from "lucide-react";

export const Button = ({
  children,
  type = "button",
  isLoading = false,
  fullWidth = false,
  className = "",
  icon = null,
  ...props
}) => {
  const baseClasses =
    "flex justify-center items-center py-3 px-4 border border-transparent rounded-lg shadow-sm text font-medium text-white";
  const gradientClasses =
    "bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600";

  const classes = `
    ${baseClasses}
    ${gradientClasses}
    ${fullWidth ? "w-full" : ""}
    ${className}
  `;

  return (
    <button type={type} disabled={isLoading} className={classes} {...props}>
      {isLoading ? (
        <Loader className="h-5 w-5 animate-spin" />
      ) : (
        <>
          {icon ? icon : ""} {children}
          {icon ? "" : <ChevronRight className="h-5 w-5 ml-2" />}
        </>
      )}
    </button>
  );
};
