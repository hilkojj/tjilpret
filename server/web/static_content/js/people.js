
window.paths["/tjillers"] = function () {

    startActivity("people", true, function () {

        requestNotify("friends");
        applyFavColor();
        title("Mesnen en vriends");
        var ac = $("#activity");

        $.ajax({
            url: "/api/allColors",
            method: "post",
            success: function (res) {

                var colors = { all: "Alle kleuren van de reggenboog" };
                for (var i in res) {
                    var row = res[i];
                    colors[row.id] = row.name + " (" + row.people + ")";
                }
                showFilteredSearch(ac, {
                    colorClass: {
                        name: "Lieflingskleur",
                        options: colors,
                        default: "all"
                    },
                    sortBy: {
                        name: "Sorteer op",
                        options: {
                            activity: "Laatst actief",
                            friends: "Aantal vreinden",
                            rep: "Reputatie",
                            messages: "Aantal tjetberichten",
                            uploads: "Aantal uplaods",
                            joined: "Nieuwste account"
                        }
                    },
                    desc: {
                        name: "Volgorde",
                        options: {
                            1: "Aflopend",
                            0: "Oplopend"
                        },
                        default: 1
                    }
                }, "/api/searchPeople", peopleResultsViewer);
            }
        });
    });
};

function peopleResultsViewer(results, div) {
    if (!(0 in results)) return;
    var i = 0;
    var callback = function (profileCard) {
        if (++i in results)
            showProfileCard(div, results[i], true, callback);
    }
    showProfileCard(div, results[i], true, callback);
}

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