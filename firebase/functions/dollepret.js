require("./utils.js")()

var admin = require('firebase-admin');

var serviceAccount = require("./dollepretKey.json");

var dolleApp = admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://dollepret-1ab12.firebaseio.com"
}, "Dollepret");
var dolleDatabase = dolleApp.firestore();

module.exports = function() {

    this.test = function() {
        dolleDatabase.collection("uploads").doc().set({"haha": "doet ie het?????"});
        console.log("kfdkljgdfklgjdfgkljfdglkjfdgl");
    }

}
