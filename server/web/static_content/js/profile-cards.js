
function showProfileCard(parent, user, m6, callback) {
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
        profileCard.find("btn").attr("style", "background-color: " + rgb + " !important");
        profileCard.find("#profile-card-chat-btn i").css("color", rgb);
        setHref(profileCard.find("#profile-card-profile-link"), "/tjiller/" + user.id);
        profileCard.find("#profile-card-chat-btn").find('.tooltipped').tooltip();
        callback(profileCard);
    });
}
