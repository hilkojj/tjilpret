var mobile = /Mobi/.test(navigator.userAgent);

$(document).ready(function () {

    if (navigator.appName == 'Microsoft Internet Explorer' || !!(navigator.userAgent.match(/Trident/) || navigator.userAgent.match(/rv 11/))) {
        $("body").html("<h6>Deze site werkt niet in Internet Explorer (denk ik). Gebruik een browser zoals <a href='https://chrome.com/' target='_blank'>Chrome</a>, Firefox of Edge</h6>");
        return;
    }

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
        "layout.js"
    ], "/static_content/js/").done(function () {
        initStyle(function () {

            $("#preapp-loader-container").fadeOut(200, function () {
                $("#preapp-loader-container").remove()

                startActivity("login", function() {
                    
                });
            });
        });
    });
});