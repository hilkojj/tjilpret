
window.profilePageUser = null;

window.paths["/tjiller"] = function () {

    var splitted = window.location.pathname.split("/");
    var userID = splitted[2];

    $.ajax({
        url: "/api/userInfo",
        method: "post",
        data: { id: userID },
        success: function (res) {
            if (!res.found) {
                alert("Wat spijtig. Deze gebruiker bestaat niet");
                navigate("/hoom");
                return;
            }
            startActivity("profile", true, function () {

                var user = res.userInfo;
                window.profilePageUser = user;
                applyThemeColor(user.r, user.g, user.b);
                title(user.username);
                if (user.header != null) {
                    $(".header-img").css("padding-top", "40%").css(
                        "background", "linear-gradient(\
                            transparent, transparent, transparent, rgba(0, 0, 0, .4)),\
                            url('/static_content/headers/large/" + user.header + "')"
                    ).css("background-size", "cover");
                }
                $(".header-profile-pic").attr("src", pPicPath(user.profilePic, "large"));
                usernameHtml($(".header-username"), user, true);
                usernameHtml($(".header-username-black"), user, true);
                $("#profile-bio").html(nToBr(user.bio));
                $("#profile-messages-count").html(user.messages);
                $("#profile-rep").html(user.rep).addClass(user.rep < 0 ? "red-text" : "");
                $("#profile-views").html(user.views == null ? 0 : user.views);
                $("#profile-comments").html(user.comments);
                $("#profile-groups").html(user.groups);
                $("#profile-friends").html(user.friends);
                $("#profile-uploads").html(user.uploads);

                var friendButton = $(".profile-friend-btn").attr("data-user-id", user.id);
                var chatButton = $("#profile-chat-btn");
                requestNotify("friends");

                if (user.id == window.userSession.user.id) {
                    friendButton.remove();
                    chatButton.remove();
                }

                $.ajax({
                    url: "/api/colorInfo",
                    method: "post",
                    data: { colorClassID: user.colorClassID },
                    success: function (res) {
                        var favColorCard = $("#profile-fav-color");
                        favColorCard.find("h6").html("Lieflingskleur: <b>" + res.name.toLowerCase() + "</b>");
                        favColorCard.find("p").html(nToBr(res.description));
                        setHref(favColorCard.find("a"), "/tjillers/lieflingskleur/" + res.id).find("b").html(res.people);
                    }
                });

                $.ajax({
                    url: "/api/friendsOf",
                    method: "post",
                    data: { userID: user.id },
                    success: function (res) {
                        var h6 = $("#profile-friends-h6").html("Vriends van <b>" + user.username + "</b> (" + res.length + "):");
                        if (res.length == 0) {
                            var url = "/tjillers/lieflingskleur/" + user.colorClassID;
                            h6.parent().html("<br>" +
                                (user.id == window.userSession.user.id ?
                                    `Je hept geen VRIENDS!!
                                    <br>Zoek naar 
                                    <a href="`+ url + `" onclick="return navigate('` + url + `')">
                                        vrienden met beivoorbeeld dezelfde lieflingklur!!!
                                    </a>`
                                    :
                                    `<b>` + user.username + `</b> is een eenzame tjiller.<br>Overweeg vriends te worden.`)
                                + "<br><br>"
                            );
                            return;
                        }
                        var i = 0;
                        var callback = function (profileCard) {
                            profileFriendsSearch();
                            if (++i in res)
                                if (i % 2 == 0)
                                    setTimeout(function () {
                                        showProfileCard($("#profile-friends-row"), res[i], true, callback);
                                    }, 200);
                                else showProfileCard($("#profile-friends-row"), res[i], true, callback);
                        }
                        showProfileCard($("#profile-friends-row"), res[i], true, callback);
                    }
                });

                if (3 in splitted) { // eg /uploads
                    showProfilePage(splitted[3]);
                    $("#profile-tabs").find(".active").removeClass("active");
                    $("[onclick=\"showProfilePage('" + splitted[3] + "')\"]").addClass("active");
                }
                setTimeout(function () {
                    $("#profile-tabs").tabs();
                }, 250);
            });
        }
    });
}

function profileFriendsSearch() {
    var input = $("#profile-friends-search").val();
    if (input == undefined)
        return;
    input = input.toLowerCase();
    $("#profile-friends-row").find(".profile-card").each(function () {
        var card = $(this);
        var u = card.find("h6").text().toLowerCase();
        card.css("display", u.indexOf(input) >= 0 ? "block" : "none");
    });
}

function showProfilePage(page) {
    $(".profile-page.show").removeClass("show");
    $("#profile-" + page + "-page").addClass("show");
    history.replaceState(null, null, "/tjiller/" + window.profilePageUser.id + (page == "profile" ? "" : "/" + page));
}

function showProfileCard(parent, user, m6, callback) {
    if (parent.length == 0) return;
    getFragment("profileCard", function (profileCard) {
        parent.append(profileCard);
        profileCard.find(".profile-card-header").css(
            "background", "linear-gradient(\
                transparent, transparent, transparent, rgba(0, 0, 0, .4)),\
                " + (user.header == null ? rgbString(user.r, user.g, user.b) : "url('/static_content/headers/small/" + user.header + "')")
        );
        var rgb = rgbString(user.r, user.g, user.b);
        profileCard.find(".profile-card-profile-pic").attr("src", pPicPath(user.profilePic, "med")).css("background", rgb);
        if (m6) profileCard.addClass("m6");

        usernameHtml(profileCard.find(".profile-card-username"), user, false);
        profileCard.find(".profile-card-status").html(nToBr(user.bio));

        var friendButton = profileCard.find("btn");
        var chatButton = profileCard.find("#profile-card-chat-btn");

        friendButton.attr("style", "background-color: " + rgb + " !important").attr("data-user-id", user.id);
        chatButton.find("i").css("color", rgb);

        if (user.id == window.userSession.user.id) {
            friendButton.css("visibility", "hidden");
            chatButton.remove();
        }
        
        setHref(profileCard.find("#profile-card-profile-link"), "/tjiller/" + user.id);
        requestNotify("friends");
        callback(profileCard);
    });
}