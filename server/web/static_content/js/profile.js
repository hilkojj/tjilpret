window.paths["/tjiller"] = function() {

    var userID = window.location.pathname.split("/")[2];

    $.ajax({
        url: "/api/userInfo",
        method: "post",
        data: {id: userID},
        success: function(res) {
            if (!res.found) {
                alert("Wat spijtig. Deze gebruiker bestaat niet");
                navigate("/hoom");
                return;
            }
            startActivity("profile", true, function() {

                var user = res.userInfo;
                applyThemeColor(user.r, user.g, user.b);
                $("title").html(user.username);

                if (user.header != null) {
                    $(".header-img").css("padding-top", "40%").css(
                        "background", "linear-gradient(\
                            transparent, transparent, transparent, rgba(0, 0, 0, .4)),\
                            url('/static_content/headers/large/" + user.header + "')"
                    );
                }
                $(".header-profile-pic").attr("src", pPicPath(user.profilePic, "large"));
                $(".header-username").html(user.username);
            });
        }
    });
}