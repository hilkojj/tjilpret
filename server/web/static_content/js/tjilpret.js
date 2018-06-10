var mobile = /Mobi/.test(navigator.userAgent);

window.subjects = {};

function Subject(name, data) {
    this.name = name;
    this.data = data;
    this.onSessionCreated = null;
    window.subjects[name] = this;
}

Subject.prototype.notify = function () {

    var data = this.data;
    $("[data-subject='" + this.name + "']").each(function () {

        var q = $(this);
        var functionName = q.attr("data-on-notify");
        eval(functionName + "(data, q)");
    });
};

function requestNotify(subjectName) {
    window.subjects[subjectName].notify();
}

window.paths = {
    "/hoom": function () {
        startActivity("home", true, function () { });
        title("Tjilpret web");
        applyFavColor();
    },
    "/moois": function () {
        window.mooiTimer = 0;
        window.t = 20;
        window.z = true;
        setInterval(function () {
            window.mooiTimer += .13;
            var i = 13 + Math.sin(window.mooiTimer) * 10;
            var str = "😫=======================D";
            str = str.substr(0, i) + "✊" + str.substring(i);
            window.t -= .3;
            if (window.t <= 0) {
                for (var j = 0; j > window.t * 4; j--)
                    str += "&nbsp;";
                str += "💦💦💦";
                if (window.t <= -7)
                    window.t = 12;
            }
            $("#activity").html("<p>" + str + "<p>");

        }, 16);
    }
};

window.currentPath = "";

function navigate(pathname) {
    history.pushState(null, null, pathname);
    onPathChanged();
    return false;
}

function onPathChanged() {
    if (window.userSession == null) return needForSession();

    var pathname = window.location.pathname;
    for (var path in paths) {
        var pathSlash = path + "/";
        if (path == pathname || pathSlash == pathname || pathname.startsWith(pathSlash)) {
            window.currentPath = path;
            correctTabs();
            return paths[path]();
        }
    }
    console.log("path not found -> home");
    history.replaceState(null, null, "/hoom");
    window.currentPath = "/hoom";
    window.paths["/hoom"]();
    correctTabs();
}

window.onpopstate = onPathChanged;

$(document).ready(function () {

    if (navigator.appName == 'Microsoft Internet Explorer' || !!(navigator.userAgent.match(/Trident/) || navigator.userAgent.match(/rv 11/))) {
        $("body").html("<h6>Deze site werkt niet in Internet Explorer. Gebruik een browser zoals <a href='https://chrome.com/' target='_blank'>Chrome</a>, Firefox of Edge</h6>");
        return;
    }

    if (mobile)
        $("#scrollbar-css").remove();

    $.loadScripts = function (arr, path) {
        var _arr = $.map(arr, function (scr) {
            return $.getScript((path || "") + scr).fail(function (jqxhr, settings, exception) {
                errorObj = {};
                if (arguments[0].readyState == 0) {
                    errorObj.message = 'Failed to load script!';
                }
                else {
                    errorObj.type = arguments[1];
                    errorObj.message = arguments[2]['message'];
                }
                console.log(errorObj);
            });
        });

        _arr.push($.Deferred(function (deferred) {
            $(deferred.resolve);
        }));

        return $.when.apply($, _arr);
    }

    $.loadScripts([ // no caching
        "utils.js",
        "style.js",
        "layout.js",
        "navbar.js",
        "session.js",
        "chats.js",
        "friends.js",
        "profile.js",
        "people.js",
        "filtered-search.js",
        "change-profile.js",
        "iro.min.js",
        "croppie.min.js",
        "preferences.js"
    ], "/static_content/js/").done(function () {

        initStyle(function () {
            onPathChanged();
        });

    });
});

function hidePreLoader() {
    $("#preapp-loader-container").fadeOut(200, function () {
        $("#preapp-loader-container").remove();
    });
}