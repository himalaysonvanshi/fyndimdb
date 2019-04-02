require('dotenv').config()

var mongodbClient = require('mongodb').MongoClient;
var url = process.env.MONGODB_URI;
var dbName = process.env.DB_NAME;
const fs = require('fs');
var dbFilePath = __dirname + "imdb.json";
var dbo;
var db;

var connectMongoDb = function() {
    return new Promise(function(resolve, reject) {
        mongodbClient.connect(url, { useNewUrlParser: true }, function(err, dbobject) {
            if(err) {
                reject(err);
                return;
            }

            db = dbobject;
            dbo = dbobject.db(dbName);
        
            resolve();
        }); 
    });
}

var createCollection = function() {
    return new Promise(function(resolve, reject) {
        dbo.createCollection("movies", function(err, res) {
            if(err) {
                reject(err);
                return;
            }
            resolve();
        });
    });
}

var readJsonFile = function() {
    return new Promise(function(resolve, reject) {
        fs.readFile(dbFilePath, function (err, data) {
            if(err) {
                reject(err);
                return;
            }
            resolve(data);
        })
    })    
 };

 var insertData = function(data) {
    return new Promise(function(resolve, reject) {
        try{
            var jsondata = JSON.parse(data) 
        }
        catch(e) {
            reject(e);
        };

        dbo.collection("movies").insertMany(jsondata, function(err, res) {
            if (err) { 
                reject(err);
                return;
            }

            dbo.collection("movies").updateMany({}, { $set: {viewerAllowed : 1, modAllowed: 1 }})

            resolve();
        });
    });
 }

connectMongoDb()
.then(createCollection)
.then(readJsonFile)
.then(insertData)
.catch(function(e) {
    console.log("error in inserting data", e);
})
.then( function() {
    db.close();
    process.exit();
});