var UserController = require("../controllers/userController.js")
var userController = new UserController();

function initRoutes(router) {

    router.route("/login")
    .post(userController.login)

    router.route("/logout")
    .get(userController.logout)
}

module.exports = { initRoutes: initRoutes }