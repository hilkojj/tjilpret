
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
        updateNavbarInfo(userSession.user);
        setTimeout(function () {
            M.Tabs.init($('#nav-tabs')[0]);
            $('.sidenav').sidenav();
            window.navbar.fadeIn(300);
            correctTabs();
            $(".drag-target").remove();
        }, 200);
        if (typeof callback !== "undefined")
            callback(nb);
    });
}

function updateNavbarInfo(user) {
    var rgb = rgbString(user.r, user.g, user.b);
    window.navbar.find("#username").html(user.username);
    window.navbar.find(".navbar-profile-pic").attr(
        "src",
        pPicPath(window.userSession.user.profilePic, "small"
        )
    ).css("background-color", rgb);

    $(".sidenav-background").css(
        "background-color", rgb
    ).css(
        "background-image", typeof user.header == "string" ? "url('/static_content/headers/small/" + user.header + "')" : "none"
    );
    $(".sidenav-profile-pic").attr("src", pPicPath(user.profilePic, "med")).css("background-color", rgb);
    $(".sidenav-stats").find("i").css("color", rgb);
    $(".sidenav-stats").find("b").css("color", rgb);
    var url = "/tjiller/" + user.id;
    setHref($(".sidenav-username").html(user.username).parent(), url);
    $("#sidenav-status").html(user.bio);
    $("#sidenav-chat-stat").find("b").html(user.messages);
    setHref($("#sidenav-rep-stat"), url).find("b").html(user.rep);
    setHref($("#sidenav-friends-stat"), url + "/vriends").find("b").html(user.friends);
    setHref($("#my-page-link"), url);
    setHref($("#my-uploads-link"), url + "/uploads");
}

window.clickedTab = false;

function tab(path) {
    window.clickedTab = true;
    return navigate(path);
}

function correctTabs() {
    var found = false;
    $('#nav-tabs').find("a").each(function () {
        var t = $(this);
        if (t.attr("href") == window.currentPath) {
            if (!window.clickedTab) t.addClass("active");
            found = true;
        } else t.removeClass("active");
    }).promise().done(function () {
        var nav = $("nav");
        if (!found) nav.addClass("hide-indicator");
        else nav.removeClass("hide-indicator");

        if (window.clickedTab)
            window.clickedTab = false;
        else M.Tabs.init($('#nav-tabs')[0]);
    });
}

function removeNavbar() {
    if (window.navbar == null)
        return;
    window.navbar.remove();
    $(".sidenav-overlay").remove();
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
    if (scrollTop > window.prevScrollTop && scrollTop > 20 && !window.navbarHidden) {
        nav.addClass("hidden");
        window.navbarHidden = true;
    } else if ((scrollTop < window.prevScrollTop || scrollTop < 20) && window.navbarHidden) {
        nav.removeClass("hidden");
        window.navbarHidden = false;
    }
    window.prevScrollTop = scrollTop;
});