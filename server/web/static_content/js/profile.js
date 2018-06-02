window.paths["/tjiller"] = function() {

    var splitted = window.location.pathname.split("/");
    var userID = splitted[2];

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
                usernameHtml($(".header-username"), user);
                usernameHtml($(".header-username-black"), user);
                $("#profile-bio").html(nToBr(user.bio));
                $("#profile-messages-count").html(user.messages);
                $("#profile-rep").html(user.rep).addClass(user.rep < 0 ? "red-text" : "");
                $("#profile-views").html(user.views == null ? 0 : user.views);
                $("#profile-comments").html(user.comments);
                $("#profile-groups").html(user.groups);
                $("#profile-friends").html(user.friends);
                $("#profile-uploads").html(user.uploads);
                
                if (3 in splitted) { // eg /uploads
                    showProfilePage(splitted[3]);
                    $("#profile-tabs").find(".active").removeClass("active");
                    $("[onclick=\"showProfilePage('" + splitted[3] + "')\"]").addClass("active");
                }
                setTimeout(function() {
                    $("#profile-tabs").tabs();
                }, 250);
            });
        }
    });
}

function showProfilePage(page) {
    $(".profile-page.show").removeClass("show");
    $("#profile-" + page + "-page").addClass("show");
}