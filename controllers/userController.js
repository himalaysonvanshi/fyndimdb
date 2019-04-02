var dbo;
var mongodbClient = require('mongodb').MongoClient;
var jwt = require('jsonwebtoken');
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

function userController() {
    connectMongoDb();
}

// userController.prototype.getlogin = function(req, res) {

//     res.header("Access-Control-Allow-Origin", "*");
//     res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    
//     console.log("get login params", req.params);
//     var findObj = {username: req.params.username, password: req.params.password};

//     dbo.collection('users').findOne(findObj, function(err, output) {
//         if(err || !output || output.username != findObj.username) 
//         {
//             var response = {bSuccessful: false};
//             res.send(JSON.stringify(response));
//             console.log(err, findObj, output, req.params);
//             return;
//         }
        
//         var token = jwt.sign({ username: output.username, role: output.role }, process.env.JWT_KEY);
//         res.cookie('loginToken', token, { maxAge: 900000, httpOnly: true });
//         var response = {bSuccessful: true};
//         res.send(JSON.stringify(response));
//         console.log("successful login", output, token);
//     });
// }

userController.prototype.login = function(req, res) {

    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    
    var findObj = {username: req.body.username, password: req.body.password};  
    //var findObj = {username: req.params.username, password: req.params.password};
    try {
    dbo.collection('users').findOne(findObj, function(err, output) {
        if(err || !output || output.username != findObj.username) 
        {
            var response = {bSuccessful: false};
            res.send(JSON.stringify(response));
            console.log(err, findObj, output, req.body);
            return;
        }
        
        var token = jwt.sign({ username: output.username, role: output.role }, process.env.JWT_KEY);
        res.cookie('loginToken', token, { maxAge: 900000, httpOnly: true });
        var response = {bSuccessful: true};
        res.send(JSON.stringify(response));
        console.log("successful login", token);
    });
}
catch(err) {
    res.status(500).send({error: err});
}
}

userController.prototype.logout = function(req, res) {

    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    
    res.clearCookie('loginToken');
    var response = {bSuccessful: true};
    res.send(JSON.stringify(response));
}

module.exports = userController;