const controller = require("../controllers/user.controller.js");
var path = require('path');

module.exports = app => {
    app.get('/', function(req, res) {
        res.sendFile(path.join(__dirname + '/index.html'));
    });
    
    app.get('/price', function(req, res) {
        res.sendFile(path.join(__dirname + '/index.html'));
    });
    app.post("/post-user-details",controller.postuserdetails);
    app.post("/get-user-details",controller.getuserdetails);
    app.post("/update-details",controller.updatedetails);
    app.post("/delete-details",controller.deletedetails);
    app.post("/push",controller.push);
    app.post("/record/:name/:value",controller.record);
    app.post("/record/:name",controller.recordWithBody);
    app.get("/record/:name",controller.getRecord);
};