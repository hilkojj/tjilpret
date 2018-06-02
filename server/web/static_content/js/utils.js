
function showError(error) {
    M.toast({ html: "<i class=\"material-icons red-text\" style=\"margin-right: 10px\">error</i>" + error, displayLength: 5000 });
}

function showSuccess(message) {
    M.toast({ html: "<i class=\"material-icons green-text\" style=\"margin-right: 10px\">check_circle</i>" + message, displayLength: 5000 });
}

// size: "small", "med", "large" or "original"
function pPicPath(file, size) {
    return file != null ?
        "/static_content/profile_pics/" + (size == "original" ? "" : size + "/") + file
        : "/static_content/profile_pics/default.png";
}

function rgbString(r, g, b) {
    return "rgb(" + r + ", " + g + ", " + b + ")";
}

function setHref(a, href) {
    return a.attr("href", href).attr(
        "onclick", "return navigate('" + href + "')"
    )
}

function nToBr(string) {
    return string.replace("\\n", "<br>");
}

function usernameHtml(elements, user) {
    var html = user.username;
    if (user.admin)
        html += `<i class="material-icons tooltipped" style="vertical-align: middle; margin: 0 4px;"
                data-position="bottom" data-tooltip="Erkende admin">verified_user</i>`;
    if (user.appleUser)
        html += `<img src="/static_content/img/apple_logo.svg" style="
            width: 24px;
            vertical-align: text-top;
            margin: 0 4px;"
            class="tooltipped" data-position="bottom" data-tooltip="PAS OP,  APPLE FAN!">`;
    
    if (Math.abs(user.rep) > 10) {
        var title = user.rep < 0 ? "Pretbederver" : "Pretmaker";
        var classes = ["I", "II", "III", "IV", "V", "VI", "VII", "VIII", "IX", "X"];
        var c = `<span style='font-family: "Times New Roman"'>` + classes[Math.min(9, parseInt(Math.abs(user.rep) / 30))] + "</span>";
        html += `<span style="background-color: ` 
                + (user.rep < 0 ? "#ff113d" : rgbString(user.r, user.g, user.b)) 
                + `; color: white !important; font-size: 13px !important; border-radius: 3px; padding: 3px 6px;
                    vertical-align: middle; margin: 0 4px; white-space: nowrap;">` 
                + title + " " + c + "</span>";
    } else if (((Date.now() / 1000 | 10) - user.joinedOn) / (24 * 3600) < 2) {
        html += `<span style="background-color: ` 
                + rgbString(user.r, user.g, user.b)
                + `; color: white !important; font-size: 13px !important; border-radius: 3px; padding: 3px 6px;
                    vertical-align: middle; margin: 0 4px; white-space: nowrap;">Nieuweling</span>`;
    }
    

    elements.html(html);
    $('.tooltipped').tooltip();
}