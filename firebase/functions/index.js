// list of all files with functions:
var files = [
    "users_https"
];

for (var i in files)
    require("./" + files[i] + ".js")(module.exports);
