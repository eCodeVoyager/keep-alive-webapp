const websiteModel = require("../models/websiteModel");

const addWebsite = async (websiteData) => {
  try {
    return await websiteModel.create(websiteData);
  } catch (error) {
    throw error;
  }
};

const getWebsites = async (filter, select) => {
  try {
    return await websiteModel.find(filter).select(select);
  } catch (error) {
    throw error;
  }
};

const getWebsite = async (id) => {
  try {
    return await websiteModel.findById(id);
  } catch (error) {
    throw error;
  }
};

const updateWebsite = async (id, websiteData) => {
  try {
    return await websiteModel.findByIdAndUpdate(id, websiteData, {
      new: true,
    });
  } catch (error) {
    throw error;
  }
};

const deleteWebsite = async (id) => {
  try {
    return await websiteModel.findByIdAndDelete(id);
  } catch (error) {
    throw error;
  }
};

module.exports = {
  addWebsite,
  getWebsites,
  getWebsite,
  updateWebsite,
  deleteWebsite,
};
