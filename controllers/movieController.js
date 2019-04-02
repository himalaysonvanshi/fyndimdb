var dbo;
var mongodbClient = require('mongodb').MongoClient;
var ObjectId = require('mongodb').ObjectID;
var dbName = process.env.DB_NAME;

var connectMongoDb = function() {
    return new Promise(function(resolve, reject) {
        mongodbClient.connect(process.env.MONGODB_URI, { useNewUrlParser: true }, function(err, dbobject) {
            if(err) {
                reject(err);
                return;
            }

            dbo = dbobject.db(dbName);
            resolve();
        }); 
    });
}

function movieController() {
    connectMongoDb();
}

movieController.prototype.addMovie = function(req, res) {

    console.log("trying to add movie", req.body);
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    
    var response;

    var authdata = req.authdata;
    if(!authdata || authdata.role != "admin" || !req.body.movie) {
        response = {bSuccessful : false}; 
        res.send(JSON.stringify(response));
        return;
    }
    
    try {
        var movie = JSON.parse(req.body.movie);
    }
    catch(e) {
        response = {bSuccessful : false}; 
        res.send(JSON.stringify(response));
        return;
    }
     
    dbo.collection('movies').insertOne(movie, function(err, response) {
        if(err) 
        {
            var response = {bSuccessful: false};
            res.send(JSON.stringify(response));
            console.log(err);
            return;
        }
        var response = {bSuccessful: true};
        res.send(JSON.stringify(response));
    });
}

movieController.prototype.updateMovie = function(req, res) {

    var authdata = req.authdata;
    var response;
    
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    
    if(authdata.role == "viewer") {
        response = {bSuccessful : false}; 
        res.send(JSON.stringify(response));
        return;
    }

    var id = req.body.id;
    try {
        var movie = JSON.parse(req.body.movie);
    }
    catch(e) {
        response = {bSuccessful : false}; 
        res.send(JSON.stringify(response));
        return;
    }
    
    if(authdata.role == "moderator" && (movie.modAllowed || movie.viewerAllowed)) {
        response = {bSuccessful : false}; 
        res.send(JSON.stringify(response));
        return;
    }

    var changeTo = {
        $set: movie
    }

    var findObj = {
        "_id": ObjectId(JSON.parse(id)) 
    }
    
    dbo.collection('movies').updateOne(findObj, changeTo, function(err, response) {
        if(err) 
        {
            var response = {bSuccessful: false};
            res.send(JSON.stringify(response));
            console.log(err);
            return;
        }
        var response = {bSuccessful: true};
        res.send(JSON.stringify(response));
    });
}

movieController.prototype.deleteMovie = function(req, res) {

    var authdata = req.authdata;
    var response;
    
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    
    if(authdata.role == "viewer") {
        response = {bSuccessful : false}; 
        res.send(JSON.stringify(response));
        return;
    }
    
    var id = req.body.id;

    var changeTo = {
        $set: {deleted: 1}
    }

    var findObj = {
        "_id": ObjectId(JSON.parse(id)) 
    }

    dbo.collection('movies').updateOne(findObj, changeTo, function(err, response) {
        if(err) 
        {
            var response = {bSuccessful: false};
            res.send(JSON.stringify(response));
            console.log(err);
            return;
        }
        var response = {bSuccessful: true};
        res.send(JSON.stringify(response));
    });
}

movieController.prototype.getMovies = function(req, res) {

    var authdata = req.authdata;
    var response;
    
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    
    var findObj = { deleted : { $in : [null, 0]}};
    if(authdata.role == "viewer") {
        findObj.viewerAllowed = 1;
    }
    else if(authdata.role == "moderator") {
        findObj.modAllowed = 1;
    }
       
    dbo.collection('movies').find(findObj).toArray(function(err, output) {
        if(err) 
        {
            var response = {bSuccessful: false};
            res.send(JSON.stringify(response));
            return;
        }
        var response = {bSuccessful: true, arrMovies: output};
        res.send(JSON.stringify(response));
    });
}

module.exports = movieController;