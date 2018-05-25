
function showNavbar(callback) {
    if (typeof window.navbar !== "undefined" && window.navbar != null) {
        if (typeof callback !== "undefined")
            callback(nb);
        return;
    }
    getFragment("navbar", function (nb) {
        window.navbar = nb;
        window.prevScrollTop = 0;
        window.navbarHidden = false;
        window.navbarShadow = true;

        $("header").prepend(nb);
        setTimeout(function () {
            window.tabs = $('#nav-tabs').tabs();
            window.navbar.fadeIn(300);
        }, 200);
        if (typeof callback !== "undefined")
            callback(nb);
    });
}

function removeNavbar() {
    if (typeof window.navbar === "undefined" || window.navbar == null)
        return;
    window.navbar.remove();
    window.navbar = null;
}

$(window).scroll(function () {

    if (typeof window.navbar === "undefined" || window.navbar == null)
        return;
    var scrollTop = $(window).scrollTop();
    var nav = window.navbar.find("nav");

    if (scrollTop == 0) {
        if (!window.navbarShadow) {
            window.navbarShadow = true;
            nav.addClass("z-depth-0");
        }
    } else if (window.navbarShadow) {
        nav.removeClass("z-depth-0");
        window.navbarShadow = false;
    }
    if (scrollTop > window.prevScrollTop && !window.navbarHidden) {
        nav.addClass("hidden");
        window.navbarHidden = true;
    } else if (scrollTop < window.prevScrollTop && window.navbarHidden) {
        nav.removeClass("hidden");
        window.navbarHidden = false;
    }
    window.prevScrollTop = scrollTop;
});