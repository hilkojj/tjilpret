window.userSession = null;

function startUserSession(user, token) {
    if (window.userSession != null)
        return;
    window.userSession = {
        token: token,
        user: user
    }
}

function needForSession() {
    var tokens = Cookies.getJSON("tokens");
    if (typeof tokens == "object") {
        $.ajax({
            url: "/api/validateTokens",
            method: "post",
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            data: JSON.stringify({
                tokens: tokens
            }),
            success: function (res) {
                console.log(res);
                var i = 0;
                for (var userID in res) i++;
                if (i == 0) showLogin();
                else showChooseUser(res);
            }
        });

    } else showLogin();
}

function showGradient() {
    if (!mobile) $("body").addClass("animatedGradient");
}

function showLogin() {
    showGradient();
    startActivity("login", false, function () {
        hidePreLoader();
    });
}

function showRegister() {
    showGradient();
    startActivity("register", false, function () {
        hidePreLoader();
    });
}

window.chooseUsersInfo;
function showChooseUser(users) {
    window.chooseUsersInfo = users;
    showGradient();
    startActivity("chooseUser", false, function () {
        hidePreLoader();
        var collection = $("#activity").find(".collection");
        for (var userID in users) {

            var user = users[userID];
            var a = $(
                "<a class=\"collection-item\" style=\"color: rgb(" + user.r + ", " + user.g + ", " + user.b
                + ") !important\" onclick=\"choose("
                + userID +
                ")\">"
                + user.username + "</a>");
            collection.prepend(a);
        }
    });
}

function choose(userID) {
    console.log(userID + " chosen");
    var tokens = Cookies.getJSON("tokens");
    var token = tokens[userID];
    var user = window.chooseUsersInfo[userID];
    window.chooseUsersInfo = null;
    startUserSession(user, token);
    onPathChanged();
}

function login() {
    var username = $("#login-username").val();
    $.ajax({
        url: "/api/login",
        method: "post",
        data: username == "" ? {} : {
            username: username,
            password: $("#login-password").val()
        },
        success: function (res) {
            if ("error" in res) {
                M.toast({ html: "<i class=\"material-icons red-text\" style=\"margin-right: 10px\">error</i>" + res.error, displayLength: 5000 })
            } else if (res.success == true) {
                console.log("login sucessful");
                $("body").removeClass("animatedGradient");
                startUserSession(res.userInfo, res.token);
                onPathChanged();

                var tokens = Cookies.getJSON("tokens");
                if (typeof tokens != "object") tokens = {};
                tokens[res.userInfo.id] = res.token;
                Cookies.set("tokens", tokens, { expires: 1000, secure: true });
            }
        }
    });
}