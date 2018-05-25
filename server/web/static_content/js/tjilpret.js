var mobile = /Mobi/.test(navigator.userAgent);

window.paths = {"/hoom": function() {
    startActivity("home", true, function() {});
    applyThemeColor(window.userSession.user.r, window.userSession.user.g, window.userSession.user.b);
}};

function navigate(pathname) {
    history.pushState(null, null, pathname);
    onPathChanged();
    return false;
}

function onPathChanged() {
    if (window.userSession == null) {
        if (!mobile) $("body").addClass("animatedGradient");
        return startActivity("login", false, function() {});
    }

    var pathname = window.location.pathname;
    for (var path in paths) {
        var pathSlash = path + "/";
        if (path == pathname || pathSlash == pathname || pathname.startsWith(pathSlash))
            return paths[path]();
    }
    console.log("path not found -> home");
    history.replaceState(null, null, "/hoom");
    window.paths["/hoom"]();
}

window.onpopstate = onPathChanged;

$(document).ready(function () {

    if (navigator.appName == 'Microsoft Internet Explorer' || !!(navigator.userAgent.match(/Trident/) || navigator.userAgent.match(/rv 11/))) {
        $("body").html("<h6>Deze site werkt niet in Internet Explorer (denk ik). Gebruik een browser zoals <a href='https://chrome.com/' target='_blank'>Chrome</a>, Firefox of Edge</h6>");
        return;
    }

    if (mobile)
        $("#scrollbar-css").remove();

    $.loadScripts = function (arr, path) {
        var _arr = $.map(arr, function (scr) {
            return $.getScript((path || "") + scr);
        });

        _arr.push($.Deferred(function (deferred) {
            $(deferred.resolve);
        }));

        return $.when.apply($, _arr);
    }

    $.loadScripts([ // no caching
        "style.js",
        "layout.js",
        "navbar.js",
        "session.js",
        "chats.js"
    ], "/static_content/js/").done(function () {

        initStyle(function () {
            onPathChanged();
            $("#preapp-loader-container").fadeOut(200, function () {
                $("#preapp-loader-container").remove();               
            });
        });

    });
});