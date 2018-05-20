
module.exports = function(api) {

    api.get("/login", (req, res) => {
        res.send("hoi inloggen?");
    });

}