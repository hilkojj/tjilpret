
window.navbar = null;

function showNavbar(callback) {
    if (window.navbar != null) {
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
            M.Tabs.init($('#nav-tabs')[0]);
            window.navbar.fadeIn(300);
            correctTabs();
        }, 200);
        if (typeof callback !== "undefined")
            callback(nb);
    });
}

function correctTabs() {
    $('#nav-tabs').find("a").each(function () {
        var t = $(this);
        if (t.attr("href") == window.currentPath)
            t.addClass("active");
        else t.removeClass("active");
    });
    M.Tabs.init($('#nav-tabs')[0]);
}

function removeNavbar() {
    if (window.navbar == null)
        return;
    window.navbar.remove();
    window.navbar = null;
}

$(window).scroll(function () {

    if (window.navbar == null)
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