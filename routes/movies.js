var MovieController = require("../controllers/movieController.js")
var movieController = new MovieController();

var validateToken = require("../utils").validateToken;

function initRoutes(router) {

    router.route("/movies")
    .get(validateToken, movieController.getMovies);

    router.route("/movies/add")
    .post(validateToken, movieController.addMovie);

    router.route("/movies/update")
    .post(validateToken, movieController.updateMovie);

    router.route("/movies/delete")
    .post(validateToken, movieController.deleteMovie);
}

module.exports = { initRoutes: initRoutes }
