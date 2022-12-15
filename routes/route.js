const routes = require("express").Router();
const controller = require("../controller/controller");

routes
  .route("/api/categories")
  .post(controller.create_Categories)
  .get(controller.get_Categories);

routes
  .route("/api/transaction")
  .post(controller.create_Transaction)
  .get(controller.get_Transaction)
  .delete(controller.delete_Transaction);

routes.route("/api/labels").get(controller.get_Labels);

routes
  .route("/api/users")
  .post(controller.get_User)
  .put(controller.create_User);

module.exports = routes;
