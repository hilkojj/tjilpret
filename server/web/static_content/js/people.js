
window.paths["/tjillers"] = function () {

    startActivity("people", true, function () {

        requestNotify("friends");
    });
};

function updateInvitesCollection(data, div) {
    var receivedInvites = data.receivedInvites;
    var count = 0;
    for (var i in receivedInvites) count++;
    if (count == 0)
        div.hide();
    else {

        var collection = div.find(".collection");
        var html = "";
        var ids = [];
        var n = 0;
        for (var id in receivedInvites)
            ids.push(id);

        var callback = function (item) {

            var u = receivedInvites[ids[n]].userInfo;
            item.find(".profile-pic").css("background", rgbString(u.r, u.g, u.b)).attr("src", pPicPath(u.profilePic, "small"));
            setHref(item.find("a"), "/tjiller/" + u.id);
            item.find("#accept").attr("onclick", "confirmFriendship(" + u.id + ", false, true)");
            item.find("#decline").attr("onclick", "confirmFriendship(" + u.id + ", false, false)");
            usernameHtml(item.find("#invite-username"), u, false);
            html += item[0].outerHTML;
            if (++n == count) {
                if (html == collection.html()) return;
                collection.html(html);
                div.show();
            } else getFragment("invite-collection-item", callback);
        }
        getFragment("invite-collection-item", callback);
    }
}