// ------------------------------------- PART A: INITILIZING THE VARIABLES ---------------------------------------------

var express = require('express');
var MongoClient = require('mongodb').MongoClient;
var assert = require('assert');
var bodyParser = require('body-parser');
var ObjectID = require('mongodb').ObjectID;

// Connection URL
//var url = 'mongodb://udit:rangrezz@ds117178.mlab.com:17178/tododb';

// Database Name
var dbName = 'tododb';
var db = Object;

// --------------------------------------- PART B: CONNECTING TO MONGO SERVER ------------------------------------------

// Use connect method to connect to the server
MongoClient.connect(url, function(err, client) {
    // assert.equal(null, err); // --> checks for two equal values, else throws error
    if (err) {
        console.error(err);
        return 0;
    }

    console.log("Connected successfully to server");
    db = client.db(dbName);
    // client.close();
});

// ---------------------------- PART C: CREATING EXPRESS INSTANCE AND SERVING HOME.HTML -------------------------------

var app = express();
app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({
    extended: true
})); // support encoded bodies

app.get('/', function(req, res, next) {
    res.sendFile('/home.html', {
        root: __dirname
    });
});

// ----------------------------------------- PART D: CRUD OPERATION ROUTES --------------------------------------------

app.get('/getEntries', function(req, res, next) {
    //console.log('request received');
    function callback(result) {
       /* if (result.length == 0) {
            res.send('No entries yet');
            return 0;
        }*/

        res.json(JSON.parse(JSON.stringify(result)));
        //console.log('response_Sent');
        // or simply res.json(result);
    }

    var collection = db.collection('vortex');
    // Find some vortex
    collection.find({}).toArray(function(err, docs) {
        // assert.equal(err, null);	// --> checks for two equal values, else throws error
        console.log("Found the following records");
        console.log(docs);
        callback(docs);
    });

});

app.post('/create', function(req, res, next) {
    console.log(req.body);

    function callback(err) {
        if (err) {
            res.send('Error inserting record, try again or debug code...');
            return 0;
        }

        res.send('Successfully insereted record.');
    }

    // Get the vortex collection
    var collection = db.collection('vortex');
    // Insert some vortex
    collection.insertOne(req.body, function(err, result) {
        // assert.equal(err, null);	// --> checks for two equal values, else throws error
        if (err) {
            console.error(err)
            callback(err);
        }

        callback(null);
    });

});

app.post('/update', function(req, res, next) {
    console.log(req.body);

    function callback(err, status) {
        if (err) {
            res.send('Error updating record, try again or debug code...');
            return 0;
        }

        if (status == 0) {
            res.send('No updating needed.');
            return 0;
        }

        res.send('Successfully updated record.');
    }

    // Get the vortex collection
    var collection = db.collection('vortex');
    // Update vortex where a is 2, set b equal to 1
    collection.updateOne({
        _id: new ObjectID(req.body.id)
    }, {
        $set: req.body
    }, function(err, result) {
        // assert.equal(err, null);	// --> checks for two equal values, else throws error
        if (err) {
            console.error(err);
            callback(err);
        }

        callback(null, result.modifiedCount);
    });
});

app.post('/delete', function(req, res, next) {
    function callback(err, status) {
        if (err) {
            res.send('Error deleting record, try again or debug code...');
            return 0;
        }

        if (status == 0) {
            res.send('Record doesn\'t exist.');
            return 0;
        }

        res.send('Successfully deleted record.');
    }

    // Get the vortex collection
    var collection = db.collection('vortex');
    // Delete vortex where a is 3
    collection.deleteOne({
        _id: new ObjectID(req.body.id)
    }, function(err, result) {
        // assert.equal(err, null);	// --> checks for two equal values, else throws error
        if (err) {
            console.error(err);
            callback(err);
        }

        callback(null, result.result.n);
    });
});

// -------------------------------------- PART E: SERVING LOCAL FILES FOR HTML TO USE ----------------------------------

app.get('/home.css', function(req, res, next) {
    res.sendFile(__dirname + "/" + "home.css");
});

app.get('/home.js', function(req, res, next) {
    res.sendFile(__dirname + "/" + "home.js");
});

// ----------------------------------------- PART F: RUNNING THE SEVER -------------------------------------------------

app.listen(3000, function() {
    console.log('Example app listening on port 3000!');
});
