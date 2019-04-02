const movieRouter  = require("./movies"),
    userRouter = require("./user");

module.exports = (router) => {
    movieRouter.initRoutes(router);
    userRouter.initRoutes(router);
    return router;
}
