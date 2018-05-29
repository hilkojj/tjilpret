
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
        : "/static_content/profile_pics/default.jpg";
}