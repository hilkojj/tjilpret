window.paths["/lieflingskleur"] = function () {

    startActivity("change-fav-color", true, function () {

        $.ajax({
            url: "/api/allColors",
            method: "post",
            success: startChangeFavColor
        });
    });
}

function startChangeFavColor(classes) {
    var user = window.userSession.user;
    var saveBtn = $("#save-fav-color");

    var colorPickerDiv = $("#color-picker");
    var size = colorPickerDiv.parent().width();
    applyFavColor();
    if (size > 260) size = 260;
    colorPickerDiv.width(size);

    var newColor = null;

    saveBtn.click(function () {
        if (newColor == null) return;
        $.ajax({
            url: "/api/changeFavColor",
            method: "post",
            data: {
                token: window.userSession.token,
                r: newColor.r, g: newColor.g, b: newColor.b
            },
            success: function (res) {

                if (res.success) showSuccess("opgeslagen");
                else showError("Potver er ging iets mis");
            }
        });
    });

    new iro.ColorPicker("#color-picker", {
        // Canvas dimensions:
        width: size,
        height: size / 3.5 * 4,
        color: rgbString(user.r, user.g, user.b),
        markerRadius: 8,
        padding: 2,
        sliderMargin: 24,
        borderWidth: 0,
        borderColor: "#000"
    }).on("color:change", function (color) {

        var hsl = color.hsl;
        var rgb = color.rgb;
        applyThemeColor(rgb.r, rgb.g, rgb.b);

        var colorClass = null;
        var maxHue = 99999;
        for (var i in classes) {
            var c = classes[i];
            if (hsl.l < c.max_lightness * 100) {
                colorClass = c;
                break;
            } else if (hsl.s < c.max_saturation * 100) {
                colorClass = c;
                break;
            } else if (hsl.h < c.max_hue && c.max_hue < maxHue) {
                colorClass = c;
                maxHue = c.max_hue;
            }
        }
        if (colorClass == null)
            colorClass = classes[0]; // red

        var info = $("#color-picker-info");
        info.fadeTo(200, 1);
        if (hsl.l > 70) {
            info.find("h6").addClass("red-text").html("Deze kleur is te verblindend");
            info.find("b").html("0");
            saveBtn.addClass("disabled");
        } else {
            info.find("h6").removeClass("red-text").html(colorClass.name);
            info.find("b").html(colorClass.people);
            saveBtn.removeClass("disabled");
            newColor = rgb;
        }

    });
}