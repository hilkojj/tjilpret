
getFragment("change-profile-modal", function (modal) {
    $("main").append(modal);
    modal.modal();
    var instance = M.Modal.getInstance(modal);
    modal.find(".collection-item").click(function () {
        instance.close();
    });
});

window.paths["/lieflingskleur"] = function () {

    startActivity("change-fav-color", true, function () {

        title("Lievlingskleur");
        $.ajax({
            url: "/api/allColors",
            method: "post",
            success: startChangeFavColor
        });
    });
}

function startChangeFavColor(classes) {
    var user = window.subjects.user.data;
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

                updateUser();
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

window.paths["/status"] = function () {

    startActivity("change-status", true, function () {

        title("Stattus wijszigen");
        applyFavColor();
        var textArea = $("#new-status");
        textArea.val(window.subjects.user.data.bio.replace("\\n", "\n"));
        M.textareaAutoResize(textArea);
        textArea.characterCounter();

    });
}

function updateStatus(status) {
    $.ajax({
        url: "/api/updateStatus",
        method: "post",
        data: {
            token: window.userSession.token,
            status: status
        },
        success: function (res) {

            if (res.success) showSuccess("hoppakeee");
            else if ("error" in res) showError(res.error);

            updateUser();
        }
    });
}

function uploadProfileImg(url, name, file) {
    var fd = new FormData();
    fd.append("token", window.userSession.token);
    fd.append(name, file, name);
    $.ajax({
        type: 'POST',
        url: url,
        data: fd,
        processData: false,
        contentType: false
    }).done(function (res) {
        if ("error" in res) showError(res.error);
        else if (res.success) showSuccess("Geniet ervan");
        updateUser();
        history.back();
    });
}

window.paths["/profilfoto"] = function () {

    var input = $("#pp-input")[0];
    if (!(input.files && input.files[0])) return navigate("/hoom");

    title("Lekker fototje uploden");
    var file = input.files[0];
    input.value = "";

    if (file.name.endsWith(".gif")) startActivity("loader", true, function () {
        applyFavColor();
        uploadProfileImg("/api/uploadProfilePic", "profilePic", file);
    });
    else showCroppie(file, 200, 200, "circle", 300, 800, 800, function (blob) {
        startActivity("loader", true, function () { });
        uploadProfileImg("/api/uploadProfilePic", "profilePic", blob);
    });
}

function ppChosen() {
    var input = $("#pp-input")[0];
    if (input.files && input.files[0])
        navigate("/profilfoto");
}

window.paths["/banner"] = function () {

    var input = $("#header-input")[0];
    if (!(input.files && input.files[0])) return navigate("/hoom");

    title("Lekker bannertje uploden");
    var file = input.files[0];
    input.value = "";

    if (file.name.endsWith(".gif")) startActivity("loader", true, function () {
        applyFavColor();
        uploadProfileImg("/api/uploadHeader", "header", file);
    });
    else showCroppie(file, 400, 160, "square", 300, 1600, 640, function (blob) {
        startActivity("loader", true, function () { });
        uploadProfileImg("/api/uploadHeader", "header", blob);
    });
}

function headerChosen() {
    var input = $("#header-input")[0];
    if (input.files && input.files[0])
        navigate("/banner");
}

function showCroppie(file, vpWidth, vpHeight, type, boundaryHeight, resultWidth, resultHeight, resultCallback) {
    startActivity("croppie", true, function () {

        applyFavColor();

        var iframe = $("#croppie-iframe");
        iframe.load(function () {
            var croppieDiv = iframe[0].contentWindow.croppieDiv;
            var c = croppieDiv.croppie({
                viewport: {
                    width: vpWidth,
                    height: vpHeight,
                    type: type
                },
                boundary: {
                    height: boundaryHeight
                },
                enableOrientation: true
            });
            var reader = new FileReader();
            reader.onload = function (e) {
                c.croppie("bind", {
                    url: e.target.result,
                    orientation: 1
                });
            }
            reader.readAsDataURL(file);

            $("#croppie-rot-left").click(function () { c.croppie("rotate", 90); });
            $("#croppie-rot-right").click(function () { c.croppie("rotate", -90); });

            var saveBtn = $("#croppie-save");
            saveBtn.click(function () {
                c.croppie("result", {
                    type: "blob",
                    size: {
                        width: resultWidth,
                        height: resultHeight
                    },
                    circle: false
                }).then(resultCallback);
            });
        });

    });
}