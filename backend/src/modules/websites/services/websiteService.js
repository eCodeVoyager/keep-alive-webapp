/**
 * Website service module - Handles all database operations related to websites
 *
 * This service provides methods to interact with the website model,
 * including CRUD operations and specialized queries.
 */

const websiteModel = require("../models/websiteModel");
const mongoose = require("mongoose");
const httpStatus = require("http-status");
const ApiError = require("../../../utils/apiError");

/**
 * Add a new website to the database
 * @param {Object} websiteData - The website data to be stored
 * @returns {Promise<Object>} - The created website
 * @throws {Error} If website creation fails
 */
const addWebsite = async (websiteData) => {
  try {
    return await websiteModel.create(websiteData);
  } catch (error) {
    if (error.code === 11000) {
      throw new ApiError(
        httpStatus.CONFLICT,
        "Website with this URL already exists"
      );
    }
    throw error;
  }
};

/**
 * Get websites based on filter criteria using standard find method
 * @param {Object} filter - Filtering criteria
 * @param {String} select - Fields to select
 * @returns {Promise<Array>} - Array of websites matching criteria
 * @throws {Error} If query fails
 */
const getWebsites = async (filter = {}, select) => {
  try {
    return await websiteModel
      .find(filter)
      .sort({ createdAt: -1 })
      .select(select);
  } catch (error) {
    throw error;
  }
};

/**
 * Get websites with pagination using mongoose-paginate-v2
 * @param {Object} filter - Filtering criteria
 * @param {Number} page - Page number
 * @param {Number} limit - Items per page
 * @param {Object} options - Additional options for pagination
 * @returns {Promise<Object>} - Paginated result with docs, totalDocs, etc.
 * @throws {Error} If query fails
 */
const getWebsitesWithPagination = async (
  filter = {},
  page = 1,
  limit = 10,
  options = {}
) => {
  try {
    const paginateOptions = {
      page,
      limit,
      sort: options.sort || { createdAt: -1 },
      populate: options.populate || [],
      lean: options.lean || false,
    };

    return await websiteModel.paginate(filter, paginateOptions);
  } catch (error) {
    throw error;
  }
};

/**
 * Get a website by its ID
 * @param {string} id - Website ID
 * @returns {Promise<Object>} - Website document
 * @throws {ApiError} If website not found or ID is invalid
 */
const getWebsite = async (id) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new ApiError(httpStatus.BAD_REQUEST, "Invalid website ID");
    }

    const website = await websiteModel.findById(id);
    if (!website) {
      throw new ApiError(httpStatus.NOT_FOUND, "Website not found");
    }

    return website;
  } catch (error) {
    throw error;
  }
};

/**
 * Update a website by ID
 * @param {string} id - Website ID
 * @param {Object} websiteData - Updated website data
 * @returns {Promise<Object>} - Updated website
 * @throws {ApiError} If website not found or update fails
 */
const updateWebsite = async (id, websiteData) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new ApiError(httpStatus.BAD_REQUEST, "Invalid website ID");
    }

    const website = await websiteModel.findByIdAndUpdate(id, websiteData, {
      new: true,
      runValidators: true,
    });

    if (!website) {
      throw new ApiError(httpStatus.NOT_FOUND, "Website not found");
    }

    return website;
  } catch (error) {
    if (error.code === 11000) {
      throw new ApiError(
        httpStatus.CONFLICT,
        "Website with this URL already exists"
      );
    }
    throw error;
  }
};

/**
 * Check if user has reached their website limit
 * @param {string} userId - User ID
 * @param {string} accountType - User's account type
 * @returns {Promise<boolean>} Whether user can add more websites
 */
const checkWebsiteLimit = async (userId, accountType) => {
  try {
    const userWebsites = await websiteModel.countDocuments({ owner: userId });
    const limit = accountType === "premium" ? 100 : 5; // Free users can monitor 5 websites, premium users 100

    return userWebsites < limit;
  } catch (error) {
    throw error;
  }
};

/**
 * Delete a website by ID
 * @param {string} id - Website ID
 * @returns {Promise<Object>} - Deleted website
 * @throws {ApiError} If website not found or deletion fails
 */
const deleteWebsite = async (id) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new ApiError(httpStatus.BAD_REQUEST, "Invalid website ID");
    }

    // First try to get the website to ensure it exists
    const website = await websiteModel.findById(id);
    if (!website) {
      // If website doesn't exist, consider it already deleted
      return { message: "Website already deleted" };
    }

    // Try to delete the website
    const deletedWebsite = await websiteModel.findByIdAndDelete(id);
    if (!deletedWebsite) {
      // If deletion failed but website exists, throw error
      throw new ApiError(
        httpStatus.INTERNAL_SERVER_ERROR,
        "Failed to delete website"
      );
    }

    return deletedWebsite;
  } catch (error) {
    // If error is already an ApiError, rethrow it
    if (error instanceof ApiError) {
      throw error;
    }
    // For other errors, throw a generic error
    throw new ApiError(
      httpStatus.INTERNAL_SERVER_ERROR,
      "Error deleting website"
    );
  }
};

/**
 * Get website status summary counts
 * @param {string} owner - Owner ID
 * @returns {Promise<Object>} - Counts of online and offline websites
 */
const getWebsiteStatusSummary = async (owner) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(owner)) {
      throw new ApiError(httpStatus.BAD_REQUEST, "Invalid owner ID");
    }

    const result = await websiteModel.aggregate([
      { $match: { owner: new mongoose.Types.ObjectId(owner) } },
      { $group: { _id: "$status", count: { $sum: 1 } } },
    ]);

    // Format the results
    const summary = {
      online: 0,
      offline: 0,
      total: 0,
    };

    result.forEach((item) => {
      if (item._id) {
        summary[item._id] = item.count;
        summary.total += item.count;
      }
    });

    return summary;
  } catch (error) {
    throw error;
  }
};

/**
 * Find websites that match the given URL
 * @param {string} url - URL to match
 * @param {string} owner - Optional owner ID to limit search
 * @returns {Promise<Array>} - Matching websites
 */
const findWebsiteByUrl = async (url, owner = null) => {
  try {
    const query = { url };
    if (owner) {
      query.owner = owner;
    }

    return await websiteModel.findOne(query);
  } catch (error) {
    throw error;
  }
};

/**
 * Find websites by multiple URLs
 * @param {Array<string>} urls - Array of URLs to find
 * @returns {Promise<Array>} - Array of websites matching the URLs
 */
const findWebsitesByUrls = async (urls) => {
  try {
    return await websiteModel.find({ url: { $in: urls } });
  } catch (error) {
    throw error;
  }
};

/**
 * Update website status and related fields
 * @param {string} id - Website ID
 * @param {string} status - New status ('online' or 'offline')
 * @param {boolean} notify_offline - Whether to notify on next offline event
 * @returns {Promise<Object>} - Updated website
 */
const updateWebsiteStatus = async (id, status, notify_offline = null) => {
  try {
    const updateData = { status };

    if (status === "online") {
      updateData.offline_ping_count = 0;
      updateData.notify_offline = true;
    } else if (status === "offline" && notify_offline !== null) {
      updateData.notify_offline = notify_offline;
    }

    return await websiteModel.findByIdAndUpdate(id, updateData, { new: true });
  } catch (error) {
    throw error;
  }
};

/**
 * Increment the offline ping count for a website
 * @param {string} id - Website ID
 * @param {number} increment - Amount to increment by (default: 1)
 * @returns {Promise<Object>} - Updated website
 */
const incrementOfflinePingCount = async (id, increment = 1) => {
  try {
    return await websiteModel.findByIdAndUpdate(
      id,
      { $inc: { offline_ping_count: increment } },
      { new: true }
    );
  } catch (error) {
    throw error;
  }
};

/**
 * Get websites that have been offline for too long and may need deletion
 * @param {number} threshold - Threshold count for deletion consideration
 * @returns {Promise<Array>} - Websites that may need to be deleted
 */
const getOfflineWebsitesForCleanup = async (threshold = 864) => {
  try {
    return await websiteModel.find({
      status: "offline",
      offline_ping_count: { $gte: threshold },
    });
  } catch (error) {
    throw error;
  }
};

/**
 * Search websites by URL pattern
 * @param {string} searchTerm - Search term
 * @param {string} owner - Owner ID to limit search
 * @param {number} limit - Result limit
 * @returns {Promise<Array>} - Matching websites
 */
const searchWebsites = async (searchTerm, owner, limit = 10) => {
  try {
    const query = {};

    if (owner) {
      query.owner = owner;
    }

    if (searchTerm) {
      query.url = { $regex: searchTerm, $options: "i" };
    }

    return await websiteModel.find(query).limit(limit);
  } catch (error) {
    throw error;
  }
};

module.exports = {
  addWebsite,
  getWebsites,
  getWebsitesWithPagination,
  getWebsite,
  updateWebsite,
  deleteWebsite,
  getWebsiteStatusSummary,
  findWebsiteByUrl,
  findWebsitesByUrls,
  updateWebsiteStatus,
  incrementOfflinePingCount,
  getOfflineWebsitesForCleanup,
  searchWebsites,
  checkWebsiteLimit,
};
