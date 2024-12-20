const websiteService = require("../services/websiteService");
const ApiResponse = require("../../../utils/apiResponse");
const ApiError = require("../../../utils/apiError");
const httpStatus = require("http-status");
const { schedulePing, deleteScheduledJob } = require("../../../jobs/pingJob");
const logService = require("../../logs/services/logService");
const axios = require("axios");

const addWebsite = async (req, res, next) => {
  try {
    const requestUrlOrigin = new URL(req.body.url).origin;

    let getWebsite = await websiteService.getWebsites({
      url: requestUrlOrigin,
    });

    if (getWebsite.length > 0) {
      return next(
        new ApiError(httpStatus.BAD_REQUEST, "URL already exists in our system")
      );
    }

    await axios.get(req.body.url);

    const website = await websiteService.addWebsite({
      ...req.body,
      owner: req.user.id,
      owner_email: req.user.email,
    });

    schedulePing(website.owner_email, website.url, website.ping_time);
    return res
      .status(httpStatus.CREATED)
      .json(
        new ApiResponse(
          httpStatus.CREATED,
          website,
          "Websites added successfully"
        )
      );
  } catch (error) {
    if (error.isAxiosError) {
      return next(
        new ApiError(httpStatus.BAD_GATEWAY, "Error connecting to website")
      );
    }
    return next(error);
  }
};

const getWebsites = async (req, res, next) => {
  try {
    const websites = await websiteService.getWebsites();
    if (websites.length === 0) {
      return next(new ApiError(httpStatus.NOT_FOUND, "No websites found"));
    }
    return res
      .status(httpStatus.OK)
      .json(
        new ApiResponse(
          httpStatus.OK,
          websites,
          "Websites retrieved successfully"
        )
      );
  } catch (error) {
    next(error);
  }
};

const getWebsite = async (req, res, next) => {
  try {
    const website = await websiteService.getWebsite(req.params.id);
    return res.json(
      new ApiResponse(httpStatus.OK, website, "Website retrieved successfully")
    );
  } catch (error) {
    next(error);
  }
};

const updateWebsite = async (req, res, next) => {
  try {
    const website = await websiteService.updateWebsite(req.params.id, req.body);
    return res.json(
      new ApiResponse(httpStatus.OK, website, "Website updated successfully")
    );
  } catch (error) {
    next(error);
  }
};

const deleteWebsite = async (req, res, next) => {
  try {
    const website = await websiteService.getWebsite(req.params.id);
    await deleteScheduledJob(website.url);
    await websiteService.deleteWebsite(req.params.id);
    await logService.deleteLogs(website.url);
    return res.json(
      new ApiResponse(httpStatus.OK, null, "Website deleted successfully")
    );
  } catch (error) {
    next(error);
  }
};

const getLoggedInUserWebsites = async (req, res, next) => {
  try {
    const websites = await websiteService.getWebsites({ owner: req.user.id });
    if (websites.length === 0) {
      return next(new ApiError(httpStatus.NOT_FOUND, "No websites found"));
    }
    return res
      .status(httpStatus.OK)
      .json(
        new ApiResponse(
          httpStatus.OK,
          websites,
          "Websites retrieved successfully"
        )
      );
  } catch (error) {
    next(error);
  }
};

module.exports = {
  addWebsite,
  getWebsites,
  getWebsite,
  updateWebsite,
  deleteWebsite,
  getLoggedInUserWebsites,
};
