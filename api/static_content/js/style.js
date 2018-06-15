
var originalCss = "";

function initStyle(callback) {
    $.ajax({
        url: "/static_content/css/stylesheet.css",
        success: function(css) {
            originalCss = css;
            $("head").append("<style id='dynamic-css'></style>");
            applyThemeColor(94, 94, 255);
            setTimeout(callback, 500);
        }
    });
}

function applyFavColor() {
    var u = window.subjects.user.data;
    applyThemeColor(u.r, u.g, u.b);
}

function applyThemeColor(r, g, b) {

    const values = {
        r: r, g: g, b: b,
        rgb: "rgb(" + r + "," + g + "," + b +")",
        rgbSec: "rgb(55, 255, 135)"
    }
    var newCss = originalCss;

    for (var key in values) 
        newCss = newCss.split("?" + key + "?").join(values[key]);

    $("#dynamic-css").html(newCss);
    $("[name='theme-color']").remove();
    $("head").append("<meta name='theme-color' content='" + values.rgb + "'>");
}