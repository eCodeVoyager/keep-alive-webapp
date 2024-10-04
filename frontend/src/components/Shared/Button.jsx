import PropTypes from "prop-types";

export const Button = ({
  children,
  type = "button",
  isLoading = false,
  fullWidth = false,
  className = "",
  ...props
}) => {
  const baseClasses =
    "flex justify-center items-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white";
  const gradientClasses =
    "bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600";
  const focusClasses =
    "focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500";

  const classes = `
    ${baseClasses}
    ${gradientClasses}
    ${focusClasses}
    ${fullWidth ? "w-full" : ""}
    ${className}
  `;

  return (
    <button type={type} disabled={isLoading} className={classes} {...props}>
      {isLoading ? (
        <svg
          className="animate-spin h-5 w-5 text-white"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          ></circle>
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          ></path>
        </svg>
      ) : (
        children
      )}
    </button>
  );
};

Button.propTypes = {
  children: PropTypes.node.isRequired,
  type: PropTypes.oneOf(["button", "submit", "reset"]),
  isLoading: PropTypes.bool,
  fullWidth: PropTypes.bool,
  className: PropTypes.string,
};
