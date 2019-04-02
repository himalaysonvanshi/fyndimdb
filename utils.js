var mongodbClient = require('mongodb').MongoClient;
var dbo;
var jwt = require('jsonwebtoken');

var connectMongoDb = function() {
    return new Promise(function(resolve, reject) {
        mongodbClient.connect(process.env.MONGODB_URI, { useNewUrlParser: true }, function(err, dbobject) {
            if(err) {
                reject(err);
                console.log(err);
                return;
            }

            dbo = dbobject.db("movies");
            resolve();
        }); 
    });
}

module.exports =  {
    validateToken: function(req, res, next) {

        connectMongoDb()
        .then(function () {
            jwt.verify(req.cookies.loginToken, process.env.JWT_KEY, 
            function(err, authdata) {

                if(err || !authdata || !authdata.username) {
                    var response = {bSuccessful: false};
                    res.send(JSON.stringify(response));
                    return;
                }

                var findObj = { username : authdata.username, role: authdata.role};
                
                dbo.collection('users').findOne(findObj, function(err, output) {
                    if(err || !output || output.username != authdata.username) 
                    {
                        var response = {bSuccessful: false};
                        res.send(JSON.stringify(response));
                        return;
                    }
                    
                    req.authdata = authdata;
                    next();
                });

            });
        })
        .catch((e) => { console.log(e)});
    }
}