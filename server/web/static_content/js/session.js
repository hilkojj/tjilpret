window.userSession = null;

function startUserSession(user, token) {
    window.userSession = {
        token: token,
        user: user
    }
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
                Materialize.toast("<i class=\"material-icons red-text\" style=\"margin-right: 10px\">error</i>" + res.error, 5000);
            }
        }
    });
}