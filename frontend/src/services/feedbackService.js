import requests from "./httpRequest";

const FeedbackService = {
  create: async (body) => requests.post("/feedbacks", body),
};

export default FeedbackService;
