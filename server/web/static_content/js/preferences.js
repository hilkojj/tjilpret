window.paths["/instellingun"] = function () {

    startActivity("preferences", true, function () {

        applyFavColor();
        title("Instellingun enzo");

        $(".prefs-coll").collapsible();


        $.ajax({
            url: "/api/tokenHistory",
            method: "post",
            data: { token: window.userSession.token },
            success: function (res) {

                var collection = $("#token-history");
                for (var i in res) {
                    var token = res[i];
                    var thisSession = token.token == window.userSession.token;
                    collection.append(`
                        <a class="collection-item waves-effect" ` + (thisSession ? `style="background: rgb(192, 255, 217);"` : ``) + `
                            onclick="confirm('Afmelde op dit aperaat?') ? tokenHistoryRemove(` + token.token + `, $(this)) : false">
                            ` + (thisSession ? `<span>Deze sessie</span><br>` : ``) + `
                            <i class="material-icons">access_time</i>` + convertTimestamp(token.created) + `<br><b>
                            <i class="material-icons">computer</i>` + token.readableUserAgent + `</b><br>
                            <i class="material-icons">location_on</i>` + token.ip + 
                        `</a>
                    `);
                }
            }
        });

    });
}

function tokenHistoryRemove(token, a) {
    logout(token, function() {
        a.remove();
    });
}