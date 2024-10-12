
import requests from "./httpRequest";

const logService = {
  getLogs: async (url) => requests.get("/logs?url=" + url),
};

export default logService;
