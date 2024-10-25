require("dotenv").config();

const ApiError = require("./apiError");
// Function to handle dynamic origin configuration
const getCorsOrigin = () => {
  const clientUrls = process.env.CLIENT_URL || "*";

  // If the origin is '*', allow all origins
  if (clientUrls === "*") {
    return "*";
  }

  // If there are multiple URLs, split them into an array
  const urls = clientUrls.split(",");

  return function (origin, callback) {
    // Block requests without an Origin header
    if (!origin) {
      callback(
        new ApiError(403, "Not allowed by CORS - Origin not in whitelist")
      );
      return;
    }

    // Allow only specified origins
    if (urls.includes(origin)) {
      callback(null, true);
    } else {
      callback(
        new ApiError(403, "Not allowed by CORS - Origin not in whitelist")
      );
    }
  };
};

module.exports = getCorsOrigin;
