
module.exports = function(api) {

    api.post("/login", (req, res) => {
        res.send("hoi inloggen?");
    });

}