
var htmlFiles = {};

function getFragment(name, callback) {
    getHtmlFile("/static_content/html/fragments/" + name + ".html", function (html) {
        callback($(html));
    });
}

var switchingActivity = false;

function startActivity(name, doShowNavbar, callback) {
    getHtmlFile("/static_content/html/activities/" + name + ".html", function (html) {

        if (switchingActivity)
            return;

        switchingActivity = true;
        const ac = $("#activity");
        ac.fadeOut(100, function() {
            if (doShowNavbar)
                showNavbar();
            else removeNavbar();
            switchingActivity = false;
            ac.html(html);
            ac.fadeIn(100);
            callback();
        });
    });
}

function getHtmlFile(url, callback) {
    if (url in htmlFiles)
        return callback(htmlFiles[url]);

    $.ajax({
        url: url,
        success: function (html) {
            htmlFiles[url] = html;
            callback(html);
        }
    });
}