
var originalCss = "";

function initStyle(callback) {
    $.ajax({
        url: "/static_content/css/stylesheet.css",
        success: function(css) {
            originalCss = css;
            $("head").append("<style id='dynamic-css'></style>");
            applyThemeColor(94, 94, 255, 55, 255, 135);
            setTimeout(callback, 500);
        }
    });
}

function applyThemeColor(r, g, b) {}

function applyThemeColor(r, g, b, r1, g1, b1) {

    const values = {
        r: r, g: g, b: b,
        rgb: "rgb(" + r + "," + g + "," + b +")",
        rgbSec: "rgb(" + r1 + "," + g1 + "," + b1 +")"
    }
    var newCss = originalCss;

    for (var key in values) 
        newCss = newCss.split("?" + key + "?").join(values[key]);

    $("#dynamic-css").html(newCss);
    if (!mobile) $("body").addClass("animatedGradient");
    $("[name='theme-color']").remove();
    $("head").append("<meta name='theme-color' content='" + values.rgb + "'>");
}