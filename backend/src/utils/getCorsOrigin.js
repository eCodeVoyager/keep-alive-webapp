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

  // Allow credentials only for specified origins
  return function (origin, callback) {
    if (urls.includes(origin) || !origin) {
      callback(null, true);
    } else {
      callback(new ApiError(403, "Not allowed by CORS"));
    }
  };
};

module.exports = getCorsOrigin;
