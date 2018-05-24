
function showNavbar(callback) {
    getFragment("navbar", function(navbar) {
        $("header").prepend(navbar);
        $('#nav-tabs').tabs();
        if (mobile) {
            navbar.find(".tabs").find("span").remove(); // remove text on tabs when on mobile
        }
        navbar.fadeIn(300);
        if (typeof callback !== "undefined")
            callback(navbar);
    });
}

function removeNavbar() {

}