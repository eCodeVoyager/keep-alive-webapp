const router = require("express").Router();
const logsController = require("../controllers/logController");
const authenticate = require("../../../middleware/authMiddleware");

router.use(authenticate);

router
  .route("/")
  .get(authenticate, logsController.getLogs)
  .delete(authenticate, logsController.deleteLogs);

module.exports = router;
