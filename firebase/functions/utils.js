
var functions = require('firebase-functions');
var admin = require('firebase-admin');
admin.initializeApp(functions.config().firebase);
var database = admin.database();

module.exports = function() {

    this.functions = functions;
    this.admin = admin;
    this.database = database;

    this.refValue = function(reference, callback) {
        reference.once("value", snapshot => {
            callback(snapshot.val());
        });
    }

}
